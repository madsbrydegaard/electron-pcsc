# electron-pcsc

When running app using 'npm start' from console on windows 10
```
 npm ERR! code ELIFECYCLE
npm ERR! errno 3228369023
npm ERR! electron.card-loader@0.0.1 start: `electron .`
npm ERR! Exit status 3228369023
npm ERR!
npm ERR! Failed at the electron.card-loader@0.0.1 start script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     C:\Users\mads\AppData\Roaming\npm-cache\_logs\2019-01-03T08_06_05_156Z-debug.log
```

Changing "start": "electron ." to "start": "node ." in packages.json and everything works!

Additional info:
We are using Node.js 10.11.0, Chromium 69.0.3497.106, and Electron 4.0.0.
