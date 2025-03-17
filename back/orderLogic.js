function calculateTotalPrice(price, quantity) {
    return price * quantity;
}

async function checkUserBalance(user, totalPrice) {
    return user.balance >= totalPrice;
}

async function checkStockAvailability(product, quantity) {
    return product.stock >= quantity;
}

module.exports = {
    calculateTotalPrice,
    checkUserBalance,
    checkStockAvailability,
};
