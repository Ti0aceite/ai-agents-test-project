// Utility functions

function validateEmail(email) {
  // TODO: implement proper email validation
  return email.includes('@');
}

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

// Unused function
function deprecatedHelper() {
  console.log('This function is never called');
  return null;
}

// Another unused function
function oldCalculation(a, b, c) {
  return (a + b) * c / 2;
}

const API_KEY = 'sk-test-1234567890abcdef'; // Hardcoded API key!

module.exports = { validateEmail, formatPrice, API_KEY };
