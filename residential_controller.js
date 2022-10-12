let elevatorID = 1;
let floorRequestButtonID = 1;
let callButtonID = 1;

class Column {
  constructor(_id, _amountOfFloors, _amountOfElevators) {
    this.ID = _id;
    this.status = "Online";
    this.elevatorList = [];
    this.callButtonList = [];

    this.createCallButtons(_amountOfFloors);
    this.createElevators(_amountOfFloors, _amountOfElevators);
  }
  createCallButtons = function (_amountOfFloors) {
    // create button to call the elevator outside the cage
    let buttonFloor = 1;
    console.log(_amountOfFloors);

    for (let i = 1; i <= _amountOfFloors; i++) {
      //If it's not the last floor
      if (buttonFloor < _amountOfFloors) {
        let callButton = new CallButton(callButtonID, buttonFloor, "UP");
        this.callButtonList.push(callButton);
        callButtonID++;
      }
      if (buttonFloor > 1) {
        //If it's not the first floor

        let callButton = new CallButton(
          callButtonID,

          buttonFloor,
          "Down"
        );
        this.callButtonList.push(callButton);
        callButtonID++;
      }

      buttonFloor++;
    }
  };
  createElevators = function (_amountOfFloors, _amountOfElevators) {
    for (let i = 1; i <= _amountOfElevators; i++) {
      let elevator = new Elevator(elevatorID, _amountOfFloors);
      this.elevatorList.push(elevator);
      elevatorID++;
    }
  };
  requestElevator(floor, direction) {
    let elevator = this.findElevator(floor, direction);
    elevator.floorRequestList.push(floor);
    elevator.move();
    elevator.operateDoors();

    return elevator;
  }
  findElevator(requestedFloor, requestedDirection) {
    var bestElevator;
    this.bestElevatorInformations = {
      bestElevator: this.elevator,
      bestScore: 5,
      referenceGap: 10000000,
    };

    this.elevatorList.forEach((elevator) => {
      if (
        //The elevator is at my floor and going in the direction I want
        requestedFloor == elevator.currentFloor &&
        elevator.status == "stopped" &&
        requestedDirection == elevator.direction
      ) {
        this.bestElevatorInformations = this.checkIfElevatorIsBetter(
          1,
          elevator,
          bestElevatorInformations.bestScore,
          bestElevatorInformations.referenceGap,
          bestElevatorInformations.bestElevator,
          requestedFloor
        );
        return this.bestElevatorInformations;
      } else if (
        //The elevator is lower than me, is coming up and I want to go up
        requestedFloor > elevator.currentFloor &&
        elevator.direction == "up" &&
        requestedDirection == elevator.direction
      ) {
        this.bestElevatorInformations = this.checkIfElevatorIsBetter(
          2,
          elevator,
          this.bestElevatorInformations.bestScore,
          this.bestElevatorInformations.referenceGap,
          this.bestElevatorInformations.bestElevator,
          requestedFloor
        );
        return this.bestElevatorInformations;
      } else if (
        //The elevator is higher than me, is coming down and I want to go down
        requestedFloor < elevator.currentFloor &&
        elevator.direction == "down" &&
        requestedDirection == elevator.direction
      ) {
        this.bestElevatorInformations = this.checkIfElevatorIsBetter(
          2,
          elevator,
          this.bestElevatorInformations.bestScore,
          this.bestElevatorInformations.referenceGap,
          this.bestElevatorInformations.bestElevator,
          requestedFloor
        );
        return this.bestElevatorInformations;
      } else if (elevator.status == "idle") {
        //The elevator is idle
        this.bestElevatorInformations = this.checkIfElevatorIsBetter(
          3,
          elevator,
          this.bestElevatorInformations.bestScore,
          this.bestElevatorInformations.referenceGap,
          this.bestElevatorInformations.bestElevator,
          requestedFloor
        );
        return this.bestElevatorInformations;
      } else {
        this.bestElevatorInformations = this.checkIfElevatorIsBetter(
          4,
          elevator,
          this.bestElevatorInformations.bestScore,
          this.bestElevatorInformations.referenceGap,
          this.bestElevatorInformations.bestElevator,
          requestedFloor
        );
        return this.bestElevatorInformations;
      }
    });
    bestElevator = this.bestElevatorInformations.bestElevator;
    console.log(
      "this.bestElevatorInformations.bestElevator: ",
      this.bestElevatorInformations.bestElevator
    );
    return bestElevator;
  }
  checkIfElevatorIsBetter(
    scoreToCheck,
    newElevator,
    bestScore,
    referenceGap,
    bestElevator,
    requestedFloor
  ) {
    // console.log(" bestElevator: ", bestElevator);
    if (scoreToCheck < bestScore) {
      bestScore = scoreToCheck;
      bestElevator = newElevator;
      referenceGap = Math.abs(newElevator.currentFloor - requestedFloor);
      // console.log("newElevator.currentFloor: ", newElevator.currentFloor);
    } else if (bestScore == scoreToCheck) {
      let gap = Math.abs(newElevator.currentFloor - requestedFloor);

      if (referenceGap > gap) {
        bestElevator = newElevator;
        referenceGap = gap;
      }
    }
    this.bestElevatorInformations.bestElevator = bestElevator;
    this.bestElevatorInformations.bestScore = bestScore;
    this.bestElevatorInformations.referenceGap = referenceGap;

    return this.bestElevatorInformations;
  }
}

