# ProtoT - Ant Colony Simulator

A fascinating ant colony simulation built with vanilla JavaScript ES6+ and HTML5 Canvas 2D API. Watch as intelligent ants explore their environment, discover food sources, and create efficient pheromone trails to guide their colony to success!

![Ant Colony Simulator](https://github.com/user-attachments/assets/4245cbbc-fd4b-42e1-b052-fdea16858df3)

## 🐜 Features

### Core Simulation
- **Intelligent Ant Behavior**: Ants wander randomly until they find food, then return home laying pheromone trails
- **Pheromone Communication**: Ants follow chemical trails left by successful foragers
- **Colony Growth**: Colony population can grow as more food is collected
- **Food Sources**: Multiple food sources that ants can discover and harvest
- **Real-time Statistics**: Track ant count, food sources, and food collected

### Interactive Controls
- **Start/Pause/Reset**: Full simulation control
- **Add Food**: Click anywhere on the canvas to place food sources
- **Random Food**: Add food at random locations
- **Pheromone Visualization**: Toggle to see the chemical trails (press 'P')
- **Keyboard Shortcuts**: Quick access to all features

## 🎮 Controls

| Action | Button | Keyboard |
|--------|--------|----------|
| Start/Pause | Start/Pause | Space |
| Reset Simulation | Reset | R |
| Add Random Food | Add Food | F |
| Toggle Pheromones | - | P |
| Add Food at Cursor | Click Canvas | - |

## 🚀 Quick Start

1. Open `index.html` in a web browser
2. Click "Start Simulation" to begin
3. Watch as ants explore and discover food sources
4. Click anywhere on the canvas to add new food sources
5. Use keyboard shortcuts for quick control

## 🏗️ Technical Architecture

The simulation is built with a modular architecture using ES6+ classes:

### Core Classes
- **`Ant`**: Individual ant behavior, pathfinding, and state management
- **`AntColony`**: Manages the ant population and colony behavior  
- **`Food`**: Represents food sources with depleting amounts
- **`Pheromone`**: Chemical trail system with evaporation
- **`PheromoneGrid`**: Efficient spatial partitioning for pheromone lookup
- **`Renderer`**: Handles all canvas drawing operations
- **`AntSimulation`**: Main simulation controller and game loop

### File Structure
```
├── index.html          # Main HTML page
├── css/
│   └── styles.css      # Styling and layout
├── js/
│   ├── ant.js          # Ant behavior and AI
│   ├── colony.js       # Colony management
│   ├── food.js         # Food source logic
│   ├── pheromone.js    # Pheromone trail system
│   ├── renderer.js     # Canvas rendering
│   └── main.js         # Main simulation controller
└── README.md
```

## 🧠 Ant Intelligence

Each ant exhibits complex emergent behavior through simple rules:

1. **Exploration**: Random wandering when no trails are detected
2. **Trail Following**: Following strongest pheromone trails to food sources
3. **Food Collection**: Picking up food and switching to return mode
4. **Trail Laying**: Depositing pheromones while carrying food back home
5. **Edge Avoidance**: Avoiding simulation boundaries
6. **Energy Management**: Basic energy system affecting behavior

## 🎨 Visual Features

- **Dynamic Ant Visualization**: Ants change color when carrying food
- **Food Source Scaling**: Food sources shrink as they're depleted
- **Pheromone Trails**: Optional visualization of chemical communication
- **Colony Home**: Visual representation of the ant nest
- **Real-time UI**: Live statistics and control feedback

## 🔧 Customization

The simulation can be easily customized by modifying parameters in the JavaScript files:

- Ant population and spawn rates in `colony.js`
- Pheromone strength and evaporation in `pheromone.js`  
- Food amounts and placement in `food.js`
- Canvas size and colors in `styles.css`

## 🌟 Future Enhancements

Potential additions mentioned in the original concept:
- Multiple competing colonies
- Environmental obstacles
- Predator/prey dynamics
- Multiple food types with different values
- Advanced pheromone types (danger, exploration, etc.)
- Colony vs colony competition mode

## 📱 Browser Compatibility

Works in all modern browsers supporting:
- HTML5 Canvas 2D API
- ES6+ JavaScript features
- CSS3 styling

No external dependencies required!