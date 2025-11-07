// Loan calculation utilities

// Calculate monthly payment using compound interest formula
export const calculateMonthlyPayment = (principal, annualRate, durationMonths) => {
  if (!principal || !annualRate || !durationMonths || principal <= 0 || annualRate < 0 || durationMonths <= 0) {
    return 0;
  }

  const monthlyRate = annualRate / 12;

  if (monthlyRate === 0) {
    return principal / durationMonths;
  }

  const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, durationMonths);
  const denominator = Math.pow(1 + monthlyRate, durationMonths) - 1;

  return numerator / denominator;
};

// Calculate total interest over the loan term
export const calculateTotalInterest = (principal, annualRate, durationMonths) => {
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, durationMonths);
  const totalPayments = monthlyPayment * durationMonths;
  return totalPayments - principal;
};

// Calculate total amount to be repaid
export const calculateTotalRepayment = (principal, annualRate, durationMonths) => {
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, durationMonths);
  return monthlyPayment * durationMonths;
};

// Generate amortization schedule
export const generateAmortizationSchedule = (principal, annualRate, durationMonths) => {
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, durationMonths);
  const monthlyRate = annualRate / 12;

  const schedule = [];
  let remainingBalance = principal;

  for (let month = 1; month <= durationMonths; month++) {
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    remainingBalance -= principalPayment;

    // Ensure remaining balance doesn't go negative due to rounding
    if (remainingBalance < 0.01) {
      remainingBalance = 0;
    }

    schedule.push({
      month,
      monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
      principalPayment: parseFloat(principalPayment.toFixed(2)),
      interestPayment: parseFloat(interestPayment.toFixed(2)),
      remainingBalance: parseFloat(remainingBalance.toFixed(2)),
    });
  }

  return schedule;
};

// Calculate effective annual rate (APR)
export const calculateAPR = (principal, totalRepayment, durationMonths, fees = 0) => {
  const totalCost = totalRepayment + fees;
  const netPrincipal = principal - fees;

  if (netPrincipal <= 0 || durationMonths <= 0) return 0;

  const monthlyRate = Math.pow(totalCost / netPrincipal, 1 / durationMonths) - 1;
  return monthlyRate * 12;
};

// Calculate processing fee
export const calculateProcessingFee = (principal, feeRate = 0.02) => {
  return principal * feeRate;
};

// Calculate debt-to-income ratio
export const calculateDebtToIncomeRatio = (monthlyDebt, monthlyIncome) => {
  if (!monthlyIncome || monthlyIncome <= 0) return 0;
  return (monthlyDebt / monthlyIncome) * 100;
};

// Calculate loan affordability based on income
export const calculateAffordableLoanAmount = (monthlyIncome, annualRate, durationMonths, debtToIncomeLimit = 0.4) => {
  const maxMonthlyPayment = monthlyIncome * debtToIncomeLimit;

  if (annualRate <= 0 || durationMonths <= 0) return 0;

  const monthlyRate = annualRate / 12;
  const denominator = monthlyRate * Math.pow(1 + monthlyRate, durationMonths);
  const numerator = Math.pow(1 + monthlyRate, durationMonths) - 1;

  return (maxMonthlyPayment * numerator) / denominator;
};

// Calculate credit utilization ratio
export const calculateCreditUtilization = (currentBalance, creditLimit) => {
  if (!creditLimit || creditLimit <= 0) return 0;
  return (currentBalance / creditLimit) * 100;
};

// Calculate compound interest (for savings/investments)
export const calculateCompoundInterest = (principal, annualRate, compoundingFrequency, years) => {
  if (!principal || !annualRate || !compoundingFrequency || !years) return 0;

  const rate = annualRate / compoundingFrequency;
  const time = compoundingFrequency * years;

  return principal * Math.pow(1 + rate, time);
};

// Calculate simple interest
export const calculateSimpleInterest = (principal, annualRate, years) => {
  return principal * annualRate * years;
};

