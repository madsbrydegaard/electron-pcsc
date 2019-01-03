// ==========  usb-provider ===========
'use strict';

const { app, BrowserWindow } = require('electron');
var HID = require("node-hid");
const EventEmitter = require('events');

class USBProvider extends EventEmitter {

    constructor() {
        super();
        var self = this;
        this.onerror = function (e) {
            console.log('error: ' + e);
        };
        this.getDeviceHandle = function () {
            return deviceHandle;
        }

        var SCAN_INTERVAL = 2000; // scan every 2 secs
        var VENDOR_ID = 0xACD; // default ID TECH vid
        var deviceHandle = null; // stores our handle
        var deviceRecord = null; // stores device record
        var stopKey = null; // to stop polling (if needed)

        // This will be called repeatedly by poll(), below
        function cycle() {

            var deviceFound = false;
            HID.devices().forEach(function (device, index, records) {

                deviceFound = (device.vendorId == VENDOR_ID);

                if (device.vendorId == VENDOR_ID && deviceRecord == null) {
                    deviceRecord = device;
                    try {
                        // Try to connect.
                        deviceHandle =
                            new HID.HID(device.vendorId, device.productId);

                        deviceHandle.on('error', self.onerror);

                        self.emit('usbconnect', deviceHandle);

                        console.log("usbprovider: connect");
                    } catch (e) {
                        self.onerror("Exception caught:\n" + e);
                        self.emit('usbexception', device);
                    }
                } // if

                if (index == records.length - 1 && !deviceFound) {

                    // HANDLE DISCONNECT EVENT
                    if (deviceRecord != null) {
                        deviceRecord = deviceHandle = null; // nullify record	
                        // self.ondisconnect();
                        self.emit('usbdisconnect');

                        console.log("usbprovider: disconnect");
                    } // if 

                } // if 
            }); // forEach
        } // cycle

        this.poll = function () {
            this.stopKey = setInterval(cycle, SCAN_INTERVAL);
        }
    }
}
// Allow other modules to use this one:
module.exports = USBProvider;

// First, instantiate the provider
var usb = new USBProvider();

var deviceHandle = null; // We will store the device handle here

// Set up a connection handler. Inside it, set the data handler.
usb.on('usbconnect', function (h) {

    deviceHandle = h; // cache the handle

    // set up a data handler (for reading data)
    deviceHandle.on('data', (data) => {

        var hex = data.toString('hex');
        // do something with data...

        console.log("data: " + hex);
    });

});

usb.poll();  // Be sure to do this! This starts auto-detect & connect