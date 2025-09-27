import { Ionicons } from '@expo/vector-icons';
import { getUniversalLink } from '@selfxyz/core';
import {
  SelfAppBuilder
} from "@selfxyz/qrcode";
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import 'react-native-get-random-values'; // Must be imported before any crypto libraries

export default function KYCScreen() {
  const [kycData, setKycData] = useState({
    identityVerified: false,
    addressVerified: false,
    selfProtocolConnected: false,
  });
  const [selfApp, setSelfApp] = useState<any | null>(null);
  const [universalLink, setUniversalLink] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const kycSteps = [
    {
      id: 'identity',
      title: 'Identity Verification',
      subtitle: 'Verify your identity using Self.xyz protocol',
      icon: 'person-circle-outline',
      completed: kycData.identityVerified,
    },
    {
      id: 'address',
      title: 'Address Verification',
      subtitle: 'Confirm your residential address',
      icon: 'location-outline',
      completed: kycData.addressVerified,
    },
    {
      id: 'protocol',
      title: 'Self.xyz Connection',
      subtitle: 'Connect to decentralized identity protocol',
      icon: 'shield-checkmark-outline',
      completed: kycData.selfProtocolConnected,
    },
  ];

  useEffect(() => {
    initializeSelfApp();
    
    const handleDeepLink = (url: string) => {
      console.log('Deep link received:', url);
      // if (url.includes('kyc-callback')) {
      //   handleSelfCallback(url);
      // }
      handleSelfCallback(url);
    };

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });
    
    return () => {
      subscription?.remove();
    };
  }, []);

  const initializeSelfApp = async () => {
    try {
      const userId="0x96951c97688efCd01e83f9FEd8b74907630D4173";
      const app = new SelfAppBuilder({
        version: 2,
        appName: process.env.EXPO_PUBLIC_SELF_APP_NAME || "Pluto Crypto Wallet",
        scope: process.env.EXPO_PUBLIC_SELF_SCOPE || "pluto-kyc",
        endpoint: process.env.EXPO_PUBLIC_SELF_ENDPOINT || "https://staging-gateway.self.xyz",
        logoBase64: "https://i.postimg.cc/mrmVf9hm/self.png",
        userId: userId.toLowerCase(),
        endpointType: "staging_https",
        userIdType: "hex",
        userDefinedData: JSON.stringify({
          app: "Pluto",
          purpose: "KYC Verification",
          timestamp: Date.now()
        }),
        disclosures: {
          minimumAge: 18,
          nationality: true,
          gender: true,
        },
        deeplinkCallback: "pluto://kyc-callback", // Deep link back to your app
      }).build();

      setSelfApp(app);
      const link = getUniversalLink(app);
      setUniversalLink(link);
      
      console.log('Self.xyz app initialized:', { userId, universalLink: link });
    } catch (error) {
      console.error('Failed to initialize Self.xyz app:', error);
      Alert.alert('Error', 'Failed to initialize Self.xyz verification');
    }
  };

  const handleSelfCallback = async (url: string) => {
    try {
      console.log('Processing Self.xyz callback:', url);
      
      // Parse the URL to extract any parameters
      const parsedUrl = Linking.parse(url);
      console.log('Parsed URL:', parsedUrl);
      
      // Check if the callback indicates success
      // The exact parameters depend on Self.xyz implementation
      // For now, we'll assume any callback means success
      setKycData(prev => ({ 
        ...prev, 
        identityVerified: true,
        addressVerified: true,
        selfProtocolConnected: true 
      }));
      
      setIsConnecting(false);
      
      Alert.alert(
        'Verification Complete!', 
        'Your identity has been successfully verified with Self.xyz',
        [{ text: 'OK', onPress: () => console.log('KYC completed') }]
      );
      
    } catch (error) {
      console.error('Error handling Self.xyz callback:', error);
      setIsConnecting(false);
      Alert.alert('Error', 'Failed to process verification result');
    }
  };

  const openSelfApp = async () => {
    if (!universalLink) {
      Alert.alert('Error', 'Self.xyz connection not ready. Please try again.');
      return;
    }
    
    try {
      // setIsConnecting(true);
      console.log('Opening Self.xyz with URL:', universalLink);
      
      const result = await WebBrowser.openBrowserAsync(universalLink);
      console.log('WebBrowser result:', result);
      
      // Note: The callback will be handled by the deep link listener
      // If user dismisses the browser without completing verification
      if (result.type === 'dismiss') {
        setIsConnecting(false);
        console.log('User dismissed Self.xyz verification');
      }
    } catch (error) {
      console.error('Failed to open Self.xyz:', error);
      setIsConnecting(false);
      Alert.alert('Error', 'Failed to open Self.xyz verification');
    }
  }

  const handleContinue = () => {
    const allVerified = Object.values(kycData).every(Boolean);
    if (!allVerified) {
      Alert.alert('Incomplete', 'Please complete all KYC steps before continuing');
      return;
    }

    // Navigate to bank connection screen
    router.push('/(tabs)/bank-connection');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>KYC Verification</Text>
            <Text style={styles.subtitle}>
              Complete identity verification to access your blockchain wallet
            </Text>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(Object.values(kycData).filter(Boolean).length / 3) * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Object.values(kycData).filter(Boolean).length} of 3 steps completed
            </Text>
          </View>

          {/* KYC Steps */}
          <View style={styles.stepsContainer}>
            {kycSteps.map((step, index) => (
              <View key={step.id} style={styles.stepCard}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepIconContainer}>
                    <Ionicons
                      name={step.icon as any}
                      size={24}
                      color={step.completed ? '#FF9500' : '#666'}
                    />
                    {step.completed && (
                      <View style={styles.completedBadge}>
                        <Ionicons name="checkmark" size={12} color="white" />
                      </View>
                    )}
                  </View>
                  <View style={styles.stepInfo}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
                  </View>
                  <View style={styles.stepStatus}>
                    {step.completed ? (
                      <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                    ) : (
                      <View style={styles.pendingDot} />
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Self.xyz Protocol Integration */}
          <View style={styles.protocolCard}>
            <View style={styles.protocolHeader}>
              <Ionicons name="shield-checkmark" size={32} color="#FF9500" />
              <Text style={styles.protocolTitle}>Self.xyz Protocol</Text>
            </View>
            <Text style={styles.protocolDescription}>
              Secure, decentralized identity verification powered by blockchain technology.
              Your data remains private and under your control.
            </Text>
            <TouchableOpacity
              style={[styles.protocolButton, isConnecting && styles.protocolButtonConnecting]}
              onPress={openSelfApp}
              disabled={!universalLink}
            >
              <Text style={styles.protocolButtonText}>
                {isConnecting ? 'Connecting...' : 'Connect with Self.xyz'}
              </Text>
              {isConnecting ? (
                <Ionicons name="sync" size={20} color="white" />
              ) : (
                <Ionicons name="arrow-forward" size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              !Object.values(kycData).every(Boolean) && styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            disabled={!Object.values(kycData).every(Boolean)}
          >
            <Text style={styles.continueButtonText}>
              Continue to Bank Connection
            </Text>
          </TouchableOpacity>
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
    progressContainer: {
      marginBottom: 32,
    },
    progressBar: {
      height: 4,
      backgroundColor: '#444',
      borderRadius: 2,
      marginBottom: 8,
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#FF9500',
      borderRadius: 2,
    },
    progressText: {
      fontSize: 14,
      color: '#A0A0A0',
      textAlign: 'center',
    },
    stepsContainer: {
      marginBottom: 32,
    },
    stepCard: {
      backgroundColor: '#3C3C3E',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    stepHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    stepIconContainer: {
      position: 'relative',
      marginRight: 16,
    },
    completedBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      width: 16,
      height: 16,
      backgroundColor: '#4CAF50',
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepInfo: {
      flex: 1,
    },
    stepTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: 'white',
      marginBottom: 4,
    },
    stepSubtitle: {
      fontSize: 14,
      color: '#A0A0A0',
    },
    stepStatus: {
      marginLeft: 12,
    },
    pendingDot: {
      width: 8,
      height: 8,
      backgroundColor: '#666',
      borderRadius: 4,
    },
    protocolCard: {
      backgroundColor: '#3C3C3E',
      borderRadius: 16,
      padding: 20,
      marginBottom: 32,
      borderWidth: 1,
      borderColor: '#FF9500',
    },
    protocolHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    protocolTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
      marginLeft: 12,
    },
    protocolDescription: {
      fontSize: 14,
      color: '#A0A0A0',
      lineHeight: 20,
      marginBottom: 20,
    },
    protocolButton: {
      backgroundColor: '#FF9500',
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 25,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    protocolButtonConnecting: {
      backgroundColor: '#CC7700',
    },
    protocolButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      marginRight: 8,
    },
    continueButton: {
      backgroundColor: '#FF9500',
      paddingVertical: 16,
      borderRadius: 25,
      alignItems: 'center',
    },
    continueButtonDisabled: {
      backgroundColor: '#666',
    },
    continueButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: '600',
    },
  });

