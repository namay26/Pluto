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
import OnOffRamp from 'react-native-mtp-onofframp';

export default function FiatOnRampScreen() {
  const [onRampMethod, setOnRampMethod] = useState<string | null>(null);
  const [onRampStatus, setOnRampStatus] = useState<'idle' | 'processing' | 'completed'>('idle');
  const [showMtPelerin, setShowMtPelerin] = useState(false);

  const onRampMethods = [
    { 
      id: 'mtpelerin', 
      name: 'MtPelerin', 
      description: 'Bank transfer, credit card',
      icon: 'card-outline', 
      color: '#2196F3',
      fees: '1-3%',
      time: '5-30 min'
    },
    { 
      id: 'Mock Simulation', 
      name: 'Mock Simulation', 
      description: 'Direct Testnet transfer',
      icon: 'business-outline', 
      color: '#4CAF50',
      fees: '0.5-1%',
      time: '1-3 days'
    },
  ];

  const handleMethodSelect = (methodId: string) => {
    setOnRampMethod(methodId);
  };

  const handleStartOnRamp = () => {
    if (!onRampMethod) {
      Alert.alert('No Method Selected', 'Please select a payment method to continue');
      return;
    }

    setOnRampStatus('processing');

    if (onRampMethod === 'mtpelerin') {
      // Show MtPelerin widget
      setShowMtPelerin(true);
      setOnRampStatus('idle'); // Reset status when showing widget
      
      // For demo: simulate completion after 30 seconds
      setTimeout(() => {
        if (showMtPelerin) {
          setShowMtPelerin(false);
          setOnRampStatus('completed');
          Alert.alert(
            'Demo: Purchase Completed!',
            'In a real app, this would be triggered by the MtPelerin widget. Your rBTC has been added to your wallet.',
            [
              {
                text: 'Continue to Dashboard',
                onPress: () => {
                  router.replace('/(tabs)/dashboard');
                },
              },
            ]
          );
        }
      }, 30000); // 30 seconds demo timeout
    } else if (onRampMethod === 'Mock Simulation') {
      // Navigate to fiat-to-rBTC simulation screen
      setOnRampStatus('idle'); // Reset status
      router.push('/fiat-to-rbtc');
    } else {
      // Simulate other payment methods
      setTimeout(() => {
        setOnRampStatus('completed');
        Alert.alert(
          'Purchase Successful!',
          'Your crypto has been added to your wallet. You can now start using Pluto!',
          [
            {
              text: 'Continue to Dashboard',
              onPress: () => {
                router.replace('/(tabs)/dashboard');
              },
            },
          ]
        );
      }, 3000);
    }
  };
  
  const handleMtPelerinClose = () => {
    console.log('MtPelerin widget closed');
    setShowMtPelerin(false);
    setOnRampStatus('idle');
  };
  
  // Note: The OnOffRamp component handles success/error internally
  // For production, you would implement wallet callbacks:
  // onGetAddresses, onSignPersonalMessage, onSendTransaction

  const handleSkipOnRamp = () => {
    Alert.alert(
      'Skip Funding?',
      'You can add funds to your wallet later from the dashboard. Continue without funding?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => {
            router.replace('/(tabs)/dashboard');
          },
        },
      ]
    );
  };
  
  if (showMtPelerin) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.mtPelerinHeader}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={handleMtPelerinClose}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.mtPelerinTitle}>Fund Your Wallet</Text>
          <View style={styles.placeholder} />
        </View>
        <OnOffRamp
          env="production"
          onOffRampOptions={{
            type: 'direct-link',
            lang: 'en',
            bdc: 'rBTC', // Rootstock Bitcoin
            addr: '0x742d35Cc6634C0532925a3b8D0C9e3e4c413c123', // User's wallet address
            net: 'rsk', // Rootstock network
            amount: '100', // Default amount in USD
            'primary-color': 'FF9500',
            tab: '0'
          }}
          containerStyle={styles.mtPelerinWidget}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Fund Your Wallet</Text>
            <Text style={styles.subtitle}>
              Add cryptocurrency to your wallet to start using Pluto. Choose your preferred payment method.
            </Text>
          </View>

          <View style={styles.securityCard}>
            <View style={styles.securityHeader}>
              <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
              <Text style={styles.securityTitle}>Secure & Regulated</Text>
            </View>
            <Text style={styles.securityDescription}>
              All transactions are processed through regulated financial partners. 
              Your funds go directly to your self-custodial wallet.
            </Text>
          </View>

          <View style={styles.methodsSection}>
            <Text style={styles.sectionTitle}>Choose Payment Method</Text>
            <View style={styles.methodsList}>
              {onRampMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.methodCard,
                    onRampMethod === method.id && styles.methodCardSelected,
                  ]}
                  onPress={() => handleMethodSelect(method.id)}
                >
                  <View style={[styles.methodIcon, { backgroundColor: method.color }]}>
                    <Ionicons name={method.icon as any} size={24} color="white" />
                  </View>
                  <View style={styles.methodInfo}>
                    <Text style={styles.methodName}>{method.name}</Text>
                    <Text style={styles.methodDescription}>{method.description}</Text>
                    <View style={styles.methodDetails}>
                      <Text style={styles.methodFees}>Fees: {method.fees}</Text>
                      <Text style={styles.methodTime}>Time: {method.time}</Text>
                    </View>
                  </View>
                  {onRampMethod === method.id && (
                    <View style={styles.selectedIndicator}>
                      <Ionicons name="checkmark-circle" size={20} color="#FF9500" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.skipButton} onPress={handleSkipOnRamp}>
            <Ionicons name="arrow-forward-outline" size={20} color="#A0A0A0" />
            <Text style={styles.skipButtonText}>Skip for now - Add funds later</Text>
            <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
          </TouchableOpacity>

          {onRampStatus !== 'idle' && (
            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                {onRampStatus === 'processing' ? (
                  <>
                    <Ionicons name="sync" size={24} color="#FF9500" />
                    <Text style={styles.statusTitle}>Processing Purchase...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                    <Text style={styles.statusTitle}>Purchase Completed!</Text>
                  </>
                )}
              </View>
              <Text style={styles.statusDescription}>
                {onRampStatus === 'processing'
                  ? 'Processing your crypto purchase...'
                  : 'Your rBTC has been added to your wallet.'}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.onRampButton,
              !onRampMethod && styles.onRampButtonDisabled,
              onRampStatus === 'processing' && styles.onRampButtonProcessing,
            ]}
            onPress={handleStartOnRamp}
            disabled={!onRampMethod || onRampStatus === 'processing'}
          >
            <Text style={styles.onRampButtonText}>
              {onRampStatus === 'processing' ? 'Processing...' : 'Buy Crypto'}
            </Text>
            {onRampStatus === 'processing' && (
              <Ionicons name="sync" size={20} color="white" style={styles.processingIcon} />
            )}
          </TouchableOpacity>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Why fund your wallet?</Text>
            <View style={styles.infoItem}>
              <Ionicons name="flash" size={16} color="#FF9500" />
              <Text style={styles.infoText}>Start using voice commands immediately</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="send" size={16} color="#FF9500" />
              <Text style={styles.infoText}>Send crypto to friends via ENS names</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="trending-up" size={16} color="#FF9500" />
              <Text style={styles.infoText}>Access DeFi protocols and trading</Text>
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
  methodsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },
  methodsList: {
    gap: 12,
  },
  methodCard: {
    backgroundColor: '#3C3C3E',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  methodCardSelected: {
    borderColor: '#FF9500',
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    color: '#A0A0A0',
    marginBottom: 8,
  },
  methodDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  methodFees: {
    fontSize: 12,
    color: '#FF9500',
  },
  methodTime: {
    fontSize: 12,
    color: '#4CAF50',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3C3C3E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#555',
  },
  skipButtonText: {
    fontSize: 16,
    color: '#A0A0A0',
    fontWeight: '500',
    marginHorizontal: 8,
  },
  mtPelerinHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2C2C2E',
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C3E',
  },
  closeButton: {
    padding: 8,
  },
  mtPelerinTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  mtPelerinWidget: {
    flex: 1,
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
  onRampButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  onRampButtonDisabled: {
    backgroundColor: '#666',
  },
  onRampButtonProcessing: {
    backgroundColor: '#FF9500',
  },
  onRampButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  processingIcon: {
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
