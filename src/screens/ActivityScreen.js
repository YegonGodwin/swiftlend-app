import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ActivityScreen() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const transactions = [
    {
      id: '1',
      title: 'Loan Disbursement',
      amount: '+ Ksh 5,000',
      date: 'Due: 25 Aug 2024',
      time: '201 2023',
      icon: 'add-circle',
      type: 'credit',
      category: 'Today',
    },
    {
      id: '2',
      title: 'Service Fee Payment',
      amount: '- Ksh 500',
      date: 'Due: 25 Aug 2024',
      time: '201 2023',
      icon: 'remove-circle',
      type: 'debit',
      category: 'Today',
    },
    {
      id: '3',
      title: 'Service Fee Payment',
      amount: '- 500',
      date: 'Due: 25 Aug 2024',
      time: '201 2023',
      icon: 'time',
      type: 'debit',
      category: 'Today',
    },
    {
      id: '4',
      title: 'Payment Received',
      amount: '+ Ksh 5,000',
      date: 'Due: 25 Aug 2024',
      time: '201 2021',
      icon: 'checkmark-circle',
      type: 'credit',
      category: 'Yesterday',
    },
    {
      id: '5',
      title: 'Payment Received',
      amount: '- 25 000',
      date: 'Due: 25 Aug 2024',
      time: '201 2021',
      icon: 'checkmark-circle',
      type: 'debit',
      category: 'Yesterday',
    },
    {
      id: '6',
      title: 'Application Approved',
      amount: '- 151 18',
      date: 'Due: 25 Aug 2024',
      time: '201 2021',
      icon: 'thumbs-up',
      type: 'info',
      category: 'Yesterday',
    },
    {
      id: '7',
      title: 'Application Submitted',
      amount: '',
      date: 'Due: 25 Aug 2024',
      time: '201 2021',
      icon: 'document-text',
      type: 'info',
      category: 'Yesterday',
    },
  ];

  const filters = [
    { id: 'all', label: 'All', icon: 'list' },
    { id: 'credit', label: 'Credits', icon: 'arrow-down' },
    { id: 'debit', label: 'Debits', icon: 'arrow-up' },
    { id: 'pending', label: 'Pending', icon: 'time' },
  ];

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(transaction);
    return acc;
  }, {});

  const filteredTransactions =
    selectedFilter === 'all'
      ? groupedTransactions
      : Object.keys(groupedTransactions).reduce((acc, category) => {
          acc[category] = groupedTransactions[category].filter(
            (t) => t.type === selectedFilter
          );
          return acc;
        }, {});

  const getIconColor = (type) => {
    switch (type) {
      case 'credit':
        return '#00D9B5';
      case 'debit':
        return '#FF5252';
      default:
        return '#4A90E2';
    }
  };

  const getIconBackground = (type) => {
    switch (type) {
      case 'credit':
        return '#1E3A32';
      case 'debit':
        return '#3A1E1E';
      default:
        return '#1E2E3A';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="flash" size={28} color="#00D9B5" />
          <Text style={styles.logoText}>SwiftLend</Text>
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Activity</Text>
        <Text style={styles.subtitle}>Your Transaction History</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8F92A1" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions..."
          placeholderTextColor="#8F92A1"
        />
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
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
            activeOpacity={0.7}
          >
            <Ionicons
              name={filter.icon}
              size={18}
              color={selectedFilter === filter.id ? '#FFFFFF' : '#8F92A1'}
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

      {/* Transactions List */}
      <ScrollView
        style={styles.transactionsContainer}
        showsVerticalScrollIndicator={false}
      >
        {Object.keys(filteredTransactions).map((category) => (
          <View key={category} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <Text style={styles.categoryYear}>
                {filteredTransactions[category][0]?.time}
              </Text>
            </View>

            {filteredTransactions[category].map((transaction) => (
              <TouchableOpacity
                key={transaction.id}
                style={styles.transactionCard}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.transactionIconContainer,
                    { backgroundColor: getIconBackground(transaction.type) },
                  ]}
                >
                  <Ionicons
                    name={transaction.icon}
                    size={24}
                    color={getIconColor(transaction.type)}
                  />
                </View>

                <View style={styles.transactionContent}>
                  <Text style={styles.transactionTitle}>
                    {transaction.title}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {transaction.date}
                  </Text>
                </View>

                {transaction.amount && (
                  <Text
                    style={[
                      styles.transactionAmount,
                      {
                        color:
                          transaction.type === 'credit'
                            ? '#00D9B5'
                            : '#FF5252',
                      },
                    ]}
                  >
                    {transaction.amount}
                  </Text>
                )}

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#8F92A1"
                  style={styles.chevron}
                />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Load More */}
        <TouchableOpacity style={styles.loadMoreButton}>
          <Text style={styles.loadMoreText}>Load More Transactions</Text>
          <Ionicons name="refresh" size={18} color="#00D9B5" />
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>This Month</Text>
          <View style={styles.summaryAmounts}>
            <Text style={[styles.summaryAmount, { color: '#00D9B5' }]}>
              +Ksh 65,000
            </Text>
            <Text style={[styles.summaryAmount, { color: '#FF5252' }]}>
              -Ksh 12,500
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151828',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8F92A1',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2F4A',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filtersContent: {
    paddingHorizontal: 20,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2F4A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
  },
  filterChipActive: {
    backgroundColor: '#00D9B5',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8F92A1',
    marginLeft: 6,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  transactionsContainer: {
    flex: 1,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  categoryYear: {
    fontSize: 14,
    color: '#8F92A1',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2F4A',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  transactionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionContent: {
    flex: 1,
    marginLeft: 12,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#8F92A1',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  chevron: {
    marginLeft: 4,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2F4A',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  loadMoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00D9B5',
    marginRight: 8,
  },
  summaryCard: {
    backgroundColor: '#2A2F4A',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#8F92A1',
    marginBottom: 8,
  },
  summaryAmounts: {
    flexDirection: 'row',
    gap: 20,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
