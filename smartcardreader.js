var SmartCardReader = require('smartcardreader')();

SmartCardReader.on('connect', (device) => {
    console.info(`connected: ${device}`);
});
SmartCardReader.on('disconnect', (device) => {
    console.info(`disconnected: ${device}`);
});
SmartCardReader.on('read', (data) => {
    console.info(`read: ${data}`);
});