import { MCPSubgraphClient, PassbookEntry, PassbookResult, SubgraphEntity, SubgraphSchema } from "./types.js";

const DEFAULT_KEYWORDS = ["Rootstock", "RSK", "transactions", "transfers"];

function pickBestCounts(counts: { ipfsHash: string; queriesLast30Days: number }[]) {
  if (!counts.length) return undefined;
  return counts.slice().sort((a, b) => b.queriesLast30Days - a.queriesLast30Days)[0];
}

function findTransferLikeEntity(schema: SubgraphSchema): { entity: SubgraphEntity; fields: { hash?: string; from?: string; to?: string; value?: string; asset?: string; timestamp?: string; blockNumber?: string; fee?: string; status?: string } } | undefined {
  for (const ent of schema.entities || schema.types || []) {
    const fieldNames = ent.fields.map(f => f.name.toLowerCase());
    const hasFrom = fieldNames.includes("from") || fieldNames.includes("sender") || fieldNames.includes("fromaddress") || fieldNames.includes("from_addr");
    const hasTo = fieldNames.includes("to") || fieldNames.includes("recipient") || fieldNames.includes("toaddress") || fieldNames.includes("to_addr");
    const hasTimestamp = fieldNames.includes("blocktimestamp") || fieldNames.includes("timestamp");
    const hasHash = fieldNames.includes("hash") || fieldNames.includes("txhash") || fieldNames.includes("transactionhash");
    if ((hasFrom || hasTo) && hasTimestamp) {
      // map canonical fields
      const mapField = (candidates: string[]) => ent.fields.find(f => candidates.includes(f.name.toLowerCase()))?.name;
      const fields = {
        hash: mapField(["hash", "txhash", "transactionhash"]),
        from: mapField(["from", "sender", "fromaddress", "from_addr"]),
        to: mapField(["to", "recipient", "toaddress", "to_addr"]),
        value: mapField(["value", "amount", "quantity"]),
        asset: mapField(["asset", "token", "symbol", "currency"]),
        timestamp: mapField(["blocktimestamp", "timestamp"]),
        blockNumber: mapField(["blocknumber", "block"]),
        fee: mapField(["fee", "gasfee", "gasused"]),
        status: mapField(["status", "state"])
      };
      return { entity: ent, fields };
    }
  }
  return undefined;
}

function buildQuery(entityName: string, fields: { hash?: string; from?: string; to?: string; value?: string; asset?: string; timestamp?: string; blockNumber?: string; fee?: string; status?: string }, userAddress: string, limit = 12) {
  const orderField = fields.timestamp ?? "blockTimestamp";
  const whereFilters: string[] = [];
  const addr = userAddress.toLowerCase();
  if (fields.from && fields.to) {
    whereFilters.push(`${fields.from.toLowerCase()}_in: [\"${addr}\", \"${userAddress}\"]`);
    whereFilters.push(`${fields.to.toLowerCase()}_in: [\"${addr}\", \"${userAddress}\"]`);
    // We'll OR them by doing two queries merged in code, since GraphQL where doesn't support OR easily across different fields.
  }
  // Query template: we will build two queries if both from and to exist, else single query.
  const selection = [fields.hash, fields.from, fields.to, fields.value, fields.asset, fields.timestamp, fields.blockNumber, fields.fee, fields.status]
    .filter(Boolean)
    .join("\n      ");

  const singleWhereFrom = fields.from ? `where: { ${fields.from}: \"${userAddress}\" }` : "";
  const singleWhereTo = fields.to ? `where: { ${fields.to}: \"${userAddress}\" }` : "";
  const orderBy = orderField;

  const queryParts: string[] = [];
  if (fields.from) {
    queryParts.push(`fromQuery: ${entityName}(first: ${limit}, orderBy: ${orderBy}, orderDirection: desc, ${singleWhereFrom}) {\n      ${selection}\n    }`);
  }
  if (fields.to) {
    queryParts.push(`toQuery: ${entityName}(first: ${limit}, orderBy: ${orderBy}, orderDirection: desc, ${singleWhereTo}) {\n      ${selection}\n    }`);
  }
  if (queryParts.length === 0) {
    // fallback: no where filter, just recent
    queryParts.push(`recent: ${entityName}(first: ${limit}, orderBy: ${orderBy}, orderDirection: desc) {\n      ${selection}\n    }`);
  }

  const query = `query Passbook($address: String!) {\n  ${queryParts.join("\n  ")}\n}`;
  return query;
}

