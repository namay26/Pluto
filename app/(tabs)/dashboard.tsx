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

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface InvestmentCard {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  percentage: string;
  isPositive: boolean;
  color: string;
}

export default function DashboardScreen() {
  const totalBalance = 32680.20;
  
  const categories: Category[] = [
    { id: '1', name: 'Deposit', icon: 'add-circle', color: AppColors.accent },
    { id: '2', name: 'Withdraw', icon: 'remove-circle', color: AppColors.warning },
    { id: '3', name: 'Transfer', icon: 'swap-horizontal', color: AppColors.info },
    { id: '4', name: 'History', icon: 'time', color: AppColors.textSecondary },
    { id: '5', name: 'Card', icon: 'card', color: AppColors.accent },
    { id: '6', name: 'Invest', icon: 'trending-up', color: AppColors.success },
    { id: '7', name: 'Loan', icon: 'cash', color: AppColors.warning },
    { id: '8', name: 'More', icon: 'ellipsis-horizontal', color: AppColors.textSecondary },
  ];

  const investments: InvestmentCard[] = [
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
      title: 'Short-term earnings',
      subtitle: 'Stocks',
      amount: '$1,200',
      percentage: '+8%',
      isPositive: true,
      color: AppColors.success,
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

          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
            <TouchableOpacity style={styles.payButton}>
              <Text style={styles.payButtonText}>Pay now</Text>
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <View style={styles.categoriesSection}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.categoriesGrid}>
              {categories.map((category) => (
                <TouchableOpacity key={category.id} style={styles.categoryItem}>
                  <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                    <Ionicons name={category.icon as any} size={24} color={AppColors.textPrimary} />
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Credit Card */}
          <View style={styles.creditCardSection}>
            <Text style={styles.sectionTitle}>Credit Cards</Text>
            <View style={styles.creditCard}>
              <View style={styles.creditCardHeader}>
                <Text style={styles.creditCardTitle}>Long-term earnings</Text>
                <View style={styles.creditCardToggle}>
                  <View style={styles.toggleActive} />
                </View>
              </View>
              <View style={styles.creditCardContent}>
                <View style={styles.creditCardLeft}>
                  <Text style={styles.creditCardSubtitle}>Cryptocurrency</Text>
                  <Text style={styles.creditCardAmount}>$2,500</Text>
                </View>
                <View style={styles.creditCardRight}>
                  <Text style={styles.creditCardPercentage}>+15%</Text>
                  <Text style={styles.creditCardChange}>$375</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Investment Cards */}
          <View style={styles.investmentSection}>
            {investments.map((investment) => (
              <View key={investment.id} style={styles.investmentCard}>
                <View style={styles.investmentHeader}>
                  <View>
                    <Text style={styles.investmentTitle}>{investment.title}</Text>
                    <Text style={styles.investmentSubtitle}>{investment.subtitle}</Text>
                  </View>
                  <View style={styles.investmentToggle}>
                    <View style={styles.toggleActive} />
                  </View>
                </View>
                <View style={styles.investmentContent}>
                  <Text style={styles.investmentAmount}>{investment.amount}</Text>
                  <Text style={[
                    styles.investmentPercentage,
                    { color: investment.isPositive ? AppColors.success : AppColors.danger }
                  ]}>
                    {investment.percentage}
                  </Text>
                </View>
              </View>
            ))}
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
  balanceCard: {
    backgroundColor: AppColors.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
    marginBottom: 16,
  },
  payButton: {
    backgroundColor: AppColors.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  payButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },
  creditCardSection: {
    marginBottom: 24,
  },
  creditCard: {
    backgroundColor: AppColors.secondary,
    borderRadius: 16,
    padding: 20,
  },
  creditCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  creditCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  creditCardToggle: {
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
  creditCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  creditCardLeft: {
    flex: 1,
  },
  creditCardRight: {
    alignItems: 'flex-end',
  },
  creditCardSubtitle: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 8,
  },
  creditCardAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
  },
  creditCardPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.success,
    marginBottom: 4,
  },
  creditCardChange: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },
  investmentSection: {
    gap: 16,
  },
  investmentCard: {
    backgroundColor: AppColors.secondary,
    borderRadius: 16,
    padding: 20,
  },
  investmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  investmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  investmentSubtitle: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },
  investmentToggle: {
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: AppColors.accent,
    padding: 2,
    justifyContent: 'center',
  },
  investmentContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  investmentAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
  },
  investmentPercentage: {
    fontSize: 16,
    fontWeight: '600',
  },
});
