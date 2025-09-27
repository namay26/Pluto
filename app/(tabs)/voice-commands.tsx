import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface VoiceCommand {
  id: string;
  command: string;
  status: 'listening' | 'processing' | 'executing' | 'completed' | 'failed';
  timestamp: Date;
  result?: {
    action: string;
    mcpServer: string;
    transactionHash?: string;
    error?: string;
  };
}

export default function VoiceCommandsScreen() {
  const [isListening, setIsListening] = useState(false);
  const [currentCommand, setCurrentCommand] = useState<VoiceCommand | null>(null);
  const [commandHistory, setCommandHistory] = useState<VoiceCommand[]>([]);
  const pulseAnim = new Animated.Value(1);
  const waveAnim = new Animated.Value(0);

  useEffect(() => {
    if (isListening) {
      // Pulse animation for microphone
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
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
      
      // Wave animation for sound visualization
      Animated.loop(
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      pulseAnim.setValue(1);
      waveAnim.setValue(0);
    }
  }, [isListening]);

  const handleVoiceCommand = () => {
    if (isListening) {
      // Stop listening
      setIsListening(false);
      return;
    }

    // Start listening
    setIsListening(true);
    
    // Simulate voice command processing
    setTimeout(() => {
      const mockCommand: VoiceCommand = {
        id: Date.now().toString(),
        command: 'Send 2 rBTC to bob.eth',
        status: 'processing',
        timestamp: new Date(),
      };
      
      setCurrentCommand(mockCommand);
      setIsListening(false);

      // Simulate processing stages
      setTimeout(() => {
        setCurrentCommand(prev => prev ? {
          ...prev,
          status: 'executing',
          result: {
            action: 'Transfer 2 rBTC to bob.eth',
            mcpServer: 'RootstockMCP',
          }
        } : null);

        setTimeout(() => {
          const completedCommand: VoiceCommand = {
            ...mockCommand,
            status: 'completed',
            result: {
              action: 'Transfer 2 rBTC to bob.eth',
              mcpServer: 'RootstockMCP',
              transactionHash: '0x1234...5678',
            }
          };
          
          setCurrentCommand(completedCommand);
          setCommandHistory(prev => [completedCommand, ...prev]);
          
          // Clear current command after 3 seconds
          setTimeout(() => {
            setCurrentCommand(null);
          }, 3000);
        }, 2000);
      }, 2000);
    }, 3000);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'processing': return '#FF9500';
      case 'executing': return '#2196F3';
      case 'failed': return '#F44336';
      default: return '#666';
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Voice Commands</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Voice Interface */}
        <View style={styles.voiceInterface}>
          <Text style={styles.instructionText}>
            {isListening ? 'Listening... Speak your command' : 'Tap the microphone and speak'}
          </Text>
          
          {/* Sound Wave Visualization */}
          {isListening && (
            <View style={styles.waveContainer}>
              {[...Array(5)].map((_, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.waveBars,
                    {
                      transform: [{
                        scaleY: waveAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.3, 1 + Math.random() * 0.5],
                        })
                      }],
                      animationDelay: `${index * 100}ms`,
                    }
                  ]}
                />
              ))}
            </View>
          )}
          
          {/* Voice Button */}
          <TouchableOpacity
            style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
            onPress={handleVoiceCommand}
          >
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Ionicons
                name={isListening ? 'mic' : 'mic-outline'}
                size={64}
                color={isListening ? '#FF9500' : 'white'}
              />
            </Animated.View>
          </TouchableOpacity>
          
          <Text style={styles.hintText}>
            Try: "Send 2 rBTC to mom.eth" or "Check my balance"
          </Text>
        </View>

        {/* Current Command Status */}
        {currentCommand && (
          <View style={styles.commandStatus}>
            <View style={styles.commandHeader}>
              <Text style={styles.commandText}>"{currentCommand.command}"</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentCommand.status) }]}>
                <Text style={styles.statusText}>{currentCommand.status}</Text>
              </View>
            </View>
            
            {currentCommand.result && (
              <View style={styles.commandResult}>
                <Text style={styles.resultText}>🤖 {currentCommand.result.action}</Text>
                <Text style={styles.mcpText}>via {currentCommand.result.mcpServer}</Text>
                {currentCommand.result.transactionHash && (
                  <Text style={styles.hashText}>Tx: {currentCommand.result.transactionHash}</Text>
                )}
              </View>
            )}
          </View>
        )}
        
        {/* Command History */}
        {commandHistory.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>Recent Commands</Text>
            {commandHistory.slice(0, 3).map((cmd) => (
              <View key={cmd.id} style={styles.historyItem}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyCommand}>"{cmd.command}"</Text>
                  <Text style={styles.historyTime}>{formatTime(cmd.timestamp)}</Text>
                </View>
                <View style={[styles.historyStatus, { backgroundColor: getStatusColor(cmd.status) }]}>
                  <Text style={styles.historyStatusText}>{cmd.status}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  voiceInterface: {
    alignItems: 'center',
    marginBottom: 40,
  },
  instructionText: {
    fontSize: 18,
    color: '#A0A0A0',
    textAlign: 'center',
    marginBottom: 40,
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    marginBottom: 40,
  },
  waveBars: {
    width: 4,
    height: 40,
    backgroundColor: '#FF9500',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  voiceButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
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
    marginBottom: 20,
  },
  voiceButtonActive: {
    borderColor: '#FF9500',
    backgroundColor: '#4A3C2A',
  },
  hintText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  commandStatus: {
    backgroundColor: '#3C3C3E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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
  commandResult: {
    backgroundColor: '#2A2A2C',
    borderRadius: 8,
    padding: 12,
  },
  resultText: {
    fontSize: 14,
    color: '#FF9500',
    marginBottom: 4,
  },
  mcpText: {
    fontSize: 12,
    color: '#A0A0A0',
    marginBottom: 4,
  },
  hashText: {
    fontSize: 12,
    color: '#4CAF50',
  },
  historySection: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },
  historyItem: {
    backgroundColor: '#3C3C3E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyCommand: {
    fontSize: 14,
    color: 'white',
    fontStyle: 'italic',
    flex: 1,
  },
  historyTime: {
    fontSize: 12,
    color: '#666',
  },
  historyStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  historyStatusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
});
