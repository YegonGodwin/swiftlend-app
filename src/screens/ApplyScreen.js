import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function ApplyScreen({ navigation }) {
  const [loanType, setLoanType] = useState('personal');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('12');
  const [purpose, setPurpose] = useState('');
  const [income, setIncome] = useState('');

  const loanTypes = [
    { id: 'personal', label: 'Personal Loan', icon: 'person' },
    { id: 'business', label: 'Business Loan', icon: 'briefcase' },
    { id: 'emergency', label: 'Emergency Loan', icon: 'flash' },
    { id: 'education', label: 'Education Loan', icon: 'school' },
  ];

  const durations = ['3', '6', '12', '18', '24', '36'];

  const calculateMonthlyPayment = () => {
    const principal = parseFloat(amount);
    const months = parseInt(duration);
    const rate = 0.12; // 12% annual interest
    
    if (!principal || !months) return 0;
    
    const monthlyRate = rate / 12;
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                    (Math.pow(1 + monthlyRate, months) - 1);
    
    return payment.toFixed(2);
  };

  const handleSubmit = () => {
    if (!amount || !purpose || !income) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Application Submitted',
      'Your loan application has been submitted successfully. We will review it and get back to you within 24 hours.',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Apply for Loan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Loan Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Loan Type</Text>
          <View style={styles.loanTypesGrid}>
            {loanTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.loanTypeCard,
                  loanType === type.id && styles.loanTypeCardActive,
                ]}
                onPress={() => setLoanType(type.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={type.icon}
                  size={28}
                  color={loanType === type.id ? '#00D9B5' : '#8F92A1'}
                />
                <Text
                  style={[
                    styles.loanTypeText,
                    loanType === type.id && styles.loanTypeTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Loan Amount */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loan Amount</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>Ksh</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              placeholderTextColor="#8F92A1"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
          <View style={styles.amountSuggestions}>
            {['5000', '10000', '25000', '50000'].map((amt) => (
              <TouchableOpacity
                key={amt}
                style={styles.suggestionChip}
                onPress={() => setAmount(amt)}
              >
                <Text style={styles.suggestionText}>Ksh {amt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Loan Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loan Duration (Months)</Text>
          <View style={styles.durationContainer}>
            {durations.map((dur) => (
              <TouchableOpacity
                key={dur}
                style={[
                  styles.durationChip,
                  duration === dur && styles.durationChipActive,
                ]}
                onPress={() => setDuration(dur)}
              >
                <Text
                  style={[
                    styles.durationText,
                    duration === dur && styles.durationTextActive,
                  ]}
                >
                  {dur}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Monthly Payment Estimate */}
        {amount && duration && (
          <LinearGradient
            colors={['#00D9B5', '#00A88E']}
            style={styles.estimateCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.estimateContent}>
              <Text style={styles.estimateLabel}>Estimated Monthly Payment</Text>
              <Text style={styles.estimateAmount}>
                Ksh {calculateMonthlyPayment()}
              </Text>
              <Text style={styles.estimateNote}>
                *Based on 12% annual interest rate
              </Text>
            </View>
          </LinearGradient>
        )}

        {/* Purpose */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Purpose of Loan</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Describe why you need this loan..."
              placeholderTextColor="#8F92A1"
              multiline
              numberOfLines={4}
              value={purpose}
              onChangeText={setPurpose}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Monthly Income */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Income</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>Ksh</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter monthly income"
              placeholderTextColor="#8F92A1"
              keyboardType="numeric"
              value={income}
              onChangeText={setIncome}
            />
          </View>
        </View>

        {/* Additional Information */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#4A90E2" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Quick Approval Process</Text>
            <Text style={styles.infoText}>
              • Get approved in minutes{'\n'}
              • No hidden fees{'\n'}
              • Flexible repayment options{'\n'}
              • 24/7 customer support
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#00D9B5', '#00A88E']}
            style={styles.submitGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.submitText}>Submit Application</Text>
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  loanTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loanTypeCard: {
    width: '48%',
    backgroundColor: '#2A2F4A',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  loanTypeCardActive: {
    borderColor: '#00D9B5',
    backgroundColor: '#1E3A32',
  },
  loanTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8F92A1',
    marginTop: 8,
    textAlign: 'center',
  },
  loanTypeTextActive: {
    color: '#00D9B5',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2F4A',
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
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 14,
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 14,
    minHeight: 100,
  },
  amountSuggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  suggestionChip: {
    backgroundColor: '#2A2F4A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8F92A1',
  },
  durationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  durationChip: {
    backgroundColor: '#2A2F4A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  durationChipActive: {
    borderColor: '#00D9B5',
    backgroundColor: '#1E3A32',
  },
  durationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8F92A1',
  },
  durationTextActive: {
    color: '#00D9B5',
  },
  estimateCard: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  estimateContent: {
    alignItems: 'center',
  },
  estimateLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  estimateAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  estimateNote: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
  },
  infoCard: {
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
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#8F92A1',
    lineHeight: 20,
  },
  submitButton: {
    marginHorizontal: 20,
    borderRadius: 25,
    overflow: 'hidden',
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  submitText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
});
