/**
 * Renderer handles all canvas drawing operations
 */
class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.showPheromones = true;
        this.pheromoneAlpha = 0.3;
    }

    clear() {
        this.ctx.fillStyle = '#2d5a2d';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    renderPheromones(pheromoneGrid) {
        if (!this.showPheromones) return;

        const pheromones = pheromoneGrid.getAllPheromones();
        
        pheromones.forEach(pheromone => {
            const intensity = pheromone.getIntensity();
            if (intensity > 0.05) {
                this.ctx.globalAlpha = intensity * this.pheromoneAlpha;
                
                if (pheromone.type === 'food') {
                    this.ctx.fillStyle = '#4ecdc4'; // Blue-green for food trails
                } else {
                    this.ctx.fillStyle = '#ff6b6b'; // Red for home trails
                }
                
                this.ctx.beginPath();
                this.ctx.arc(pheromone.x, pheromone.y, 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
        
        this.ctx.globalAlpha = 1.0;
    }

    renderFood(foodSources) {
        foodSources.forEach(food => {
            if (!food.isConsumed()) {
                const ratio = food.getAmount() / food.initialAmount;
                const radius = food.getRadius() * ratio;
                
                // Draw food with size based on remaining amount
                this.ctx.fillStyle = '#4ecdc4';
                this.ctx.beginPath();
                this.ctx.arc(food.x, food.y, radius, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Add a darker border
                this.ctx.strokeStyle = '#2c7a7a';
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
        });
    }

    renderColony(colony) {
        colony.render(this.ctx);
    }

    renderUI(colony, foodSources) {
        // Update HTML elements instead of drawing on canvas
        document.getElementById('antCount').textContent = `Ants: ${colony.getAntCount()}`;
        document.getElementById('foodCount').textContent = `Food: ${foodSources.filter(f => !f.isConsumed()).length}`;
        document.getElementById('foodCollected').textContent = `Collected: ${colony.getFoodCollected()}`;
    }

    render(colony, foodSources, pheromoneGrid) {
        this.clear();
        this.renderPheromones(pheromoneGrid);
        this.renderFood(foodSources);
        this.renderColony(colony);
        this.renderUI(colony, foodSources);
    }

    togglePheromones() {
        this.showPheromones = !this.showPheromones;
    }
}