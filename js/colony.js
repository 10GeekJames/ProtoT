/**
 * AntColony manages a collection of ants and their behavior
 */
class AntColony {
    constructor(x, y, initialAnts = 20) {
        this.x = x;
        this.y = y;
        this.ants = [];
        this.maxAnts = 50;
        this.spawnRate = 0.02; // Probability per frame to spawn new ant
        this.foodCollected = 0;
        
        // Create initial ants
        for (let i = 0; i < initialAnts; i++) {
            this.addAnt();
        }
    }

    addAnt() {
        if (this.ants.length < this.maxAnts) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 20;
            const antX = this.x + Math.cos(angle) * distance;
            const antY = this.y + Math.sin(angle) * distance;
            
            const ant = new Ant(antX, antY, this);
            this.ants.push(ant);
        }
    }

    update(foodSources, pheromoneGrid) {
        // Update all ants
        this.ants.forEach(ant => {
            ant.update(foodSources, pheromoneGrid);
        });

        // Remove ants with no energy (optional feature)
        this.ants = this.ants.filter(ant => ant.energy > 0);

        // Occasionally spawn new ants if food is being collected
        if (Math.random() < this.spawnRate && this.foodCollected > this.ants.length / 4) {
            this.addAnt();
        }
    }

    render(ctx) {
        // Draw colony home
        ctx.fillStyle = 'rgba(139, 69, 19, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw all ants
        this.ants.forEach(ant => {
            ant.render(ctx);
        });
    }

    getAntCount() {
        return this.ants.length;
    }

    getFoodCollected() {
        return this.foodCollected;
    }
}