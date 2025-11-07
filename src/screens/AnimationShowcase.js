import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
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
import {
  fadeIn,
  fadeOut,
  scaleIn,
  scaleOut,
  slideInFromBottom,
  slideInFromTop,
  slideInFromLeft,
  slideInFromRight,
  createShakeAnimation,
  createCardFlipAnimation,
  heartbeatAnimation,
  pulseAnimation,
  wiggleAnimation,
  rotateAnimation,
  createButtonPressAnimation,
  staggeredFadeIn,
  ANIMATION_DURATIONS,
} from "../utils/animations";

const { width } = Dimensions.get("window");

const AnimationShowcase = ({ navigation }) => {
  const [showToast, setShowToast] = useState(false);
  const [countingValue, setCountingValue] = useState(1000);
  const [progressValue, setProgressValue] = useState(0.3);

  // Animation values for demonstrations
  const fadeValue = useRef(new Animated.Value(1)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const translateXValue = useRef(new Animated.Value(0)).current;
  const translateYValue = useRef(new Animated.Value(0)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const shakeValue = useRef(new Animated.Value(0)).current;
  const heartbeatValue = useRef(new Animated.Value(1)).current;
  const flipValue = useRef(new Animated.Value(0)).current;
  const wiggleValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;

  const staggeredValues = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const animationSections = [
    {
      id: "basic",
      title: "Basic Animations",
      items: [
        {
          name: "Fade In/Out",
          onPress: () => {
            const currentValue = fadeValue._value;
            const animation = currentValue === 1 ? fadeOut(fadeValue, 300) : fadeIn(fadeValue, 300);
            animation.start();
          },
          animatedValue: fadeValue,
          style: { opacity: fadeValue },
        },
        {
          name: "Scale In/Out",
          onPress: () => {
            const currentValue = scaleValue._value;
            const animation = currentValue === 1 ? scaleOut(scaleValue, 300) : scaleIn(scaleValue, 300);
            animation.start();
          },
          animatedValue: scaleValue,
          style: { transform: [{ scale: scaleValue }] },
        },
        {
          name: "Slide Left/Right",
          onPress: () => {
            const animation = Animated.sequence([
              slideInFromRight(translateXValue, 300),
              Animated.delay(500),
              slideInFromLeft(translateXValue, 300),
            ]);
            translateXValue.setValue(100);
            animation.start();
          },
          animatedValue: translateXValue,
          style: { transform: [{ translateX: translateXValue }] },
        },
        {
          name: "Slide Up/Down",
          onPress: () => {
            const animation = Animated.sequence([
              slideInFromTop(translateYValue, 300),
              Animated.delay(500),
              slideInFromBottom(translateYValue, 300),
            ]);
            translateYValue.setValue(-50);
            animation.start();
          },
          animatedValue: translateYValue,
          style: { transform: [{ translateY: translateYValue }] },
        },
      ],
    },
    {
      id: "complex",
      title: "Complex Animations",
      items: [
        {
          name: "Rotate 360°",
          onPress: () => {
            rotateAnimation(rotateValue, 1000).start(() => {
              rotateValue.setValue(0);
            });
          },
          animatedValue: rotateValue,
          style: {
            transform: [
              {
                rotate: rotateValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"],
                }),
              },
            ],
          },
        },
        {
          name: "Shake",
          onPress: () => {
            createShakeAnimation(shakeValue, 10).start();
          },
          animatedValue: shakeValue,
          style: { transform: [{ translateX: shakeValue }] },
        },
        {
          name: "Heartbeat",
          onPress: () => {
            heartbeatAnimation(heartbeatValue).start();
          },
          animatedValue: heartbeatValue,
          style: { transform: [{ scale: heartbeatValue }] },
        },
        {
          name: "Card Flip",
          onPress: () => {
            createCardFlipAnimation(flipValue, 600).start(() => {
              flipValue.setValue(0);
            });
          },
          animatedValue: flipValue,
          style: {
            transform: [
              {
                rotateY: flipValue.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: ["0deg", "90deg", "0deg"],
                }),
              },
            ],
          },
        },
      ],
    },
    {
      id: "interactive",
      title: "Interactive Animations",
      items: [
        {
          name: "Wiggle",
          onPress: () => {
            wiggleAnimation(wiggleValue).start();
          },
          animatedValue: wiggleValue,
          style: {
            transform: [
              {
                rotate: wiggleValue.interpolate({
                  inputRange: [-1, 1],
                  outputRange: ["-10deg", "10deg"],
                }),
              },
            ],
          },
        },
        {
          name: "Pulse",
          onPress: () => {
            pulseAnimation(pulseValue, 0.9, 1.1).start();
          },
          animatedValue: pulseValue,
          style: { transform: [{ scale: pulseValue }] },
        },
        {
          name: "Staggered Fade",
          onPress: () => {
            staggeredValues.forEach(value => value.setValue(0));
            staggeredFadeIn(staggeredValues, 300, 100).start();
          },
          animatedValue: staggeredValues[0],
          isStaggered: true,
        },
      ],
    },
  ];

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Animation Showcase</Text>
      <View style={styles.placeholder} />
    </View>
  );

  const renderAnimationItem = (item, index) => {
    if (item.isStaggered) {
      return (
        <View key={item.name} style={styles.staggeredContainer}>
          <Button
            title={item.name}
            onPress={item.onPress}
            style={styles.animationButton}
            size="small"
          />
          <View style={styles.staggeredItems}>
            {staggeredValues.map((value, idx) => (
              <Animated.View
                key={idx}
                style={[
                  styles.staggeredItem,
                  { opacity: value, transform: [{ scale: value }] },
                ]}
              />
            ))}
          </View>
        </View>
      );
    }

    return (
      <View key={item.name} style={styles.animationItem}>
        <Button
          title={item.name}
          onPress={item.onPress}
          style={styles.animationButton}
          size="small"
        />
        <Animated.View style={[styles.animatedElement, item.style]}>
          <View style={styles.demoBox}>
            <Ionicons name="star" size={24} color={COLORS.primary} />
          </View>
        </Animated.View>
      </View>
    );
  };

  const renderComponentShowcase = () => (
    <Card style={styles.componentSection}>
      <Text style={styles.sectionTitle}>Component Animations</Text>

      {/* Counting Text */}
      <View style={styles.componentItem}>
        <Text style={styles.componentLabel}>Counting Text</Text>
        <CountingText
          value={countingValue}
          prefix="$"
          suffix=""
          style={styles.countingText}
          duration={1000}
        />
        <Button
          title="Animate Count"
          onPress={() => setCountingValue(Math.floor(Math.random() * 10000) + 1000)}
          size="small"
          variant="outline"
        />
      </View>

      {/* Progress Bar */}
      <View style={styles.componentItem}>
        <Text style={styles.componentLabel}>Progress Bar</Text>
        <ProgressBar
          progress={progressValue}
          height={12}
          gradient={COLORS.gradientPrimary}
          showGlow={true}
          style={styles.progressBar}
        />
        <Button
          title="Change Progress"
          onPress={() => setProgressValue(Math.random())}
          size="small"
          variant="outline"
        />
      </View>

      {/* Loading Spinners */}
      <View style={styles.componentItem}>
        <Text style={styles.componentLabel}>Loading Spinners</Text>
        <View style={styles.spinnersContainer}>
          <LoadingSpinner size={30} type="spinner" />
          <LoadingSpinner size={30} type="dots" />
          <LoadingSpinner size={30} type="pulse" />
          <LoadingSpinner size={30} type="wave" />
          <LoadingSpinner size={30} type="gradient-spinner" />
        </View>
      </View>

      {/* Animated Cards */}
      <View style={styles.componentItem}>
        <Text style={styles.componentLabel}>Animated Cards</Text>
        <View style={styles.cardsContainer}>
          <Card
            style={styles.demoCard}
            animateOnMount={true}
            animationType="fadeIn"
            gradient={COLORS.gradientPrimary}
            padding="medium"
          >
            <Text style={styles.cardText}>Fade In</Text>
          </Card>
          <Card
            style={styles.demoCard}
            animateOnMount={true}
            animationType="scaleIn"
            gradient={COLORS.gradientSecondary}
            padding="medium"
          >
            <Text style={styles.cardText}>Scale In</Text>
          </Card>
          <Card
            style={styles.demoCard}
            animateOnMount={true}
            animationType="slideUp"
            gradient={COLORS.gradientWarning}
            padding="medium"
          >
            <Text style={styles.cardText}>Slide Up</Text>
          </Card>
        </View>
      </View>

      {/* Toast Notification */}
      <View style={styles.componentItem}>
        <Text style={styles.componentLabel}>Toast Notifications</Text>
        <View style={styles.toastButtons}>
          <Button
            title="Success"
            onPress={() => setShowToast("success")}
            size="small"
            variant="outline"
          />
          <Button
            title="Error"
            onPress={() => setShowToast("error")}
            size="small"
            variant="outline"
          />
          <Button
            title="Warning"
            onPress={() => setShowToast("warning")}
            size="small"
            variant="outline"
          />
          <Button
            title="Info"
            onPress={() => setShowToast("info")}
            size="small"
            variant="outline"
          />
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.description}>
          Tap the buttons below to see various animations in action!
        </Text>

        {animationSections.map((section) => (
          <Card key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.animationsGrid}>
              {section.items.map((item, index) => renderAnimationItem(item, index))}
            </View>
          </Card>
        ))}

        {renderComponentShowcase()}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Toast Notifications */}
      <NotificationToast
        visible={showToast === "success"}
        type="success"
        title="Success!"
        message="This is a success notification with smooth animations."
        onDismiss={() => setShowToast(false)}
        duration={3000}
      />
      <NotificationToast
        visible={showToast === "error"}
        type="error"
        title="Error!"
        message="This is an error notification with shake animation."
        onDismiss={() => setShowToast(false)}
        duration={3000}
      />
      <NotificationToast
        visible={showToast === "warning"}
        type="warning"
        title="Warning!"
        message="This is a warning notification."
        onDismiss={() => setShowToast(false)}
        duration={3000}
      />
      <NotificationToast
        visible={showToast === "info"}
        type="info"
        title="Info"
        message="This is an info notification."
        onDismiss={() => setShowToast(false)}
        duration={3000}
      />
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

  placeholder: {
    width: 40,
  },

  // Content
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: SPACING.xl,
  },

  description: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },

  // Sections
  section: {
    marginBottom: SPACING.xl,
    padding: SPACING.xl,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },

  animationsGrid: {
    gap: SPACING.lg,
  },

  animationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  animationButton: {
    flex: 1,
    marginRight: SPACING.lg,
  },

  animatedElement: {
    justifyContent: "center",
    alignItems: "center",
  },

  demoBox: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.medium,
  },

  // Staggered animations
  staggeredContainer: {
    alignItems: "center",
    gap: SPACING.md,
  },

  staggeredItems: {
    flexDirection: "row",
    gap: SPACING.sm,
  },

  staggeredItem: {
    width: 30,
    height: 30,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
  },

  // Component showcase
  componentSection: {
    padding: SPACING.xl,
  },

  componentItem: {
    marginBottom: SPACING.xl,
  },

  componentLabel: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },

  countingText: {
    fontSize: TYPOGRAPHY.fontSize["3xl"],
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: SPACING.md,
  },

  progressBar: {
    marginBottom: SPACING.md,
  },

  spinnersContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: SPACING.lg,
  },

  cardsContainer: {
    flexDirection: "row",
    gap: SPACING.md,
    flexWrap: "wrap",
  },

  demoCard: {
    flex: 1,
    minWidth: 100,
    minHeight: 80,
    justifyContent: "center",
    alignItems: "center",
  },

  cardText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.white,
    textAlign: "center",
  },

  toastButtons: {
    flexDirection: "row",
    gap: SPACING.sm,
    flexWrap: "wrap",
  },

  bottomSpacing: {
    height: SPACING["4xl"],
  },
});

export default AnimationShowcase;
