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

interface TradingCard {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  percentage: string;
  isPositive: boolean;
  color: string;
}

export default function TradingScreen() {
  const longTermEarnings = 2500.00;
  
  const tradingCards: TradingCard[] = [
    {
      id: '1',
      title: 'Long-term earnings',
      subtitle: 'Cryptocurrency',
      amount: '$2,500',
      percentage: '+15%',
      isPositive: true,
      color: AppColors.accent,
    },
    {
      id: '2',
      title: 'Long-term earnings',
      subtitle: 'Stocks',
      amount: '$1,800',
      percentage: '+12%',
      isPositive: true,
      color: AppColors.success,
    },
    {
      id: '3',
      title: 'Long-term earnings',
      subtitle: 'Bonds',
      amount: '$950',
      percentage: '+8%',
      isPositive: true,
      color: AppColors.info,
    },
    {
      id: '4',
      title: 'Long-term earnings',
      subtitle: 'Real Estate',
      amount: '$3,200',
      percentage: '+18%',
      isPositive: true,
      color: AppColors.warning,
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
              <Text style={styles.userName}>Team Banking</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications-outline" size={24} color={AppColors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileButton}>
                <View style={styles.profileAvatar}>
                  <Text style={styles.profileInitial}>T</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Main Earnings Card */}
          <View style={styles.mainEarningsCard}>
            <View style={styles.earningsHeader}>
              <Text style={styles.earningsTitle}>Long-term earnings</Text>
              <View style={styles.earningsToggle}>
                <View style={styles.toggleActive} />
              </View>
            </View>
            <View style={styles.earningsContent}>
              <View style={styles.earningsLeft}>
                <Text style={styles.earningsSubtitle}>Cryptocurrency</Text>
                <Text style={styles.earningsAmount}>
                  ${longTermEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </Text>
              </View>
              <View style={styles.earningsRight}>
                <Text style={styles.earningsPercentage}>+15%</Text>
                <Text style={styles.earningsChange}>$375</Text>
              </View>
            </View>
          </View>

          {/* Trading Cards Grid */}
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
              <View style={[styles.navDot, styles.navDotActive]} />
              <View style={styles.navDot} />
              <View style={styles.navDot} />
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
  mainEarningsCard: {
    backgroundColor: AppColors.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  earningsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  earningsToggle: {
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
  earningsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  earningsLeft: {
    flex: 1,
  },
  earningsRight: {
    alignItems: 'flex-end',
  },
  earningsSubtitle: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 8,
  },
  earningsAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
  },
  earningsPercentage: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.success,
    marginBottom: 4,
  },
  earningsChange: {
    fontSize: 14,
    color: AppColors.textSecondary,
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
