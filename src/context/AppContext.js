import React, { createContext, useContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  LOAN_TYPES,
  APPLICATION_STATUS,
  CREDIT_SCORE_RANGES,
} from "../constants/app";

// Initial state
const initialState = {
  // User data
  user: {
    id: null,
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: null,
    nationalId: "",
    profilePicture: null,
    isVerified: false,
    createdAt: null,
  },

  // Authentication
  auth: {
    isAuthenticated: false,
    token: null,
    refreshToken: null,
    biometricEnabled: false,
    pinEnabled: false,
    isFirstLaunch: true,
  },

  // Financial data
  financial: {
    creditScore: 750,
    monthlyIncome: 0,
    employmentStatus: "",
    employer: "",
    accountBalance: 0,
    totalDebt: 0,
    creditLimit: 0,
    creditUtilization: 0,
  },

  // Loans
  loans: {
    applications: [],
    activeLoans: [],
    completedLoans: [],
    totalBorrowed: 0,
    totalRepaid: 0,
    nextPaymentDate: null,
    nextPaymentAmount: 0,
  },

  // Transactions
  transactions: [],

  // App settings
  settings: {
    theme: "dark",
    language: "en",
    currency: "KES",
    notificationsEnabled: true,
    biometricEnabled: false,
    autoLogout: 30, // minutes
  },

  // UI state
  ui: {
    loading: false,
    error: null,
    currentScreen: "Home",
    notification: null,
  },

  // Feature flags
  features: {
    biometricAuth: true,
    darkTheme: true,
    pushNotifications: true,
    documentScanner: true,
    aiAssistant: true,
    gamification: true,
  },
};

// Action types
export const ACTION_TYPES = {
  // Auth actions
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  SET_FIRST_LAUNCH: "SET_FIRST_LAUNCH",
  ENABLE_BIOMETRIC: "ENABLE_BIOMETRIC",
  ENABLE_PIN: "ENABLE_PIN",

  // User actions
  UPDATE_USER_PROFILE: "UPDATE_USER_PROFILE",
  VERIFY_USER: "VERIFY_USER",

  // Financial actions
  UPDATE_CREDIT_SCORE: "UPDATE_CREDIT_SCORE",
  UPDATE_FINANCIAL_INFO: "UPDATE_FINANCIAL_INFO",

  // Loan actions
  ADD_LOAN_APPLICATION: "ADD_LOAN_APPLICATION",
  UPDATE_LOAN_STATUS: "UPDATE_LOAN_STATUS",
  ADD_ACTIVE_LOAN: "ADD_ACTIVE_LOAN",
  COMPLETE_LOAN: "COMPLETE_LOAN",
  UPDATE_NEXT_PAYMENT: "UPDATE_NEXT_PAYMENT",

  // Transaction actions
  ADD_TRANSACTION: "ADD_TRANSACTION",
  UPDATE_TRANSACTIONS: "UPDATE_TRANSACTIONS",

  // Settings actions
  UPDATE_SETTINGS: "UPDATE_SETTINGS",
  CHANGE_THEME: "CHANGE_THEME",

  // UI actions
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_CURRENT_SCREEN: "SET_CURRENT_SCREEN",
  SHOW_NOTIFICATION: "SHOW_NOTIFICATION",
  HIDE_NOTIFICATION: "HIDE_NOTIFICATION",

  // Data actions
  HYDRATE_STATE: "HYDRATE_STATE",
  RESET_STATE: "RESET_STATE",
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        auth: {
          ...state.auth,
          isAuthenticated: true,
          token: action.payload.token,
          refreshToken: action.payload.refreshToken,
        },
        user: {
          ...state.user,
          ...action.payload.user,
        },
        ui: {
          ...state.ui,
          loading: false,
          error: null,
        },
      };

    case ACTION_TYPES.LOGIN_FAILURE:
      return {
        ...state,
        auth: {
          ...state.auth,
          isAuthenticated: false,
          token: null,
          refreshToken: null,
        },
        ui: {
          ...state.ui,
          loading: false,
          error: action.payload.error,
        },
      };

    case ACTION_TYPES.LOGOUT:
      return {
        ...initialState,
        auth: {
          ...initialState.auth,
          isFirstLaunch: false,
        },
        settings: state.settings,
      };

    case ACTION_TYPES.SET_FIRST_LAUNCH:
      return {
        ...state,
        auth: {
          ...state.auth,
          isFirstLaunch: action.payload,
        },
      };

    case ACTION_TYPES.ENABLE_BIOMETRIC:
      return {
        ...state,
        auth: {
          ...state.auth,
          biometricEnabled: action.payload,
        },
        settings: {
          ...state.settings,
          biometricEnabled: action.payload,
        },
      };

    case ACTION_TYPES.UPDATE_USER_PROFILE:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };

    case ACTION_TYPES.UPDATE_CREDIT_SCORE:
      return {
        ...state,
        financial: {
          ...state.financial,
          creditScore: action.payload,
        },
      };

    case ACTION_TYPES.UPDATE_FINANCIAL_INFO:
      return {
        ...state,
        financial: {
          ...state.financial,
          ...action.payload,
        },
      };

    case ACTION_TYPES.ADD_LOAN_APPLICATION:
      return {
        ...state,
        loans: {
          ...state.loans,
          applications: [...state.loans.applications, action.payload],
        },
      };

    case ACTION_TYPES.UPDATE_LOAN_STATUS:
      return {
        ...state,
        loans: {
          ...state.loans,
          applications: state.loans.applications.map((loan) =>
            loan.id === action.payload.id
              ? { ...loan, status: action.payload.status }
              : loan,
          ),
        },
      };

    case ACTION_TYPES.ADD_ACTIVE_LOAN:
      return {
        ...state,
        loans: {
          ...state.loans,
          activeLoans: [...state.loans.activeLoans, action.payload],
          totalBorrowed: state.loans.totalBorrowed + action.payload.amount,
        },
      };

    case ACTION_TYPES.ADD_TRANSACTION:
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };

    case ACTION_TYPES.UPDATE_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };

    case ACTION_TYPES.CHANGE_THEME:
      return {
        ...state,
        settings: {
          ...state.settings,
          theme: action.payload,
        },
      };

    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        ui: {
          ...state.ui,
          loading: action.payload,
        },
      };

    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        ui: {
          ...state.ui,
          error: action.payload,
          loading: false,
        },
      };

    case ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        ui: {
          ...state.ui,
          error: null,
        },
      };

    case ACTION_TYPES.SHOW_NOTIFICATION:
      return {
        ...state,
        ui: {
          ...state.ui,
          notification: action.payload,
        },
      };

    case ACTION_TYPES.HIDE_NOTIFICATION:
      return {
        ...state,
        ui: {
          ...state.ui,
          notification: null,
        },
      };

    case ACTION_TYPES.HYDRATE_STATE:
      return {
        ...state,
        ...action.payload,
      };

    case ACTION_TYPES.RESET_STATE:
      return initialState;

    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Storage keys
