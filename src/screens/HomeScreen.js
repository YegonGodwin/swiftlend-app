import React, { useEffect, useState, useRef } from "react";
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
import CountingText from "../components/common/CountingText";
import ProgressBar from "../components/common/ProgressBar";
import LoadingSpinner from "../components/common/LoadingSpinner";
import NotificationToast from "../components/common/NotificationToast";
import {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
} from "../constants/theme";
import { QUICK_ACTIONS, FINANCIAL_TIPS } from "../constants/app";
import {
  formatCurrency,
  getCreditScoreCategory,
  formatRelativeTime,
} from "../utils/formatters";
import {
  staggeredFadeIn,
  createEntranceAnimation,
  heartbeatAnimation,
  fadeIn,
  scaleIn,
  slideInFromBottom,
  ANIMATION_DURATIONS,
} from "../utils/animations";

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const { state, actions } = useApp();
  const user = useUser();
  const financial = useFinancial();
  const loans = useLoans();

  const [refreshing, setRefreshing] = useState(false);
  const [animatedScore] = useState(new Animated.Value(0));
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  // Animation values
  const fadeValues = useRef(
    Array.from({ length: 6 }, () => new Animated.Value(0)),
  ).current;
  const scaleValues = useRef(
    Array.from({ length: 4 }, () => new Animated.Value(0.8)),
  ).current;
  const heartbeatValue = useRef(new Animated.Value(1)).current;
  const slideValues = useRef(
    Array.from({ length: 3 }, () => new Animated.Value(50)),
  ).current;

  useEffect(() => {
    // Animate credit score on mount
    Animated.timing(animatedScore, {
      toValue: financial.creditScore,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    // Start entrance animations
    const entranceAnimation = staggeredFadeIn(
      fadeValues,
      ANIMATION_DURATIONS.NORMAL,
      150,
    );
    const scaleAnimation = Animated.stagger(
      200,
      scaleValues.map((value) => scaleIn(value, ANIMATION_DURATIONS.NORMAL)),
    );
    const slideAnimation = Animated.stagger(
      100,
      slideValues.map((value) =>
        slideInFromBottom(value, ANIMATION_DURATIONS.NORMAL),
      ),
    );

    Animated.parallel([
      entranceAnimation,
      scaleAnimation,
      slideAnimation,
    ]).start();

    // Start heartbeat animation for notifications
    if (user.firstName) {
      heartbeatAnimation(heartbeatValue).start();
    }
  }, [financial.creditScore]);

  useEffect(() => {
    // Rotate financial tips every 10 seconds
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % FINANCIAL_TIPS.length);
    }, 10000);

    return () => clearInterval(tipInterval);
  }, []);

  useEffect(() => {
    // Show welcome notification for new users
    if (user.firstName && !showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 4000);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [user.firstName]);

  const onRefresh = async () => {
    setRefreshing(true);

    // Simulate API call to refresh data
    setTimeout(() => {
      // Update credit score with a small random variation
      const newScore = Math.max(
        300,
        Math.min(850, financial.creditScore + (Math.random() - 0.5) * 20),
      );
      actions.updateCreditScore(Math.round(newScore));

      // Reset animations for refresh
      fadeValues.forEach((value) => value.setValue(0));
      const refreshAnimation = staggeredFadeIn(
        fadeValues,
        ANIMATION_DURATIONS.FAST,
        50,
      );
      refreshAnimation.start();

      setRefreshing(false);
    }, 1500);
  };

  const handleQuickAction = (action) => {
    if (action.screen) {
      navigation.navigate(action.screen);
    }
  };

  const getCreditScorePercentage = () => {
    return Math.round((financial.creditScore / 850) * 100);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const creditRating = getCreditScoreCategory(financial.creditScore);

  const loanOffers = [
    {
      id: "1",
      type: "Personal Loan",
      amount: "Up to " + formatCurrency(50000),
      gradient: COLORS.gradientPrimary,
      interestRate: "12%",
      processingTime: "24 hours",
    },
    {
      id: "2",
      type: "Business Loan",
      amount: "Low Interest Rates",
      gradient: COLORS.gradientSecondary,
      interestRate: "10%",
      processingTime: "48 hours",
    },
    {
      id: "3",
      type: "Emergency Loan",
      amount: "Get Cash Fast",
      gradient: COLORS.gradientWarning,
      interestRate: "15%",
      processingTime: "1 hour",
    },
  ];

  const recentActivities = [
    {
      id: "1",
      type: "payment_received",
      title: "Payment Received",
      description: "Monthly installment",
      amount: 5000,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      icon: "checkmark-circle",
      color: COLORS.success,
    },
    {
      id: "2",
      type: "application_approved",
      title: "Application Approved",
      description: "Personal loan request",
      amount: -15000,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      icon: "checkmark-circle",
      color: COLORS.success,
    },
    {
      id: "3",
      type: "credit_score_updated",
      title: "Credit Score Updated",
      description: "Your score improved",
      amount: null,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      icon: "trending-up",
      color: COLORS.info,
    },
  ];

  const renderHeader = () => (
    <Animated.View style={[styles.header, { opacity: fadeValues[0] }]}>
      <View style={styles.headerContent}>
        <View>
          <Text style={styles.greetingText}>
            {getGreeting()}
            {user.firstName ? `, ${user.firstName}` : ""}!
          </Text>
          <View style={styles.logoContainer}>
            <Ionicons name="flash" size={24} color={COLORS.primary} />
            <Text style={styles.logoText}>SwiftLend</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <Animated.View style={{ transform: [{ scale: heartbeatValue }] }}>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={COLORS.textPrimary}
              />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </Animated.View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <View style={styles.profileAvatar}>
              <Text style={styles.profileInitial}>
                {user.firstName?.charAt(0) || "U"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  const renderCreditScoreCard = () => (
    <Card
      gradient={COLORS.gradientCard}
      style={styles.creditScoreCard}
      animateOnMount={true}
      animationDelay={300}
      animationType="entrance"
    >
      <View style={styles.creditScoreHeader}>
        <Text style={styles.creditScoreLabel}>Your Credit Score</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          {refreshing ? (
            <LoadingSpinner
              size={20}
              color={COLORS.textSecondary}
              type="spinner"
            />
          ) : (
            <Ionicons name="refresh" size={20} color={COLORS.textSecondary} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.scoreContainer}>
        <CountingText
          value={financial.creditScore}
          startValue={300}
          duration={2000}
          style={styles.creditScoreValue}
          animateOnMount={true}
        />
        <Animated.View
          style={[
            styles.ratingBadge,
            {
              backgroundColor: creditRating.color,
              transform: [{ scale: scaleValues[0] }],
            },
          ]}
        >
          <Text style={styles.ratingText}>{creditRating.text}</Text>
        </Animated.View>
      </View>

      <View style={styles.progressContainer}>
        <ProgressBar
          progress={getCreditScorePercentage() / 100}
          height={8}
          gradient={[creditRating.color + "40", creditRating.color]}
          animated={true}
          duration={1500}
          showGlow={true}
          glowColor={creditRating.color}
          style={styles.animatedProgressBar}
        />
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabel}>300</Text>
          <Text style={styles.progressLabel}>850</Text>
        </View>
      </View>

      <Button
        title="Tips to Improve"
        variant="ghost"
        size="small"
        icon="arrow-forward"
        iconPosition="right"
        onPress={() => {
          /* Navigate to credit tips */
        }}
        style={styles.improveButton}
      />
    </Card>
  );

  const renderQuickActions = () => (
    <Animated.View
      style={[
        styles.section,
        {
          opacity: fadeValues[1],
          transform: [{ translateY: slideValues[0] }],
        },
      ]}
    >
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.quickActionsContainer}
      >
        {QUICK_ACTIONS.map((action, index) => (
          <Card
            key={action.id}
            onPress={() => handleQuickAction(action)}
            style={styles.quickActionCard}
            shadow={false}
            animateOnMount={true}
            animationDelay={600 + index * 100}
            animationType="scaleIn"
          >
            <LinearGradient
              colors={action.gradient}
              style={styles.actionIconContainer}
            >
              <Ionicons name={action.icon} size={24} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.actionTitle}>{action.title}</Text>
          </Card>
        ))}
      </ScrollView>
    </Animated.View>
  );

  const renderLoanOffers = () => (
    <Animated.View
      style={[
        styles.section,
        {
          opacity: fadeValues[2],
          transform: [{ translateY: slideValues[1] }],
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Loan Offers Just For You</Text>
        <Button
          title="See All"
          variant="ghost"
          size="small"
          onPress={() => {
            /* Navigate to all offers */
          }}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.loanOffersContainer}
      >
        {loanOffers.map((offer, index) => (
          <Card
            key={offer.id}
            gradient={offer.gradient}
            onPress={() => navigation.navigate("LoanDetails", { loan: offer })}
            style={styles.loanOfferCard}
            padding="large"
            animateOnMount={true}
            animationDelay={1000 + index * 200}
            animationType="slideUp"
          >
            <View style={styles.offerHeader}>
              <Text style={styles.loanType}>{offer.type}</Text>
              <Text style={styles.processingTime}>{offer.processingTime}</Text>
            </View>
            <CountingText
              value={parseInt(offer.amount.replace(/[^\d]/g, ""))}
              prefix="Up to Ksh "
              style={styles.loanAmount}
              duration={1000}
              animateOnMount={true}
            />
            <View style={styles.offerDetails}>
              <View style={styles.offerDetail}>
                <Text style={styles.offerDetailLabel}>Interest Rate</Text>
                <Text style={styles.offerDetailValue}>
                  {offer.interestRate}
                </Text>
              </View>
            </View>
            <Button
              title="View Details"
              variant="secondary"
              size="small"
              style={styles.viewDetailsButton}
            />
          </Card>
        ))}
      </ScrollView>
    </Animated.View>
  );

  const renderFinancialTip = () => {
    const currentTip = FINANCIAL_TIPS[currentTipIndex];

    return (
      <Animated.View
        style={[
          styles.section,
          {
            opacity: fadeValues[3],
            transform: [{ scale: scaleValues[1] }],
          },
        ]}
      >
        <Text style={styles.sectionTitle}>Financial Tip of the Day</Text>
        <Card
          style={styles.tipCard}
          animateOnMount={true}
          animationDelay={1400}
          animationType="fadeIn"
        >
          <View style={styles.tipHeader}>
            <Animated.View
              style={[
                styles.tipIconContainer,
                {
                  backgroundColor: currentTip.color + "20",
                  transform: [{ scale: scaleValues[2] }],
                },
              ]}
            >
              <Ionicons
                name={currentTip.icon}
                size={24}
                color={currentTip.color}
              />
            </Animated.View>
            <View style={styles.tipIndicator}>
              <Text style={styles.tipCategory}>
                {currentTip.category.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.tipTitle}>{currentTip.title}</Text>
          <Text style={styles.tipDescription}>{currentTip.description}</Text>
        </Card>
      </Animated.View>
    );
  };

  const renderRecentActivity = () => (
    <Animated.View
      style={[
        styles.section,
        {
          opacity: fadeValues[4],
          transform: [{ translateY: slideValues[2] }],
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Button
          title="View All"
          variant="ghost"
          size="small"
          onPress={() => navigation.navigate("Activity")}
        />
      </View>

      {recentActivities.map((activity, index) => (
        <Card
          key={activity.id}
          style={styles.activityCard}
          animateOnMount={true}
          animationDelay={1600 + index * 150}
          animationType="slideUp"
        >
          <Animated.View
            style={[
              styles.activityIconContainer,
              {
                backgroundColor: activity.color + "20",
                transform: [{ scale: scaleValues[3] }],
              },
            ]}
          >
            <Ionicons name={activity.icon} size={20} color={activity.color} />
          </Animated.View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>{activity.title}</Text>
            <Text style={styles.activityDescription}>
              {activity.description}
            </Text>
            <Text style={styles.activityDate}>
              {formatRelativeTime(activity.date)}
            </Text>
          </View>
          {activity.amount && (
            <CountingText
              value={Math.abs(activity.amount)}
              prefix={activity.amount > 0 ? "+Ksh " : "-Ksh "}
              style={[
                styles.activityAmount,
                { color: activity.amount > 0 ? COLORS.success : COLORS.error },
              ]}
              duration={800}
              animateOnMount={true}
            />
          )}
        </Card>
      ))}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderHeader()}
        {renderCreditScoreCard()}
        {renderQuickActions()}
        {renderLoanOffers()}
        {renderFinancialTip()}
        {renderRecentActivity()}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Notification Toast */}
      <NotificationToast
        visible={showNotification}
        type="success"
        title={`Welcome back, ${user.firstName}!`}
        message="Your financial journey continues with SwiftLend"
        position="top"
        onDismiss={() => setShowNotification(false)}
        animate={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollView: {
    flex: 1,
  },

  // Header
  header: {
    paddingTop: 60,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },

  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  greetingText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoText: {
    fontSize: TYPOGRAPHY.fontSize["2xl"],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },

  notificationButton: {
    position: "relative",
    padding: SPACING.sm,
  },

  notificationBadge: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
  },

  profileButton: {
    padding: SPACING.xs,
  },

  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  profileInitial: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },

  // Credit Score Card
  creditScoreCard: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING["2xl"],
  },

  creditScoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },

  creditScoreLabel: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },

  refreshButton: {
    padding: SPACING.xs,
  },

  scoreContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: SPACING.xl,
  },

  creditScoreValue: {
    fontSize: TYPOGRAPHY.fontSize["8xl"],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginRight: SPACING.md,
  },

  ratingBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
  },

  ratingText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },

  progressContainer: {
    marginBottom: SPACING.lg,
  },

  animatedProgressBar: {
    marginBottom: SPACING.sm,
  },

  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  progressLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textTertiary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },

  improveButton: {
    alignSelf: "flex-start",
  },

  // Sections
  section: {
    marginBottom: SPACING["3xl"],
    paddingHorizontal: SPACING.xl,
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

  // Quick Actions
  quickActionsContainer: {
    marginLeft: -SPACING.xl,
    paddingLeft: SPACING.xl,
  },

  quickActionCard: {
    alignItems: "center",
    width: 100,
    marginRight: SPACING.lg,
    padding: SPACING.lg,
  },

  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },

  actionTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
    textAlign: "center",
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },

  // Loan Offers
  loanOffersContainer: {
    marginLeft: -SPACING.xl,
    paddingLeft: SPACING.xl,
  },

  loanOfferCard: {
    width: width * 0.7,
    marginRight: SPACING.lg,
  },

  offerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },

  loanType: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.white,
  },

  processingTime: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },

  loanAmount: {
    fontSize: TYPOGRAPHY.fontSize["3xl"],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
    marginBottom: SPACING.lg,
  },

  offerDetails: {
    marginBottom: SPACING.lg,
  },

  offerDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  offerDetailLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: "rgba(255, 255, 255, 0.7)",
  },

  offerDetailValue: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },

  viewDetailsButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderColor: "rgba(255, 255, 255, 0.3)",
  },

  // Financial Tip
  tipCard: {
    padding: SPACING.xl,
  },

  tipHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },

  tipIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  tipIndicator: {
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },

  tipCategory: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },

  tipTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },

  tipDescription: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },

  // Activity
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
    padding: SPACING.lg,
  },

  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },

  activityContent: {
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

  activityAmount: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginLeft: SPACING.md,
  },

  bottomSpacing: {
    height: SPACING["4xl"],
  },
});

export default HomeScreen;
