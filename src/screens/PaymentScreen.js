import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LoanDetailsScreen({ navigation, route }) {
  const { loan } = route.params || {};

  const loanInfo = loan || {
    type: 'Personal Loan',
    amount: 'Ksh 50,000',
    gradient: ['#00D9B5', '#00A88E'],
  };

  const repaymentSchedule = [
    { month: 1, amount: 'Ksh 5,500', dueDate: '25 Aug 2024', status: 'paid' },
    { month: 2, amount: 'Ksh 5,500', dueDate: '25 Sep 2024', status: 'paid' },
    { month: 3, amount: 'Ksh 5,500', dueDate: '25 Oct 2024', status: 'upcoming' },
    { month: 4, amount: 'Ksh 5,500', dueDate: '25 Nov 2024', status: 'upcoming' },
    { month: 5, amount: 'Ksh 5,500', dueDate: '25 Dec 2024', status: 'upcoming' },
    { month: 6, amount: 'Ksh 5,500', dueDate: '25 Jan 2025', status: 'upcoming' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loan Details</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Loan Card */}
        <LinearGradient
          colors={loanInfo.gradient}
          style={styles.loanCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.loanType}>{loanInfo.type}</Text>
          <Text style={styles.loanAmount}>{loanInfo.amount}</Text>

          <View style={styles.loanStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Outstanding</Text>
              <Text style={styles.statValue}>Ksh 33,000</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Paid</Text>
              <Text style={styles.statValue}>Ksh 17,000</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '34%' }]} />
            </View>
            <Text style={styles.progressText}>34% Completed</Text>
          </View>
        </LinearGradient>

        {/* Loan Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loan Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Loan ID</Text>
              <Text style={styles.infoValue}>#SL-2024-001</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Disbursement Date</Text>
              <Text style={styles.infoValue}>20 Aug 2024</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Loan Term</Text>
              <Text style={styles.infoValue}>12 Months</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Interest Rate</Text>
              <Text style={styles.infoValue}>12% p.a.</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Monthly Payment</Text>
              <Text style={styles.infoValue}>Ksh 5,500</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Next Due Date</Text>
              <Text style={[styles.infoValue, { color: '#00D9B5' }]}>
                25 Aug 2024
              </Text>
            </View>
          </View>
        </View>

        {/* Repayment Schedule */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Repayment Schedule</Text>
            <TouchableOpacity>
              <Text style={styles.downloadText}>Download</Text>
            </TouchableOpacity>
          </View>

          {repaymentSchedule.map((payment) => (
            <View key={payment.month} style={styles.scheduleCard}>
              <View style={styles.scheduleLeft}>
                <View
                  style={[
                    styles.scheduleIcon,
                    {
                      backgroundColor:
                        payment.status === 'paid' ? '#1E3A32' : '#2A2F4A',
                    },
                  ]}
                >
                  {payment.status === 'paid' ? (
                    <Ionicons name="checkmark" size={20} color="#00D9B5" />
                  ) : (
                    <Text style={styles.monthNumber}>{payment.month}</Text>
                  )}
                </View>
                <View style={styles.scheduleInfo}>
                  <Text style={styles.scheduleAmount}>{payment.amount}</Text>
                  <Text style={styles.scheduleDueDate}>
                    Due: {payment.dueDate}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      payment.status === 'paid'
                        ? 'rgba(0, 217, 181, 0.2)'
                        : 'rgba(255, 165, 0, 0.2)',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: payment.status === 'paid' ? '#00D9B5' : '#FFA500',
                    },
                  ]}
                >
                  {payment.status === 'paid' ? 'Paid' : 'Upcoming'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Payment')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#00D9B5', '#00A88E']}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="card" size={20} color="#FFFFFF" />
              <Text style={styles.actionText}>Make Payment</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
            <Ionicons name="document-text" size={20} color="#00D9B5" />
            <Text style={styles.secondaryButtonText}>View Statement</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
            <Ionicons name="call" size={20} color="#00D9B5" />
            <Text style={styles.secondaryButtonText}>Contact Support</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loanCard: {
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
  },
  loanType: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  loanAmount: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  loanStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {},
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
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
  downloadText: {
    fontSize: 14,
    color: '#00D9B5',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#2A2F4A',
    padding: 20,
    borderRadius: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#8F92A1',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scheduleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2A2F4A',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  scheduleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scheduleIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scheduleInfo: {
    marginLeft: 12,
    flex: 1,
  },
  scheduleAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  scheduleDueDate: {
    fontSize: 12,
    color: '#8F92A1',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  actionButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 12,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  actionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2F4A',
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00D9B5',
    marginLeft: 8,
  },
});
