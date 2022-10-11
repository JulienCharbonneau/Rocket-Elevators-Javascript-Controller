let elevatorID = 1;
let floorRequestButtonID = 1;
let callButtonID = 1;

class Column {
  constructor(_id, _amountOfFloors, _amountOfElevators) {
    this.id = _id;
    this.status;
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
        let callButton = new CallButton(callButtonID, "OFF", buttonFloor, "UP");
        this.callButtonList.push(callButton);
        callButtonID++;
      }
      if (buttonFloor > 1) {
        //If it's not the first floor

        let callButton = new CallButton(
          callButtonID,
          "OFF",
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
      let elevator = new Elevator(elevatorID, "idle", _amountOfFloors, 1);
      this.elevatorList.push(elevator);
      elevatorID++;
    }
  };
  // requestElevator(floor, direction) {
  //   let elevator = this.findElevator(floor, direction);
  //   Elevator.floorRequestList.push(floor);
  // }
}

class Elevator {
  constructor(_id, _status, _amountOfFloors, _currentFloor) {
    this.ID = _id;
    this.status = _status;
    this.currentFloor = _currentFloor;
    this.direction = null;
    this.door = new Door(_id, "closed");
    this.floorRequestsButtonsList = [];
    this.floorRequestList = [7, 2, 5];
    this.createFloorRequestButtons(_amountOfFloors);
  }
  createFloorRequestButtons(_amountOfFloors) {
    //create a button to request each floor
    let buttonFloor = 1;
    for (let i = 1; i <= _amountOfFloors; i++) {
      let floorRequestButton = new FloorRequestButton(
        floorRequestButtonID,
        "OFF",
        buttonFloor
      );
      this.floorRequestsButtonsList.push(floorRequestButton);
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
    this.door.status = "opened";
    await new Promise((resolve) => setTimeout(resolve, 5000));
    this.operateDoors();
  }
}

class CallButton {
  constructor(_id, _status, _floor, _direction) {
    this.ID = _id;
    this.status = _status;
    this.floor = _floor;
    this.direction = _direction;
  }
}
class FloorRequestButton {
  constructor(_id, _status, _floor) {
    this.ID = _id;
    this.status = _status;
    this.floor = _floor;
  }
}

class Door {
  constructor(_id, _status) {
    this.ID = _id;
    this.status = _status;
  }
}

let testElevator = new Elevator(1, "status", 10, 10);
console.log("testElevator: ", testElevator);
testElevator.requestFloor(3);
testElevator.operateDoors();
// let testColumn = new Column(1, 10, 2);
// console.log("testColumn: ", testColumn);
module.exports = { Column, Elevator, CallButton, FloorRequestButton, Door };
