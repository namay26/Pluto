import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { ethers } from "ethers";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Onboarding screen for username collection and app introduction

export default function AuthenticationScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(true);

  const provider = new ethers.JsonRpcProvider(
    "https://eth-sepolia.g.alchemy.com/v2/Iylkh0nK5WGuh1Erax1tcyZROWcPmxi2"
  );

  // Sepolia ENS Contract Addresses
  const ETH_REGISTRAR_CONTROLLER_ADDRESS = "0xFED6a969AaA60E4961FCD3EBF1A2e8913ac65B72";
  const PUBLIC_RESOLVER_ADDRESS = "0x8FADE66B79cC9f707aB26799354482EB93a5B7dD";

  // Minimal ABI for ENS operations
  const ETH_REGISTRAR_CONTROLLER_ABI = [
    "function available(string name) view returns (bool)",
    "function makeCommitment(string name, address owner, uint256 duration, bytes32 secret, address resolver, bytes[] data, bool reverseRecord, uint16 ownerControlledFuses) view returns (bytes32)",
    "function commit(bytes32 commitment)",
    "function register(string name, address owner, uint256 duration, bytes32 secret, address resolver, bytes[] data, bool reverseRecord, uint16 ownerControlledFuses) payable",
    "function rentPrice(string name, uint256 duration) view returns (uint256)"
  ];


  async function checkENS(name: string) {
    const address = await provider.resolveName(name);
    if (address) {
      console.log(`${name} is registered! Address: ${address}`);
      return address;
    } else {
      console.log(`${name} is not registered.`);
      return null;
    }
  }

  async function checkENSAvailability(name: string): Promise<boolean> {
    try {
      const controller = new ethers.Contract(
        ETH_REGISTRAR_CONTROLLER_ADDRESS,
        ETH_REGISTRAR_CONTROLLER_ABI,
        provider
      );
      
      // Remove .eth suffix if present for the availability check
      const label = name.toLowerCase().replace('.eth', '');
      const isAvailable = await controller.available(label);
      
      console.log(`ENS name ${label}.eth availability:`, isAvailable);
      return isAvailable;
    } catch (error) {
      console.error('Error checking ENS availability:', error);
      return false;
    }
  }

  async function registerENSName(name: string, ownerAddress: string, wallet: ethers.Wallet): Promise<boolean> {
    try {
      const controller = new ethers.Contract(
        ETH_REGISTRAR_CONTROLLER_ADDRESS,
        ETH_REGISTRAR_CONTROLLER_ABI,
        wallet
      );

      // Remove .eth suffix if present
      const label = name.toLowerCase().replace('.eth', '');
      
      // Registration parameters
      const duration = 31536000; // 1 year in seconds
      const secret = ethers.randomBytes(32); // Random secret for commit-reveal
      const resolverAddress = PUBLIC_RESOLVER_ADDRESS;
      const data = []; // No additional resolver data
      const reverseRecord = true; // Set up reverse record
      const ownerControlledFuses = 0; // No fuses

      console.log('Starting ENS registration process for:', `${label}.eth`);

      // Step 1: Make commitment
      const commitment = await controller.makeCommitment(
        label,
        ownerAddress,
        duration,
        secret,
        resolverAddress,
        data,
        reverseRecord,
        ownerControlledFuses
      );

      console.log('Generated commitment:', commitment);

      // Step 2: Submit commitment
      const commitTx = await controller.commit(commitment);
      console.log('Commitment transaction:', commitTx.hash);
      await commitTx.wait();
      console.log('Commitment confirmed');

      // Step 3: Wait for minimum commitment age (60 seconds)
      console.log('Waiting 65 seconds for commitment age...');
      await new Promise(resolve => setTimeout(resolve, 65000));

      // Step 4: Get registration price
      const price = await controller.rentPrice(label, duration);
      console.log('Registration price:', ethers.formatEther(price), 'ETH');

      // Step 5: Register the name
      const registerTx = await controller.register(
        label,
        ownerAddress,
        duration,
        secret,
        resolverAddress,
        data,
        reverseRecord,
        ownerControlledFuses,
        { value: price }
      );

      console.log('Registration transaction:', registerTx.hash);
      await registerTx.wait();
      console.log('ENS name registered successfully!');

      return true;
    } catch (error) {
      console.error('Error registering ENS name:', error);
      return false;
    }
  }

  const handleOnRamp = async () => {
    if (!username.trim()) {
      Alert.alert(
        "Username Required",
        "Please enter your ENS username (e.g., alice.eth)"
      );
      return;
    }

    if (!password.trim()) {
      Alert.alert("Password Required", "Please enter your password");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual ENS lookup and authentication
      // This would involve:
      // 1. ENS reverse lookup to check if user exists
      // 2. If exists: validate password and login
      // 3. If new user: create wallet, register ENS, redirect to fiat on-ramp

      //

      console.log("ENS Username:", username);
      console.log("Attempting authentication...");

      const addressFromEns = await checkENS(username);

      // ENS name not found, if addressFromEns is null
      if (!addressFromEns) {
        console.log('ENS name not found, checking availability and registering...');
        
        // Private key will be given by akshat sir
        // setting the wallet to interact
        const PRIVATE_KEY = "0x213adbcecef4667ef52d2e243c8f912f051685660f7c6d223b7c8babf948e151";

        const wallet = new ethers.Wallet(
          PRIVATE_KEY,
          provider
        );

        // Get wallet address
        const walletAddress = wallet.address;
        console.log('Wallet address:', walletAddress);

        // Ensure username has .eth suffix for consistency
        const ensName = username.toLowerCase().endsWith('.eth') ? username : `${username}.eth`;
        
        // Check availability
        const isAvailable = await checkENSAvailability(ensName);
        
        if (!isAvailable) {
          Alert.alert(
            'Name Not Available',
            `The ENS name ${ensName} is already taken. Please choose a different name.`
          );
          setIsLoading(false);
          return;
        }

        // Register the ENS name
        Alert.alert(
          'Registering ENS Name',
          `${ensName} is available! Starting registration process...\n\nThis will take about 70 seconds due to the commit-reveal process.`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => setIsLoading(false)
            },
            {
              text: 'Register',
              onPress: async () => {
                const success = await registerENSName(ensName, walletAddress, wallet);
                
                if (success) {
                  Alert.alert(
                    'Registration Successful!',
                    `${ensName} has been registered to your wallet!\n\nAddress: ${walletAddress}`,
                    [
                      {
                        text: 'Continue to Funding',
                        onPress: () => router.push('/(tabs)/bank-connection')
                      }
                    ]
                  );
                } else {
                  Alert.alert(
                    'Registration Failed',
                    'There was an error registering your ENS name. Please try again.'
                  );
                }
                setIsLoading(false);
              }
            }
          ]
        );
        return; // Exit early to prevent the rest of the function from running
      } else {
        // ENS name exists, user is logging in
        console.log('ENS name found, user logging in with address:', addressFromEns);
        
        Alert.alert('Welcome Back!', `Logging in ${username}...`, [
          { text: 'Continue', onPress: () => router.push('/(tabs)/dashboard') },
        ]);
        setIsLoading(false);
        return;
      }

      // This code should not be reached due to early returns above
      console.log('Unexpected code path reached');
    } catch (error) {
      Alert.alert(
        "Authentication Failed",
        "Please check your credentials and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
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
              Manage crypto with voice commands and ENS identity. Your gateway
              to decentralized finance powered by Rootstock and ENS.
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
                  name={isSecureTextEntry ? "eye-off" : "eye"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.onRampButton,
                isLoading && styles.onRampButtonDisabled,
              ]}
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
              New users: Enter desired username (we'll add .eth and register it)
              {"\n"}Existing users: Enter your full ENS name to login
              {"\n"}Registration takes ~70 seconds due to ENS commit-reveal process
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
    backgroundColor: "#2C2C2E",
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
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  iconContainer: {
    marginBottom: 32,
  },
  appIconBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FF9500",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
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
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
    textAlign: "center",
  },
  appDescription: {
    fontSize: 16,
    color: "#A0A0A0",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  featureText: {
    fontSize: 16,
    color: "white",
    marginLeft: 12,
    fontWeight: "500",
  },
  // Lower Half - Input Section
  inputSection: {
    paddingTop: 20,
    alignItems: "center",
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 16,
    textAlign: "center",
  },
  usernameInput: {
    width: "100%",
    backgroundColor: "#3C3C3E",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "white",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#555",
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3C3C3E",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#555",
    marginBottom: 24,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "white",
  },
  eyeButton: {
    paddingHorizontal: 16,
  },
  helpText: {
    fontSize: 14,
    color: "#A0A0A0",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 20,
  },
  onRampButton: {
    backgroundColor: "#FF9500",
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    shadowColor: "#FF9500",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  onRampButtonDisabled: {
    backgroundColor: "#666",
    shadowOpacity: 0,
  },
  onRampButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
