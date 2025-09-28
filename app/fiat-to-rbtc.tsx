import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
// import { ethers } from 'ethers'; // Commented out for simulation - would be used in production

// Hardcoded configuration
const HARDCODED_CONFIG = {
  privateKey: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', // Demo private key
  fromAddress: '0x742d35Cc6634C0532925a3b8D0C9e3e4c413c123', // Source address
  toAddress: '0x8ba1f109551bD432803012645Hac136c22C177c9', // Your college address
  rpcUrl: 'https://public-node.testnet.rsk.co', // Rootstock testnet RPC
  tokenAmount: '0.00116', // rBTC amount to transfer
  fiatAmount: '100', // INR amount
  exchangeRate: '86206.90' // INR per rBTC (approx $2600 * 83 INR/USD)
};


export default function FiatToRBTCScreen() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [transferStatus, setTransferStatus] = useState<'idle' | 'processing' | 'completed'>('idle');

  const simulateTokenTransfer = async () => {
    setIsProcessing(true);
    setTransferStatus('processing');

    try {
      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // In a real implementation, you would:
      // 1. Create provider: const provider = new ethers.JsonRpcProvider(HARDCODED_CONFIG.rpcUrl);
      // 2. Create wallet: const wallet = new ethers.Wallet(HARDCODED_CONFIG.privateKey, provider);
      // 3. Send transaction: await wallet.sendTransaction({...});

      // For simulation, we'll just show success
      setTransferStatus('completed');
      
      Alert.alert(
        'Transfer Successful!',
        `${HARDCODED_CONFIG.tokenAmount} rBTC has been transferred to your college address.`,
        [
          {
            text: 'Continue to Dashboard',
            onPress: () => {
              router.replace('/(tabs)/dashboard');
            },
          },
        ]
      );
    } catch (transferError) {
      console.error('Transfer simulation error:', transferError);
      Alert.alert('Transfer Failed', 'Please try again later.');
      setTransferStatus('idle');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprove = () => {
    Alert.alert(
      'Confirm Purchase',
      `You are about to purchase ${HARDCODED_CONFIG.tokenAmount} rBTC for ₹${HARDCODED_CONFIG.fiatAmount} using Google Pay.\n\nThe rBTC will be transferred to your college address.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: simulateTokenTransfer,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buy Crypto</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tab Navigation */}

        {/* Payment Method Selection - Hardcoded to GPay */}
        <View style={styles.paymentSection}>
          <View style={styles.paymentMethods}>
            <View style={[styles.paymentMethod, styles.selectedPayment]}>
              <Ionicons name="logo-google" size={20} color="#4285F4" />
              <Text style={styles.paymentText}>Google Pay</Text>
            </View>
          </View>
        </View>

        {/* Amount Section */}
        <View style={styles.amountSection}>
          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>YOU SEND</Text>
            <View style={styles.amountRow}>
              <Text style={styles.amountValue}>{HARDCODED_CONFIG.fiatAmount}</Text>
              <View style={styles.currencySelector}>
                <View style={styles.currencyFlag}>
                  <Text style={styles.flagEmoji}>🇮🇳</Text>
                </View>
                <Text style={styles.currencyCode}>INR</Text>
                <Ionicons name="chevron-down" size={16} color="#A0A0A0" />
              </View>
            </View>
          </View>

          <View style={styles.exchangeIcon}>
            <Ionicons name="swap-vertical" size={24} color="#FF9500" />
          </View>

          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>YOU GET</Text>
            <View style={styles.amountRow}>
              <Text style={styles.amountValue}>{HARDCODED_CONFIG.tokenAmount}</Text>
              <View style={styles.currencySelector}>
                <View style={[styles.currencyFlag, { backgroundColor: '#FF9500' }]}>
                  <Text style={styles.cryptoSymbol}>₿</Text>
                </View>
                <Text style={styles.currencyCode}>rBTC</Text>
                <Ionicons name="chevron-down" size={16} color="#A0A0A0" />
              </View>
            </View>
          </View>
        </View>

        {/* Market Rate */}
        <View style={styles.marketRate}>
          <Ionicons name="trending-up" size={16} color="#4CAF50" />
          <Text style={styles.marketRateText}>
            Market rate: 1 rBTC = ₹{HARDCODED_CONFIG.exchangeRate}
          </Text>
        </View>

        {/* Transfer Status */}
        {transferStatus !== 'idle' && (
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              {transferStatus === 'processing' ? (
                <>
                  <ActivityIndicator size="small" color="#FF9500" />
                  <Text style={styles.statusTitle}>Processing Transfer...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  <Text style={styles.statusTitle}>Transfer Completed!</Text>
                </>
              )}
            </View>
            <Text style={styles.statusDescription}>
              {transferStatus === 'processing'
                ? 'Transferring rBTC to your college address...'
                : `${HARDCODED_CONFIG.tokenAmount} rBTC has been sent to your college.`}
            </Text>
          </View>
        )}


        {/* Approve Button */}
        <TouchableOpacity
          style={[
            styles.approveButton,
            (isProcessing || transferStatus === 'completed') && styles.approveButtonDisabled
          ]}
          onPress={handleApprove}
          disabled={isProcessing || transferStatus === 'completed'}
        >
          {isProcessing ? (
            <>
              <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />
              <Text style={styles.approveButtonText}>Processing...</Text>
            </>
          ) : transferStatus === 'completed' ? (
            <Text style={styles.approveButtonText}>Transfer Completed</Text>
          ) : (
            <Text style={styles.approveButtonText}>Approve Purchase</Text>
          )}
        </TouchableOpacity>

        <View style={styles.disclaimer}>
          <Ionicons name="information-circle-outline" size={16} color="#A0A0A0" />
          <Text style={styles.disclaimerText}>
            This is a simulation. In production, real funds would be processed and transferred.
          </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  profileButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#3C3C3E',
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#00D4AA',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#A0A0A0',
  },
  activeTabText: {
    color: 'white',
  },
  paymentSection: {
    marginBottom: 24,
  },
  paymentMethods: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00D4AA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  selectedPayment: {
    backgroundColor: '#00D4AA',
  },
  paymentText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  amountSection: {
    marginBottom: 24,
  },
  amountCard: {
    backgroundColor: '#3C3C3E',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 12,
    color: '#A0A0A0',
    marginBottom: 8,
    fontWeight: '500',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencyFlag: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9500',
  },
  flagEmoji: {
    fontSize: 16,
  },
  cryptoSymbol: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  exchangeIcon: {
    alignSelf: 'center',
    marginVertical: -6,
    zIndex: 1,
    backgroundColor: '#2C2C2E',
    padding: 8,
    borderRadius: 20,
  },
  marketRate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  marketRateText: {
    fontSize: 14,
    color: '#A0A0A0',
  },
  statusCard: {
    backgroundColor: '#3C3C3E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  statusDescription: {
    fontSize: 14,
    color: '#A0A0A0',
  },
  approveButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  approveButtonDisabled: {
    backgroundColor: '#666',
  },
  approveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 8,
    paddingHorizontal: 20,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#A0A0A0',
    textAlign: 'center',
    flex: 1,
  },
});
