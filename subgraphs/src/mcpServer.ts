import { MCPSubgraphClient, SubgraphSearchResult, DeploymentQueryCount, TopSubgraphDeploymentInput, SubgraphSchema, ExecuteQueryOptions } from "./types.js";

/**
 * MCP Server for Rootstock Passbook using Subgraph MCP tools
 * Implements the Model Context Protocol (MCP) server interface
 */
export class RootstockPassbookMCPServer {
  private subgraphClient: MCPSubgraphClient;

  constructor() {
    // Import will be done dynamically in handleRequest
    this.subgraphClient = null as any;
  }

  private async getClient() {
    if (!this.subgraphClient) {
      const { SubgraphMCPClient } = await import('./mcpClient.js');
      this.subgraphClient = new SubgraphMCPClient();
    }
    return this.subgraphClient;
  }

  /**
   * Handle MCP JSON-RPC requests
   */
  async handleRequest(request: any): Promise<any> {
    const { method, params, id } = request;

    try {
      let result;
      
      switch (method) {
        case 'initialize':
          result = await this.initialize(params);
          break;
        case 'tools/list':
          result = await this.listTools();
          break;
        case 'tools/call':
          result = await this.callTool(params);
          break;
        default:
          throw new Error(`Unknown method: ${method}`);
      }

      return {
        jsonrpc: '2.0',
        id,
        result
      };
    } catch (error: any) {
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32603,
          message: error.message || 'Internal error'
        }
      };
    }
  }

  private async initialize(params: any) {
    return {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {}
      },
      serverInfo: {
        name: 'rootstock-passbook-mcp',
        version: '1.0.0'
      }
    };
  }

  private async listTools() {
    return {
      tools: [
        {
          name: 'search_subgraphs_by_keyword',
          description: 'Search for subgraphs by keyword (e.g., "Rootstock", "RSK", "transactions/transfers")',
          inputSchema: {
            type: 'object',
            properties: {
              keyword: {
                type: 'string',
                description: 'Keyword to search for in subgraph names and descriptions'
              }
            },
            required: ['keyword']
          }
        },
        {
          name: 'get_deployment_30day_query_counts',
          description: 'Get 30-day query counts for subgraph deployments to pick the most active ones',
          inputSchema: {
            type: 'object',
            properties: {
              ipfsHashes: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of IPFS hashes for subgraph deployments'
              }
            },
            required: ['ipfsHashes']
          }
        },
        {
          name: 'get_top_subgraph_deployments',
          description: 'Get top subgraph deployments for a specific address and chain',
          inputSchema: {
            type: 'object',
            properties: {
              address: {
                type: 'string',
                description: 'Contract or wallet address to search for'
              },
              chain: {
                type: 'string',
                description: 'Blockchain chain identifier (e.g., "rootstock", "rsk")'
              }
            },
            required: ['address', 'chain']
          }
        },
        {
          name: 'get_schema_by_ipfs_hash',
          description: 'Get subgraph schema by IPFS hash to understand available entities and fields',
          inputSchema: {
            type: 'object',
            properties: {
              ipfsHash: {
                type: 'string',
                description: 'IPFS hash of the subgraph deployment'
              }
            },
            required: ['ipfsHash']
          }
        },
        {
          name: 'execute_query_by_ipfs_hash',
          description: 'Execute a GraphQL query on a subgraph by IPFS hash',
          inputSchema: {
            type: 'object',
            properties: {
              ipfs_hash: {
                type: 'string',
                description: 'IPFS hash of the subgraph deployment'
              },
              query: {
                type: 'string',
                description: 'GraphQL query to execute'
              },
              variables: {
                type: 'object',
                description: 'Variables for the GraphQL query'
              }
            },
            required: ['ipfs_hash', 'query']
          }
        },
        {
          name: 'build_rootstock_passbook',
          description: 'Build a complete Rootstock passbook for an address showing last 10-12 transactions',
          inputSchema: {
            type: 'object',
            properties: {
              address: {
                type: 'string',
                description: 'Wallet or contract address to build passbook for'
              },
              limit: {
                type: 'number',
                description: 'Number of transactions to retrieve (default: 12)',
                default: 12
              },
              keywords: {
                type: 'array',
                items: { type: 'string' },
                description: 'Keywords to search for subgraphs (default: ["Rootstock", "RSK", "transactions", "transfers"])',
                default: ['Rootstock', 'RSK', 'transactions', 'transfers']
              }
            },
            required: ['address']
          }
        }
      ]
    };
  }

  private async callTool(params: any) {
    const { name, arguments: args } = params;

    switch (name) {
      case 'search_subgraphs_by_keyword':
        return await this.searchSubgraphsByKeyword(args.keyword);
      
      case 'get_deployment_30day_query_counts':
        return await this.getDeployment30DayQueryCounts(args.ipfsHashes);
      
      case 'get_top_subgraph_deployments':
        return await this.getTopSubgraphDeployments(args.address, args.chain);
      
      case 'get_schema_by_ipfs_hash':
        return await this.getSchemaByIpfsHash(args.ipfsHash);
      
      case 'execute_query_by_ipfs_hash':
        return await this.executeQueryByIpfsHash(args.ipfs_hash, args.query, args.variables);
      
      case 'build_rootstock_passbook':
        return await this.buildRootstockPassbook(args.address, args.limit, args.keywords);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  private async searchSubgraphsByKeyword(keyword: string): Promise<SubgraphSearchResult[]> {
    const client = await this.getClient();
    return await client.search_subgraphs_by_keyword(keyword);
  }

  private async getDeployment30DayQueryCounts(ipfsHashes: string[]): Promise<DeploymentQueryCount[]> {
    const client = await this.getClient();
    return await client.get_deployment_30day_query_counts(ipfsHashes);
  }

  private async getTopSubgraphDeployments(address: string, chain: string): Promise<SubgraphSearchResult[]> {
    const client = await this.getClient();
    return await client.get_top_subgraph_deployments({ address, chain: chain as any });
  }

  private async getSchemaByIpfsHash(ipfsHash: string): Promise<SubgraphSchema> {
    const client = await this.getClient();
    if (!client.get_schema_by_ipfs_hash) {
      throw new Error('get_schema_by_ipfs_hash not implemented');
    }
    return await client.get_schema_by_ipfs_hash(ipfsHash);
  }

  private async executeQueryByIpfsHash(ipfsHash: string, query: string, variables?: any): Promise<any> {
    const client = await this.getClient();
    if (!client.execute_query_by_ipfs_hash) {
      throw new Error('execute_query_by_ipfs_hash not implemented');
    }
    return await client.execute_query_by_ipfs_hash({
      ipfs_hash: ipfsHash,
      query,
      variables
    });
  }

  private async buildRootstockPassbook(address: string, limit: number = 12, keywords: string[] = ['Rootstock', 'RSK', 'transactions', 'transfers']): Promise<any> {
    // Import the buildPassbook function from passbook.ts
    const { buildPassbook } = await import('./passbook.js');
    const client = await this.getClient();
    return await buildPassbook(client, { address, keywords, limit });
  }
}
