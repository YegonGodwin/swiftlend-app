import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function CardsScreen({ navigation }) {
  const [selectedCard, setSelectedCard] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const loans = [
    {
      id: '1',
      type: 'Active Personal Loan',
      amount: 'Ksh 50,000',
      nextPayment: 'Ksh 5,500',
      dueDate: '25 Aug 2024',
      gradient: ['#00D9B5', '#00A88E'],
      progress: 0.4,
    },
    {
      id: '2',
      type: 'Business Loan',
      amount: 'Ksh 100,000',
      nextPayment: 'Ksh 12,000',
      dueDate: '30 Aug 2024',
      gradient: ['#4158D0', '#C850C0'],
      progress: 0.65,
    },
    {
      id: '3',
      type: 'Emergency Loan',
      amount: 'Ksh 25,000',
      nextPayment: 'Ksh 3,000',
      dueDate: '20 Aug 2024',
      gradient: ['#FF6B6B', '#FF8E53'],
      progress: 0.25,
    },
  ];

  const recentActivity = [
    {
      id: '1',
      title: 'Payment Received',
      amount: '+ Ksh 5,000',
      date: 'Due: 25 Aug 2024',
      icon: 'checkmark-circle',
      positive: true,
    },
    {
      id: '2',
      title: 'Payment Received',
      amount: '+ Ksh 50,000',
      date: 'Due: 25 Aug 2024',
      icon: 'checkmark-circle',
      positive: true,
    },
    {
      id: '3',
      title: 'Payment Received',
      amount: '+ Ksh 50,000',
      date: 'Due: 25 Aug 2024',
      icon: 'checkmark-circle',
      positive: true,
    },
  ];

  const exploreOptions = [
    {
      id: '1',
      title: 'Business Loan',
      subtitle: 'Low Interest Rates',
      icon: 'briefcase',
    },
    {
      id: '2',
      title: 'Explore New Options',
      subtitle: 'Find the best loan',
      icon: 'add-circle',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="flash" size={28} color="#00D9B5" />
          <Text style={styles.logoText}>SwiftLend</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Your Loans & Cards</Text>
          <Text style={styles.subtitle}>Manage your finances.</Text>
        </View>

        {/* Active Loans Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Personal Loan</Text>

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
          >
            {/* Main Active Loan Card */}
            <View style={styles.cardWrapper}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate('LoanDetails', { loan: loans[0] })
                }
              >
                <LinearGradient
                  colors={loans[0].gradient}
                  style={styles.loanCard}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.cardType}>{loans[0].type}</Text>
                  <Text style={styles.cardAmount}>{loans[0].amount}</Text>

                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentLabel}>Next Payment:</Text>
                    <Text style={styles.paymentAmount}>
                      {loans[0].nextPayment}
                    </Text>
                  </View>

                  <View style={styles.dueDateContainer}>
                    <Text style={styles.dueLabel}>
                      Due: {loans[0].dueDate}
                    </Text>
                  </View>

                  <TouchableOpacity style={styles.makePaymentButton}>
                    <Text style={styles.makePaymentText}>Make Payment</Text>
                  </TouchableOpacity>

                  {/* Progress Bar */}
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBackground}>
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${loans[0].progress * 100}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {Math.round(loans[0].progress * 100)}% Paid
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Explore Options Cards */}
            {exploreOptions.map((option) => (
              <View key={option.id} style={styles.cardWrapper}>
                <TouchableOpacity activeOpacity={0.9}>
                  <View style={styles.exploreCard}>
                    <View style={styles.exploreIconContainer}>
                      <Ionicons
                        name={option.icon}
                        size={48}
                        color="#00D9B5"
                      />
                    </View>
                    <Text style={styles.exploreTitle}>{option.title}</Text>
                    <Text style={styles.exploreSubtitle}>
                      {option.subtitle}
                    </Text>

                    {option.icon === 'add-circle' && (
                      <TouchableOpacity style={styles.exploreButton}>
                        <Ionicons name="add" size={24} color="#FFFFFF" />
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {[...loans.slice(0, 1), ...exploreOptions].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === selectedCard && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityLeft}>
                <View
                  style={[
                    styles.activityIconContainer,
                    { backgroundColor: activity.positive ? '#1E3A32' : '#3A1E1E' },
                  ]}
                >
                  <Ionicons
                    name={activity.icon}
                    size={24}
                    color={activity.positive ? '#00D9B5' : '#FF5252'}
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDate}>{activity.date}</Text>
                </View>
              </View>
              <Text
                style={[
                  styles.activityAmount,
                  { color: activity.positive ? '#00D9B5' : '#FF5252' },
                ]}
              >
                {activity.amount}
              </Text>
            </View>
          ))}
        </View>

        {/* Loan Management Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loan Management</Text>

          <TouchableOpacity
            style={styles.managementCard}
            onPress={() => navigation.navigate('LoanCalculator')}
          >
            <View style={styles.managementIconContainer}>
              <Ionicons name="calculator" size={24} color="#00D9B5" />
            </View>
            <View style={styles.managementContent}>
              <Text style={styles.managementTitle}>Loan Calculator</Text>
              <Text style={styles.managementDescription}>
                Calculate your loan payments
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#8F92A1" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.managementCard}
            onPress={() => navigation.navigate('Payment')}
          >
            <View style={styles.managementIconContainer}>
              <Ionicons name="card" size={24} color="#00D9B5" />
            </View>
            <View style={styles.managementContent}>
              <Text style={styles.managementTitle}>Make a Payment</Text>
              <Text style={styles.managementDescription}>
                Pay your loan installment
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#8F92A1" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.managementCard}>
            <View style={styles.managementIconContainer}>
              <Ionicons name="download" size={24} color="#00D9B5" />
            </View>
            <View style={styles.managementContent}>
              <Text style={styles.managementTitle}>Download Statement</Text>
              <Text style={styles.managementDescription}>
                Get your loan statement
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#8F92A1" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151828',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8F92A1',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#00D9B5',
    fontWeight: '600',
  },
  cardWrapper: {
    width: width - 40,
    marginRight: 16,
  },
  loanCard: {
    padding: 24,
    borderRadius: 20,
    minHeight: 280,
  },
  cardType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  paymentInfo: {
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  paymentAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dueDateContainer: {
    marginBottom: 16,
  },
  dueLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  makePaymentButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  makePaymentText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
  },
  exploreCard: {
    backgroundColor: '#2A2F4A',
    padding: 24,
    borderRadius: 20,
    minHeight: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E2337',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  exploreTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  exploreSubtitle: {
    fontSize: 14,
    color: '#8F92A1',
    textAlign: 'center',
  },
  exploreButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00D9B5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3A3F5C',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#00D9B5',
    width: 24,
  },
  activityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2A2F4A',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    marginLeft: 12,
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    color: '#8F92A1',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  managementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2F4A',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  managementIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E2337',
    alignItems: 'center',
    justifyContent: 'center',
  },
  managementContent: {
    flex: 1,
    marginLeft: 16,
  },
  managementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  managementDescription: {
    fontSize: 14,
    color: '#8F92A1',
  },
});