function mapEntries(rows: any[], fields: { hash?: string; from?: string; to?: string; value?: string; asset?: string; timestamp?: string; blockNumber?: string; fee?: string; status?: string }, userAddress: string): PassbookEntry[] {
  const addr = userAddress.toLowerCase();
  return rows.map((r: any) => {
    const fromVal = fields.from ? (r[fields.from] as string | undefined) : undefined;
    const toVal = fields.to ? (r[fields.to] as string | undefined) : undefined;
    let direction: "in" | "out" = "out";
    let counterparty: string | undefined;
    if (toVal && toVal.toLowerCase() === addr) {
      direction = "in";
      counterparty = fromVal;
    } else if (fromVal && fromVal.toLowerCase() === addr) {
      direction = "out";
      counterparty = toVal;
    } else {
      // fallback if neither matches strictly
      direction = "out";
      counterparty = toVal || fromVal;
    }
    return {
      hash: (fields.hash ? r[fields.hash] : undefined) || "",
      direction,
      counterparty,
      value: fields.value ? String(r[fields.value]) : undefined,
      asset: fields.asset ? String(r[fields.asset]) : undefined,
      timestamp: fields.timestamp ? r[fields.timestamp] : undefined,
      blockNumber: fields.blockNumber ? Number(r[fields.blockNumber]) : undefined,
      fee: fields.fee ? String(r[fields.fee]) : undefined,
      status: fields.status ? String(r[fields.status]) : undefined,
    } as PassbookEntry;
  });
}

export async function buildPassbook(client: MCPSubgraphClient, params: { address?: string; keywords?: string[]; limit?: number }): Promise<PassbookResult> {
  const { address, keywords = DEFAULT_KEYWORDS, limit = 12 } = params;

  // 1) Discover candidate subgraphs
  let candidates = new Map<string, { id: string; ipfsHash: string; name?: string }>();
  for (const kw of keywords) {
    const results = await client.search_subgraphs_by_keyword(kw);
    for (const r of results) {
      if (!r.ipfsHash) continue;
      candidates.set(r.ipfsHash, { id: r.id, ipfsHash: r.ipfsHash, name: r.displayName || r.name });
    }
  }

  // If starting from address on Rootstock, optionally shortlist
  if (address) {
    try {
      const top = await client.get_top_subgraph_deployments({ address, chain: "rootstock" });
      for (const r of top) {
        if (!r.ipfsHash) continue;
        candidates.set(r.ipfsHash, { id: r.id, ipfsHash: r.ipfsHash, name: r.displayName || r.name });
      }
    } catch {
      // ignore if not implemented
    }
  }

  const ipfsList = Array.from(candidates.values()).map(c => c.ipfsHash);
  if (ipfsList.length === 0) {
    throw new Error("No candidate subgraphs found for keywords. Try different keywords or ensure MCP is connected.");
  }

  // 2) Query 30-day counts and pick the most active
  const counts = await client.get_deployment_30day_query_counts(ipfsList);
  const best = pickBestCounts(counts);
  if (!best) {
    throw new Error("Could not retrieve query counts to select a reliable deployment.");
  }

  const chosen = candidates.get(best.ipfsHash)!;

  // 3) Fetch schema to confirm fields and entity for transfers/transactions
  const schema: SubgraphSchema = await (client.get_schema_by_ipfs_hash ? client.get_schema_by_ipfs_hash(chosen.ipfsHash) : Promise.reject(new Error("get_schema_by_ipfs_hash not implemented")));
  const found = findTransferLikeEntity(schema);
  if (!found) {
    throw new Error("Could not find a transfer/transaction-like entity in the selected subgraph schema.");
  }
  const entityName = found.entity.name;

  // 4) Build and execute query (pin by ipfs_hash for determinism here)
  const query = buildQuery(entityName, found.fields, address || "", limit);

  const exec = await (client.execute_query_by_ipfs_hash ? client.execute_query_by_ipfs_hash({ ipfs_hash: chosen.ipfsHash, query, variables: { address: address || "" } }) : Promise.reject(new Error("execute_query_by_ipfs_hash not implemented")));

  // 5) Normalize results
  let rows: any[] = [];
  if (exec?.data?.fromQuery || exec?.data?.toQuery) {
    rows = [ ...(exec.data.fromQuery || []), ...(exec.data.toQuery || []) ];
  } else if (exec?.data?.recent) {
    rows = exec.data.recent;
  } else {
    // try to read entity root directly
    if (exec?.data?.[entityName]) rows = exec.data[entityName];
  }

  // Sort descending by timestamp if present
  const tsField = found.fields.timestamp;
  if (tsField) {
    rows.sort((a, b) => {
      const ta = Number(a[tsField]);
      const tb = Number(b[tsField]);
      return tb - ta;
    });
  }

  const entries = mapEntries(rows.slice(0, limit), found.fields, address || "");

  const result: PassbookResult = {
    selected: { type: "ipfs_hash", value: chosen.ipfsHash, name: chosen.name, id: chosen.id },
    entries,
  };
  return result;
}
