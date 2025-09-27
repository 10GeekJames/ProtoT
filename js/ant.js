/**
 * Ant class - represents individual ant behavior
 */
class Ant {
    constructor(x, y, colony) {
        this.x = x;
        this.y = y;
        this.colony = colony;
        this.homeX = x;
        this.homeY = y;
        
        // Movement properties
        this.speed = 1;
        this.direction = Math.random() * Math.PI * 2;
        this.turnSpeed = 0.2;
        
        // State properties
        this.hasFood = false;
        this.state = 'wandering'; // 'wandering', 'returning', 'following_trail'
        this.energy = 100;
        
        // Trail properties
        this.trailTimer = 0;
        this.trailInterval = 10; // Drop pheromone every N frames
        
        // Sensor properties
        this.sensorRange = 30;
        this.sensorAngle = Math.PI / 3; // 60 degrees
        
        // Visual properties
        this.size = 3;
        this.color = this.hasFood ? '#ff6b6b' : '#333';
    }

    update(foodSources, pheromoneGrid) {
        this.energy -= 0.1;
        
        // State machine
        switch (this.state) {
            case 'wandering':
                this.wander(foodSources, pheromoneGrid);
                break;
            case 'returning':
                this.returnHome(pheromoneGrid);
                break;
            case 'following_trail':
                this.followTrail(pheromoneGrid, foodSources);
                break;
        }
        
        // Update position
        this.move();
        
        // Drop pheromone trail
        this.updateTrail(pheromoneGrid);
        
        // Update visual properties
        this.color = this.hasFood ? '#ff6b6b' : '#333';
    }

    wander(foodSources, pheromoneGrid) {
        // Look for food
        const nearbyFood = this.findNearbyFood(foodSources);
        if (nearbyFood) {
            this.collectFood(nearbyFood);
            return;
        }

        // Look for pheromone trails leading to food
        const foodTrail = this.detectPheromoneTrail(pheromoneGrid, 'food');
        if (foodTrail.strength > 0.3) {
            this.state = 'following_trail';
            this.direction = foodTrail.direction;
            return;
        }

        // Random wandering with slight directional bias
        this.direction += (Math.random() - 0.5) * this.turnSpeed;
        
        // Avoid edges by turning away from them
        this.avoidEdges();
    }

    followTrail(pheromoneGrid, foodSources) {
        // Look for food first
        const nearbyFood = this.findNearbyFood(foodSources);
        if (nearbyFood) {
            this.collectFood(nearbyFood);
            return;
        }

        // Follow the strongest food pheromone trail
        const foodTrail = this.detectPheromoneTrail(pheromoneGrid, 'food');
        if (foodTrail.strength > 0.1) {
            this.direction = foodTrail.direction;
        } else {
            // Lost trail, go back to wandering
            this.state = 'wandering';
        }
    }

    returnHome(pheromoneGrid) {
        // Calculate direction to home
        const homeDirection = Math.atan2(this.homeY - this.y, this.homeX - this.x);
        this.direction = homeDirection;
        
        // Check if reached home
        const distanceToHome = Math.sqrt((this.x - this.homeX) ** 2 + (this.y - this.homeY) ** 2);
        if (distanceToHome < 15) {
            this.dropFood();
            this.state = 'wandering';
        }
    }

    findNearbyFood(foodSources) {
        for (const food of foodSources) {
            if (!food.isConsumed() && food.isInRange(this.x, this.y, this.sensorRange)) {
                return food;
            }
        }
        return null;
    }

    collectFood(food) {
        if (food.takeFood(1) > 0) {
            this.hasFood = true;
            this.state = 'returning';
            this.colony.foodCollected++;
        }
    }

    dropFood() {
        this.hasFood = false;
    }

    detectPheromoneTrail(pheromoneGrid, type) {
        let bestDirection = this.direction;
        let maxStrength = 0;
        
        // Check multiple directions around the ant
        const numSensors = 8;
        for (let i = 0; i < numSensors; i++) {
            const angle = (Math.PI * 2 * i) / numSensors;
            const sensorX = this.x + Math.cos(angle) * this.sensorRange;
            const sensorY = this.y + Math.sin(angle) * this.sensorRange;
            
            const strength = pheromoneGrid.getPheromoneStrength(sensorX, sensorY, type);
            if (strength > maxStrength) {
                maxStrength = strength;
                bestDirection = angle;
            }
        }
        
        return {
            direction: bestDirection,
            strength: maxStrength
        };
    }

    move() {
        this.x += Math.cos(this.direction) * this.speed;
        this.y += Math.sin(this.direction) * this.speed;
    }

    avoidEdges() {
        const margin = 20;
        const canvas = { width: 800, height: 600 }; // Should be passed from main
        
        if (this.x < margin) this.direction = 0; // Face right
        if (this.x > canvas.width - margin) this.direction = Math.PI; // Face left
        if (this.y < margin) this.direction = Math.PI / 2; // Face down
        if (this.y > canvas.height - margin) this.direction = -Math.PI / 2; // Face up
    }

    updateTrail(pheromoneGrid) {
        this.trailTimer++;
        
        if (this.trailTimer >= this.trailInterval) {
            this.trailTimer = 0;
            
            if (this.hasFood) {
                // Lay trail back to home (food trail)
                pheromoneGrid.addPheromone(this.x, this.y, 1.0, 'food');
            } else if (this.state === 'returning' || this.state === 'wandering') {
                // Lay weaker home trail
                pheromoneGrid.addPheromone(this.x, this.y, 0.5, 'home');
            }
        }
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.direction);
        
        // Draw ant body
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size, -this.size/2, this.size * 2, this.size);
        
        // Draw food indicator if carrying food
        if (this.hasFood) {
            ctx.fillStyle = '#4ecdc4';
            ctx.beginPath();
            ctx.arc(this.size + 2, 0, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}