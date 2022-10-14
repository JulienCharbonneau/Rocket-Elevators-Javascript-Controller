# Rocket-Elevators-Python-Controller
This project is about implementing an elevator controller . The program is based on pseudocode file given and for this version written in JavaScript. 


### Usage 
To run the script with node.js run the command
`node residential_controller.js`

To run test with npm run the command
`npm test`

More test can be uncomment at the bottom of the file

```
// testColumn = new Column(1, 10, 2);
// console.log("testColumn: ", testColumn);

// testColumn.createElevators(10, 2);
// testColumn.requestElevator(3, 7);
// testColumn.findElevator(3, 7);

// testElevator = new Elevator(1, 10);
// console.log("testElevator: ", testElevator);

// testElevator.requestFloor(10);
```
### Description
This program creates a number of columns and elevators as needed and supports the needs of elevator request button and floor access request button with a system-based efficiency management  point allowing to evaluate the best choice taking into account the floor where the request was initiated versus the availability and the direction of the cage. This system thus makes it possible to efficiently sort requests and return a lift in a short time.

#### Dependencies

`npm`
`node.js`

