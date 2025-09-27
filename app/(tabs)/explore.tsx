import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { AppColors } from '@/constants/theme';

interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  route?: string;
}

export default function ExploreScreen() {
  const menuItems: MenuItem[] = [
    {
      id: '1',
      title: 'Account Settings',
      subtitle: 'Manage your profile and preferences',
      icon: 'person-outline',
    },
    {
      id: '2',
      title: 'Security',
      subtitle: 'Two-factor authentication and security',
      icon: 'shield-checkmark-outline',
    },
    {
      id: '3',
      title: 'Notifications',
      subtitle: 'Push notifications and alerts',
      icon: 'notifications-outline',
    },
    {
      id: '4',
      title: 'Payment Methods',
      subtitle: 'Manage cards and bank accounts',
      icon: 'card-outline',
    },
    {
      id: '5',
      title: 'Transaction History',
      subtitle: 'View all your transactions',
      icon: 'time-outline',
    },
    {
      id: '6',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: 'help-circle-outline',
    },
    {
      id: '7',
      title: 'About',
      subtitle: 'App version and information',
      icon: 'information-circle-outline',
    },
  ];

  const handleMenuPress = (item: MenuItem) => {
    if (item.route) {
      router.push(item.route as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>More</Text>
            <TouchableOpacity style={styles.profileButton}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileInitial}>T</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* User Info Card */}
          <View style={styles.userCard}>
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <Text style={styles.userInitial}>TB</Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>Team Banking</Text>
                <Text style={styles.userEmail}>team@plutoapp.com</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={20} color={AppColors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleMenuPress(item)}
              >
                <View style={styles.menuIcon}>
                  <Ionicons name={item.icon as any} size={24} color={AppColors.accent} />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={AppColors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appVersion}>Pluto v1.0.0</Text>
            <Text style={styles.appDescription}>
              Your modern financial companion for crypto and traditional banking
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
    backgroundColor: AppColors.primary,
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
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
  },
  profileButton: {
    padding: 4,
  },
  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  userCard: {
    backgroundColor: AppColors.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: AppColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },
  editButton: {
    padding: 8,
  },
  menuSection: {
    gap: 12,
  },
  menuItem: {
    backgroundColor: AppColors.secondary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  appVersion: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    color: AppColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
