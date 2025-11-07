import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../context/AppContext";
import Button from "../components/common/Button";
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from "../constants/theme";
import { ONBOARDING_SLIDES } from "../constants/app";

const { width, height } = Dimensions.get("window");

const OnboardingScreen = ({ navigation }) => {
  const { actions } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = () => {
    actions.setFirstLaunch(false);
    navigation.replace("Main");
  };

  const handleSkip = () => {
    actions.setFirstLaunch(false);
    navigation.replace("Main");
  };

  const renderIllustration = (item) => {
    switch (item.animation) {
      case "wallet":
        return (
          <View style={styles.illustrationContainer}>
            <View style={styles.walletContainer}>
              <LinearGradient
                colors={COLORS.gradientPrimary}
                style={styles.walletCard}
              >
                <Ionicons name="card" size={40} color={COLORS.white} />
              </LinearGradient>
              <View style={styles.coinStack}>
                <View style={[styles.coin, { top: 0, left: 20 }]} />
                <View style={[styles.coin, { top: 8, left: 15 }]} />
                <View style={[styles.coin, { top: 16, left: 10 }]} />
              </View>
              <View style={styles.moneyBills}>
                <View
                  style={[styles.bill, { transform: [{ rotate: "10deg" }] }]}
                />
                <View
                  style={[
                    styles.bill,
                    { transform: [{ rotate: "-5deg" }], top: 10 },
                  ]}
                />
              </View>
            </View>
          </View>
        );

      case "speed":
        return (
          <View style={styles.illustrationContainer}>
            <View style={styles.speedContainer}>
              <LinearGradient
                colors={COLORS.gradientSecondary}
                style={styles.speedCircle}
              >
                <Ionicons name="flash" size={60} color={COLORS.white} />
              </LinearGradient>
              <View style={styles.speedLines}>
                {[...Array(5)].map((_, i) => (
                  <Animated.View
                    key={i}
                    style={[
                      styles.speedLine,
                      {
                        right: 120 + i * 15,
                        top: 80 + i * 8,
                        opacity: 1 - i * 0.15,
                      },
                    ]}
                  />
                ))}
              </View>
              <View style={styles.phoneFrame}>
                <View style={styles.phoneScreen}>
                  <View style={styles.checkmarkContainer}>
                    <Ionicons
                      name="checkmark-circle"
                      size={30}
                      color={COLORS.success}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        );

      case "trust":
        return (
          <View style={styles.illustrationContainer}>
            <View style={styles.trustContainer}>
              <LinearGradient
                colors={COLORS.gradientPrimary}
                style={styles.shieldContainer}
              >
                <Ionicons
                  name="shield-checkmark"
                  size={80}
                  color={COLORS.white}
                />
              </LinearGradient>
              <View style={styles.documentsContainer}>
                <View style={styles.document}>
                  <View style={styles.documentHeader} />
                  <View style={styles.documentLine} />
                  <View style={styles.documentLine} />
                  <View style={[styles.documentLine, { width: "60%" }]} />
                </View>
                <View style={[styles.document, { right: 20, top: 20 }]}>
                  <View style={styles.documentHeader} />
                  <View style={styles.documentLine} />
                  <View style={styles.documentLine} />
                </View>
              </View>
              <View style={styles.lockIcon}>
                <Ionicons name="lock-closed" size={24} color={COLORS.primary} />
              </View>
            </View>
          </View>
        );

      case "insights":
        return (
          <View style={styles.illustrationContainer}>
            <View style={styles.insightsContainer}>
              <LinearGradient
                colors={COLORS.gradientInfo}
                style={styles.brainContainer}
              >
                <Ionicons name="analytics" size={60} color={COLORS.white} />
              </LinearGradient>
              <View style={styles.chartContainer}>
                <View style={styles.barChart}>
                  <View style={[styles.bar, { height: 30 }]} />
                  <View style={[styles.bar, { height: 50 }]} />
                  <View style={[styles.bar, { height: 40 }]} />
                  <View style={[styles.bar, { height: 60 }]} />
                </View>
              </View>
              <View style={styles.aiIndicator}>
                <View style={styles.aiDot} />
                <View style={[styles.aiDot, { animationDelay: "0.5s" }]} />
                <View style={[styles.aiDot, { animationDelay: "1s" }]} />
              </View>
            </View>
          </View>
        );

      default:
        return (
          <LinearGradient
            colors={COLORS.gradientPrimary}
            style={styles.defaultIcon}
          >
            <Ionicons name={item.icon} size={80} color={COLORS.white} />
          </LinearGradient>
        );
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>{renderIllustration(item)}</View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      <View style={styles.pagination}>
        {ONBOARDING_SLIDES.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
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
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>

      <View style={styles.progressInfo}>
        <Text style={styles.progressText}>
          {currentIndex + 1} of {ONBOARDING_SLIDES.length}
        </Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={COLORS.gradientBackground} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIconContainer}>
            <Ionicons name="flash" size={28} color={COLORS.primary} />
          </View>
          <Text style={styles.logoText}>SwiftLend</Text>
        </View>
        {currentIndex < ONBOARDING_SLIDES.length - 1 && (
          <Button
            title="Skip"
            variant="ghost"
            size="small"
            onPress={handleSkip}
            style={styles.skipButton}
          />
        )}
      </View>

      {/* Slides */}
      <View style={styles.slidesContainer}>
        <FlatList
          data={ONBOARDING_SLIDES}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false },
          )}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
          scrollEventThrottle={32}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {renderPagination()}

        <View style={styles.buttonContainer}>
          <Button
            title={
              currentIndex === ONBOARDING_SLIDES.length - 1
                ? "Get Started"
                : "Continue"
            }
            onPress={scrollTo}
            size="medium"
            icon={
              currentIndex === ONBOARDING_SLIDES.length - 1
                ? "rocket"
                : "arrow-forward"
            }
            iconPosition="right"
            style={styles.primaryButton}
          />
        </View>

        {currentIndex === ONBOARDING_SLIDES.length - 1 && (
          <View style={styles.secondaryButtonContainer}>
            <Button
              title="I already have an account"
              variant="ghost"
              size="small"
              onPress={handleGetStarted}
              style={styles.loginButton}
            />
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.primary}20`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },

  logoText: {
    fontSize: TYPOGRAPHY.fontSize["3xl"],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },

  skipButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },

  slidesContainer: {
    flex: 1,
  },

  slide: {
    width,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: SPACING["3xl"],
  },

  iconContainer: {
    alignItems: "center",
    marginBottom: SPACING["6xl"],
    height: 300,
    justifyContent: "center",
  },

  // Illustrations
  illustrationContainer: {
    width: 280,
    height: 280,
    justifyContent: "center",
    alignItems: "center",
  },

  // Wallet illustration
  walletContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
  },

  walletCard: {
    width: 120,
    height: 80,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 60,
  },

  coinStack: {
    position: "absolute",
    top: 80,
    right: 60,
  },

  coin: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.warning,
    borderWidth: 3,
    borderColor: "#FFD700",
  },

  moneyBills: {
    position: "absolute",
    bottom: 80,
    left: 40,
  },

  bill: {
    position: "absolute",
    width: 60,
    height: 30,
    backgroundColor: COLORS.success,
    borderRadius: BORDER_RADIUS.sm,
  },

  // Speed illustration
  speedContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  speedCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },

  speedLines: {
    position: "absolute",
  },

  speedLine: {
    position: "absolute",
    width: 30,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },

  phoneFrame: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 60,
    height: 100,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xs,
  },

  phoneScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: "center",
    alignItems: "center",
  },

  checkmarkContainer: {
    padding: SPACING.sm,
  },

  // Trust illustration
  trustContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  shieldContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
  },

  documentsContainer: {
    position: "absolute",
    top: 40,
    left: 20,
  },

  document: {
    position: "absolute",
    width: 50,
    height: 65,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.xs,
  },

  documentHeader: {
    height: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginBottom: SPACING.xs,
  },

  documentLine: {
    height: 3,
    backgroundColor: COLORS.textTertiary,
    borderRadius: 1,
    marginBottom: SPACING.xs,
  },

  lockIcon: {
    position: "absolute",
    bottom: 40,
    right: 30,
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },

  // Insights illustration
  insightsContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  brainContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },

  chartContainer: {
    position: "absolute",
    bottom: 60,
    left: 40,
  },

  barChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: SPACING.xs,
  },

  bar: {
    width: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },

  aiIndicator: {
    position: "absolute",
    top: 30,
    right: 40,
    flexDirection: "row",
    gap: SPACING.xs,
  },

  aiDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },

  // Default icon
  defaultIcon: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
  },

  textContainer: {
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING["4xl"],
  },

  title: {
    fontSize: TYPOGRAPHY.fontSize["5xl"],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.lg,
    lineHeight: 40,
  },

  description: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 26,
    paddingHorizontal: SPACING.md,
  },

  footer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING["5xl"],
    alignItems: "center",
  },

  paginationContainer: {
    alignItems: "center",
    marginBottom: SPACING["4xl"],
  },

  pagination: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },

  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },

  progressInfo: {
    backgroundColor: `${COLORS.backgroundCard}80`,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.xl,
  },

  progressText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },

  buttonContainer: {
    width: "100%",
    maxWidth: 280,
    marginBottom: SPACING.lg,
  },

  primaryButton: {
    paddingHorizontal: SPACING["3xl"],
    minHeight: 50,
  },

  secondaryButtonContainer: {
    alignItems: "center",
  },

  loginButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
});

export default OnboardingScreen;
