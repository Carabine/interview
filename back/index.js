// Next time I will instantly skip a vacancy where I am asked to complete a to-do list test task for a middle position

const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const cors = require('cors');
require('dotenv').config();

const { calculateTotalPrice, checkUserBalance, checkStockAvailability } = require('./orderLogic');

const prisma = new PrismaClient();

const app = express();
app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: 'Too many requests, please try again later.',
});
app.use(limiter);

const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

app.use((err, req, res, next) => {
    logger.error(err.message);
    res.status(err.status || 500).send({ error: err.message });
});

app.post('/orders', async (req, res) => {
    try {
        req.body.quantity = Number(req.body.quantity);
        const { userId, productId, quantity } = req.body;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const totalPrice = calculateTotalPrice(product.price, quantity);

        const hasSufficientBalance = await checkUserBalance(user, totalPrice);
        if (!hasSufficientBalance) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        const isStockAvailable = await checkStockAvailability(product, quantity);
        if (!isStockAvailable) {
            return res.status(400).json({ error: 'Out of stock' });
        }

        const order = await prisma.$transaction(async (prisma) => {
            await prisma.user.update({
                where: { id: userId },
                data: { balance: user.balance - totalPrice },
            });

            await prisma.product.update({
                where: { id: productId },
                data: { stock: product.stock - quantity },
            });

            return prisma.order.create({
                data: {
                    userId,
                    productId,
                    quantity,
                    totalPrice,
                },
            });
        });

        res.status(201).json(order);
    } catch (error) {
        logger.error('Error creating order:', error.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.get('/orders/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const orders = await prisma.order.findMany({
            where: { userId },
            include: { product: true },
        });

        res.json(orders);
    } catch (error) {
        logger.error('Error fetching orders:', error.message);
        res.status(500).json({ error: 'Failed to retrieve orders' });
    }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
