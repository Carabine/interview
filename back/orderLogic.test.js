const { calculateTotalPrice, checkUserBalance } = require('./orderLogic.js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Order Business Logic', () => {

    const user = {
        id: 'f87efd8d-769f-4467-a317-6e462df80b8d',
        balance: 100.0,
    };

    const product = {
        id: 'f161dfde-c308-4a2f-95cf-7b6a61dc590d',
        price: 20.0,
        stock: 5,
    };

    it('should calculate the total price correctly', () => {
        const quantity = 3;
        const totalPrice = calculateTotalPrice(product.price, quantity);
        expect(totalPrice).toBe(60);
    });

    it('should check if user has enough balance', async () => {
        const quantity = 3;
        const totalPrice = calculateTotalPrice(product.price, quantity);

        const hasBalance = await checkUserBalance(user, totalPrice);
        expect(hasBalance).toBe(true);

        const insufficientTotalPrice = 120;
        const hasInsufficientBalance = await checkUserBalance(user, insufficientTotalPrice);
        expect(hasInsufficientBalance).toBe(false);
    });
});
