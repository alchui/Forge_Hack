/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// The following extension doesn't provide a robust extension.
// Date: November 11, 2020
//
///////////////////////////////////////////////////////////////////////////////
var red = new THREE.Vector4(1, 0.8, 0.8, 1);
var red2 = new THREE.Vector4(1, 0.6, 0.6, 1);
var red3 = new THREE.Vector4(1, 0, 0, 1);

var started = false;

class TemperatureExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this.viewer = viewer;
        this._group = null;
        this._button = null;
        this.customize = this.customize.bind(this);
    }

    load() {
        if (this.viewer.model.getInstanceTree()) {
            this.customize();
        } else {
            this.viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, this.customize());
        }        
        return true;
    }
    unload() {
        console.log('TemperatureExtension is now unloaded!');
        // Clean our UI elements if we added any
        if (this._group) {
            this._group.removeControl(this._button);
            if (this._group.getNumberOfControls() === 0) {
                this.viewer.toolbar.removeControl(this._group);
            }
        }
        return true;
    }

    customize() {
        let viewer = this.viewer;

        this._button = new Autodesk.Viewing.UI.Button('TemperatureExtensionButton');
        this._button.addClass('TemperatureExtensionIcon');
        this._button.setToolTip('Temperature');

        // _group
        this._group = new Autodesk.Viewing.UI.ControlGroup('TemperatureExtensionsToolbar');
        this._group.addControl(this._button);
        this.viewer.toolbar.addControl(this._group);

        
        let viewState = viewer.getState();

        let lookUp = () => {
            let rooms = [];// Array to store Room Objects

            let room;// be an Room Object
            oneday.forEach((row)=>{
                room=new Room();// New Room Object
                Object.assign(room,row);// Assign json to the new Room
                rooms.push(room);// Add the Room to the Array     
            });

            let roomOne = []; // "B4:E6:2D:BE:AF:0D"
            let roomTwo = []; // "B4:E6:2D:BF:0D:35"
            let roomThree = []; // "B4:E6:2D:BE:AF:59"

            rooms.forEach((rr) => {
                if(rr.id == "B4:E6:2D:BE:AF:0D")
                    roomOne.push(checkTemperature(rr.temperature));
                else if(rr.id == "B4:E6:2D:BF:0D:35")
                    roomTwo.push(checkTemperature(rr.temperature));
                else
                    roomThree.push(checkTemperature(rr.temperature));
            });

            let timer = setInterval(function () {
                let tempColor;

                if(roomOne.length == 0 && roomTwo.length == 0 && roomThree.length == 0 ){
                    clearInterval(timer);
                }

                if (started != false && roomOne.length > 0) {
                    tempColor = roomOne.pop();
                    viewer.model.setThemingColor(7818, tempColor);
                    viewer.model.setThemingColor(7807, tempColor);
                    viewer.impl.invalidate(true);
                }
                if (started != false && roomTwo.length > 0) {
                    tempColor = roomOne.pop();
                    viewer.model.setThemingColor(7819, tempColor);
                    viewer.model.setThemingColor(7792, tempColor);
                    viewer.model.setThemingColor(7805, tempColor);
                    viewer.model.setThemingColor(3748, tempColor);
                    viewer.impl.invalidate(true);
                }
                if (started != false && roomThree.length > 0) {
                    tempColor = roomThree.pop();
                    viewer.model.setThemingColor(7830, tempColor);
                    viewer.model.setThemingColor(7799, tempColor);
                    viewer.model.setThemingColor(7793, tempColor);
                    viewer.impl.invalidate(true);
                }
            }, 2000);
        };
        let initState = () => {
            //viewer.restoreState(viewState);
            viewer.clearThemingColors();
            viewer.impl.invalidate(true);
        };

        this._button.onClick = function (e) {
            started = !started;
            if (started)
            {
                lookUp();
            }
            else
            {
                initState();
            }
        };

    }

}

class Room {
    set timestamp(timestamp) {
        this._timestamp=timestamp;
    }
    set id(id) {
        this._id=id;
    }
    set CO2(CO2) {
        this._CO2=CO2;
    }
    set temperature(temperature) {
        this._temperature=temperature;
    }
    set pressure(pressure) {
        this._pressure=pressure;
    }
    set humidity(humidity) {
        this._humidity=humidity;
    }
    get timestamp() {
        return this._timestamp;
    }
    get id() {
        return this._id;
    }
    get CO2() {
        return this._CO2;
    }
    get temperature() {
        return this._temperature;
    }
    get pressure() {
        return this._pressure;
    }
    get humidity() {
        return this._humidity;
    }
    constructor() {
    }
}

function checkTemperature(temp) {
    if(temp > 20 && temp < 22) {
        return red
    }
    else if(temp >= 22 && temp < 23) {
        return red2
    }
    else {
        return red3
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('TemperatureExtension',
    TemperatureExtension);