const STORAGE_KEYS = {
  USER_DATA: "@swiftlend_user_data",
  AUTH_TOKEN: "@swiftlend_auth_token",
  SETTINGS: "@swiftlend_settings",
  FINANCIAL_DATA: "@swiftlend_financial_data",
};

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from storage on app start
  useEffect(() => {
    loadStoredData();
  }, []);

  // Save data to storage when state changes
  useEffect(() => {
    saveDataToStorage();
  }, [state.user, state.auth, state.settings, state.financial]);

  const loadStoredData = async () => {
    try {
      const [userData, authToken, settings, financialData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER_DATA).catch(() => null),
        AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN).catch(() => null),
        AsyncStorage.getItem(STORAGE_KEYS.SETTINGS).catch(() => null),
        AsyncStorage.getItem(STORAGE_KEYS.FINANCIAL_DATA).catch(() => null),
      ]);

      const storedState = {};

      try {
        if (userData) {
          storedState.user = JSON.parse(userData);
        }
      } catch (e) {
        console.warn("Failed to parse user data:", e);
      }

      try {
        if (authToken) {
          const auth = JSON.parse(authToken);
          storedState.auth = { ...initialState.auth, ...auth };
        }
      } catch (e) {
        console.warn("Failed to parse auth token:", e);
      }

      try {
        if (settings) {
          storedState.settings = {
            ...initialState.settings,
            ...JSON.parse(settings),
          };
        }
      } catch (e) {
        console.warn("Failed to parse settings:", e);
      }

      try {
        if (financialData) {
          storedState.financial = {
            ...initialState.financial,
            ...JSON.parse(financialData),
          };
        }
      } catch (e) {
        console.warn("Failed to parse financial data:", e);
      }

      if (Object.keys(storedState).length > 0) {
        dispatch({ type: ACTION_TYPES.HYDRATE_STATE, payload: storedState });
      }
    } catch (error) {
      console.warn("Error loading stored data:", error);
    }
  };

  const saveDataToStorage = async () => {
    try {
      const savePromises = [
        AsyncStorage.setItem(
          STORAGE_KEYS.USER_DATA,
          JSON.stringify(state.user),
        ).catch((e) => console.warn("Failed to save user data:", e)),
        AsyncStorage.setItem(
          STORAGE_KEYS.AUTH_TOKEN,
          JSON.stringify({
            isAuthenticated: state.auth.isAuthenticated,
            token: state.auth.token,
            refreshToken: state.auth.refreshToken,
            biometricEnabled: state.auth.biometricEnabled,
            pinEnabled: state.auth.pinEnabled,
            isFirstLaunch: state.auth.isFirstLaunch,
          }),
        ).catch((e) => console.warn("Failed to save auth token:", e)),
        AsyncStorage.setItem(
          STORAGE_KEYS.SETTINGS,
          JSON.stringify(state.settings),
        ).catch((e) => console.warn("Failed to save settings:", e)),
        AsyncStorage.setItem(
          STORAGE_KEYS.FINANCIAL_DATA,
          JSON.stringify(state.financial),
        ).catch((e) => console.warn("Failed to save financial data:", e)),
      ];

      await Promise.all(savePromises);
    } catch (error) {
      console.warn("Error saving data to storage:", error);
    }
  };

  // Action creators
  const actions = {
    // Auth actions
    login: (userData, tokens) => {
      dispatch({
        type: ACTION_TYPES.LOGIN_SUCCESS,
        payload: { user: userData, ...tokens },
      });
    },

    logout: async () => {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
      dispatch({ type: ACTION_TYPES.LOGOUT });
    },

    setFirstLaunch: (isFirst) => {
      dispatch({ type: ACTION_TYPES.SET_FIRST_LAUNCH, payload: isFirst });
    },

    enableBiometric: (enabled) => {
      dispatch({ type: ACTION_TYPES.ENABLE_BIOMETRIC, payload: enabled });
    },

    // User actions
    updateProfile: (profileData) => {
      dispatch({
        type: ACTION_TYPES.UPDATE_USER_PROFILE,
        payload: profileData,
      });
    },

    // Financial actions
    updateCreditScore: (score) => {
      dispatch({ type: ACTION_TYPES.UPDATE_CREDIT_SCORE, payload: score });
    },

    updateFinancialInfo: (info) => {
      dispatch({ type: ACTION_TYPES.UPDATE_FINANCIAL_INFO, payload: info });
    },

    // Loan actions
    submitLoanApplication: (applicationData) => {
      const application = {
        id: Date.now().toString(),
        ...applicationData,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      dispatch({
        type: ACTION_TYPES.ADD_LOAN_APPLICATION,
        payload: application,
      });
      return application;
    },

    updateLoanStatus: (loanId, status) => {
      dispatch({
        type: ACTION_TYPES.UPDATE_LOAN_STATUS,
        payload: { id: loanId, status },
      });
    },

    // Transaction actions
    addTransaction: (transactionData) => {
      const transaction = {
        id: Date.now().toString(),
        ...transactionData,
        timestamp: new Date().toISOString(),
      };
      dispatch({ type: ACTION_TYPES.ADD_TRANSACTION, payload: transaction });
    },

    // Settings actions
    updateSettings: (settings) => {
      dispatch({ type: ACTION_TYPES.UPDATE_SETTINGS, payload: settings });
    },

    changeTheme: (theme) => {
      dispatch({ type: ACTION_TYPES.CHANGE_THEME, payload: theme });
    },

    // UI actions
    setLoading: (loading) => {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading });
    },

    setError: (error) => {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error });
    },

    clearError: () => {
      dispatch({ type: ACTION_TYPES.CLEAR_ERROR });
    },

    showNotification: (notification) => {
      dispatch({ type: ACTION_TYPES.SHOW_NOTIFICATION, payload: notification });
      // Auto hide after 3 seconds
      setTimeout(() => {
        dispatch({ type: ACTION_TYPES.HIDE_NOTIFICATION });
      }, 3000);
    },

    hideNotification: () => {
      dispatch({ type: ACTION_TYPES.HIDE_NOTIFICATION });
    },
  };

  const value = {
    state,
    dispatch,
    actions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

// Selector hooks for specific parts of state
export const useAuth = () => {
  const { state } = useApp();
  return state.auth;
};

export const useUser = () => {
  const { state } = useApp();
  return state.user;
};

export const useFinancial = () => {
  const { state } = useApp();
  return state.financial;
};

export const useLoans = () => {
  const { state } = useApp();
  return state.loans;
};

export const useSettings = () => {
  const { state } = useApp();
  return state.settings;
};

export const useUI = () => {
  const { state } = useApp();
  return state.ui;
};

export default AppContext;
