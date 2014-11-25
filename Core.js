var storage = require('node-persist');
var zerorpc = require('zerorpc');

var accessory_Factor = new require("./Accessory.js");
var accessoryController_Factor = new require("./AccessoryController.js");
var service_Factor = new require("./Service.js");
var characteristic_Factor = new require("./Characteristic.js");

var targetPort = 51826;

// Get the accessories data
var fs = require('fs');
var path = require('path');

var accessoryTemplates = {}

// Get user defined accessory templates from the templates folder
// - user defined accessory template filenames must end with "_template.js"
fs.readdirSync(path.join(__dirname, "templates")).forEach(function(file) {
    var filename = file.split('_');
    if (filename.pop()==="template.js") {
        accessoryTemplates[filename.pop()] = require("./templates/" + file).accessory;
    };
});

console.log("HAP-NodeJS starting...");
storage.initSync();

var count = storage.getItem("count");
var characteristics = {};
var accessories = [];
var accessoryControllers = [];
var client = null;

var server = new zerorpc.Server({
    init: function(remote_host, remote_port) {
        if (client == null) {
            client = zerorpc.Client();
            client.connect("tcp://" + remote_host + ":" + remote_port);
        }
    },
    addAccessory: function(template, values, callbacks) {
        if (!(template in accessoryTemplates)) {
            console.log("[ERROR] addAccessory: template " + template + " not found");
            return;
        }

        if (!("name" in values)) {
            console.log("[ERROR] addAccessory: displayName not set");
            return;
        }

        if (!("item" in values)) {
            console.log("[ERROR] addAccessory: item not set");
            return;
        }

        console.log("[DEBUG] try to add " + values["name"] + " for item " + values["item"]);

        var accessoryTemplate = accessoryTemplates[template];
        var accessoryController = new accessoryController_Factor.AccessoryController();

        //loop through services
        for (var j = 0; j < accessoryTemplate.services.length; j++) {
            var service = new service_Factor.Service(accessoryTemplate.services[j].sType);

            //loop through characteristics
            for (var k = 0; k < accessoryTemplate.services[j].characteristics.length; k++) {
                var isItem = false;
                var onUpdate = accessoryTemplate.services[j].characteristics[k].onUpdate;
                var initialValue = accessoryTemplate.services[j].characteristics[k].initialValue;

                if (onUpdate !== undefined && onUpdate !== null) {
                    if (typeof onUpdate == 'string' || onUpdate instanceof String) {
                        if (onUpdate in callbacks) {
                            onUpdate = callbacks[onUpdate];
                            isItem = true;
                            console.log("[DEBUG] add callback " + onUpdate);
                        } else {
                            continue;
                        }
                    }
                }

                if (typeof initialValue == 'string' || initialValue instanceof String) {
                    if (initialValue.charAt(0) == '#') {
                        if (initialValue.substr(1) in values) {
                            console.log("[DEBUG] replacing marker " + initialValue);
                            initialValue = values[initialValue.substr(1)];
                            console.log("[DEBUG] marker replaced with " + initialValue);
                        }
                    }
                }

                var options = {
                    type: accessoryTemplate.services[j].characteristics[k].cType,
                    perms: accessoryTemplate.services[j].characteristics[k].perms,
                    format: accessoryTemplate.services[j].characteristics[k].format,
                    initialValue: initialValue,
                    supportEvents: accessoryTemplate.services[j].characteristics[k].supportEvents,
                    supportBonjour: accessoryTemplate.services[j].characteristics[k].supportBonjour,
                    manfDescription: accessoryTemplate.services[j].characteristics[k].manfDescription,
                    designedMaxLength: accessoryTemplate.services[j].characteristics[k].designedMaxLength,
                    designedMinValue: accessoryTemplate.services[j].characteristics[k].designedMinValue,
                    designedMaxValue: accessoryTemplate.services[j].characteristics[k].designedMaxValue,
                    designedMinStep: accessoryTemplate.services[j].characteristics[k].designedMinStep,
                    unit: accessoryTemplate.services[j].characteristics[k].unit,
                }

                var characteristic = new characteristic_Factor.Characteristic(options, onUpdate);

                if (isItem) {
                    characteristic.setClient(client);
                    characteristics[onUpdate] = charactersitic;
                }

                service.addCharacteristic(characteristic);
            };	
            accessoryController.addService(service);
        };

        // create item specific values
        var item = storage.getItem(values["item"]);
        if (item === undefined) {
            // increment the accessory counter
            count++;

            item = { username: "", targetPort: targetPort + (count * 2) };

            var hex = count.toString(16);

            for (var i = 0; i < 12 - hex.length; i++) {
                item.username += "0";
            }
            item.username += hex;
            item.username = item.username.match( /.{1,2}/g ).join( ':' );

            storage.setItem(values["item"], item);
            storage.setItem("count", count);
            storage.persistSync();
        }

        var accessory = new accessory_Factor.Accessory(values["name"], item.username, storage, parseInt(item.targetPort), "031-45-154", accessoryController);
        accessories.push(accessory);
        accessoryControllers.push(accessoryController);
        accessory.publishAccessory();
    },
    updateValue: function(item, value) {
        if (item in characteristics) {
            characteristics[item].updateValue(value, null);
        }
    }
});

// start RPC server
server.bind("tcp://0.0.0.0:4242");


