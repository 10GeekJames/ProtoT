/**
 * Pheromone system for ant trail communication
 */
class Pheromone {
    constructor(x, y, strength = 1.0, type = 'home') {
        this.x = x;
        this.y = y;
        this.strength = strength;
        this.type = type; // 'home' or 'food'
        this.maxStrength = strength;
        this.evaporationRate = 0.005; // How fast pheromones evaporate
        this.age = 0;
    }

    update() {
        this.age++;
        this.strength -= this.evaporationRate;
        return this.strength > 0.01; // Return false when pheromone should be removed
    }

    getIntensity() {
        return Math.max(0, this.strength);
    }
}

class PheromoneGrid {
    constructor(width, height, cellSize = 10) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.cols = Math.ceil(width / cellSize);
        this.rows = Math.ceil(height / cellSize);
        this.grid = [];
        
        // Initialize grid
        for (let i = 0; i < this.rows; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.grid[i][j] = [];
            }
        }
    }

    addPheromone(x, y, strength = 1.0, type = 'home') {
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);
        
        if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
            this.grid[row][col].push(new Pheromone(x, y, strength, type));
        }
    }

    getPheromoneStrength(x, y, type = 'home', radius = 20) {
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);
        let totalStrength = 0;
        let count = 0;

        // Check surrounding cells
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
                    this.grid[r][c].forEach(pheromone => {
                        if (pheromone.type === type) {
                            const distance = Math.sqrt((x - pheromone.x) ** 2 + (y - pheromone.y) ** 2);
                            if (distance <= radius) {
                                totalStrength += pheromone.getIntensity() * (1 - distance / radius);
                                count++;
                            }
                        }
                    });
                }
            }
        }

        return count > 0 ? totalStrength / count : 0;
    }

    update() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.grid[i][j] = this.grid[i][j].filter(pheromone => pheromone.update());
            }
        }
    }

    getAllPheromones() {
        const allPheromones = [];
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                allPheromones.push(...this.grid[i][j]);
            }
        }
        return allPheromones;
    }
}