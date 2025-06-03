// currency-utils.js
// Simple centralized currency utilities for consistent handling

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