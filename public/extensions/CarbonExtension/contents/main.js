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
var blue = new THREE.Vector4(0, 0, 0.3, 1);
var blue2 = new THREE.Vector4(0, 0, 0.6, 1);
var blue3 = new THREE.Vector4(0, 0, 1, 1);

var COS = false;

class CarbonExtension extends Autodesk.Viewing.Extension {
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
        console.log('CarbonExtension is now unloaded!');
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

        this._button = new Autodesk.Viewing.UI.Button('CarbonExtensionButton');
        this._button.addClass('CarbonExtensionIcon');
        this._button.setToolTip('CO2');

        // _group
        this._group = new Autodesk.Viewing.UI.ControlGroup('CarbonExtensionsToolbar');
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
                    roomOne.push(checkCO2(rr.CO2));
                else if(rr.id == "B4:E6:2D:BF:0D:35")
                    roomTwo.push(checkCO2(rr.CO2));
                else
                    roomThree.push(checkCO2(rr.CO2));
            });

            let timer = setInterval(function () {
                let tempColor;

                if(roomOne.length == 0 && roomTwo.length == 0 && roomThree.length == 0 ){
                    clearInterval(timer);
                }

                if (COS != false && roomOne.length > 0) {
                    tempColor = roomOne.pop();
                    viewer.model.setThemingColor(7818, tempColor);
                    viewer.model.setThemingColor(7807, tempColor);
                    viewer.impl.invalidate(true);
                }
                if (COS != false && roomTwo.length > 0) {
                    tempColor = roomOne.pop();
                    viewer.model.setThemingColor(7819, tempColor);
                    viewer.model.setThemingColor(7792, tempColor);
                    viewer.model.setThemingColor(7805, tempColor);
                    viewer.model.setThemingColor(3748, tempColor);
                    viewer.impl.invalidate(true);
                }
                if (COS != false && roomThree.length > 0) {
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
            COS = !COS;
            if (COS)
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

function checkCO2(temp) {
    if(temp < 420) {
        return blue
    }
    else if(temp >= 420 && temp < 450) {
        return blue2
    }
    else {
        return blue3
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('CarbonExtension',
    CarbonExtension);