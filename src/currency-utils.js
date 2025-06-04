// currency-utils.js
// Centralized currency utilities with improved validation

/**
 * Standard exchange rates to use across the application
 */
export const EXCHANGE_RATES = {
  NOK: 1,
  USD: 0.09,  // 1 NOK = 0.09 USD
  GBP: 0.07,  // 1 NOK = 0.07 GBP
  EUR: 0.085, // 1 NOK = 0.085 EUR
  CNY: 0.65   // 1 NOK = 0.65 CNY
};

/**
 * Validate that a currency conversion won't result in an unreasonably large number
 * @param {number} amount - The amount to validate
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @return {boolean} - True if conversion is reasonable, false otherwise
 */
export function isReasonableConversion(amount, fromCurrency, toCurrency) {
  // Skip validation for NOK or if currencies are the same
  if (fromCurrency === toCurrency || amount === 0) {
    return true;
  }
  
  // Calculate approximate converted amount
  const amountInNOK = fromCurrency === 'NOK' 
    ? amount 
    : amount / EXCHANGE_RATES[fromCurrency];
    
  // Check if NOK amount is reasonable (less than 10 million NOK)
  if (amountInNOK > 10000000) {
    console.warn(`Potentially excessive currency conversion: ${amount} ${fromCurrency} converts to ${amountInNOK.toFixed(2)} NOK`);
    return false;
  }
  
  return true;
}

/**
 * Convert an amount from any currency to NOK
 * @param {number} amount - The amount to convert
 * @param {string} fromCurrency - Source currency code ('NOK', 'USD', 'GBP', etc.)
 * @return {number} - The amount in NOK
 */
export function toNOK(amount, fromCurrency) {
  if (!amount && amount !== 0) return 0;
  if (!fromCurrency || fromCurrency === 'NOK') return amount;
  
  if (!EXCHANGE_RATES[fromCurrency]) {
    console.warn(`Unknown currency: ${fromCurrency}, treating as NOK`);
    return amount;
  }
  
  // Add validation
  if (!isReasonableConversion(amount, fromCurrency, 'NOK')) {
    console.warn(`Excessive conversion detected: ${amount} ${fromCurrency}. Limiting to reasonable value.`);
    // Return a capped value to prevent excessive calculations
    return 10000000; // Cap at 10M NOK
  }
  
  return Math.round(amount / EXCHANGE_RATES[fromCurrency]);
}

/**
 * Convert an amount from NOK to another currency
 * @param {number} nokAmount - The amount in NOK to convert
 * @param {string} toCurrency - Target currency code ('NOK', 'USD', 'GBP', etc.)
 * @return {number} - The amount in the target currency
 */
export function fromNOK(nokAmount, toCurrency) {
  if (!nokAmount && nokAmount !== 0) return 0;
  if (!toCurrency || toCurrency === 'NOK') return nokAmount;
  
  if (!EXCHANGE_RATES[toCurrency]) {
    console.warn(`Unknown currency: ${toCurrency}, treating as NOK`);
    return nokAmount;
  }
  
  // Add validation
  if (!isReasonableConversion(nokAmount, 'NOK', toCurrency)) {
    console.warn(`Excessive conversion detected: ${nokAmount} NOK to ${toCurrency}. Limiting to reasonable value.`);
    // Return a capped value based on currency
    return Math.round(10000000 * EXCHANGE_RATES[toCurrency]); // Cap based on 10M NOK
  }
  
  return Math.round(nokAmount * EXCHANGE_RATES[toCurrency]);
}

/**
 * Format a currency amount with proper symbol and formatting
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code
 * @return {string} - Formatted currency string
 */
export function formatCurrency(amount, currency = 'NOK') {
  if (!amount && amount !== 0) return "";
  
  // Handle excessively large numbers
  if (amount > 1000000000) {
    console.warn(`Excessively large number for formatting: ${amount} ${currency}`);
    amount = 1000000000; // Cap at 1 billion
  }
  
  // Format with spaces as thousand separators
  const formattedAmount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  
  switch(currency) {
    case 'USD': return `${formattedAmount} USD`;
    case 'GBP': return `${formattedAmount} £`;
    case 'EUR': return `${formattedAmount} €`;
    case 'CNY': return `${formattedAmount} ¥`;
    case 'NOK':
    default:
      return `${formattedAmount} NOK`;
  }
}