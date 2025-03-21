// Initialize Chart.js graph
let financeGraph;
let currentDataType = 'balance';
let currentTimeRange = 'day';

// Get real financial data from localStorage
function getFinancialData() {
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const incomes = JSON.parse(localStorage.getItem('incomes') || '[]');
    return { expenses, incomes };
}

// Generate data based on real financial records
function generateRealData(timeRange) {
    const { expenses, incomes } = getFinancialData();
    const data = [];
    const labels = [];
    const now = new Date();
    let points;
    let startDate;

    switch(timeRange) {
        case 'day':
            points = 24;
            startDate = new Date(now - 24 * 3600000);
            for(let i = 0; i < points; i++) {
                const time = new Date(startDate.getTime() + i * 3600000);
                labels.push(time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
                
                const periodExpenses = expenses.filter(e => {
                    const expenseDate = new Date(e.date);
                    return expenseDate >= time && expenseDate < new Date(time.getTime() + 3600000);
                }).reduce((sum, e) => sum + e.amount, 0);
                
                const periodIncomes = incomes.filter(inc => {
                    const incomeDate = new Date(inc.date);
                    return incomeDate >= time && incomeDate < new Date(time.getTime() + 3600000);
                }).reduce((sum, inc) => sum + inc.amount, 0);
                
                data.push(currentDataType === 'expenses' ? periodExpenses : 
                         currentDataType === 'incomes' ? periodIncomes : 
                         periodIncomes - periodExpenses);
            }
            break;
        case 'week':
            points = 7;
            startDate = new Date(now - 7 * 86400000);
            for(let i = 0; i < points; i++) {
                const time = new Date(startDate.getTime() + i * 86400000);
                labels.push(time.toLocaleDateString('en-US', { weekday: 'short' }));
                
                const periodExpenses = expenses.filter(e => {
                    const expenseDate = new Date(e.date);
                    return expenseDate >= time && expenseDate < new Date(time.getTime() + 86400000);
                }).reduce((sum, e) => sum + e.amount, 0);
                
                const periodIncomes = incomes.filter(inc => {
                    const incomeDate = new Date(inc.date);
                    return incomeDate >= time && incomeDate < new Date(time.getTime() + 86400000);
                }).reduce((sum, inc) => sum + inc.amount, 0);
                
                data.push(currentDataType === 'expenses' ? periodExpenses : 
                         currentDataType === 'incomes' ? periodIncomes : 
                         periodIncomes - periodExpenses);
            }
            break;
        case 'month':
            points = 30;
            startDate = new Date(now - 30 * 86400000);
            for(let i = 0; i < points; i++) {
                const time = new Date(startDate.getTime() + i * 86400000);
                labels.push(time.getDate().toString());
                
                const periodExpenses = expenses.filter(e => {
                    const expenseDate = new Date(e.date);
                    return expenseDate >= time && expenseDate < new Date(time.getTime() + 86400000);
                }).reduce((sum, e) => sum + e.amount, 0);
                
                const periodIncomes = incomes.filter(inc => {
                    const incomeDate = new Date(inc.date);
                    return incomeDate >= time && incomeDate < new Date(time.getTime() + 86400000);
                }).reduce((sum, inc) => sum + inc.amount, 0);
                
                data.push(currentDataType === 'expenses' ? periodExpenses : 
                         currentDataType === 'incomes' ? periodIncomes : 
                         periodIncomes - periodExpenses);
            }
            break;
        case 'year':
            points = 12;
            for(let i = 0; i < points; i++) {
                const time = new Date(now.getFullYear(), i, 1);
                labels.push(time.toLocaleDateString('en-US', { month: 'short' }));
                
                const monthEnd = new Date(now.getFullYear(), i + 1, 0);
                const periodExpenses = expenses.filter(e => {
                    const expenseDate = new Date(e.date);
                    return expenseDate >= time && expenseDate <= monthEnd;
                }).reduce((sum, e) => sum + e.amount, 0);
                
                const periodIncomes = incomes.filter(inc => {
                    const incomeDate = new Date(inc.date);
                    return incomeDate >= time && incomeDate <= monthEnd;
                }).reduce((sum, inc) => sum + inc.amount, 0);
                
                data.push(currentDataType === 'expenses' ? periodExpenses : 
                         currentDataType === 'incomes' ? periodIncomes : 
                         periodIncomes - periodExpenses);
            }
            break;
    }
    return { labels, data };
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Initialize the graph
function initializeGraph() {
    const ctx = document.getElementById('financeGraph').getContext('2d');
    const { labels, data } = generateRealData(currentTimeRange);
    
    financeGraph = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Balance',
                data: data,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });

    // Set up storage event listener for real-time updates
    window.addEventListener('storage', function(e) {
        if (e.key === 'expenses' || e.key === 'incomes') {
            updateGraph();
        }
    });

    // Update graph periodically
    setInterval(updateGraph, 60000); // Update every minute
}

