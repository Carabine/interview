const request = require('supertest');
const app = require('./index.js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('POST /orders', () => {
    let user, product, user2;

    beforeAll(async () => {
        const email = `test_${Date.now()}@example.com`;  // Unique email for each test run

        user = await prisma.user.create({
            data: {
                name: 'Test User',
                email,
                balance: 100,
            },
        });

        const email2 = `test_${Date.now()}@example.com`;  // Unique email for each test run

        user2 = await prisma.user.create({
            data: {
                name: 'Test User 2',
                email: email2,
                balance: 200,
            },
        });

        product = await prisma.product.create({
            data: {
                name: 'Test Product',
                price: 20,
                stock: 5,
            },
        });
    });

    afterAll(async () => {
        await prisma.order.deleteMany({ where: { userId: user.id } });
        await prisma.product.delete({ where: { id: product.id } });
        await prisma.user.delete({ where: { id: user.id } });
        await prisma.user.delete({ where: { id: user2.id } });

        await prisma.$disconnect();
    });

    test('should create an order when balance and stock are sufficient', async () => {
        const response = await request(app)
            .post('/orders')
            .send({
                userId: user.id,
                productId: product.id,
                quantity: 2,
            });

        expect(response.status).toBe(201);
        expect(response.body.totalPrice).toBe("40");
    });

    it('should return 400 if the user has insufficient balance', async () => {
        const quantity = 6;
        const response = await request(app)
            .post('/orders')
            .send({
                userId: user.id,
                productId: product.id,
                quantity,
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Insufficient balance');
    });

    it('should return 400 if the product is out of stock', async () => {
        const quantity = 6;
        const response = await request(app)
            .post('/orders')
            .send({
                userId: user2.id,
                productId: product.id,
                quantity,
            });
        console.log(response.body.error)

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Out of stock');
    });
});
