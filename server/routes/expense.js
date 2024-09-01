const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
// for adding expenses 
router.post('/', async (req, res) => {
    try {
        const newExpense = new Expense(req.body);
        const expense = await newExpense.save();
        res.status(201).json(expense)
    } catch (error) {
        res.status(500).json(error)
    }
})
// for getting all expenses list 
router.get('/', async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ createdAt: -1 })
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json(error)
    }
})
// for updating expense 
router.put('/:id', async (req, res) => {
    try {
        const expense = await Expense.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        )
        res.status(201).json(expense)
    } catch (error) {
        res.status(500).json(error)
    }
})

// for deleting any expense
router.delete('/:id', async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.status(201).json("Deleted Successfully")
    } catch (error) {
        res.status(500).json(error);
    }
})
module.exports = router;