// Calculate loan comparison metrics
export const compareLoanOffers = (offers) => {
  return offers.map(offer => {
    const { principal, annualRate, durationMonths, processingFee = 0 } = offer;

    const monthlyPayment = calculateMonthlyPayment(principal, annualRate, durationMonths);
    const totalInterest = calculateTotalInterest(principal, annualRate, durationMonths);
    const totalRepayment = calculateTotalRepayment(principal, annualRate, durationMonths);
    const apr = calculateAPR(principal, totalRepayment, durationMonths, processingFee);
    const totalCost = totalRepayment + processingFee;

    return {
      ...offer,
      monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
      totalInterest: parseFloat(totalInterest.toFixed(2)),
      totalRepayment: parseFloat(totalRepayment.toFixed(2)),
      totalCost: parseFloat(totalCost.toFixed(2)),
      apr: parseFloat((apr * 100).toFixed(2)),
      savings: 0, // Will be calculated relative to most expensive option
    };
  }).map((offer, index, array) => {
    const maxCost = Math.max(...array.map(o => o.totalCost));
    return {
      ...offer,
      savings: parseFloat((maxCost - offer.totalCost).toFixed(2))
    };
  });
};

// Calculate early payment savings
export const calculateEarlyPaymentSavings = (remainingBalance, annualRate, remainingMonths, extraPayment) => {
  const monthlyRate = annualRate / 12;
  const regularPayment = calculateMonthlyPayment(remainingBalance, annualRate, remainingMonths);
  const newPayment = regularPayment + extraPayment;

  // Calculate time to pay off with extra payment
  const newMonths = Math.ceil(
    Math.log(1 + (remainingBalance * monthlyRate) / newPayment) /
    Math.log(1 + monthlyRate)
  );

  const regularTotalPayment = regularPayment * remainingMonths;
  const newTotalPayment = newPayment * newMonths;

  return {
    monthsSaved: remainingMonths - newMonths,
    interestSaved: parseFloat((regularTotalPayment - newTotalPayment).toFixed(2)),
    newPayoffDate: new Date(Date.now() + newMonths * 30 * 24 * 60 * 60 * 1000),
    originalPayoffDate: new Date(Date.now() + remainingMonths * 30 * 24 * 60 * 60 * 1000),
  };
};

// Calculate credit score impact estimation
export const estimateCreditScoreImpact = (currentScore, loanAmount, monthlyIncome, currentDebt = 0) => {
  let scoreChange = 0;

  // Debt-to-income impact
  const newDebtToIncome = calculateDebtToIncomeRatio(currentDebt + loanAmount / 12, monthlyIncome);
  if (newDebtToIncome > 40) {
    scoreChange -= 20;
  } else if (newDebtToIncome > 30) {
    scoreChange -= 10;
  } else if (newDebtToIncome < 20) {
    scoreChange += 5;
  }

  // Credit mix improvement (assuming this adds to credit mix)
  scoreChange += 10;

  // Hard inquiry impact
  scoreChange -= 5;

  const newScore = Math.max(300, Math.min(850, currentScore + scoreChange));

  return {
    currentScore,
    estimatedNewScore: newScore,
    scoreChange,
    impactFactors: {
      debtToIncome: newDebtToIncome,
      creditMixImprovement: 10,
      hardInquiry: -5,
    }
  };
};

// Calculate break-even point for refinancing
export const calculateRefinanceBreakEven = (currentLoan, newLoan, refinancingCosts) => {
  const currentMonthly = calculateMonthlyPayment(
    currentLoan.balance,
    currentLoan.annualRate,
    currentLoan.remainingMonths
  );

  const newMonthly = calculateMonthlyPayment(
    newLoan.principal,
    newLoan.annualRate,
    newLoan.durationMonths
  );

  const monthlySavings = currentMonthly - newMonthly;

  if (monthlySavings <= 0) {
    return {
      breakEvenMonths: null,
      totalSavings: 0,
      recommendation: 'Refinancing not recommended - no monthly savings'
    };
  }

  const breakEvenMonths = Math.ceil(refinancingCosts / monthlySavings);
  const totalSavingsOverTerm = (monthlySavings * newLoan.durationMonths) - refinancingCosts;

  return {
    breakEvenMonths,
    monthlySavings: parseFloat(monthlySavings.toFixed(2)),
    totalSavings: parseFloat(totalSavingsOverTerm.toFixed(2)),
    recommendation: breakEvenMonths <= 12 ? 'Recommended' :
                   breakEvenMonths <= 24 ? 'Consider carefully' : 'Not recommended'
  };
};

export default {
  calculateMonthlyPayment,
  calculateTotalInterest,
  calculateTotalRepayment,
  generateAmortizationSchedule,
  calculateAPR,
  calculateProcessingFee,
  calculateDebtToIncomeRatio,
  calculateAffordableLoanAmount,
  calculateCreditUtilization,
  calculateCompoundInterest,
  calculateSimpleInterest,
  compareLoanOffers,
  calculateEarlyPaymentSavings,
  estimateCreditScoreImpact,
  calculateRefinanceBreakEven,
};
