// DOM Elements
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseList = document.getElementById('expense-list');
const totalAmount = document.getElementById('total-amount');
const suggestionsList = document.getElementById('suggestions-list');

// Load expenses from Local Storage on page load
document.addEventListener('DOMContentLoaded', loadExpenses);

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Add a new expense
function addExpense() {
  const name = expenseNameInput.value.trim();
  const amount = parseFloat(expenseAmountInput.value);

  if (name === '' || isNaN(amount) || amount <= 0) {
    alert('Please enter a valid name and amount.');
    return;
  }

  const expense = { id: Date.now(), name, amount };
  expenses.push(expense);
  saveExpenses();
  renderExpense(expense);
  updateTotal();
  generateSuggestions();

  // Clear input fields
  expenseNameInput.value = '';
  expenseAmountInput.value = '';
}

// Render an expense item in the list
function renderExpense(expense) {
  const li = document.createElement('li');
  li.innerHTML = `
    ${expense.name}: $${expense.amount.toFixed(2)}
    <span class="delete-btn" onclick="deleteExpense(${expense.id})">X</span>
  `;
  expenseList.appendChild(li);
}

// Delete an expense by ID
function deleteExpense(id) {
  expenses = expenses.filter(expense => expense.id !== id);
  saveExpenses();
  loadExpenses();
  updateTotal();
  generateSuggestions();
}

// Save expenses to Local Storage
function saveExpenses() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Load expenses from Local Storage
function loadExpenses() {
  expenseList.innerHTML = '';
  expenses.forEach(expense => renderExpense(expense));
  updateTotal();
  generateSuggestions();
}

// Calculate and update total amount
function updateTotal() {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  totalAmount.textContent = total.toFixed(2);
}

// Generate suggestions based on spending patterns
function generateSuggestions() {
  const categories = {};
  suggestionsList.innerHTML = '';

  // Categorize expenses by name and sum their amounts
  expenses.forEach(expense => {
    if (categories[expense.name]) {
      categories[expense.name] += expense.amount;
    } else {
      categories[expense.name] = expense.amount;
    }
  });

  // Display suggestions based on high-spending categories
  for (const category in categories) {
    if (categories[category] > 100) {  // Threshold for suggesting minimization
      const li = document.createElement('li');
      li.textContent = `Consider reducing expenses in "${category}" as it totals $${categories[category].toFixed(2)}`;
      suggestionsList.appendChild(li);
    }
  }

  // General suggestion if total spending exceeds a certain amount
  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  if (totalExpense > 500) {
    const li = document.createElement('li');
    li.textContent = "Consider reducing overall expenses, as total spending exceeds $500.";
    suggestionsList.appendChild(li);
  }
}
