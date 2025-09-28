import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect, useMemo } from 'react';
import {
  Alert,
  Animated,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface UserData {
  ensName: string;
  walletAddress: string;
  balance: string;
}

export default function DashboardScreen() {
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showSendModal, setShowSendModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [userData] = useState<UserData>({
    ensName: 'aryan.eth',
    walletAddress: '0x742d35Cc6634C0532925a3b8D0C9e3e4c413c123',
    balance: '0.00166 rBTC', // Rootstock Bitcoin
  });
  const pulseAnim = useMemo(() => new Animated.Value(1), []);

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
  }, [isListening, pulseAnim]);

  const handleVoiceCommand = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    
    // Navigate to voice commands screen
    router.push('/(tabs)/voice-commands');
    
    // Reset listening state after navigation
    setTimeout(() => {
      setIsListening(false);
    }, 500);
  };
  
  const handleGeneratePassbook = () => {
    // Navigate to explore screen which we'll use as passbook
    router.push('/(tabs)/explore');
  };

  const handleApprove = () => {
    const text = inputText.toLowerCase().trim();
    
    if (text.includes('send')) {
      setShowSendModal(true);
    } else if (text.includes('swap')) {
      setShowSwapModal(true);
    }
    
    // Clear input after processing
    setInputText('');
  };

  const closeSendModal = () => {
    setShowSendModal(false);
  };

  const closeSwapModal = () => {
    setShowSwapModal(false);
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* ENS Tag & Greeting */}
        <View style={styles.header}>
          <View style={styles.ensContainer}>
            <View style={styles.ensIcon}>
              <Ionicons name="person-circle" size={60} color="#FF9500" />
            </View>
            <Text style={styles.greeting}>Welcome,</Text>
            <Text style={styles.ensName}>{userData.ensName}!</Text>
            <Text style={styles.balance}>{userData.balance}</Text>
          </View>
        </View>

        {/* Voice Command Button */}
        <View style={styles.voiceSection}>
          <TouchableOpacity
            style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
            onPress={handleVoiceCommand}
          >
            <Animated.View style={[styles.micContainer, { transform: [{ scale: pulseAnim }] }]}>
              <Ionicons
                name={isListening ? 'mic' : 'mic-outline'}
                size={48}
                color={isListening ? '#FF9500' : 'white'}
              />
            </Animated.View>
            <Text style={styles.voiceButtonText}>
              {isListening ? 'Listening...' : 'Tap to speak'}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.voiceHint}>
            Try saying: &quot;Send 2 ETH to alice.eth&quot; or &quot;Check my balance&quot;
          </Text>
          
          {/* Text Input */}
          <TextInput
            style={styles.textInput}
            placeholder="Type your command here..."
            placeholderTextColor="#A0A0A0"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          
          {/* Approve Button */}
          <TouchableOpacity
            style={[styles.approveButton, !inputText.trim() && styles.approveButtonDisabled]}
            onPress={handleApprove}
            disabled={!inputText.trim()}
          >
            <Text style={styles.approveButtonText}>Approve</Text>
          </TouchableOpacity>
        </View>

        {/* Generate Passbook Button */}
        <View style={styles.passbookSection}>
          <TouchableOpacity
            style={styles.passbookButton}
            onPress={handleGeneratePassbook}
          >
            <Ionicons name="book-outline" size={24} color="white" />
            <Text style={styles.passbookButtonText}>Generate Passbook</Text>
            <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
          </TouchableOpacity>
          
          <Text style={styles.passbookHint}>
            View your recent transactions and blockchain activity
          </Text>
        </View>
      </View>
      
      {/* Send Modal */}
      <Modal
        visible={showSendModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeSendModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Send Transaction</Text>
            <View style={styles.dataContainer}>
              <Text style={styles.dataLabel}>Sender:</Text>
              <Text style={styles.dataValue}>0x742d35Cc6634C0532925a3b844Bc454e4438f44e</Text>
              
              <Text style={styles.dataLabel}>Source Token:</Text>
              <Text style={styles.dataValue}>ethUSDC</Text>
              
              <Text style={styles.dataLabel}>Source Amount:</Text>
              <Text style={styles.dataValue}>10,000</Text>
              
              <Text style={styles.dataLabel}>Receiver Address:</Text>
              <Text style={styles.dataValue}>0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B</Text>
              
              <Text style={styles.dataLabel}>Receive Token:</Text>
              <Text style={styles.dataValue}>arbUSDC</Text>
              
              <Text style={styles.dataLabel}>Receive Amount:</Text>
              <Text style={styles.dataValue}>5,000</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={closeSendModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Swap Modal */}
      <Modal
        visible={showSwapModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeSwapModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Swap Transaction</Text>
            <View style={styles.dataContainer}>
              <Text style={styles.dataLabel}>Sender:</Text>
              <Text style={styles.dataValue}>0x742d35Cc6634C0532925a3b844Bc454e4438f44e</Text>
              
              <Text style={styles.dataLabel}>Source Token:</Text>
              <Text style={styles.dataValue}>0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 (USDC)</Text>
              
              <Text style={styles.dataLabel}>Source Amount:</Text>
              <Text style={styles.dataValue}>10,000</Text>
              
              <Text style={styles.dataLabel}>Destination Token:</Text>
              <Text style={styles.dataValue}>0xC02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2 (WETH)</Text>
              
              <Text style={styles.dataLabel}>Min Amount Out:</Text>
              <Text style={styles.dataValue}>5,000</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={closeSwapModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2E',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 60,
  },
  ensContainer: {
    alignItems: 'center',
    flex: 1,
  },
  ensIcon: {
    marginBottom: 16,
  },
  greeting: {
    fontSize: 18,
    color: '#A0A0A0',
    marginBottom: 8,
  },
  ensName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  balance: {
    fontSize: 16,
    color: '#FF9500',
    fontWeight: '600',
  },
  logoutButton: {
    padding: 8,
  },
  voiceSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  voiceButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#3C3C3E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  voiceButtonActive: {
    borderColor: '#FF9500',
    backgroundColor: '#4A3C2A',
  },
  micContainer: {
    marginBottom: 12,
  },
  voiceButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
  },
  voiceHint: {
    fontSize: 14,
    color: '#A0A0A0',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  passbookSection: {
    alignItems: 'center',
  },
  passbookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3C3C3E',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  passbookButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
    flex: 1,
    marginLeft: 12,
  },
  passbookHint: {
    fontSize: 14,
    color: '#A0A0A0',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  textInput: {
    width: '100%',
    backgroundColor: '#3C3C3E',
    borderRadius: 12,
    padding: 16,
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  approveButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 16,
  },
  approveButtonDisabled: {
    backgroundColor: '#666',
  },
  approveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  dataContainer: {
    marginBottom: 24,
  },
  dataLabel: {
    fontSize: 14,
    color: '#A0A0A0',
    marginTop: 12,
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  closeButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 12,
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