class Elevator {
  constructor(_id, _amountOfFloors) {
    this.ID = _id;
    this.status = "idle";
    this.currentFloor = 1;
    this.direction = null;
    this.door = new Door(_id, "closed");
    this.floorRequestButtonList = [];
    this.floorRequestList = [];
    this.createFloorRequestButtons(_amountOfFloors);
  }
  createFloorRequestButtons(_amountOfFloors) {
    //create a button to request each floor
    let buttonFloor = 1;
    for (let i = 1; i <= _amountOfFloors; i++) {
      let floorRequestButton = new FloorRequestButton(
        floorRequestButtonID,

        buttonFloor
      );
      this.floorRequestButtonList.push(floorRequestButton);
      buttonFloor++;
      floorRequestButtonID++;
    }
  }
  //Simulate when a user press a button inside the elevator
  requestFloor(floor) {
    this.floorRequestList.push(floor);
    this.move();
    this.operateDoors();
  }
  move() {
    while (this.floorRequestList.length > 0) {
      let destination = this.floorRequestList[0];
      this.status = "moving";
      if (this.currentFloor < destination) {
        this.direction = "up";
        this.sortFloorList();
        while (this.currentFloor < destination) {
          this.currentFloor++;
          this.screenDisplay = this.currentFloor;
        }
      } else if (this.currentFloor > destination) {
        this.direction = "down";
        this.sortFloorList();
        while (this.currentFloor > destination) {
          this.currentFloor--;
          this.screenDisplay = this.currentFloor;
        }
      }
      this.status = "stopped";
      this.floorRequestList.shift();
    }
    this.status = "idle";
  }
  sortFloorList() {
    if (this.direction == "up") {
      this.floorRequestList.sort(function (a, b) {
        return a - b;
      });

      console.log("this.floorRequestList: ", this.floorRequestList);
    } else {
      this.floorRequestList.sort(function (a, b) {
        return b - a;
      });
      console.log("this.floorRequestList: ", this.floorRequestList);
    }
  }
  async operateDoors() {
    console.log("wait 5 seconds");
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

class CallButton {
  constructor(_id, _floor, _direction) {
    this.ID = _id;
    this.status = "OFF";
    this.floor = _floor;
    this.direction = _direction;
  }
}
class FloorRequestButton {
  constructor(_id, _floor) {
    this.ID = _id;
    this.status = "OFF";
    this.floor = _floor;
  }
}

class Door {
  constructor(_id, _status) {
    this.ID = _id;
    this.status = _status;
  }
}

// let testElevator = new Elevator(1, "status", 10, 10);
// console.log("testElevator: ", testElevator);
// testElevator.requestFloor(3);
let testColumn = new Column(1, 10, 2);
testColumn.findElevator();
console.log("testColumn: ", testColumn);
module.exports = { Column, Elevator, CallButton, FloorRequestButton, Door };
