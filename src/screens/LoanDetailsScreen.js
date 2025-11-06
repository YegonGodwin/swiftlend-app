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

export default function PaymentScreen({ navigation }) {
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [amount, setAmount] = useState('5500');
  const [phoneNumber, setPhoneNumber] = useState('');

  const paymentMethods = [
    { id: 'mpesa', label: 'M-Pesa', icon: 'phone-portrait' },
    { id: 'card', label: 'Credit/Debit Card', icon: 'card' },
    { id: 'bank', label: 'Bank Transfer', icon: 'business' },
  ];

  const handlePayment = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (paymentMethod === 'mpesa' && !phoneNumber) {
      Alert.alert('Error', 'Please enter your M-Pesa phone number');
      return;
    }

    Alert.alert(
      'Payment Initiated',
      `Your payment of Ksh ${amount} has been initiated. Please complete the transaction on your phone.`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
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
        <Text style={styles.headerTitle}>Make Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Active Loan Info */}
        <LinearGradient
          colors={['#00D9B5', '#00A88E']}
          style={styles.loanCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.loanLabel}>Active Personal Loan</Text>
          <Text style={styles.loanAmount}>Ksh 50,000</Text>
          <View style={styles.loanDetails}>
            <View style={styles.loanDetailItem}>
              <Text style={styles.loanDetailLabel}>Next Payment</Text>
              <Text style={styles.loanDetailValue}>Ksh 5,500</Text>
            </View>
            <View style={styles.loanDetailItem}>
              <Text style={styles.loanDetailLabel}>Due Date</Text>
              <Text style={styles.loanDetailValue}>25 Aug 2024</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Payment Amount */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Amount</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>Ksh</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="Enter amount"
              placeholderTextColor="#8F92A1"
            />
          </View>

          {/* Quick Amount Buttons */}
          <View style={styles.quickAmounts}>
            {['5500', '10000', '25000', '50000'].map((amt) => (
              <TouchableOpacity
                key={amt}
                style={[
                  styles.quickAmountButton,
                  amount === amt && styles.quickAmountButtonActive,
                ]}
                onPress={() => setAmount(amt)}
              >
                <Text
                  style={[
                    styles.quickAmountText,
                    amount === amt && styles.quickAmountTextActive,
                  ]}
                >
                  {amt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethodCard,
                paymentMethod === method.id && styles.paymentMethodCardActive,
              ]}
              onPress={() => setPaymentMethod(method.id)}
              activeOpacity={0.7}
            >
              <View style={styles.paymentMethodLeft}>
                <View
                  style={[
                    styles.paymentMethodIcon,
                    paymentMethod === method.id &&
                      styles.paymentMethodIconActive,
                  ]}
                >
                  <Ionicons
                    name={method.icon}
                    size={24}
                    color={paymentMethod === method.id ? '#00D9B5' : '#8F92A1'}
                  />
                </View>
                <Text
                  style={[
                    styles.paymentMethodText,
                    paymentMethod === method.id &&
                      styles.paymentMethodTextActive,
                  ]}
                >
                  {method.label}
                </Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  paymentMethod === method.id && styles.radioButtonActive,
                ]}
              >
                {paymentMethod === method.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* M-Pesa Phone Number */}
        {paymentMethod === 'mpesa' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>M-Pesa Phone Number</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call" size={20} color="#8F92A1" />
              <TextInput
                style={[styles.input, { marginLeft: 12 }]}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                placeholder="+254 712 345 678"
                placeholderTextColor="#8F92A1"
              />
            </View>
          </View>
        )}

        {/* Card Details */}
        {paymentMethod === 'card' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Details</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="card" size={20} color="#8F92A1" />
              <TextInput
                style={[styles.input, { marginLeft: 12 }]}
                placeholder="Card Number"
                placeholderTextColor="#8F92A1"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.cardDetailsRow}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  placeholderTextColor="#8F92A1"
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                <TextInput
                  style={styles.input}
                  placeholder="CVV"
                  placeholderTextColor="#8F92A1"
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>
            </View>
          </View>
        )}

        {/* Bank Account */}
        {paymentMethod === 'bank' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bank Account</Text>
            <View style={styles.bankInfoCard}>
              <Text style={styles.bankInfoLabel}>Bank Name</Text>
              <Text style={styles.bankInfoValue}>SwiftLend Bank</Text>
              <Text style={styles.bankInfoLabel}>Account Number</Text>
              <Text style={styles.bankInfoValue}>1234567890</Text>
              <Text style={styles.bankInfoLabel}>Account Name</Text>
              <Text style={styles.bankInfoValue}>SwiftLend Payments</Text>
              <Text style={styles.bankInfoNote}>
                Please use your loan reference number in the payment description
              </Text>
            </View>
          </View>
        )}

        {/* Payment Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Payment Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payment Amount</Text>
            <Text style={styles.summaryValue}>Ksh {amount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Processing Fee</Text>
            <Text style={styles.summaryValue}>Ksh 0</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLabel}>Total Amount</Text>
            <Text style={styles.summaryTotalValue}>Ksh {amount}</Text>
          </View>
        </View>

        {/* Pay Button */}
        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePayment}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#00D9B5', '#00A88E']}
            style={styles.payGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="lock-closed" size={20} color="#FFFFFF" />
            <Text style={styles.payText}>Pay Ksh {amount}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.securityNote}>
          <Ionicons name="shield-checkmark" size={16} color="#00D9B5" />
          <Text style={styles.securityText}>
            Your payment is secure and encrypted
          </Text>
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
  loanLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  loanAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  loanDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loanDetailItem: {
    flex: 1,
  },
  loanDetailLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  loanDetailValue: {
    fontSize: 16,
    fontWeight: '600',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2F4A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 12,
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
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickAmountButton: {
    backgroundColor: '#2A2F4A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  quickAmountButtonActive: {
    borderColor: '#00D9B5',
    backgroundColor: '#1E3A32',
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8F92A1',
  },
  quickAmountTextActive: {
    color: '#00D9B5',
  },
  paymentMethodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2A2F4A',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentMethodCardActive: {
    borderColor: '#00D9B5',
    backgroundColor: '#1E3A32',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E2337',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentMethodIconActive: {
    backgroundColor: '#1E3A32',
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8F92A1',
  },
  paymentMethodTextActive: {
    color: '#FFFFFF',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8F92A1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonActive: {
    borderColor: '#00D9B5',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00D9B5',
  },
  cardDetailsRow: {
    flexDirection: 'row',
  },
  bankInfoCard: {
    backgroundColor: '#2A2F4A',
    padding: 20,
    borderRadius: 16,
  },
  bankInfoLabel: {
    fontSize: 12,
    color: '#8F92A1',
    marginTop: 12,
    marginBottom: 4,
  },
  bankInfoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bankInfoNote: {
    fontSize: 12,
    color: '#FFD700',
    marginTop: 16,
    fontStyle: 'italic',
  },
  summaryCard: {
    backgroundColor: '#2A2F4A',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#8F92A1',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#3A3F5C',
    marginVertical: 12,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00D9B5',
  },
  payButton: {
    marginHorizontal: 20,
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 12,
  },
  payGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  payText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  securityText: {
    fontSize: 12,
    color: '#8F92A1',
    marginLeft: 6,
  },
});
