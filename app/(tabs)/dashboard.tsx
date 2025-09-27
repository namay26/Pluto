import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface WalletBalance {
  chain: string;
  chainId: number;
  symbol: string;
  balance: string;
  usdValue: string;
  icon: string;
  color: string;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'transfer';
  asset: string;
  amount: string;
  chain: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  txHash?: string;
  mcpServer?: string;
}

interface VoiceCommand {
  id: string;
  command: string;
  status: 'listening' | 'processing' | 'executing' | 'completed' | 'failed';
  aiDecision?: {
    mcpServer: string;
    action: string;
    reasoning: string;
  };
  bankTransaction?: {
    amount: string;
    status: 'pending' | 'completed' | 'failed';
  };
}

export default function DashboardScreen() {
  const [isListening, setIsListening] = useState(false);
  const [currentCommand, setCurrentCommand] = useState<VoiceCommand | null>(null);
  const [walletBalances, setWalletBalances] = useState<WalletBalance[]>([
    {
      chain: 'Ethereum',
      chainId: 1,
      symbol: 'ETH',
      balance: '2.45',
      usdValue: '$4,890.00',
      icon: 'logo-ethereum',
      color: '#627EEA',
    },
    {
      chain: 'Polygon',
      chainId: 137,
      symbol: 'MATIC',
      balance: '1,250.00',
      usdValue: '$1,125.00',
      icon: 'diamond-outline',
      color: '#8247E5',
    },
    {
      chain: 'Bitcoin',
      chainId: 0,
      symbol: 'BTC',
      balance: '0.125',
      usdValue: '$5,625.00',
      icon: 'logo-bitcoin',
      color: '#F7931A',
    },
  ]);

  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'buy',
      asset: 'ETH',
      amount: '0.5',
      chain: 'Ethereum',
      status: 'completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      mcpServer: 'UniswapMCP',
    },
    {
      id: '2',
      type: 'buy',
      asset: 'MATIC',
      amount: '100',
      chain: 'Polygon',
      status: 'pending',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      mcpServer: 'QuickSwapMCP',
    },
  ]);

  const [bankBalance] = useState('$12,450.00');
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening]);

  const handleVoiceCommand = () => {
    if (isListening) {

      setIsListening(false);
      setCurrentCommand(null);
      return;
    }

    setIsListening(true);
    
    setTimeout(() => {
      const mockCommand: VoiceCommand = {
        id: Date.now().toString(),
        command: 'Buy 5 ETH on Polygon',
        status: 'processing',
      };
      setCurrentCommand(mockCommand);
      setIsListening(false);


      setTimeout(() => {
        setCurrentCommand(prev => prev ? {
          ...prev,
          status: 'executing',
          aiDecision: {
            mcpServer: 'PolygonBridgeMCP',
            action: 'Bridge ETH to Polygon and execute swap',
            reasoning: 'User wants ETH on Polygon network, will use bridge + DEX',
          },
          bankTransaction: {
            amount: '$11,250.00',
            status: 'pending',
          },
        } : null);

        setTimeout(() => {
          setCurrentCommand(prev => prev ? {
            ...prev,
            status: 'completed',
            bankTransaction: {
              amount: '$11,250.00',
              status: 'completed',
            },
          } : null);


          const newTransaction: Transaction = {
            id: Date.now().toString(),
            type: 'buy',
            asset: 'ETH',
            amount: '5.0',
            chain: 'Polygon',
            status: 'completed',
            timestamp: new Date(),
            mcpServer: 'PolygonBridgeMCP',
          };
          setRecentTransactions(prev => [newTransaction, ...prev]);

          setTimeout(() => setCurrentCommand(null), 3000);
        }, 2000);
      }, 2000);
    }, 3000);
  };

  const getTotalPortfolioValue = () => {
    return walletBalances.reduce((total, wallet) => {
      return total + parseFloat(wallet.usdValue.replace('$', '').replace(',', ''));
    }, 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'pending': return '#FF9500';
      case 'failed': return '#F44336';
      default: return '#666';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Good morning!</Text>
              <Text style={styles.portfolioValue}>
                ${getTotalPortfolioValue().toLocaleString()}
              </Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.push('/(tabs)/voice-commands')}
              >
                <Ionicons name="mic-outline" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="settings-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.voiceSection}>
            <Text style={styles.sectionTitle}>Voice Commands</Text>
            <TouchableOpacity
              style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
              onPress={handleVoiceCommand}
            >
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Ionicons
                  name={isListening ? 'mic' : 'mic-outline'}
                  size={32}
                  color={isListening ? '#FF9500' : 'white'}
                />
              </Animated.View>
              <Text style={styles.voiceButtonText}>
                {isListening ? 'Listening...' : 'Tap to speak'}
              </Text>
            </TouchableOpacity>

            {currentCommand && (
              <View style={styles.commandCard}>
                <View style={styles.commandHeader}>
                  <Text style={styles.commandText}>"{currentCommand.command}"</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentCommand.status) }]}>
                    <Text style={styles.statusText}>{currentCommand.status}</Text>
                  </View>
                </View>

                {currentCommand.aiDecision && (
                  <View style={styles.aiDecision}>
                    <Text style={styles.aiTitle}>🤖 AI Agent Decision:</Text>
                    <Text style={styles.aiServer}>MCP Server: {currentCommand.aiDecision.mcpServer}</Text>
                    <Text style={styles.aiAction}>Action: {currentCommand.aiDecision.action}</Text>
                    <Text style={styles.aiReasoning}>Reasoning: {currentCommand.aiDecision.reasoning}</Text>
                  </View>
                )}

                {currentCommand.bankTransaction && (
                  <View style={styles.bankTransaction}>
                    <Text style={styles.bankTitle}>💳 Bank Transaction:</Text>
                    <Text style={styles.bankAmount}>Amount: {currentCommand.bankTransaction.amount}</Text>
                    <Text style={[styles.bankStatus, { color: getStatusColor(currentCommand.bankTransaction.status) }]}>
                      Status: {currentCommand.bankTransaction.status}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>

          <View style={styles.bankSection}>
            <View style={styles.bankCard}>
              <View style={styles.bankHeader}>
                <Ionicons name="card" size={24} color="#4CAF50" />
                <Text style={styles.bankTitle}>Connected Bank Account</Text>
              </View>
              <Text style={styles.bankBalance}>{bankBalance}</Text>
              <Text style={styles.bankSubtext}>Available for crypto purchases</Text>
            </View>
          </View>

          <View style={styles.walletsSection}>
            <Text style={styles.sectionTitle}>Your Wallets</Text>
            {walletBalances.map((wallet, index) => (
              <View key={index} style={styles.walletCard}>
                <View style={styles.walletHeader}>
                  <View style={[styles.walletIcon, { backgroundColor: wallet.color }]}>
                    <Ionicons name={wallet.icon as any} size={20} color="white" />
                  </View>
                  <View style={styles.walletInfo}>
                    <Text style={styles.walletChain}>{wallet.chain}</Text>
                    <Text style={styles.walletBalance}>{wallet.balance} {wallet.symbol}</Text>
                  </View>
                  <Text style={styles.walletValue}>{wallet.usdValue}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.transactionsSection}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            {recentTransactions.map((tx) => (
              <View key={tx.id} style={styles.transactionCard}>
                <View style={styles.transactionHeader}>
                  <View style={styles.transactionIcon}>
                    <Ionicons
                      name={tx.type === 'buy' ? 'arrow-down' : 'arrow-up'}
                      size={16}
                      color={tx.type === 'buy' ? '#4CAF50' : '#F44336'}
                    />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionTitle}>
                      {tx.type.toUpperCase()} {tx.amount} {tx.asset}
                    </Text>
                    <Text style={styles.transactionChain}>{tx.chain}</Text>
                    {tx.mcpServer && (
                      <Text style={styles.transactionMcp}>via {tx.mcpServer}</Text>
                    )}
                  </View>
                  <View style={[styles.transactionStatus, { backgroundColor: getStatusColor(tx.status) }]}>
                    <Text style={styles.transactionStatusText}>{tx.status}</Text>
                  </View>
                </View>
              </View>
            ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    color: '#A0A0A0',
    marginBottom: 4,
  },
  portfolioValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  voiceSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },
  voiceButton: {
    backgroundColor: '#3C3C3E',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  voiceButtonActive: {
    borderColor: '#FF9500',
    backgroundColor: '#4A3C2A',
  },
  voiceButtonText: {
    fontSize: 16,
    color: 'white',
    marginTop: 8,
    fontWeight: '500',
  },
  commandCard: {
    backgroundColor: '#3C3C3E',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  commandHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  commandText: {
    fontSize: 16,
    color: 'white',
    fontStyle: 'italic',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  aiDecision: {
    backgroundColor: '#2A2A2C',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 14,
    color: '#FF9500',
    fontWeight: '600',
    marginBottom: 4,
  },
  aiServer: {
    fontSize: 12,
    color: '#A0A0A0',
    marginBottom: 2,
  },
  aiAction: {
    fontSize: 12,
    color: '#A0A0A0',
    marginBottom: 2,
  },
  aiReasoning: {
    fontSize: 12,
    color: '#A0A0A0',
  },
  bankTransaction: {
    backgroundColor: '#2A2A2C',
    borderRadius: 8,
    padding: 12,
  },
  bankTitle: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 4,
  },
  bankAmount: {
    fontSize: 12,
    color: '#A0A0A0',
    marginBottom: 2,
  },
  bankStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  bankSection: {
    marginBottom: 32,
  },
  bankCard: {
    backgroundColor: '#3C3C3E',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  bankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bankBalance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  bankSubtext: {
    fontSize: 14,
    color: '#A0A0A0',
  },
  walletsSection: {
    marginBottom: 32,
  },
  walletCard: {
    backgroundColor: '#3C3C3E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  walletInfo: {
    flex: 1,
  },
  walletChain: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  walletBalance: {
    fontSize: 14,
    color: '#A0A0A0',
  },
  walletValue: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  transactionsSection: {
    marginBottom: 32,
  },
  transactionCard: {
    backgroundColor: '#3C3C3E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2A2A2C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  transactionChain: {
    fontSize: 12,
    color: '#A0A0A0',
    marginBottom: 2,
  },
  transactionMcp: {
    fontSize: 12,
    color: '#FF9500',
  },
  transactionStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  transactionStatusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
});
