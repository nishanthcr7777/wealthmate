// Initialize variables to store financial data
let expenses = [];
let incomes = [];

// DOM Elements
const expenseDescription = document.getElementById('expense-description');
const expenseAmount = document.getElementById('expense-amount');
const incomeDescription = document.getElementById('income-description');
const incomeAmount = document.getElementById('income-amount');
const totalIncomeElement = document.getElementById('total-income');
const totalBudgetElement = document.getElementById('total-budget');
const balanceElement = document.getElementById('balance');
const expenseList = document.getElementById('expense-list');
const incomeList = document.getElementById('income-list');

// Load data from localStorage
function loadData() {
    const savedExpenses = localStorage.getItem('expenses');
    const savedIncomes = localStorage.getItem('incomes');
    
    if (savedExpenses) expenses = JSON.parse(savedExpenses);
    if (savedIncomes) incomes = JSON.parse(savedIncomes);
    
    updateUI();
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('incomes', JSON.stringify(incomes));
}

// Add new expense
function addExpense() {
    const description = expenseDescription.value.trim();
    const amount = parseFloat(expenseAmount.value);
    
    if (description && amount > 0) {
        expenses.push({ description, amount, date: new Date().toISOString() });
        expenseDescription.value = '';
        expenseAmount.value = '';
        
        saveData();
        updateUI();
        
        // Add animation class to total budget card
        const budgetCard = document.getElementById('total-budget-card');
        budgetCard.classList.add('update-animation');
        setTimeout(() => budgetCard.classList.remove('update-animation'), 300);
    } else {
        alert("Please enter a valid expense description and amount.");
    }
}

// Add new income
function addIncome() {
    const description = incomeDescription.value.trim();
    const amount = parseFloat(incomeAmount.value);
    
    if (description && amount > 0) {
        incomes.push({ description, amount, date: new Date().toISOString() });
        incomeDescription.value = '';
        incomeAmount.value = '';
        
        saveData();
        updateUI();
        
        // Add animation class to income card
        const incomeCard = document.getElementById('total-income-card');
        incomeCard.classList.add('update-animation');
        setTimeout(() => incomeCard.classList.remove('update-animation'), 300);
    } else {
        alert("Please enter a valid income description and amount.");
    }
}

// Calculate totals
function calculateTotals() {
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const balance = totalIncome - totalExpenses;
    
    return { totalIncome, totalExpenses, balance };
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount);
}

// Update UI elements
function updateUI() {
    const { totalIncome, totalExpenses, balance } = calculateTotals();
    
    totalIncomeElement.textContent = formatCurrency(totalIncome);
    totalBudgetElement.textContent = formatCurrency(totalExpenses);
    balanceElement.textContent = formatCurrency(balance);
    
    // Update expense list
    expenseList.innerHTML = '';
    expenses.slice().reverse().forEach(expense => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${expense.description}</span>
            <span>${formatCurrency(expense.amount)}</span>
        `;
        expenseList.appendChild(li);
    });
    
    // Update card colors based on balance
    const balanceCard = document.getElementById('balance-card');
    if (balance < 0) {
        balanceCard.style.color = 'var(--danger)';
    } else {
        balanceCard.style.color = 'var(--success)';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', loadData);

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        if (document.activeElement === expenseAmount || 
            document.activeElement === expenseDescription) {
            addExpense();
        } else if (document.activeElement === incomeAmount || 
                   document.activeElement === incomeDescription) {
            addIncome();
        }
    }
});