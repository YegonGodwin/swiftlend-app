import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  useApp,
  useUser,
  useFinancial,
  useSettings,
} from "../context/AppContext";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import { useForm } from "../hooks/useForm";
import {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
} from "../constants/theme";
import { APP_CONFIG, SUCCESS_MESSAGES } from "../constants/app";
import {
  validateRequired,
  validateEmail,
  validatePhoneNumber,
  validateName,
} from "../utils/validation";
import { formatName, formatPhoneNumber } from "../utils/formatters";

const ProfileScreen = ({ navigation }) => {
  const { actions } = useApp();
  const user = useUser();
  const financial = useFinancial();
  const settings = useSettings();

  const [isEditing, setIsEditing] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);

  // Form validation rules
  const validationRules = {
    firstName: [(value) => validateName(value, "First name")],
    lastName: [(value) => validateName(value, "Last name")],
    email: [(value) => validateEmail(value)],
    phoneNumber: [(value) => validatePhoneNumber(value)],
  };

  // Initialize form with user data
  const form = useForm(
    {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
    },
    validationRules,
  );

  const handleSaveProfile = async (formData) => {
    try {
      actions.updateProfile(formData);
      actions.showNotification({
        type: "success",
        title: "Profile Updated",
        message: SUCCESS_MESSAGES.PROFILE_UPDATED,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
      actions.setError("Failed to update profile. Please try again.");
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          actions.logout();
        },
      },
    ]);
  };

  const handleSettingChange = (setting, value) => {
    actions.updateSettings({ [setting]: value });
    actions.showNotification({
      type: "success",
      title: "Settings Updated",
      message: `${setting} has been ${value ? "enabled" : "disabled"}`,
    });
  };

  const menuItems = [
    {
      id: "personal",
      title: "Personal Information",
      icon: "person-outline",
      action: () => setShowPersonalInfo(!showPersonalInfo),
      expandable: true,
      expanded: showPersonalInfo,
    },
    {
      id: "security",
      title: "Security",
      icon: "shield-checkmark-outline",
      action: () => navigation.navigate("Security"),
      badge: !settings.biometricEnabled ? "Setup Required" : null,
    },
    {
      id: "cards",
      title: "Payment Methods",
      icon: "card-outline",
      action: () => navigation.navigate("Cards"),
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: "notifications-outline",
      action: () => {},
      toggle: {
        value: settings.notificationsEnabled,
        onValueChange: (value) =>
          handleSettingChange("notificationsEnabled", value),
      },
    },
    {
      id: "documents",
      title: "Documents",
      icon: "document-text-outline",
      action: () => navigation.navigate("Documents"),
    },
    {
      id: "support",
      title: "Help & Support",
      icon: "help-circle-outline",
      action: () => navigation.navigate("Support"),
    },
    {
      id: "terms",
      title: "Terms & Conditions",
      icon: "document-outline",
      action: () => {},
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      icon: "lock-closed-outline",
      action: () => {},
    },
  ];

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Ionicons name="flash" size={24} color={COLORS.primary} />
        <Text style={styles.logoText}>Profile</Text>
      </View>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => {
          /* Navigate to settings */
        }}
      >
        <Ionicons
          name="settings-outline"
          size={24}
          color={COLORS.textPrimary}
        />
      </TouchableOpacity>
    </View>
  );

  const renderProfileCard = () => (
    <Card gradient={COLORS.gradientPrimary} style={styles.profileCard}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {formatName(user.firstName, user.lastName, {
                format: "initials",
              }) || "U"}
            </Text>
          </View>
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="camera" size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>
            {formatName(user.firstName, user.lastName) || "User"}
          </Text>
          <Text style={styles.userEmail}>{user.email || "No email"}</Text>
          <Text style={styles.userPhone}>
            {formatPhoneNumber(user.phoneNumber) || "No phone"}
          </Text>
        </View>
      </View>

      <View style={styles.verificationStatus}>
        <View
          style={[
            styles.verifiedBadge,
            !user.isVerified && styles.unverifiedBadge,
          ]}
        >
          <Ionicons
            name={user.isVerified ? "checkmark-circle" : "alert-circle"}
            size={16}
            color={COLORS.white}
          />
          <Text style={styles.verifiedText}>
            {user.isVerified ? "Verified Account" : "Verification Pending"}
          </Text>
        </View>
      </View>

      <Button
        title={isEditing ? "Cancel" : "Edit Profile"}
        variant="secondary"
        size="small"
        icon={isEditing ? "close" : "create"}
        onPress={() => {
          if (isEditing) {
            form.reset();
          }
          setIsEditing(!isEditing);
        }}
        style={styles.editButton}
      />
    </Card>
  );

  const renderPersonalInfoForm = () => {
    if (!showPersonalInfo) return null;

    return (
      <Card style={styles.personalInfoCard}>
        <View style={styles.personalInfoHeader}>
          <Text style={styles.personalInfoTitle}>Personal Information</Text>
          {!isEditing && (
            <Button
              title="Edit"
              variant="ghost"
              size="small"
              icon="create"
              onPress={() => setIsEditing(true)}
            />
          )}
        </View>

        {isEditing ? (
          <View style={styles.formContainer}>
            <Input
              label="First Name"
              placeholder="Enter your first name"
              {...form.getFieldProps("firstName")}
            />
            <Input
              label="Last Name"
              placeholder="Enter your last name"
              {...form.getFieldProps("lastName")}
            />
            <Input
              label="Email"
              placeholder="Enter your email"
              keyboardType="email-address"
              leftIcon="mail"
              {...form.getFieldProps("email")}
            />
            <Input
              label="Phone Number"
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              leftIcon="call"
              {...form.getFieldProps("phoneNumber")}
            />

            <View style={styles.formActions}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => {
                  form.reset();
                  setIsEditing(false);
                }}
                style={styles.cancelButton}
              />
              <Button
                title="Save Changes"
                onPress={form.handleSubmit(handleSaveProfile)}
                loading={form.isSubmitting}
                disabled={!form.isDirty() || !form.isValid}
                style={styles.saveButton}
              />
            </View>
          </View>
        ) : (
          <View style={styles.infoDisplay}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>First Name</Text>
              <Text style={styles.infoValue}>
                {user.firstName || "Not provided"}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Last Name</Text>
              <Text style={styles.infoValue}>
                {user.lastName || "Not provided"}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>
                {user.email || "Not provided"}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>
                {formatPhoneNumber(user.phoneNumber) || "Not provided"}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Recently"}
              </Text>
            </View>
          </View>
        )}
      </Card>
    );
  };

  const renderStatsCards = () => (
    <View style={styles.statsContainer}>
      <Card
        style={styles.statCard}
        onPress={() => navigation.navigate("Activity")}
      >
        <Text style={styles.statValue}>{financial.creditScore || 0}</Text>
        <Text style={styles.statLabel}>Credit Score</Text>
        <Ionicons name="trending-up" size={20} color={COLORS.success} />
      </Card>

      <Card
        style={styles.statCard}
        onPress={() => navigation.navigate("Activity")}
      >
        <Text style={styles.statValue}>
          {financial.totalDebt
            ? `${Math.round(financial.totalDebt / 1000)}K`
            : "0"}
        </Text>
        <Text style={styles.statLabel}>Total Debt</Text>
        <Ionicons name="wallet" size={20} color={COLORS.warning} />
      </Card>

      <Card
        style={styles.statCard}
        onPress={() => navigation.navigate("Activity")}
      >
        <Text style={styles.statValue}>
          {financial.monthlyIncome
            ? `${Math.round(financial.monthlyIncome / 1000)}K`
            : "0"}
        </Text>
        <Text style={styles.statLabel}>Monthly Income</Text>
        <Ionicons name="cash" size={20} color={COLORS.primary} />
      </Card>
    </View>
  );

  const renderMenuItem = (item) => (
    <Card
      key={item.id}
      style={styles.menuItem}
      onPress={item.action}
      disabled={!!item.toggle}
    >
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemLeft}>
          <View style={styles.menuIconContainer}>
            <Ionicons name={item.icon} size={20} color={COLORS.primary} />
          </View>
          <View style={styles.menuItemTextContainer}>
            <Text style={styles.menuItemText}>{item.title}</Text>
            {item.badge && (
              <Text style={styles.menuItemBadge}>{item.badge}</Text>
            )}
          </View>
        </View>

        <View style={styles.menuItemRight}>
          {item.toggle ? (
            <Switch
              value={item.toggle.value}
              onValueChange={item.toggle.onValueChange}
              trackColor={{ false: COLORS.border, true: COLORS.primary + "40" }}
              thumbColor={
                item.toggle.value ? COLORS.primary : COLORS.textTertiary
              }
            />
          ) : (
            <Ionicons
              name={
                item.expandable && item.expanded
                  ? "chevron-up"
                  : "chevron-forward"
              }
              size={20}
              color={COLORS.textSecondary}
            />
          )}
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
        {renderProfileCard()}
        {renderPersonalInfoForm()}
        {renderStatsCards()}

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          {menuItems.map(renderMenuItem)}
        </View>

        <Card style={styles.dangerZone}>
          <Text style={styles.dangerZoneTitle}>Danger Zone</Text>
          <Button
            title="Logout"
            variant="danger"
            icon="log-out"
            onPress={handleLogout}
            fullWidth
            style={styles.logoutButton}
          />
        </Card>

        <Text style={styles.versionText}>
          {APP_CONFIG.name} v{APP_CONFIG.version}
        </Text>

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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
    paddingTop: 60,
    paddingBottom: SPACING.lg,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoText: {
    fontSize: TYPOGRAPHY.fontSize["2xl"],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },

  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundCard,
    justifyContent: "center",
    alignItems: "center",
  },

  // ScrollView
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: SPACING.xl,
  },

  // Profile Card
  profileCard: {
    marginBottom: SPACING.xl,
  },

  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },

  avatarContainer: {
    position: "relative",
    marginRight: SPACING.lg,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.white,
  },

  avatarText: {
    fontSize: TYPOGRAPHY.fontSize["3xl"],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },

  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryDark,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },

  profileInfo: {
    flex: 1,
  },

  userName: {
    fontSize: TYPOGRAPHY.fontSize["2xl"],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },

  userEmail: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: SPACING.xs,
  },

  userPhone: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: "rgba(255, 255, 255, 0.8)",
  },

  verificationStatus: {
    alignItems: "center",
    marginBottom: SPACING.lg,
  },

  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },

  unverifiedBadge: {
    backgroundColor: "rgba(255, 82, 82, 0.2)",
  },

  verifiedText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.white,
    marginLeft: SPACING.xs,
  },

  editButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderColor: "rgba(255, 255, 255, 0.3)",
  },

  // Personal Info
  personalInfoCard: {
    marginBottom: SPACING.xl,
  },

  personalInfoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },

  personalInfoTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },

  formContainer: {
    gap: SPACING.sm,
  },

  formActions: {
    flexDirection: "row",
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },

  cancelButton: {
    flex: 1,
  },

  saveButton: {
    flex: 1,
  },

  infoDisplay: {
    gap: SPACING.lg,
  },

  infoItem: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.sm,
  },

  infoLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },

  infoValue: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },

  // Stats
  statsContainer: {
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },

  statCard: {
    flex: 1,
    alignItems: "center",
    padding: SPACING.lg,
    position: "relative",
  },

  statValue: {
    fontSize: TYPOGRAPHY.fontSize["2xl"],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },

  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },

  // Menu
  menuSection: {
    marginBottom: SPACING.xl,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },

  menuItem: {
    marginBottom: SPACING.sm,
  },

  menuItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },

  menuItemTextContainer: {
    flex: 1,
  },

  menuItemText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
  },

  menuItemBadge: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.warning,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginTop: SPACING.xs,
  },

  menuItemRight: {
    marginLeft: SPACING.md,
  },

  // Danger Zone
  dangerZone: {
    marginBottom: SPACING.xl,
    borderColor: COLORS.error,
    borderWidth: 1,
  },

  dangerZoneTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.error,
    marginBottom: SPACING.lg,
  },

  logoutButton: {
    backgroundColor: COLORS.error,
  },

  // Footer
  versionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textTertiary,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },

  bottomSpacing: {
    height: SPACING["4xl"],
  },
});

export default ProfileScreen;
