const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const transactionList = document.getElementById('transaction-list');
const transactionForm = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');

const API_URL = '/api/transactions';

let transactions = [];
let deleteTransactionId = null;

async function fetchTransactions() {
    const res = await fetch(API_URL);
    const data = await res.json();
    transactions = data;
    renderTransactions();
    updateBalance();
}

function renderTransactions() {
    transactionList.innerHTML = '';
    transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.classList.add(transaction.type);
        li.innerHTML = `
            ${transaction.description} <span>${transaction.type === 'income' ? '+' : '-'}$${transaction.amount}</span>
            <button class="delete-btn" onclick="confirmDeleteTransaction('${transaction._id}')">x</button>
        `;
        transactionList.appendChild(li);
    });
}

function updateBalance() {
    const incomeTotal = transactions
        .filter(transaction => transaction.type === 'income')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
    const expenseTotal = transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
    const totalBalance = incomeTotal - expenseTotal;

    balance.innerText = totalBalance.toFixed(2);
    income.innerText = incomeTotal.toFixed(2);
    expense.innerText = expenseTotal.toFixed(2);
}

transactionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newTransaction = {
        description: descriptionInput.value,
        amount: parseFloat(amountInput.value),
        type: typeSelect.value
    };

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTransaction)
    });
    const data = await res.json();
    transactions.push(data);
    renderTransactions();
    updateBalance();

    descriptionInput.value = '';
    amountInput.value = '';
});

async function deleteTransaction(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    transactions = transactions.filter(transaction => transaction._id !== id);
    renderTransactions();
    updateBalance();
    closeModal();
}

function confirmDeleteTransaction(id) {
    deleteTransactionId = id;
    openModal();
}

function openModal() {
    document.getElementById('delete-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('delete-modal').style.display = 'none';
}

document.getElementById('confirm-delete-btn').addEventListener('click', () => {
    deleteTransaction(deleteTransactionId);
});

document.getElementById('cancel-delete-btn').addEventListener('click', closeModal);
document.querySelector('.close-btn').addEventListener('click', closeModal);

function changeTheme(theme) {
    document.body.className = theme;
}

fetchTransactions();

