export type Chain = "rootstock" | "rsk";

export interface SubgraphSearchResult {
  id: string; // Subgraph ID
  ipfsHash: string; // current ipfs hash for the deployment
  name?: string;
  displayName?: string;
  description?: string;
  chains?: string[];
  queryCount?: number;
}

export interface DeploymentQueryCount {
  ipfsHash: string;
  queriesLast30Days: number;
}

export interface TopSubgraphDeploymentInput {
  address: string;
  chain: Chain;
}

export interface SubgraphSchemaField {
  name: string;
  type: string;
  description?: string;
}

export interface SubgraphEntity {
  name: string;
  kind?: string;
  description?: string;
  fields: SubgraphSchemaField[];
}

export interface SubgraphSchema {
  // minimal representation needed for building a transfer/tx query
  entities?: SubgraphEntity[];
  types?: SubgraphEntity[];
}

export interface ExecuteQueryOptions {
  // Use exactly one of these for deterministic vs latest
  deployment_id?: string; // pin to exact deployment if known
  subgraph_id?: string; // or use subgraph id for latest
  ipfs_hash?: string; // alternative selector if supported
  query: string;
  variables?: Record<string, any>;
}

export interface MCPSubgraphClient {
  search_subgraphs_by_keyword(keyword: string): Promise<SubgraphSearchResult[]>;
  get_deployment_30day_query_counts(ipfsHashes: string[]): Promise<DeploymentQueryCount[]>;
  get_top_subgraph_deployments(input: TopSubgraphDeploymentInput): Promise<SubgraphSearchResult[]>;
  get_schema_by_deployment_id?(deploymentId: string): Promise<SubgraphSchema>;
  get_schema_by_subgraph_id?(subgraphId: string): Promise<SubgraphSchema>;
  get_schema_by_ipfs_hash?(ipfsHash: string): Promise<SubgraphSchema>;
  execute_query_by_deployment_id?(opts: ExecuteQueryOptions & { deployment_id: string }): Promise<any>;
  execute_query_by_subgraph_id?(opts: ExecuteQueryOptions & { subgraph_id: string }): Promise<any>;
  execute_query_by_ipfs_hash?(opts: ExecuteQueryOptions & { ipfs_hash: string }): Promise<any>;
}

export interface PassbookEntry {
  hash: string;
  direction: "in" | "out";
  counterparty?: string;
  value?: string;
  asset?: string;
  timestamp?: string | number;
  blockNumber?: number;
  fee?: string;
  status?: string;
}

export interface PassbookResult {
  selected: {
    type: "deployment_id" | "subgraph_id" | "ipfs_hash";
    value: string;
    name?: string;
    id?: string;
  };
  entries: PassbookEntry[];
}
