/**
 * Food class represents food sources for ants
 */
class Food {
    constructor(x, y, amount = 100) {
        this.x = x;
        this.y = y;
        this.amount = amount;
        this.initialAmount = amount;
        this.radius = Math.min(15, Math.max(5, amount / 10)); // Size based on amount
        this.consumed = false;
    }

    takeFood(amount = 1) {
        if (this.amount > 0) {
            const taken = Math.min(amount, this.amount);
            this.amount -= taken;
            
            if (this.amount <= 0) {
                this.consumed = true;
            }
            
            return taken;
        }
        return 0;
    }

    getAmount() {
        return this.amount;
    }

    isConsumed() {
        return this.consumed;
    }

    getRadius() {
        return this.radius;
    }

    // Check if a point is within the food's pickup range
    isInRange(x, y, range = 8) {
        const distance = Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
        return distance <= range;
    }
}