import React, { useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useApp, useUser, useFinancial, useLoans } from "../context/AppContext";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
} from "../constants/theme";
import { LOAN_TYPES } from "../constants/app";
import {
  formatCurrency,
  formatDate,
  formatRelativeTime,
  formatDuration,
} from "../utils/formatters";

const { width } = Dimensions.get("window");

const CardsScreen = ({ navigation }) => {
  const { actions } = useApp();
  const user = useUser();
  const financial = useFinancial();
  const loans = useLoans();

  const [selectedCard, setSelectedCard] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Mock active loans - in real app, this would come from context/API
  const activeLoans = [
    {
      id: "loan1",
      type: "personal",
      title: "Personal Loan",
      principal: 50000,
      currentBalance: 30000,
      monthlyPayment: 5500,
      nextPaymentDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      interestRate: 0.12,
      remainingMonths: 6,
      totalMonths: 12,
      status: "active",
      gradient: COLORS.gradientPrimary,
    },
    {
      id: "loan2",
      type: "business",
      title: "Business Loan",
      principal: 100000,
      currentBalance: 65000,
      monthlyPayment: 12000,
      nextPaymentDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      interestRate: 0.1,
      remainingMonths: 8,
      totalMonths: 24,
      status: "active",
      gradient: COLORS.gradientSecondary,
    },
  ];

  // Mock recent activities
  const recentActivity = [
    {
      id: "1",
      type: "payment",
      title: "Payment Received",
      description: "Monthly EMI payment",
      amount: 5500,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      loanId: "loan1",
      status: "completed",
    },
    {
      id: "2",
      type: "payment",
      title: "Payment Received",
      description: "Monthly EMI payment",
      amount: 12000,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      loanId: "loan2",
      status: "completed",
    },
    {
      id: "3",
      type: "disbursement",
      title: "Loan Disbursed",
      description: "Personal loan amount transferred",
      amount: 50000,
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      loanId: "loan1",
      status: "completed",
    },
  ];

  const exploreOptions = [
    {
      id: "explore_business",
      title: "Business Loan",
      subtitle: "Low Interest Rates",
      description: "Grow your business with flexible funding",
      icon: "briefcase",
      gradient: COLORS.gradientSecondary,
      action: () => navigation.navigate("Apply"),
    },
    {
      id: "explore_emergency",
      title: "Emergency Loan",
      subtitle: "Quick Cash Access",
      description: "Get funds when you need them most",
      icon: "flash",
      gradient: COLORS.gradientWarning,
      action: () => navigation.navigate("Apply"),
    },
    {
      id: "explore_new",
      title: "Explore More Options",
      subtitle: "Find the perfect loan",
      description: "Discover all available loan products",
      icon: "add-circle",
      gradient: COLORS.gradientInfo,
      action: () => navigation.navigate("Apply"),
    },
  ];

  const managementOptions = [
    {
      id: "calculator",
      title: "Loan Calculator",
      description: "Calculate your loan payments",
      icon: "calculator",
      action: () => navigation.navigate("LoanCalculator"),
    },
    {
      id: "payment",
      title: "Make a Payment",
      description: "Pay your loan installment",
      icon: "card",
      action: () => navigation.navigate("Payment"),
    },
    {
      id: "statement",
      title: "Download Statement",
      description: "Get your loan statement",
      icon: "download",
      action: () => {
        actions.showNotification({
          type: "info",
          title: "Statement",
          message: "Statement download will be available soon",
        });
      },
    },
    {
      id: "refinance",
      title: "Refinance Options",
      description: "Explore better rates",
      icon: "refresh",
      action: () => {
        actions.showNotification({
          type: "info",
          title: "Refinancing",
          message: "Refinancing options coming soon",
        });
      },
    },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      actions.showNotification({
        type: "success",
        title: "Refreshed",
        message: "Loan information updated successfully",
      });
    }, 1500);
  };

  const calculateProgress = (loan) => {
    const paidMonths = loan.totalMonths - loan.remainingMonths;
    return paidMonths / loan.totalMonths;
  };

  const getCardData = () => {
    return [...activeLoans, ...exploreOptions];
  };

  const handleCardPress = (loan) => {
    navigation.navigate("LoanDetails", { loan });
  };

  const handleMakePayment = (loan) => {
    navigation.navigate("Payment", { loanId: loan.id });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Ionicons name="flash" size={24} color={COLORS.primary} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Cards & Loans</Text>
            <Text style={styles.subtitle}>Manage your finances</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("Apply")}
        >
          <Ionicons name="add" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLoanCard = (loan) => {
    const progress = calculateProgress(loan);
    const paidAmount = loan.principal - loan.currentBalance;

    return (
      <Card
        key={loan.id}
        gradient={loan.gradient}
        style={styles.loanCard}
        onPress={() => handleCardPress(loan)}
        padding="large"
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardType}>{loan.title}</Text>
          <TouchableOpacity
            style={styles.cardMenu}
            onPress={() => {
              actions.showNotification({
                type: "info",
                title: "Menu",
                message: "Card options menu coming soon",
              });
            }}
          >
            <Ionicons
              name="ellipsis-horizontal"
              size={20}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.cardAmount}>
          {formatCurrency(loan.currentBalance)}
        </Text>
        <Text style={styles.cardLabel}>Current Balance</Text>

        <View style={styles.paymentSection}>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentLabel}>Next Payment</Text>
            <Text style={styles.paymentAmount}>
              {formatCurrency(loan.monthlyPayment)}
            </Text>
          </View>
          <View style={styles.dueDateContainer}>
            <Text style={styles.dueLabel}>
              Due {formatDate(loan.nextPaymentDate, "medium")}
            </Text>
          </View>
        </View>

        <Button
          title="Make Payment"
          variant="secondary"
          size="medium"
          onPress={() => handleMakePayment(loan)}
          style={styles.paymentButton}
        />

        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[styles.progressFill, { width: `${progress * 100}%` }]}
              />
            </View>
          </View>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {Math.round(progress * 100)}% Paid
            </Text>
            <Text style={styles.remainingText}>
              {loan.remainingMonths} months left
            </Text>
          </View>
        </View>

        <View style={styles.loanDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Original Amount</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(loan.principal)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Interest Rate</Text>
            <Text style={styles.detailValue}>
              {(loan.interestRate * 100).toFixed(1)}%
            </Text>
          </View>
        </View>
      </Card>
    );
  };

  const renderExploreCard = (option) => (
    <Card
      key={option.id}
      style={styles.exploreCard}
      onPress={option.action}
      padding="large"
    >
      <View style={styles.exploreContent}>
        <View
          style={[
            styles.exploreIcon,
            { backgroundColor: COLORS.primary + "20" },
          ]}
        >
          <Ionicons name={option.icon} size={40} color={COLORS.primary} />
        </View>

        <Text style={styles.exploreTitle}>{option.title}</Text>
        <Text style={styles.exploreSubtitle}>{option.subtitle}</Text>
        <Text style={styles.exploreDescription}>{option.description}</Text>

        {option.id === "explore_new" && (
          <View style={styles.exploreButton}>
            <Ionicons name="arrow-forward" size={24} color={COLORS.primary} />
          </View>
        )}
      </View>
    </Card>
  );

  const renderCardsCarousel = () => (
    <View style={styles.carouselSection}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / (width - 40),
          );
          setSelectedCard(index);
        }}
      >
        {activeLoans.map(renderLoanCard)}
        {exploreOptions.map(renderExploreCard)}
      </ScrollView>

      {/* Pagination */}
      <View style={styles.pagination}>
        {getCardData().map((_, index) => {
          const inputRange = [
            (index - 1) * (width - 40),
            index * (width - 40),
            (index + 1) * (width - 40),
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.paginationDot,
                {
                  width: dotWidth,
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );

  const renderRecentActivity = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Button
          title="View All"
          variant="ghost"
          size="small"
          onPress={() => navigation.navigate("Activity")}
        />
      </View>

      {recentActivity.slice(0, 3).map((activity) => {
        const isCredit = activity.type === "disbursement";
        const config = {
          disbursement: { icon: "arrow-down-circle", color: COLORS.success },
          payment: { icon: "arrow-up-circle", color: COLORS.error },
        };
        const activityConfig = config[activity.type] || config.payment;

        return (
          <Card
            key={activity.id}
            style={styles.activityCard}
            onPress={() => {
              // Navigate to activity details
            }}
          >
            <View style={styles.activityContent}>
              <View
                style={[
                  styles.activityIcon,
                  { backgroundColor: activityConfig.color + "20" },
                ]}
              >
                <Ionicons
                  name={activityConfig.icon}
                  size={20}
                  color={activityConfig.color}
                />
              </View>

              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDescription}>
                  {activity.description}
                </Text>
                <Text style={styles.activityDate}>
                  {formatRelativeTime(activity.date)}
                </Text>
              </View>

              <View style={styles.activityRight}>
                <Text
                  style={[
                    styles.activityAmount,
                    { color: isCredit ? COLORS.success : COLORS.error },
                  ]}
                >
                  {isCredit ? "+" : "-"}
                  {formatCurrency(activity.amount)}
                </Text>
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor:
                          activity.status === "completed"
                            ? COLORS.success
                            : COLORS.warning,
                      },
                    ]}
                  />
                  <Text style={styles.statusText}>{activity.status}</Text>
                </View>
              </View>
            </View>
          </Card>
        );
      })}
    </View>
  );

  const renderManagementOptions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Loan Management</Text>
      <View style={styles.managementGrid}>
        {managementOptions.map((option) => (
          <Card
            key={option.id}
            style={styles.managementCard}
            onPress={option.action}
          >
            <View
              style={[
                styles.managementIcon,
                { backgroundColor: COLORS.primary + "20" },
              ]}
            >
              <Ionicons name={option.icon} size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.managementTitle}>{option.title}</Text>
            <Text style={styles.managementDescription}>
              {option.description}
            </Text>
          </Card>
        ))}
      </View>
    </View>
  );

  const renderQuickStats = () => {
    const totalDebt = activeLoans.reduce(
      (sum, loan) => sum + loan.currentBalance,
      0,
    );
    const totalPaid = activeLoans.reduce(
      (sum, loan) => sum + (loan.principal - loan.currentBalance),
      0,
    );
    const avgProgress =
      activeLoans.length > 0
        ? activeLoans.reduce((sum, loan) => sum + calculateProgress(loan), 0) /
          activeLoans.length
        : 0;

    return (
      <View style={styles.statsSection}>
        <Card style={styles.statsCard}>
          <View style={styles.statsContent}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatCurrency(totalDebt)}</Text>
              <Text style={styles.statLabel}>Total Balance</Text>
              <Ionicons name="wallet" size={20} color={COLORS.warning} />
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatCurrency(totalPaid)}</Text>
              <Text style={styles.statLabel}>Total Paid</Text>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={COLORS.success}
              />
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Math.round(avgProgress * 100)}%
              </Text>
              <Text style={styles.statLabel}>Avg Progress</Text>
              <Ionicons name="trending-up" size={20} color={COLORS.primary} />
            </View>
          </View>
        </Card>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeLoans.length > 0 && renderQuickStats()}
        {renderCardsCarousel()}
        {renderRecentActivity()}
        {renderManagementOptions()}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: 60,
    paddingBottom: SPACING.lg,
  },

  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  titleContainer: {
    marginLeft: SPACING.sm,
  },

  title: {
    fontSize: TYPOGRAPHY.fontSize["2xl"],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },

  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
  },

  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundCard,
    justifyContent: "center",
    alignItems: "center",
  },

  scrollView: {
    flex: 1,
  },

  // Stats Section
  statsSection: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },

  statsCard: {
    padding: SPACING.lg,
  },

  statsContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  statItem: {
    alignItems: "center",
    flex: 1,
  },

  statValue: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },

  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },

  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },

  // Carousel
  carouselSection: {
    marginBottom: SPACING.xl,
  },

  loanCard: {
    width: width - 40,
    marginHorizontal: SPACING.xl,
    minHeight: 320,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },

  cardType: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.white,
  },

  cardMenu: {
    padding: SPACING.sm,
  },

  cardAmount: {
    fontSize: TYPOGRAPHY.fontSize["5xl"],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },

  cardLabel: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: SPACING.xl,
  },

  paymentSection: {
    marginBottom: SPACING.lg,
  },

  paymentInfo: {
    marginBottom: SPACING.sm,
  },

  paymentLabel: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: SPACING.xs,
  },

  paymentAmount: {
    fontSize: TYPOGRAPHY.fontSize["2xl"],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },

  dueDateContainer: {
    marginBottom: SPACING.lg,
  },

  dueLabel: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: "rgba(255, 255, 255, 0.8)",
  },

  paymentButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderColor: "rgba(255, 255, 255, 0.3)",
    marginBottom: SPACING.lg,
  },

  progressSection: {
    marginBottom: SPACING.lg,
  },

  progressBar: {
    marginBottom: SPACING.sm,
  },

  progressTrack: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
  },

  progressFill: {
    height: 8,
    backgroundColor: COLORS.white,
    borderRadius: 4,
  },

  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  progressText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: "rgba(255, 255, 255, 0.8)",
  },

  remainingText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: "rgba(255, 255, 255, 0.8)",
  },

  loanDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  detailItem: {
    flex: 1,
  },

  detailLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: SPACING.xs,
  },

  detailValue: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.white,
  },

  // Explore Cards
  exploreCard: {
    width: width - 40,
    marginHorizontal: SPACING.xl,
    minHeight: 320,
    justifyContent: "center",
    alignItems: "center",
  },

  exploreContent: {
    alignItems: "center",
  },

  exploreIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.xl,
  },

  exploreTitle: {
    fontSize: TYPOGRAPHY.fontSize["2xl"],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },

  exploreSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },

  exploreDescription: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },

  exploreButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary + "20",
    justifyContent: "center",
    alignItems: "center",
  },

  // Pagination
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
  },

  paginationDot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },

  // Sections
  section: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },

  // Activity
  activityCard: {
    marginBottom: SPACING.md,
    padding: SPACING.lg,
  },

  activityContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },

  activityInfo: {
    flex: 1,
  },

  activityTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },

  activityDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },

  activityDate: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textTertiary,
  },

  activityRight: {
    alignItems: "flex-end",
  },

  activityAmount: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginBottom: SPACING.xs,
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: SPACING.xs,
  },

  statusText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textTertiary,
    textTransform: "capitalize",
  },

  // Management
  managementGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.md,
  },

  managementCard: {
    width: (width - SPACING.xl * 2 - SPACING.md) / 2,
    padding: SPACING.lg,
    alignItems: "center",
    minHeight: 120,
  },

  managementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
  },

  managementTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.xs,
  },

  managementDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    textAlign: "center",
  },

  bottomSpacing: {
    height: SPACING["4xl"],
  },
});

export default CardsScreen;
