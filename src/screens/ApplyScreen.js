import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useApp, useUser, useFinancial } from "../context/AppContext";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Card from "../components/common/Card";
import { useForm } from "../hooks/useForm";
import {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
} from "../constants/theme";
import { LOAN_TYPES, LOAN_DURATIONS, SUCCESS_MESSAGES } from "../constants/app";
import {
  validateRequired,
  validateLoanAmount,
  validateIncome,
  validateNumeric,
} from "../utils/validation";
import { calculateMonthlyPayment } from "../utils/calculations";
import { formatCurrency } from "../utils/formatters";

const ApplyScreen = ({ navigation }) => {
  const { actions } = useApp();
  const user = useUser();
  const financial = useFinancial();

  const [selectedLoanType, setSelectedLoanType] = useState("personal");
  const [selectedDuration, setSelectedDuration] = useState(12);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  // Form validation rules
  const validationRules = {
    amount: [
      (value) => validateRequired(value, "Loan amount"),
      (value) =>
        validateNumeric(value, "Loan amount", { min: 1000, max: 1000000 }),
      (value) => validateLoanAmount(value, selectedLoanType),
    ],
    purpose: [
      (value) => validateRequired(value, "Purpose"),
      (value) => {
        if (value && value.length < 10) {
          return {
            isValid: false,
            error: "Purpose must be at least 10 characters",
          };
        }
        return { isValid: true };
      },
    ],
    monthlyIncome: [
      (value) => validateRequired(value, "Monthly income"),
      (value) => validateIncome(value),
    ],
  };

  // Initialize form
  const form = useForm(
    {
      amount: "",
      purpose: "",
      monthlyIncome: financial.monthlyIncome?.toString() || "",
    },
    validationRules,
  );

  // Calculate monthly payment when amount or duration changes
  useEffect(() => {
    const amount = parseFloat(form.values.amount);
    if (amount && selectedDuration) {
      const loanType = LOAN_TYPES[selectedLoanType.toUpperCase()];
      const payment = calculateMonthlyPayment(
        amount,
        loanType.interestRate,
        selectedDuration,
      );
      setMonthlyPayment(payment);
    } else {
      setMonthlyPayment(0);
    }
  }, [form.values.amount, selectedDuration, selectedLoanType]);

  const handleLoanTypeSelect = (typeId) => {
    setSelectedLoanType(typeId);
    // Re-validate amount if it exists
    if (form.values.amount) {
      form.validateField("amount", form.values.amount);
    }
  };

  const handleDurationSelect = (duration) => {
    setSelectedDuration(duration);
  };

  const handleSubmit = async (formData) => {
    try {
      const applicationData = {
        ...formData,
        loanType: selectedLoanType,
        duration: selectedDuration,
        interestRate: LOAN_TYPES[selectedLoanType.toUpperCase()].interestRate,
        monthlyPayment,
        userId: user.id,
        applicantName: `${user.firstName} ${user.lastName}`,
        creditScore: financial.creditScore,
        status: "pending",
      };

      const application = actions.submitLoanApplication(applicationData);

      // Add transaction for application submission
      actions.addTransaction({
        type: "application_submitted",
        description: `${LOAN_TYPES[selectedLoanType.toUpperCase()].label} application submitted`,
        amount: parseFloat(formData.amount),
        status: "pending",
        loanApplicationId: application.id,
      });

      actions.showNotification({
        type: "success",
        title: "Application Submitted!",
        message: SUCCESS_MESSAGES.APPLICATION_SUBMITTED,
      });

      // Navigate back to home
      navigation.navigate("Home");
    } catch (error) {
      console.error("Application submission error:", error);
      actions.setError("Failed to submit application. Please try again.");
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Apply for Loan</Text>
      <View style={{ width: 40 }} />
    </View>
  );

  const renderLoanTypeSelection = () => (
    <Card style={styles.section}>
      <Text style={styles.sectionTitle}>Select Loan Type</Text>
      <View style={styles.loanTypesGrid}>
        {Object.entries(LOAN_TYPES).map(([key, type]) => {
          const isSelected = selectedLoanType === type.id;
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.loanTypeCard,
                isSelected && styles.loanTypeCardActive,
              ]}
              onPress={() => handleLoanTypeSelect(type.id)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.loanTypeIconContainer,
                  isSelected && styles.loanTypeIconContainerActive,
                ]}
              >
                <Ionicons
                  name={type.icon}
                  size={24}
                  color={isSelected ? COLORS.primary : COLORS.textSecondary}
                />
              </View>
              <Text
                style={[
                  styles.loanTypeText,
                  isSelected && styles.loanTypeTextActive,
                ]}
              >
                {type.label}
              </Text>
              <Text style={styles.loanTypeDescription}>{type.description}</Text>
              <View style={styles.loanTypeDetails}>
                <Text style={styles.loanTypeDetail}>
                  Rate: {(type.interestRate * 100).toFixed(1)}%
                </Text>
                <Text style={styles.loanTypeDetail}>
                  Max: {formatCurrency(type.maxAmount)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </Card>
  );

  const renderAmountInput = () => (
    <Card style={styles.section}>
      <Text style={styles.sectionTitle}>Loan Amount</Text>
      <Input
        label="Amount"
        placeholder="Enter loan amount"
        keyboardType="numeric"
        leftIcon="cash"
        prefix="Ksh"
        maxLength={10}
        {...form.getFieldProps("amount")}
        style={styles.amountInput}
      />
      <View style={styles.amountSuggestions}>
        {["5000", "10000", "25000", "50000", "100000"].map((amount) => (
          <TouchableOpacity
            key={amount}
            style={styles.suggestionChip}
            onPress={() => form.setValue("amount", amount)}
          >
            <Text style={styles.suggestionText}>
              {formatCurrency(parseInt(amount))}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  );

  const renderDurationSelection = () => (
    <Card style={styles.section}>
      <Text style={styles.sectionTitle}>Loan Duration</Text>
      <Text style={styles.sectionSubtitle}>
        Choose repayment period (months)
      </Text>
      <View style={styles.durationContainer}>
        {LOAN_DURATIONS.filter(
          (duration) =>
            duration <= LOAN_TYPES[selectedLoanType.toUpperCase()].maxDuration,
        ).map((duration) => (
          <TouchableOpacity
            key={duration}
            style={[
              styles.durationChip,
              selectedDuration === duration && styles.durationChipActive,
            ]}
            onPress={() => handleDurationSelect(duration)}
          >
            <Text
              style={[
                styles.durationText,
                selectedDuration === duration && styles.durationTextActive,
              ]}
            >
              {duration}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  );

  const renderPaymentEstimate = () => {
    if (!monthlyPayment || !form.values.amount) return null;

    const amount = parseFloat(form.values.amount);
    const totalPayment = monthlyPayment * selectedDuration;
    const totalInterest = totalPayment - amount;

    return (
      <Card gradient={COLORS.gradientPrimary} style={styles.estimateCard}>
        <View style={styles.estimateHeader}>
          <Ionicons name="calculator" size={24} color={COLORS.white} />
          <Text style={styles.estimateTitle}>Payment Estimate</Text>
        </View>
        <View style={styles.estimateDetails}>
          <View style={styles.estimateRow}>
            <Text style={styles.estimateLabel}>Monthly Payment</Text>
            <Text style={styles.estimateValue}>
              {formatCurrency(monthlyPayment)}
            </Text>
          </View>
          <View style={styles.estimateRow}>
            <Text style={styles.estimateLabel}>Total Interest</Text>
            <Text style={styles.estimateValue}>
              {formatCurrency(totalInterest)}
            </Text>
          </View>
          <View style={styles.estimateRow}>
            <Text style={styles.estimateLabel}>Total Repayment</Text>
            <Text style={styles.estimateValue}>
              {formatCurrency(totalPayment)}
            </Text>
          </View>
        </View>
        <Text style={styles.estimateDisclaimer}>
          *Rates are subject to approval and may vary
        </Text>
      </Card>
    );
  };

  const renderPurposeInput = () => (
    <Card style={styles.section}>
      <Text style={styles.sectionTitle}>Purpose of Loan</Text>
      <Input
        label="Purpose"
        placeholder="Describe why you need this loan..."
        multiline
        numberOfLines={4}
        maxLength={500}
        {...form.getFieldProps("purpose")}
      />
    </Card>
  );

  const renderIncomeInput = () => (
    <Card style={styles.section}>
      <Text style={styles.sectionTitle}>Financial Information</Text>
      <Input
        label="Monthly Income"
        placeholder="Enter your monthly income"
        keyboardType="numeric"
        leftIcon="wallet"
        prefix="Ksh"
        {...form.getFieldProps("monthlyIncome")}
      />
      <View style={styles.incomeInfo}>
        <Ionicons name="information-circle" size={16} color={COLORS.info} />
        <Text style={styles.incomeInfoText}>
          This information helps us determine your loan eligibility
        </Text>
      </View>
    </Card>
  );

  const renderApplicationInfo = () => (
    <Card style={styles.infoCard} variant="outlined">
      <View style={styles.infoHeader}>
        <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
        <Text style={styles.infoTitle}>Quick Approval Process</Text>
      </View>
      <View style={styles.infoList}>
        <View style={styles.infoItem}>
          <Ionicons name="flash" size={16} color={COLORS.primary} />
          <Text style={styles.infoText}>Get approved in minutes</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="shield-checkmark" size={16} color={COLORS.primary} />
          <Text style={styles.infoText}>No hidden fees</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="calendar" size={16} color={COLORS.primary} />
          <Text style={styles.infoText}>Flexible repayment options</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="headset" size={16} color={COLORS.primary} />
          <Text style={styles.infoText}>24/7 customer support</Text>
        </View>
      </View>
    </Card>
  );

  const renderSubmitButton = () => (
    <View style={styles.submitContainer}>
      <Button
        title="Submit Application"
        onPress={form.handleSubmit(handleSubmit)}
        loading={form.isSubmitting}
        disabled={!form.isValid || !form.values.amount || !form.values.purpose}
        icon="paper-plane"
        iconPosition="right"
        size="large"
        fullWidth
        style={styles.submitButton}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {renderHeader()}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderLoanTypeSelection()}
        {renderAmountInput()}
        {renderDurationSelection()}
        {renderPaymentEstimate()}
        {renderPurposeInput()}
        {renderIncomeInput()}
        {renderApplicationInfo()}
        {renderSubmitButton()}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
    paddingTop: 60,
    paddingBottom: SPACING.lg,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundCard,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },

  scrollView: {
    flex: 1,
  },

  // Sections
  section: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },

  sectionSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },

  // Loan Type Selection
  loanTypesGrid: {
    gap: SPACING.md,
  },

  loanTypeCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.backgroundCard,
  },

  loanTypeCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + "10",
  },

  loanTypeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
  },

  loanTypeIconContainerActive: {
    backgroundColor: COLORS.primary + "20",
  },

  loanTypeText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },

  loanTypeTextActive: {
    color: COLORS.primary,
  },

  loanTypeDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },

  loanTypeDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  loanTypeDetail: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textTertiary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },

  // Amount Input
  amountInput: {
    marginBottom: SPACING.lg,
  },

  amountSuggestions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },

  suggestionChip: {
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  suggestionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textSecondary,
  },

  // Duration Selection
  durationContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.md,
  },

  durationChip: {
    minWidth: 60,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.backgroundLight,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: "center",
  },

  durationChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + "10",
  },

  durationText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textSecondary,
  },

  durationTextActive: {
    color: COLORS.primary,
  },

  // Payment Estimate
  estimateCard: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },

  estimateHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },

  estimateTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
    marginLeft: SPACING.sm,
  },

  estimateDetails: {
    marginBottom: SPACING.md,
  },

  estimateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },

  estimateLabel: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: "rgba(255, 255, 255, 0.8)",
  },

  estimateValue: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },

  estimateDisclaimer: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: "rgba(255, 255, 255, 0.6)",
    fontStyle: "italic",
    textAlign: "center",
  },

  // Income Info
  incomeInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.info + "10",
    borderRadius: BORDER_RADIUS.lg,
  },

  incomeInfoText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.info,
    marginLeft: SPACING.sm,
    flex: 1,
  },

  // Info Card
  infoCard: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },

  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },

  infoTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },

  infoList: {
    gap: SPACING.md,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },

  // Submit
  submitContainer: {
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
  },

  submitButton: {
    ...SHADOWS.large,
  },

  bottomSpacing: {
    height: SPACING["4xl"],
  },
});

export default ApplyScreen;
