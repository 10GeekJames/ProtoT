/**
 * Main simulation controller
 */
class AntSimulation {
    constructor() {
        this.canvas = document.getElementById('simulationCanvas');
        this.renderer = new Renderer(this.canvas);
        
        // Simulation state
        this.running = false;
        this.colony = new AntColony(100, 300); // Colony position
        this.foodSources = [];
        this.pheromoneGrid = new PheromoneGrid(this.canvas.width, this.canvas.height);
        
        // Animation
        this.lastTime = 0;
        this.fps = 60;
        this.frameInterval = 1000 / this.fps;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.addInitialFood();
        this.render();
    }

    setupEventListeners() {
        // Control buttons
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pause());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('addFoodBtn').addEventListener('click', () => this.addRandomFood());
        
        // Canvas click to add food
        this.canvas.addEventListener('click', (e) => {
            if (this.running) {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.addFood(x, y);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case ' ':
                    e.preventDefault();
                    this.running ? this.pause() : this.start();
                    break;
                case 'r':
                    this.reset();
                    break;
                case 'f':
                    this.addRandomFood();
                    break;
                case 'p':
                    this.renderer.togglePheromones();
                    break;
            }
        });
    }

    addInitialFood() {
        // Add some initial food sources
        this.addFood(600, 150, 150);
        this.addFood(700, 450, 120);
        this.addFood(300, 500, 100);
    }

    addFood(x, y, amount = 100) {
        this.foodSources.push(new Food(x, y, amount));
    }

    addRandomFood() {
        const x = Math.random() * (this.canvas.width - 100) + 50;
        const y = Math.random() * (this.canvas.height - 100) + 50;
        const amount = 50 + Math.random() * 100;
        this.addFood(x, y, amount);
    }

    start() {
        this.running = true;
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        this.gameLoop();
    }

    pause() {
        this.running = false;
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
    }

    reset() {
        this.running = false;
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        
        // Reset simulation state
        this.colony = new AntColony(100, 300);
        this.foodSources = [];
        this.pheromoneGrid = new PheromoneGrid(this.canvas.width, this.canvas.height);
        
        this.addInitialFood();
        this.render();
    }

    update() {
        // Update colony (which updates all ants)
        this.colony.update(this.foodSources, this.pheromoneGrid);
        
        // Update pheromone grid (evaporation)
        this.pheromoneGrid.update();
        
        // Remove consumed food sources
        this.foodSources = this.foodSources.filter(food => !food.isConsumed());
        
        // Occasionally add new food if running low
        if (this.foodSources.length < 2 && Math.random() < 0.01) {
            this.addRandomFood();
        }
    }

    render() {
        this.renderer.render(this.colony, this.foodSources, this.pheromoneGrid);
    }

    gameLoop(currentTime = 0) {
        if (!this.running) return;
        
        const deltaTime = currentTime - this.lastTime;
        
        if (deltaTime >= this.frameInterval) {
            this.update();
            this.render();
            this.lastTime = currentTime;
        }
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// Initialize simulation when page loads
document.addEventListener('DOMContentLoaded', () => {
    const simulation = new AntSimulation();
    
    // Add instructions
    const instructions = document.createElement('div');
    instructions.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-size: 12px;
        max-width: 200px;
    `;
    instructions.innerHTML = `
        <strong>Controls:</strong><br>
        Space - Start/Pause<br>
        R - Reset<br>
        F - Add random food<br>
        P - Toggle pheromones<br>
        Click - Add food at cursor
    `;
    document.body.appendChild(instructions);
});