import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Onboarding screen for username collection and app introduction

export default function AuthenticationScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(true);

  const handleOnRamp = async () => {
    if (!username.trim()) {
      Alert.alert('Username Required', 'Please enter your ENS username (e.g., alice.eth)');
      return;
    }
    
    if (!password.trim()) {
      Alert.alert('Password Required', 'Please enter your password');
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement actual ENS lookup and authentication
      // This would involve:
      // 1. ENS reverse lookup to check if user exists
      // 2. If exists: validate password and login
      // 3. If new user: create wallet, register ENS, redirect to fiat on-ramp
      
      console.log('ENS Username:', username);
      console.log('Attempting authentication...');
      
      // Simulate authentication process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, assume new user if username doesn't end with .eth
      const isNewUser = !username.toLowerCase().endsWith('.eth');
      
      if (isNewUser) {
        Alert.alert(
          'Welcome to Pluto!', 
          `Creating wallet for ${username}.eth and setting up ENS...\n\nNext, you'll be able to fund your new wallet.`,
          [{ 
            text: 'Continue to Funding', 
            onPress: () => router.push('/(tabs)/bank-connection') 
          }]
        );
      } else {
        Alert.alert(
          'Welcome Back!', 
          `Logging in ${username}...`,
          [{ text: 'Continue', onPress: () => router.push('/(tabs)/dashboard') }]
        );
      }
    } catch (error) {
      Alert.alert('Authentication Failed', 'Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Upper Half - App Description */}
          <View style={styles.descriptionSection}>
            <View style={styles.iconContainer}>
              <View style={styles.appIconBackground}>
                <Ionicons name="wallet-outline" size={60} color="white" />
              </View>
            </View>
            
            <Text style={styles.appTitle}>Welcome to Pluto</Text>
            <Text style={styles.appDescription}>
              Manage crypto with voice commands and ENS identity. 
              Your gateway to decentralized finance powered by Rootstock and ENS.
            </Text>
            
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
                <Text style={styles.featureText}>Secure & Encrypted</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="flash" size={20} color="#FF9500" />
                <Text style={styles.featureText}>Lightning Fast</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="globe" size={20} color="#2196F3" />
                <Text style={styles.featureText}>Global Access</Text>
              </View>
            </View>
          </View>

          {/* Lower Half - Authentication Form */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>ENS Username & Password</Text>
            
            <TextInput
              style={styles.usernameInput}
              placeholder="alice.eth"
              placeholderTextColor="#666"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
            
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={isSecureTextEntry}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setIsSecureTextEntry(!isSecureTextEntry)}
              >
                <Ionicons
                  name={isSecureTextEntry ? 'eye-off' : 'eye'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={[styles.onRampButton, isLoading && styles.onRampButtonDisabled]}
              onPress={handleOnRamp}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.onRampButtonText}>Authenticating...</Text>
              ) : (
                <Text style={styles.onRampButtonText}>OnRamp</Text>
              )}
            </TouchableOpacity>
            
            <Text style={styles.helpText}>
              New users: Enter desired username (we'll add .eth)
              {"\n"}Existing users: Enter your full ENS name
            </Text>
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
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  // Upper Half - Description Section
  descriptionSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  iconContainer: {
    marginBottom: 32,
  },
  appIconBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  appDescription: {
    fontSize: 16,
    color: '#A0A0A0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  featureText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 12,
    fontWeight: '500',
  },
  // Lower Half - Input Section
  inputSection: {
    paddingTop: 20,
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  usernameInput: {
    width: '100%',
    backgroundColor: '#3C3C3E',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: 'white',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#555',
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3C3C3E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#555',
    marginBottom: 24,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: 'white',
  },
  eyeButton: {
    paddingHorizontal: 16,
  },
  helpText: {
    fontSize: 14,
    color: '#A0A0A0',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
  onRampButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#FF9500',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  onRampButtonDisabled: {
    backgroundColor: '#666',
    shadowOpacity: 0,
  },
  onRampButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

