# electron-pcsc

My Electron app with nfc-pcsc

## Running

1. Install the dependencies:

```bash
npm install
```

2. Rebuild the native modules in order they can run inside Electron:

```bash
npm start rebuild # Note the start word!
```

Explanation: _This commands start the package.json defined script 'rebuild',
e.g. it runs `electron-rebuild -f -w nfc-pcsc`.
See [electron-rebuild's docs](https://github.com/electron/electron-rebuild) for further explanation._

3. Start the app

```bash
npm start
```
