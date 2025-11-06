import React, { useState, useEffect } from 'react';
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

export default function HomeScreen({ navigation }) {
  const [creditScore, setCreditScore] = useState(780);
  const [animatedScore] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animatedScore, {
      toValue: creditScore,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, [creditScore]);

  const quickActions = [
    {
      id: '1',
      title: 'Loan Calculator',
      icon: 'calculator',
      onPress: () => navigation.navigate('LoanCalculator'),
    },
    {
      id: '2',
      title: 'Apply Now',
      icon: 'document-text',
      onPress: () => navigation.navigate('Apply'),
    },
    {
      id: '3',
      title: 'Repayments',
      icon: 'calendar',
      onPress: () => navigation.navigate('Payment'),
    },
    {
      id: '4',
      title: 'Support',
      icon: 'headset',
      onPress: () => {},
    },
  ];

  const loanOffers = [
    {
      id: '1',
      type: 'Personal Loan',
      amount: 'Upto $10,000',
      gradient: ['#00D9B5', '#00A88E'],
    },
    {
      id: '2',
      type: 'Business Loan',
      amount: 'Low Interest Rates',
      gradient: ['#4158D0', '#C850C0'],
    },
    {
      id: '3',
      type: 'Emergency Loan',
      amount: 'Get Cash Fast',
      gradient: ['#FF6B6B', '#FF8E53'],
    },
  ];

  const getCreditRating = (score) => {
    if (score >= 750) return { text: 'Excellent', color: '#00D9B5' };
    if (score >= 700) return { text: 'Good', color: '#4CAF50' };
    if (score >= 650) return { text: 'Fair', color: '#FFC107' };
    return { text: 'Poor', color: '#FF5252' };
  };

  const rating = getCreditRating(creditScore);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="flash" size={28} color="#00D9B5" />
          <Text style={styles.logoText}>SwiftLend</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* Credit Score Card */}
      <LinearGradient
        colors={['#2A2F4A', '#3A3F5C']}
        style={styles.creditScoreCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.creditScoreLabel}>Your Credit Score:</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.creditScoreValue}>{creditScore}</Text>
          <View style={[styles.ratingBadge, { backgroundColor: rating.color }]}>
            <Text style={styles.ratingText}>{rating.text}</Text>
          </View>
        </View>

        {/* Circular Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.circularProgress}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressPercentage}>
                {Math.round((creditScore / 850) * 100)}%
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.improveButton}>
          <Text style={styles.improveButtonText}>Tips to Improve</Text>
          <Ionicons name="arrow-forward" size={16} color="#00D9B5" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickActionsContainer}
        >
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionCard}
              onPress={action.onPress}
              activeOpacity={0.8}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name={action.icon} size={28} color="#00D9B5" />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Loan Offers */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Loan Offers Just For You</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.loanOffersContainer}
        >
          {loanOffers.map((offer, index) => (
            <TouchableOpacity
              key={offer.id}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('LoanDetails', { loan: offer })}
            >
              <LinearGradient
                colors={offer.gradient}
                style={styles.loanOfferCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.loanType}>{offer.type}:</Text>
                <Text style={styles.loanAmount}>{offer.amount}</Text>
                <TouchableOpacity style={styles.viewDetailsButton}>
                  <Text style={styles.viewDetailsText}>View Details</Text>
                </TouchableOpacity>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Financial Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Tips</Text>
        <View style={styles.tipsCard}>
          <Ionicons name="bulb" size={24} color="#FFD700" />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Build Your Emergency Fund</Text>
            <Text style={styles.tipDescription}>
              Aim to save 3-6 months of expenses for unexpected situations
            </Text>
          </View>
        </View>

        <View style={styles.tipsCard}>
          <Ionicons name="trending-up" size={24} color="#00D9B5" />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Pay Bills On Time</Text>
            <Text style={styles.tipDescription}>
              Timely payments improve your credit score and reduce late fees
            </Text>
          </View>
        </View>
      </View>

      {/* Recent Activity Preview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Activity')}>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityIconContainer}>
            <Ionicons name="checkmark-circle" size={24} color="#00D9B5" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Payment Received</Text>
            <Text style={styles.activityDate}>Due: 25 Aug 2024</Text>
          </View>
          <Text style={styles.activityAmount}>+ Ksh 5,000</Text>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityIconContainer}>
            <Ionicons name="checkmark-circle" size={24} color="#00D9B5" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Application Approved</Text>
            <Text style={styles.activityDate}>Due: 25 Aug 2024</Text>
          </View>
          <Text style={styles.activityAmount}>- 151 18</Text>
        </View>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151828',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5252',
  },
  creditScoreCard: {
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
  },
  creditScoreLabel: {
    fontSize: 16,
    color: '#8F92A1',
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  creditScoreValue: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 12,
  },
  ratingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  circularProgress: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: '#00D9B5',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.3,
  },
  progressCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  improveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  improveButtonText: {
    fontSize: 14,
    color: '#00D9B5',
    marginRight: 4,
    fontWeight: '600',
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
  },
  seeAllText: {
    fontSize: 14,
    color: '#00D9B5',
    fontWeight: '600',
  },
  quickActionsContainer: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  quickActionCard: {
    backgroundColor: '#2A2F4A',
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    alignItems: 'center',
    width: 100,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1E2337',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  loanOffersContainer: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  loanOfferCard: {
    width: width * 0.65,
    padding: 24,
    borderRadius: 20,
    marginRight: 16,
  },
  loanType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  loanAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  viewDetailsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tipsCard: {
    flexDirection: 'row',
    backgroundColor: '#2A2F4A',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  tipContent: {
    flex: 1,
    marginLeft: 16,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: '#8F92A1',
    lineHeight: 20,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2F4A',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E2337',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
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
    color: '#00D9B5',
  },
});
