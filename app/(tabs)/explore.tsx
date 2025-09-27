import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl
} from 'react-native';

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'buy' | 'sell';
  asset: string;
  amount: string;
  counterparty: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  txHash: string;
  gasUsed?: string;
  gasFee?: string;
}

export default function PassbookScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Mock transaction data - in real app, this would come from The Graph subgraph
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      type: 'send',
      asset: 'rBTC',
      amount: '0.5',
      counterparty: 'bob.eth',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      status: 'completed',
      txHash: '0x1234...5678',
      gasUsed: '21000',
      gasFee: '0.0001 rBTC',
    },
    {
      id: '2',
      type: 'receive',
      asset: 'rBTC',
      amount: '1.2',
      counterparty: 'charlie.eth',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      status: 'completed',
      txHash: '0xabcd...efgh',
      gasUsed: '21000',
      gasFee: '0.0001 rBTC',
    },
    {
      id: '3',
      type: 'buy',
      asset: 'rBTC',
      amount: '2.0',
      counterparty: 'MtPelerin',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      status: 'completed',
      txHash: '0x9876...5432',
      gasUsed: '45000',
      gasFee: '0.0002 rBTC',
    },
    {
      id: '4',
      type: 'send',
      asset: 'rBTC',
      amount: '0.1',
      counterparty: 'dave.eth',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      status: 'pending',
      txHash: '0xdef0...1234',
      gasUsed: '21000',
      gasFee: '0.0001 rBTC',
    },
  ];

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual GraphQL query to Rootstock subgraph
      // Example query:
      // {
      //   transfers(first: 10, orderBy: timestamp, orderDirection: desc, 
      //             where: { from: "0xUserAddress" }) {
      //     id, amount, token, to, timestamp
      //   }
      // }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send': return 'arrow-up';
      case 'receive': return 'arrow-down';
      case 'buy': return 'card';
      case 'sell': return 'cash';
      default: return 'swap-horizontal';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'send': return '#F44336';
      case 'receive': return '#4CAF50';
      case 'buy': return '#2196F3';
      case 'sell': return '#FF9500';
      default: return '#666';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'pending': return '#FF9500';
      case 'failed': return '#F44336';
      default: return '#666';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)} minutes ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="book" size={32} color="#FF9500" />
          <Text style={styles.title}>Transaction Passbook</Text>
        </View>
        <Text style={styles.subtitle}>
          Your complete blockchain transaction history
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {isLoading && transactions.length === 0 ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading transactions...</Text>
            </View>
          ) : (
            <>
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{transactions.length}</Text>
                  <Text style={styles.statLabel}>Total Transactions</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>
                    {transactions.filter(tx => tx.status === 'completed').length}
                  </Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>
                    {transactions.filter(tx => tx.status === 'pending').length}
                  </Text>
                  <Text style={styles.statLabel}>Pending</Text>
                </View>
              </View>

              <View style={styles.transactionsSection}>
                <Text style={styles.sectionTitle}>Recent Transactions</Text>
                {transactions.map((tx) => (
                  <View key={tx.id} style={styles.transactionCard}>
                    <View style={styles.transactionHeader}>
                      <View style={[styles.transactionIcon, { backgroundColor: getTransactionColor(tx.type) }]}>
                        <Ionicons
                          name={getTransactionIcon(tx.type) as any}
                          size={16}
                          color="white"
                        />
                      </View>
                      <View style={styles.transactionInfo}>
                        <Text style={styles.transactionTitle}>
                          {tx.type.toUpperCase()} {tx.amount} {tx.asset}
                        </Text>
                        <Text style={styles.transactionCounterparty}>
                          {tx.type === 'send' ? 'To: ' : tx.type === 'receive' ? 'From: ' : ''}{tx.counterparty}
                        </Text>
                        <Text style={styles.transactionTime}>{formatDate(tx.timestamp)}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(tx.status) }]}>
                        <Text style={styles.statusText}>{tx.status}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.transactionDetails}>
                      <Text style={styles.detailText}>Hash: {tx.txHash}</Text>
                      {tx.gasUsed && (
                        <Text style={styles.detailText}>Gas: {tx.gasUsed} ({tx.gasFee})</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C3E',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0A0',
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#A0A0A0',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: '#3C3C3E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9500',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#A0A0A0',
    textAlign: 'center',
  },
  transactionsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
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
    marginBottom: 12,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
  transactionCounterparty: {
    fontSize: 14,
    color: '#A0A0A0',
    marginBottom: 2,
  },
  transactionTime: {
    fontSize: 12,
    color: '#666',
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
  transactionDetails: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2C',
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
});
