# UML Diagrams for Car Wash Management System

This directory contains PlantUML diagram files for the Car Wash Management System.

## Files

1. **architecture.puml** - System Architecture Diagram
   - Shows all microservices, databases, and external systems
   - Displays service registry and API gateway
   - Shows connections between components

2. **usecase.puml** - Use Case Diagram
   - Shows what each user role (Customer, Washer, Admin) can do
   - Displays all system functionalities
   - Shows relationships between use cases

3. **dfd-level0.puml** - Data Flow Diagram Level 0 (Context Diagram)
   - High-level view of the entire system
   - Shows external entities and data flows
   - System as a single process

4. **dfd-level1.puml** - Data Flow Diagram Level 1
   - Breaks down system into major processes
   - Shows data stores (databases)
   - Shows data flow between processes

5. **sequence.puml** - Sequence Diagram
   - Shows complete workflow from registration to receipt
   - Displays interactions between services
   - Shows message flow over time

## How to Generate Diagrams

### Option 1: Online PlantUML Editor
1. Go to http://www.plantuml.com/plantuml/uml/
2. Copy content from any .puml file
3. Paste and view the diagram
4. Download as PNG/SVG

### Option 2: VS Code Extension
1. Install "PlantUML" extension in VS Code
2. Open any .puml file
3. Press `Alt+D` to preview
4. Right-click → Export to PNG/SVG

### Option 3: Command Line
```bash
# Install PlantUML
# Download from https://plantuml.com/download

# Generate PNG
java -jar plantuml.jar architecture.puml

# Generate all diagrams
java -jar plantuml.jar *.puml
```

### Option 4: IntelliJ IDEA
1. Install "PlantUML Integration" plugin
2. Open any .puml file
3. View diagram in preview pane
4. Right-click → Export

## Diagram Descriptions

### Architecture Diagram
- **Purpose**: Shows system structure
- **Components**: 6 microservices, 4 databases, Stripe API
- **Key Points**: Service discovery, API Gateway routing

### Use Case Diagram
- **Purpose**: Shows user interactions
- **Actors**: Customer, Washer, Admin
- **Use Cases**: 13 main functionalities

### DFD Level 0
- **Purpose**: System context
- **Shows**: External entities, system boundary, data flows
- **Entities**: 3 user types + Stripe

### DFD Level 1
- **Purpose**: System decomposition
- **Shows**: 4 main processes, 4 data stores
- **Processes**: Authentication, Car Management, Order Management, Payment

### Sequence Diagram
- **Purpose**: Workflow timeline
- **Shows**: Complete user journey
- **Phases**: Registration → Car → Order → Payment → Service → Receipt

## Quick View Links

After generating, you can view diagrams at:
- http://www.plantuml.com/plantuml/uml/ (paste code)
- https://plantuml-editor.kkeisuke.com/ (alternative editor)

## Notes

- All diagrams are simplified for clarity
- Focus on main flows and components
- Detailed implementation in actual code
- Use these for documentation and presentations
