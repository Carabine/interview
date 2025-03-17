const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const user1 = await prisma.user.create({
        data: {
            name: 'Nikita',
            email: 'nikita2@gmail.com',
            balance: 150.00,
        },
    });

    const user2 = await prisma.user.create({
        data: {
            name: 'Jane Smith',
            email: 'janesmith@example.com',
            balance: 200.00,
        },
    });

    const product1 = await prisma.product.create({
        data: {
            name: 'Laptop',
            price: 1200.00,
            stock: 50,
        },
    });

    const product2 = await prisma.product.create({
        data: {
            name: 'Headphones',
            price: 150.00,
            stock: 100,
        },
    });

    console.log('Seed data created successfully');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