// Update graph data
function updateGraph() {
    const { labels, data } = generateRealData(currentTimeRange);
    
    financeGraph.data.labels = labels;
    financeGraph.data.datasets[0].data = data;
    financeGraph.data.datasets[0].label = currentDataType.charAt(0).toUpperCase() + currentDataType.slice(1);
    
    // Update colors based on data type
    switch(currentDataType) {
        case 'balance':
            financeGraph.data.datasets[0].borderColor = '#4CAF50';
            financeGraph.data.datasets[0].backgroundColor = 'rgba(76, 175, 80, 0.1)';
            break;
        case 'income':
            financeGraph.data.datasets[0].borderColor = '#2196F3';
            financeGraph.data.datasets[0].backgroundColor = 'rgba(33, 150, 243, 0.1)';
            break;
        case 'expenses':
            financeGraph.data.datasets[0].borderColor = '#F44336';
            financeGraph.data.datasets[0].backgroundColor = 'rgba(244, 67, 54, 0.1)';
            break;
    }
    
    financeGraph.update();
}

// Set up event listeners for time range and data type controls
document.getElementById('timeRange').addEventListener('change', function(e) {
    currentTimeRange = e.target.value;
    updateGraph();
});

document.getElementById('dataType').addEventListener('change', function(e) {
    currentDataType = e.target.value;
    updateGraph();
});

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Ensure the canvas element exists before initializing
    const canvas = document.getElementById('financeGraph');
    if (canvas) {
        initializeGraph();
        
        // Time range selector
        const timeRangeSelect = document.getElementById('timeRange');
        if (timeRangeSelect) {
            timeRangeSelect.addEventListener('change', (e) => {
                currentTimeRange = e.target.value;
                updateGraph();
            });
        }
        
        // Data type selector
        const dataTypeSelect = document.getElementById('dataType');
        if (dataTypeSelect) {
            dataTypeSelect.addEventListener('change', (e) => {
                currentDataType = e.target.value;
                updateGraph();
            });
        }
        
        // Update current balance from actual data
        const balanceElement = document.getElementById('currentBalance');
        if (balanceElement) {
            const { expenses, incomes } = getFinancialData();
            const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
            const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
            const currentBalance = totalIncome - totalExpenses;
            balanceElement.textContent = formatCurrency(currentBalance);

            // Update today's change
            const todayChangeElement = document.getElementById('todayChange');
            if (todayChangeElement) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const todayIncome = incomes
                    .filter(inc => new Date(inc.date) >= today)
                    .reduce((sum, inc) => sum + inc.amount, 0);
                const todayExpenses = expenses
                    .filter(exp => new Date(exp.date) >= today)
                    .reduce((sum, exp) => sum + exp.amount, 0);
                const todayChange = todayIncome - todayExpenses;
                todayChangeElement.textContent = formatCurrency(todayChange);
                todayChangeElement.style.color = todayChange >= 0 ? '#4CAF50' : '#F44336';
            }

            // Update trend
            const trendElement = document.getElementById('trend');
            if (trendElement) {
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayIncome = incomes
                    .filter(inc => new Date(inc.date) >= yesterday && new Date(inc.date) < today)
                    .reduce((sum, inc) => sum + inc.amount, 0);
                const yesterdayExpenses = expenses
                    .filter(exp => new Date(exp.date) >= yesterday && new Date(exp.date) < today)
                    .reduce((sum, exp) => sum + exp.amount, 0);
                const yesterdayChange = yesterdayIncome - yesterdayExpenses;
                
                if (Math.abs(todayChange - yesterdayChange) < 100) {
                    trendElement.textContent = 'Stable';
                    trendElement.style.color = '#4CAF50';
                } else if (todayChange > yesterdayChange) {
                    trendElement.textContent = 'Upward';
                    trendElement.style.color = '#2196F3';
                } else {
                    trendElement.textContent = 'Downward';
                    trendElement.style.color = '#F44336';
                }
            }
        }
    } else {
        console.error('Canvas element not found');
    }
});