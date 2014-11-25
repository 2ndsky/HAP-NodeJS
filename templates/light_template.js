// HomeKit types required
var types = require("./types.js");
var exports = module.exports = {};

exports.accessory = {
  services: [{
    sType: types.ACCESSORY_INFORMATION_STYPE, 
    characteristics: [{
        cType: types.NAME_CTYPE, 
        onUpdate: null,
        perms: ["pr"],
        format: "string",
        initialValue: "#name",
        supportEvents: false,
        supportBonjour: false,
        manfDescription: "Bla",
        designedMaxLength: 255    
    },{
        cType: types.MANUFACTURER_CTYPE, 
        onUpdate: null,
        perms: ["pr"],
        format: "string",
        initialValue: "smarthome.py",
        supportEvents: false,
        supportBonjour: false,
        manfDescription: "Bla",
        designedMaxLength: 255    
    },{
        cType: types.MODEL_CTYPE,
        onUpdate: null,
        perms: ["pr"],
        format: "string",
        initialValue: "Rev-1",
        supportEvents: false,
        supportBonjour: false,
        manfDescription: "Bla",
        designedMaxLength: 255    
    },{
        cType: types.SERIAL_NUMBER_CTYPE, 
        onUpdate: null,
        perms: ["pr"],
        format: "string",
        initialValue: "#item",
        supportEvents: false,
        supportBonjour: false,
        manfDescription: "Bla",
        designedMaxLength: 255    
    },{
        cType: types.IDENTIFY_CTYPE, 
        onUpdate: null,
        perms: ["pw"],
        format: "bool",
        initialValue: false,
        supportEvents: false,
        supportBonjour: false,
        manfDescription: "Identify Accessory",
        designedMaxLength: 1    
    }]
  },{
    sType: types.LIGHTBULB_STYPE, 
    characteristics: [{
        cType: types.NAME_CTYPE,
        onUpdate: null,
        perms: ["pr"],
        format: "string",
        initialValue: "#name",
        supportEvents: false,
        supportBonjour: false,
        manfDescription: "Bla",
        designedMaxLength: 255   
    },{
        cType: types.POWER_STATE_CTYPE,
        onUpdate: "power",
        perms: ["pw","pr","ev"],
        format: "bool",
        initialValue: false,
        supportEvents: false,
        supportBonjour: false,
        manfDescription: "Turn On the Light",
        designedMaxLength: 1    
    },{
        cType: types.HUE_CTYPE,
        onUpdate: "hue",
        perms: ["pw","pr","ev"],
        format: "int",
        initialValue: 0,
        supportEvents: false,
        supportBonjour: false,
        manfDescription: "Adjust Hue of Light",
        designedMinValue: 0,
        designedMaxValue: 360,
        designedMinStep: 1,
        unit: "arcdegrees"
    },{
        cType: types.BRIGHTNESS_CTYPE,
        onUpdate: "brightness",
        perms: ["pw","pr","ev"],
        format: "int",
        initialValue: 0,
        supportEvents: false,
        supportBonjour: false,
        manfDescription: "Adjust Brightness of Light",
        designedMinValue: 0,
        designedMaxValue: 100,
        designedMinStep: 1,
        unit: "%"
    },{
        cType: types.SATURATION_CTYPE,
        onUpdate: "saturation",
        perms: ["pw","pr","ev"],
        format: "int",
        initialValue: 0,
        supportEvents: false,
        supportBonjour: false,
        manfDescription: "Adjust Saturation of Light",
        designedMinValue: 0,
        designedMaxValue: 100,
        designedMinStep: 1,
        unit: "%"
    }]
  }]
}
