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
  }
  createCallButtons = function (_amountOfFloors) {
    let buttonFloor = 1;
    console.log(_amountOfFloors);

    for (let i = 0; i <= _amountOfFloors; i++) {
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
}

class Elevator {
  constructor(_id, _amountOfFloors) {}
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
let testColumn = new Column(1, 12, 1);
console.log("testColumn: ", testColumn);
module.exports = { Column, Elevator, CallButton, FloorRequestButton, Door };
