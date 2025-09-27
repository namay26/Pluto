import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MCPServer {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  chains: string[];
  enabled: boolean;
  priority: number;
  icon: string;
  color: string;
}

interface VoiceCommandExample {
  command: string;
  description: string;
  mcpServers: string[];
}

export default function VoiceCommandsScreen() {
  const [mcpServers, setMcpServers] = useState<MCPServer[]>([
    {
      id: 'uniswap',
      name: 'UniswapMCP',
      description: 'Decentralized exchange on Ethereum mainnet',
      capabilities: ['swap', 'liquidity', 'price-check'],
      chains: ['Ethereum'],
      enabled: true,
      priority: 1,
      icon: 'swap-horizontal',
      color: '#FF007A',
    },
    {
      id: 'quickswap',
      name: 'QuickSwapMCP',
      description: 'Decentralized exchange on Polygon network',
      capabilities: ['swap', 'liquidity', 'price-check'],
      chains: ['Polygon'],
      enabled: true,
      priority: 2,
      icon: 'flash',
      color: '#8247E5',
    },
    {
      id: 'polygon-bridge',
      name: 'PolygonBridgeMCP',
      description: 'Bridge assets between Ethereum and Polygon',
      capabilities: ['bridge', 'cross-chain'],
      chains: ['Ethereum', 'Polygon'],
      enabled: true,
      priority: 3,
      icon: 'git-branch',
      color: '#8247E5',
    },
    {
      id: 'aave',
      name: 'AaveMCP',
      description: 'Lending and borrowing protocol',
      capabilities: ['lend', 'borrow', 'yield'],
      chains: ['Ethereum', 'Polygon'],
      enabled: false,
      priority: 4,
      icon: 'trending-up',
      color: '#B6509E',
    },
    {
      id: 'compound',
      name: 'CompoundMCP',
      description: 'Decentralized lending protocol',
      capabilities: ['lend', 'borrow', 'yield'],
      chains: ['Ethereum'],
      enabled: false,
      priority: 5,
      icon: 'library',
      color: '#00D395',
    },
  ]);

  const [voiceCommandExamples] = useState<VoiceCommandExample[]>([
    {
      command: 'Buy 5 ETH on Polygon',
      description: 'Purchase ETH on Polygon network using best available DEX',
      mcpServers: ['QuickSwapMCP', 'PolygonBridgeMCP'],
    },
    {
      command: 'Swap 100 USDC for ETH',
      description: 'Exchange USDC for ETH on the most cost-effective platform',
      mcpServers: ['UniswapMCP', 'QuickSwapMCP'],
    },
    {
      command: 'Bridge 2 ETH to Polygon',
      description: 'Transfer ETH from Ethereum mainnet to Polygon network',
      mcpServers: ['PolygonBridgeMCP'],
    },
    {
      command: 'Lend 1000 USDC on Aave',
      description: 'Supply USDC to Aave protocol for yield generation',
      mcpServers: ['AaveMCP'],
    },
    {
      command: 'Check ETH price',
      description: 'Get current ETH price across different exchanges',
      mcpServers: ['UniswapMCP', 'QuickSwapMCP'],
    },
  ]);

  const toggleMCPServer = (serverId: string) => {
    setMcpServers(prev => 
      prev.map(server => 
        server.id === serverId 
          ? { ...server, enabled: !server.enabled }
          : server
      )
    );
  };

  const updateServerPriority = (serverId: string, direction: 'up' | 'down') => {
    setMcpServers(prev => {
      const servers = [...prev];
      const serverIndex = servers.findIndex(s => s.id === serverId);
      const server = servers[serverIndex];
      
      if (direction === 'up' && server.priority > 1) {
        const otherServer = servers.find(s => s.priority === server.priority - 1);
        if (otherServer) {
          otherServer.priority += 1;
          server.priority -= 1;
        }
      } else if (direction === 'down' && server.priority < servers.length) {
        const otherServer = servers.find(s => s.priority === server.priority + 1);
        if (otherServer) {
          otherServer.priority -= 1;
          server.priority += 1;
        }
      }
      
      return servers.sort((a, b) => a.priority - b.priority);
    });
  };

  const handleTestVoiceCommand = () => {
    Alert.alert(
      'Test Voice Command',
      'This will simulate a voice command to test your MCP server configuration.',
      [
        {
          text: 'Test "Buy 1 ETH"',
          onPress: () => {
            Alert.alert('AI Agent Decision', 
              `Selected: ${mcpServers.find(s => s.enabled && s.chains.includes('Ethereum'))?.name || 'No suitable MCP server'}\n\nReasoning: Highest priority enabled server for Ethereum transactions.`
            );
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Voice Commands & MCP</Text>
            <Text style={styles.subtitle}>
              Configure AI agent preferences for voice-controlled trading
            </Text>
          </View>

          {/* Test Voice Command */}
          <TouchableOpacity style={styles.testButton} onPress={handleTestVoiceCommand}>
            <Ionicons name="mic" size={20} color="white" />
            <Text style={styles.testButtonText}>Test Voice Command</Text>
            <Ionicons name="play" size={16} color="white" />
          </TouchableOpacity>

          {/* MCP Servers Configuration */}
          <View style={styles.mcpSection}>
            <Text style={styles.sectionTitle}>MCP Server Preferences</Text>
            <Text style={styles.sectionSubtitle}>
              AI agent will choose servers based on priority and availability
            </Text>
            
            {mcpServers.map((server) => (
              <View key={server.id} style={styles.serverCard}>
                <View style={styles.serverHeader}>
                  <View style={[styles.serverIcon, { backgroundColor: server.color }]}>
                    <Ionicons name={server.icon as any} size={20} color="white" />
                  </View>
                  <View style={styles.serverInfo}>
                    <Text style={styles.serverName}>{server.name}</Text>
                    <Text style={styles.serverDescription}>{server.description}</Text>
                    <View style={styles.serverTags}>
                      {server.capabilities.slice(0, 2).map((cap, index) => (
                        <View key={index} style={styles.capabilityTag}>
                          <Text style={styles.capabilityText}>{cap}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <Switch
                    value={server.enabled}
                    onValueChange={() => toggleMCPServer(server.id)}
                    trackColor={{ false: '#767577', true: '#FF9500' }}
                    thumbColor={server.enabled ? '#f4f3f4' : '#f4f3f4'}
                  />
                </View>
                
                {server.enabled && (
                  <View style={styles.serverControls}>
                    <View style={styles.prioritySection}>
                      <Text style={styles.priorityLabel}>Priority: {server.priority}</Text>
                      <View style={styles.priorityButtons}>
                        <TouchableOpacity
                          style={styles.priorityButton}
                          onPress={() => updateServerPriority(server.id, 'up')}
                          disabled={server.priority === 1}
                        >
                          <Ionicons name="chevron-up" size={16} color={server.priority === 1 ? '#666' : '#FF9500'} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.priorityButton}
                          onPress={() => updateServerPriority(server.id, 'down')}
                          disabled={server.priority === mcpServers.length}
                        >
                          <Ionicons name="chevron-down" size={16} color={server.priority === mcpServers.length ? '#666' : '#FF9500'} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    <View style={styles.chainsSection}>
                      <Text style={styles.chainsLabel}>Supported Chains:</Text>
                      <View style={styles.chainTags}>
                        {server.chains.map((chain, index) => (
                          <View key={index} style={styles.chainTag}>
                            <Text style={styles.chainText}>{chain}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Voice Command Examples */}
          <View style={styles.examplesSection}>
            <Text style={styles.sectionTitle}>Voice Command Examples</Text>
            <Text style={styles.sectionSubtitle}>
              Try these commands to interact with your crypto portfolio
            </Text>
            
            {voiceCommandExamples.map((example, index) => (
              <View key={index} style={styles.exampleCard}>
                <Text style={styles.exampleCommand}>"{example.command}"</Text>
                <Text style={styles.exampleDescription}>{example.description}</Text>
                <View style={styles.exampleServers}>
                  <Text style={styles.exampleServersLabel}>Uses MCP Servers:</Text>
                  <View style={styles.serversList}>
                    {example.mcpServers.map((serverName, idx) => (
                      <View key={idx} style={styles.serverTag}>
                        <Text style={styles.serverTagText}>{serverName}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* AI Agent Settings */}
          <View style={styles.aiSection}>
            <Text style={styles.sectionTitle}>AI Agent Settings</Text>
            
            <View style={styles.settingCard}>
              <View style={styles.settingHeader}>
                <Ionicons name="flash" size={20} color="#FF9500" />
                <Text style={styles.settingTitle}>Auto-Execute Trades</Text>
              </View>
              <Text style={styles.settingDescription}>
                Allow AI agent to execute trades automatically after bank confirmation
              </Text>
              <Switch
                value={true}
                trackColor={{ false: '#767577', true: '#FF9500' }}
                thumbColor={'#f4f3f4'}
              />
            </View>

            <View style={styles.settingCard}>
              <View style={styles.settingHeader}>
                <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
                <Text style={styles.settingTitle}>Confirmation Required</Text>
              </View>
              <Text style={styles.settingDescription}>
                Require manual confirmation for transactions above $1,000
              </Text>
              <Switch
                value={true}
                trackColor={{ false: '#767577', true: '#4CAF50' }}
                thumbColor={'#f4f3f4'}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2E',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0A0',
    lineHeight: 22,
  },
  testButton: {
    backgroundColor: '#FF9500',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 8,
  },
  mcpSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#A0A0A0',
    marginBottom: 16,
    lineHeight: 20,
  },
  serverCard: {
    backgroundColor: '#3C3C3E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  serverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serverIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serverInfo: {
    flex: 1,
  },
  serverName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  serverDescription: {
    fontSize: 14,
    color: '#A0A0A0',
    marginBottom: 8,
  },
  serverTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  capabilityTag: {
    backgroundColor: '#2A2A2C',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  capabilityText: {
    fontSize: 12,
    color: '#FF9500',
  },
  serverControls: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2C',
  },
  prioritySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priorityLabel: {
    fontSize: 14,
    color: '#A0A0A0',
  },
  priorityButtons: {
    flexDirection: 'row',
  },
  priorityButton: {
    padding: 4,
    marginLeft: 8,
  },
  chainsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  chainsLabel: {
    fontSize: 14,
    color: '#A0A0A0',
    marginRight: 8,
  },
  chainTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chainTag: {
    backgroundColor: '#2A2A2C',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
  },
  chainText: {
    fontSize: 12,
    color: '#4CAF50',
  },
  examplesSection: {
    marginBottom: 32,
  },
  exampleCard: {
    backgroundColor: '#3C3C3E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  exampleCommand: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9500',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  exampleDescription: {
    fontSize: 14,
    color: '#A0A0A0',
    marginBottom: 12,
    lineHeight: 20,
  },
  exampleServers: {
    marginTop: 8,
  },
  exampleServersLabel: {
    fontSize: 12,
    color: '#A0A0A0',
    marginBottom: 6,
  },
  serversList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serverTag: {
    backgroundColor: '#2A2A2C',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  serverTagText: {
    fontSize: 12,
    color: '#FF9500',
  },
  aiSection: {
    marginBottom: 32,
  },
  settingCard: {
    backgroundColor: '#3C3C3E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#A0A0A0',
    flex: 1,
    marginLeft: 28,
  },
});
