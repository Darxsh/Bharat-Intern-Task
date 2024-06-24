const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');

// Get all transactions
router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new transaction
router.post('/', async (req, res) => {
    const { type, amount, description } = req.body;
    const newTransaction = new Transaction({ type, amount, description });

    try {
        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a transaction
router.delete('/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

        await transaction.remove();
        res.json({ message: 'Transaction removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
