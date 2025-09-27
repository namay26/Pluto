import { Ionicons } from '@expo/vector-icons';
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

interface RecentPackage {
  id: string;
  name: string;
  amount: string;
  percentage: string;
  isPositive: boolean;
}

interface TradingCard {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  percentage: string;
  isPositive: boolean;
}

export default function PortfolioScreen() {
  const portfolioValue = 38468.00;
  
  const recentPackages: RecentPackage[] = [
    {
      id: '1',
      name: 'Long-term earnings',
      amount: '$2,500',
      percentage: '+15%',
      isPositive: true,
    },
    {
      id: '2',
      name: 'Short-term gains',
      amount: '$1,200',
      percentage: '+8%',
      isPositive: true,
    },
  ];

  const tradingCards: TradingCard[] = [
    {
      id: '1',
      title: 'Long-term earnings',
      subtitle: 'Cryptocurrency',
      amount: '$2,500',
      percentage: '+15%',
      isPositive: true,
    },
    {
      id: '2',
      title: 'Long-term earnings',
      subtitle: 'Stocks',
      amount: '$1,800',
      percentage: '+12%',
      isPositive: true,
    },
    {
      id: '3',
      title: 'Long-term earnings',
      subtitle: 'Bonds',
      amount: '$950',
      percentage: '+8%',
      isPositive: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>Good Morning</Text>
              <Text style={styles.userName}>My Portfolio</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications-outline" size={24} color={AppColors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileButton}>
                <View style={styles.profileAvatar}>
                  <Text style={styles.profileInitial}>M</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Portfolio Value Card */}
          <View style={styles.portfolioCard}>
            <Text style={styles.portfolioLabel}>Total Portfolio Value</Text>
            <Text style={styles.portfolioAmount}>
              ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
            <View style={styles.portfolioActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Invest More</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Withdraw</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Packages */}
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent packages</Text>
            {recentPackages.map((pkg) => (
              <View key={pkg.id} style={styles.packageCard}>
                <View style={styles.packageHeader}>
                  <View>
                    <Text style={styles.packageName}>{pkg.name}</Text>
                    <Text style={styles.packageAmount}>{pkg.amount}</Text>
                  </View>
                  <View style={styles.packageRight}>
                    <View style={styles.packageToggle}>
                      <View style={styles.toggleActive} />
                    </View>
                    <Text style={[
                      styles.packagePercentage,
                      { color: pkg.isPositive ? AppColors.success : AppColors.danger }
                    ]}>
                      {pkg.percentage}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Trading Cards */}
          <View style={styles.tradingSection}>
            {tradingCards.map((card) => (
              <View key={card.id} style={styles.tradingCard}>
                <View style={styles.tradingHeader}>
                  <View>
                    <Text style={styles.tradingTitle}>{card.title}</Text>
                    <Text style={styles.tradingSubtitle}>{card.subtitle}</Text>
                  </View>
                  <View style={styles.tradingToggle}>
                    <View style={styles.toggleActive} />
                  </View>
                </View>
                <View style={styles.tradingContent}>
                  <View style={styles.tradingLeft}>
                    <Text style={styles.tradingAmount}>{card.amount}</Text>
                  </View>
                  <View style={styles.tradingRight}>
                    <Text style={[
                      styles.tradingPercentage,
                      { color: card.isPositive ? AppColors.success : AppColors.danger }
                    ]}>
                      {card.percentage}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Bottom Navigation Dots */}
          <View style={styles.bottomNavigation}>
            <View style={styles.navDots}>
              <View style={styles.navDot} />
              <View style={styles.navDot} />
              <View style={[styles.navDot, styles.navDotActive]} />
              <View style={styles.navDot} />
              <View style={styles.navDot} />
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
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  greeting: {
    fontSize: 16,
    color: AppColors.textSecondary,
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  notificationButton: {
    padding: 8,
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
  portfolioCard: {
    backgroundColor: AppColors.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  portfolioLabel: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 8,
  },
  portfolioAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
    marginBottom: 20,
  },
  portfolioActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: AppColors.accent,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  secondaryButtonText: {
    color: AppColors.textSecondary,
  },
  recentSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginBottom: 16,
  },
  packageCard: {
    backgroundColor: AppColors.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packageName: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  packageAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
  },
  packageRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  packageToggle: {
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: AppColors.accent,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: AppColors.textPrimary,
    alignSelf: 'flex-end',
  },
  packagePercentage: {
    fontSize: 16,
    fontWeight: '600',
  },
  tradingSection: {
    gap: 16,
    marginBottom: 32,
  },
  tradingCard: {
    backgroundColor: AppColors.secondary,
    borderRadius: 16,
    padding: 20,
  },
  tradingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tradingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  tradingSubtitle: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },
  tradingToggle: {
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: AppColors.accent,
    padding: 2,
    justifyContent: 'center',
  },
  tradingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tradingLeft: {
    flex: 1,
  },
  tradingRight: {
    alignItems: 'flex-end',
  },
  tradingAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
  },
  tradingPercentage: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNavigation: {
    alignItems: 'center',
    marginTop: 20,
  },
  navDots: {
    flexDirection: 'row',
    gap: 8,
  },
  navDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.textMuted,
  },
  navDotActive: {
    backgroundColor: AppColors.accent,
    width: 24,
  },
});
