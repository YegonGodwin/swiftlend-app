import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function LoanCalculatorScreen({ navigation }) {
  const [loanAmount, setLoanAmount] = useState('50000');
  const [interestRate, setInterestRate] = useState('12');
  const [loanTerm, setLoanTerm] = useState('12');

  const calculateLoanDetails = () => {
    const principal = parseFloat(loanAmount) || 0;
    const rate = parseFloat(interestRate) / 100 / 12 || 0;
    const months = parseInt(loanTerm) || 1;

    let monthlyPayment = 0;
    let totalPayment = 0;
    let totalInterest = 0;

    if (rate === 0) {
      monthlyPayment = principal / months;
    } else {
      monthlyPayment =
        (principal * rate * Math.pow(1 + rate, months)) /
        (Math.pow(1 + rate, months) - 1);
    }

    totalPayment = monthlyPayment * months;
    totalInterest = totalPayment - principal;

    return {
      monthlyPayment: isNaN(monthlyPayment) ? 0 : monthlyPayment.toFixed(2),
      totalPayment: isNaN(totalPayment) ? 0 : totalPayment.toFixed(2),
      totalInterest: isNaN(totalInterest) ? 0 : totalInterest.toFixed(2),
      principal: principal.toFixed(2),
    };
  };

  const loanDetails = calculateLoanDetails();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loan Calculator</Text>
        <TouchableOpacity>
          <Ionicons name="refresh" size={24} color="#00D9B5" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Calculator Card */}
        <View style={styles.calculatorCard}>
          {/* Loan Amount */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Loan Amount</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>Ksh</Text>
              <TextInput
                style={styles.input}
                value={loanAmount}
                onChangeText={setLoanAmount}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#8F92A1"
              />
            </View>
            <View style={styles.slider}>
              <View style={styles.sliderTrack}>
                <View
                  style={[
                    styles.sliderFill,
                    {
                      width: `${Math.min(
                        (parseFloat(loanAmount) / 100000) * 100,
                        100
                      )}%`,
                    },
                  ]}
                />
              </View>
            </View>
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>0</Text>
              <Text style={styles.sliderLabel}>100,000</Text>
            </View>
          </View>

          {/* Interest Rate */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Annual Interest Rate</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={interestRate}
                onChangeText={setInterestRate}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#8F92A1"
              />
              <Text style={styles.percentSymbol}>%</Text>
            </View>
            <View style={styles.slider}>
              <View style={styles.sliderTrack}>
                <View
                  style={[
                    styles.sliderFill,
                    {
                      width: `${Math.min(
                        (parseFloat(interestRate) / 30) * 100,
                        100
                      )}%`,
                    },
                  ]}
                />
              </View>
            </View>
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>0%</Text>
              <Text style={styles.sliderLabel}>30%</Text>
            </View>
          </View>

          {/* Loan Term */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Loan Term (Months)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={loanTerm}
                onChangeText={setLoanTerm}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#8F92A1"
              />
              <Text style={styles.monthsText}>months</Text>
            </View>
            <View style={styles.termChips}>
              {['6', '12', '24', '36'].map((term) => (
                <TouchableOpacity
                  key={term}
                  style={[
                    styles.termChip,
                    loanTerm === term && styles.termChipActive,
                  ]}
                  onPress={() => setLoanTerm(term)}
                >
                  <Text
                    style={[
                      styles.termChipText,
                      loanTerm === term && styles.termChipTextActive,
                    ]}
                  >
                    {term}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Results */}
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>Your Loan Breakdown</Text>

          {/* Monthly Payment Card */}
          <LinearGradient
            colors={['#00D9B5', '#00A88E']}
            style={styles.monthlyPaymentCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.monthlyPaymentLabel}>Monthly Payment</Text>
            <Text style={styles.monthlyPaymentAmount}>
              Ksh {loanDetails.monthlyPayment}
            </Text>
            <Text style={styles.monthlyPaymentNote}>
              Pay this amount every month for {loanTerm} months
            </Text>
          </LinearGradient>

          {/* Details Cards */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailCard}>
              <Ionicons name="wallet" size={24} color="#4A90E2" />
              <Text style={styles.detailLabel}>Principal Amount</Text>
              <Text style={styles.detailValue}>
                Ksh {loanDetails.principal}
              </Text>
            </View>

            <View style={styles.detailCard}>
              <Ionicons name="trending-up" size={24} color="#FF6B6B" />
              <Text style={styles.detailLabel}>Total Interest</Text>
              <Text style={styles.detailValue}>
                Ksh {loanDetails.totalInterest}
              </Text>
            </View>

            <View style={styles.detailCard}>
              <Ionicons name="cash" size={24} color="#FFD700" />
              <Text style={styles.detailLabel}>Total Payment</Text>
              <Text style={styles.detailValue}>
                Ksh {loanDetails.totalPayment}
              </Text>
            </View>

            <View style={styles.detailCard}>
              <Ionicons name="calendar" size={24} color="#C850C0" />
              <Text style={styles.detailLabel}>Loan Term</Text>
              <Text style={styles.detailValue}>{loanTerm} Months</Text>
            </View>
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color="#4A90E2" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>How it works</Text>
            <Text style={styles.infoText}>
              This calculator helps you estimate your monthly loan payments
              based on the amount, interest rate, and term you choose. Actual
              rates may vary.
            </Text>
          </View>
        </View>

        {/* Apply Button */}
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => navigation.navigate('Apply')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#00D9B5', '#00A88E']}
            style={styles.applyGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.applyText}>Apply for This Loan</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

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
  calculatorCard: {
    backgroundColor: '#2A2F4A',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2337',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8F92A1',
    marginRight: 8,
  },
  percentSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8F92A1',
    marginLeft: 8,
  },
  monthsText: {
    fontSize: 14,
    color: '#8F92A1',
    marginLeft: 8,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingVertical: 14,
  },
  slider: {
    marginTop: 12,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#1E2337',
    borderRadius: 3,
  },
  sliderFill: {
    height: 6,
    backgroundColor: '#00D9B5',
    borderRadius: 3,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#8F92A1',
  },
  termChips: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  termChip: {
    backgroundColor: '#1E2337',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  termChipActive: {
    borderColor: '#00D9B5',
    backgroundColor: '#1E3A32',
  },
  termChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8F92A1',
  },
  termChipTextActive: {
    color: '#00D9B5',
  },
  resultsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  monthlyPaymentCard: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  monthlyPaymentLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  monthlyPaymentAmount: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  monthlyPaymentNote: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailCard: {
    width: '48%',
    backgroundColor: '#2A2F4A',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#8F92A1',
    marginTop: 8,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#1E2E3A',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#8F92A1',
    lineHeight: 20,
  },
  applyButton: {
    marginHorizontal: 20,
    borderRadius: 25,
    overflow: 'hidden',
  },
  applyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  applyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
});
