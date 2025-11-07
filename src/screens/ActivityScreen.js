import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp, useLoans } from "../context/AppContext";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from "../constants/theme";
import { TRANSACTION_TYPES } from "../constants/app";
import {
  formatCurrency,
  formatRelativeTime,
  formatDate,
} from "../utils/formatters";

const ActivityScreen = ({ navigation }) => {
  const { state, actions } = useApp();
  const loans = useLoans();

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Mock transactions - in real app, this would come from context/API
  const transactions = [
    {
      id: "1",
      type: "disbursement",
      title: "Loan Disbursement",
      description: "Personal loan funds transferred",
      amount: 50000,
      date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: "completed",
      loanId: "loan1",
      reference: "TXN001",
    },
    {
      id: "2",
      type: "fee",
      title: "Processing Fee",
      description: "Loan processing fee",
      amount: -1000,
      date: new Date(Date.now() - 2 * 60 * 60 * 1000 - 5 * 60 * 1000), // 2h 5m ago
      status: "completed",
      loanId: "loan1",
      reference: "TXN002",
    },
    {
      id: "3",
      type: "payment",
      title: "Monthly Payment",
      description: "EMI payment received",
      amount: -5500,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      status: "completed",
      loanId: "loan1",
      reference: "TXN003",
    },
    {
      id: "4",
      type: "payment",
      title: "Monthly Payment",
      description: "EMI payment received",
      amount: -5500,
      date: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000), // 32 days ago
      status: "completed",
      loanId: "loan1",
      reference: "TXN004",
    },
    {
      id: "5",
      type: "interest",
      title: "Interest Charged",
      description: "Monthly interest",
      amount: -800,
      date: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000 - 60 * 60 * 1000), // 32d 1h ago
      status: "completed",
      loanId: "loan1",
      reference: "TXN005",
    },
    {
      id: "6",
      type: "penalty",
      title: "Late Fee",
      description: "Payment delay penalty",
      amount: -200,
      date: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000), // 65 days ago
      status: "completed",
      loanId: "loan1",
      reference: "TXN006",
    },
  ];

  const filters = [
    { id: "all", label: "All", icon: "list" },
    { id: "disbursement", label: "Disbursed", icon: "arrow-down-circle" },
    { id: "payment", label: "Payments", icon: "arrow-up-circle" },
    { id: "fee", label: "Fees", icon: "receipt" },
    { id: "pending", label: "Pending", icon: "time" },
  ];

  // Filter and search transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Apply type filter
    if (selectedFilter !== "all") {
      filtered = filtered.filter((t) => t.type === selectedFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.reference.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [transactions, selectedFilter, searchQuery]);

  // Group transactions by time periods
  const groupedTransactions = useMemo(() => {
    const groups = {
      today: [],
      yesterday: [],
      this_week: [],
      this_month: [],
      older: [],
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    filteredTransactions.forEach((transaction) => {
      const txnDate = new Date(transaction.date);

      if (txnDate >= today) {
        groups.today.push(transaction);
      } else if (txnDate >= yesterday) {
        groups.yesterday.push(transaction);
      } else if (txnDate >= weekAgo) {
        groups.this_week.push(transaction);
      } else if (txnDate >= monthAgo) {
        groups.this_month.push(transaction);
      } else {
        groups.older.push(transaction);
      }
    });

    // Remove empty groups
    Object.keys(groups).forEach((key) => {
      if (groups[key].length === 0) {
        delete groups[key];
      }
    });

    return groups;
  }, [filteredTransactions]);

  // Calculate summary stats
  const summary = useMemo(() => {
    const thisMonth = new Date();
    thisMonth.setDate(1);

    const thisMonthTxns = transactions.filter(
      (t) => new Date(t.date) >= thisMonth,
    );

    const credits = thisMonthTxns
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const debits = thisMonthTxns
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return { credits, debits };
  }, [transactions]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      actions.showNotification({
        type: "success",
        title: "Refreshed",
        message: "Activity updated successfully",
      });
    }, 1500);
  };

  const getTransactionConfig = (type) => {
    return TRANSACTION_TYPES[type.toUpperCase()] || TRANSACTION_TYPES.PAYMENT;
  };

  const getGroupTitle = (groupKey) => {
    const titles = {
      today: "Today",
      yesterday: "Yesterday",
      this_week: "This Week",
      this_month: "This Month",
      older: "Older",
    };
    return titles[groupKey] || groupKey;
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Ionicons name="flash" size={24} color={COLORS.primary} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Activity</Text>
            <Text style={styles.subtitle}>Transaction History</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="funnel" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchSection}>
      <Input
        placeholder="Search transactions..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        leftIcon="search"
        style={styles.searchInput}
        variant="filled"
      />
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersSection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              selectedFilter === filter.id && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(filter.id)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={filter.icon}
              size={16}
              color={
                selectedFilter === filter.id
                  ? COLORS.white
                  : COLORS.textSecondary
              }
            />
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter.id && styles.filterTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderSummaryCard = () => (
    <Card style={styles.summaryCard}>
      <View style={styles.summaryHeader}>
        <Text style={styles.summaryTitle}>This Month Summary</Text>
        <TouchableOpacity>
          <Ionicons name="analytics" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.summaryContent}>
        <View style={styles.summaryItem}>
          <View style={styles.summaryItemHeader}>
            <Ionicons
              name="arrow-down-circle"
              size={20}
              color={COLORS.success}
            />
            <Text style={styles.summaryLabel}>Credits</Text>
          </View>
          <Text style={[styles.summaryAmount, { color: COLORS.success }]}>
            {formatCurrency(summary.credits)}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <View style={styles.summaryItemHeader}>
            <Ionicons name="arrow-up-circle" size={20} color={COLORS.error} />
            <Text style={styles.summaryLabel}>Debits</Text>
          </View>
          <Text style={[styles.summaryAmount, { color: COLORS.error }]}>
            -{formatCurrency(summary.debits)}
          </Text>
        </View>
      </View>
    </Card>
  );

  const renderTransactionItem = (transaction) => {
    const config = getTransactionConfig(transaction.type);
    const isCredit = transaction.amount > 0;

    return (
      <Card
        key={transaction.id}
        style={styles.transactionCard}
        onPress={() => {
          // Navigate to transaction details
        }}
      >
        <View style={styles.transactionContent}>
          <View
            style={[
              styles.transactionIcon,
              { backgroundColor: config.color + "20" },
            ]}
          >
            <Ionicons name={config.icon} size={20} color={config.color} />
          </View>

          <View style={styles.transactionInfo}>
            <Text style={styles.transactionTitle}>{transaction.title}</Text>
            <Text style={styles.transactionDescription}>
              {transaction.description}
            </Text>
            <Text style={styles.transactionTime}>
              {formatRelativeTime(transaction.date)}
            </Text>
          </View>

          <View style={styles.transactionRight}>
            <Text
              style={[
                styles.transactionAmount,
                {
                  color: isCredit ? COLORS.success : COLORS.error,
                },
              ]}
            >
              {isCredit ? "+" : ""}
              {formatCurrency(Math.abs(transaction.amount))}
            </Text>
            <View style={styles.transactionMeta}>
              <Text style={styles.transactionReference}>
                {transaction.reference}
              </Text>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      transaction.status === "completed"
                        ? COLORS.success
                        : COLORS.warning,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </Card>
    );
  };

  const renderTransactionGroup = (groupKey, transactions) => (
    <View key={groupKey} style={styles.transactionGroup}>
      <View style={styles.groupHeader}>
        <Text style={styles.groupTitle}>{getGroupTitle(groupKey)}</Text>
        <Text style={styles.groupCount}>
          {transactions.length} transaction
          {transactions.length !== 1 ? "s" : ""}
        </Text>
      </View>
      {transactions.map(renderTransactionItem)}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="receipt-outline" size={64} color={COLORS.textTertiary} />
      <Text style={styles.emptyTitle}>No Transactions Found</Text>
      <Text style={styles.emptyDescription}>
        {searchQuery
          ? "Try adjusting your search terms"
          : "Your transaction history will appear here"}
      </Text>
      {searchQuery && (
        <Button
          title="Clear Search"
          variant="ghost"
          onPress={() => setSearchQuery("")}
          style={styles.clearSearchButton}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderSearchBar()}
        {renderFilters()}
        {renderSummaryCard()}

        <View style={styles.transactionsSection}>
          {Object.keys(groupedTransactions).length > 0
            ? Object.entries(groupedTransactions).map(
                ([groupKey, transactions]) =>
                  renderTransactionGroup(groupKey, transactions),
              )
            : renderEmptyState()}

          {Object.keys(groupedTransactions).length > 0 && (
            <Button
              title="Load More"
              variant="outline"
              icon="refresh"
              onPress={() => {
                // Load more transactions
              }}
              style={styles.loadMoreButton}
            />
          )}
        </View>

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

  filterButton: {
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

  // Search
  searchSection: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
  },

  searchInput: {
    marginBottom: 0,
  },

  // Filters
  filtersSection: {
    marginBottom: SPACING.xl,
  },

  filtersContent: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },

  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.backgroundCard,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  filterText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },

  filterTextActive: {
    color: COLORS.white,
  },

  // Summary Card
  summaryCard: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },

  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },

  summaryTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },

  summaryContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  summaryItem: {
    flex: 1,
    alignItems: "center",
  },

  summaryItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },

  summaryLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },

  summaryAmount: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },

  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.lg,
  },

  // Transactions
  transactionsSection: {
    paddingHorizontal: SPACING.xl,
  },

  transactionGroup: {
    marginBottom: SPACING.xl,
  },

  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },

  groupTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },

  groupCount: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },

  transactionCard: {
    marginBottom: SPACING.md,
    padding: SPACING.lg,
  },

  transactionContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },

  transactionInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },

  transactionTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },

  transactionDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },

  transactionTime: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textTertiary,
  },

  transactionRight: {
    alignItems: "flex-end",
  },

  transactionAmount: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginBottom: SPACING.xs,
  },

  transactionMeta: {
    flexDirection: "row",
    alignItems: "center",
  },

  transactionReference: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textTertiary,
    marginRight: SPACING.sm,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: SPACING["6xl"],
  },

  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },

  emptyDescription: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },

  clearSearchButton: {
    paddingHorizontal: 0,
  },

  // Load More
  loadMoreButton: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },

  bottomSpacing: {
    height: SPACING["4xl"],
  },
});

export default ActivityScreen;
