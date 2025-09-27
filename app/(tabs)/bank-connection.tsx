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
} from 'react-native';

export default function BankConnectionScreen() {
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');

  const popularBanks = [
    { id: 'chase', name: 'Chase Bank', icon: 'card-outline', color: '#0066B2' },
    { id: 'bofa', name: 'Bank of America', icon: 'card-outline', color: '#E31837' },
    { id: 'wells', name: 'Wells Fargo', icon: 'card-outline', color: '#D71921' },
    { id: 'citi', name: 'Citibank', icon: 'card-outline', color: '#DA020E' },
    { id: 'usbank', name: 'U.S. Bank', icon: 'card-outline', color: '#005EB8' },
    { id: 'pnc', name: 'PNC Bank', icon: 'card-outline', color: '#FFD100' },
  ];

  const handleBankSelect = (bankId: string) => {
    setSelectedBank(bankId);
  };

  const handleConnectBank = () => {
    if (!selectedBank) {
      Alert.alert('No Bank Selected', 'Please select a bank to connect');
      return;
    }

    setConnectionStatus('connecting');

    // A Simulation for now, will chagne it later
    setTimeout(() => {
      setConnectionStatus('connected');
      Alert.alert(
        'Bank Connected Successfully!',
        'Your bank account has been securely linked to your blockchain wallet.',
        [
          {
            text: 'Continue',
            onPress: () => {
              router.replace('/(tabs)/dashboard');
            },
          },
        ]
      );
    }, 2000);
  };

  const handleManualEntry = () => {
    Alert.alert(
      'Manual Bank Entry',
      'This feature allows you to manually enter your bank details. Implementation pending.',
      [
        { text: 'OK' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Connect Your Bank</Text>
            <Text style={styles.subtitle}>
              Link your bank account to enable seamless crypto-to-fiat transactions
            </Text>
          </View>

          <View style={styles.securityCard}>
            <View style={styles.securityHeader}>
              <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
              <Text style={styles.securityTitle}>Bank-Grade Security</Text>
            </View>
            <Text style={styles.securityDescription}>
              Your banking information is encrypted and never stored on our servers. 
              We use industry-standard security protocols to protect your data.
            </Text>
          </View>

          <View style={styles.banksSection}>
            <Text style={styles.sectionTitle}>Select Your Bank</Text>
            <View style={styles.banksGrid}>
              {popularBanks.map((bank) => (
                <TouchableOpacity
                  key={bank.id}
                  style={[
                    styles.bankCard,
                    selectedBank === bank.id && styles.bankCardSelected,
                  ]}
                  onPress={() => handleBankSelect(bank.id)}
                >
                  <View style={[styles.bankIcon, { backgroundColor: bank.color }]}>
                    <Ionicons name={bank.icon as any} size={24} color="white" />
                  </View>
                  <Text style={styles.bankName}>{bank.name}</Text>
                  {selectedBank === bank.id && (
                    <View style={styles.selectedIndicator}>
                      <Ionicons name="checkmark-circle" size={20} color="#FF9500" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.manualButton} onPress={handleManualEntry}>
            <Ionicons name="create-outline" size={20} color="#FF9500" />
            <Text style={styles.manualButtonText}>Enter Bank Details Manually</Text>
            <Ionicons name="chevron-forward" size={20} color="#FF9500" />
          </TouchableOpacity>

          {connectionStatus !== 'idle' && (
            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                {connectionStatus === 'connecting' ? (
                  <>
                    <Ionicons name="sync" size={24} color="#FF9500" />
                    <Text style={styles.statusTitle}>Connecting...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                    <Text style={styles.statusTitle}>Connected Successfully!</Text>
                  </>
                )}
              </View>
              <Text style={styles.statusDescription}>
                {connectionStatus === 'connecting'
                  ? 'Securely connecting to your bank account...'
                  : 'Your bank account is now linked to your blockchain wallet.'}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.connectButton,
              !selectedBank && styles.connectButtonDisabled,
              connectionStatus === 'connecting' && styles.connectButtonConnecting,
            ]}
            onPress={handleConnectBank}
            disabled={!selectedBank || connectionStatus === 'connecting'}
          >
            <Text style={styles.connectButtonText}>
              {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect Bank Account'}
            </Text>
            {connectionStatus === 'connecting' && (
              <Ionicons name="sync" size={20} color="white" style={styles.connectingIcon} />
            )}
          </TouchableOpacity>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Why connect your bank?</Text>
            <View style={styles.infoItem}>
              <Ionicons name="swap-horizontal" size={16} color="#FF9500" />
              <Text style={styles.infoText}>Instant crypto-to-cash conversions</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="trending-up" size={16} color="#FF9500" />
              <Text style={styles.infoText}>Lower transaction fees</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="shield-checkmark" size={16} color="#FF9500" />
              <Text style={styles.infoText}>Secure and regulated transactions</Text>
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0A0',
    lineHeight: 24,
  },
  securityCard: {
    backgroundColor: '#3C3C3E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  securityDescription: {
    fontSize: 14,
    color: '#A0A0A0',
    lineHeight: 20,
  },
  banksSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },
  banksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bankCard: {
    width: '48%',
    backgroundColor: '#3C3C3E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  bankCardSelected: {
    borderColor: '#FF9500',
  },
  bankIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  bankName: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3C3C3E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FF9500',
  },
  manualButtonText: {
    fontSize: 16,
    color: '#FF9500',
    fontWeight: '500',
    marginHorizontal: 8,
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
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  statusDescription: {
    fontSize: 14,
    color: '#A0A0A0',
  },
  connectButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  connectButtonDisabled: {
    backgroundColor: '#666',
  },
  connectButtonConnecting: {
    backgroundColor: '#FF9500',
  },
  connectButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  connectingIcon: {
    marginLeft: 8,
  },
  infoSection: {
    backgroundColor: '#3C3C3E',
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#A0A0A0',
    marginLeft: 8,
  },
});
