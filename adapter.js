import { EventEmitter } from "events";
import { BleManager, State } from 'react-native-ble-plx';

class RuuviAdapter extends EventEmitter {
  manager = null;
  isScanning = false;

  constructor() {
    super();

    this.manager = new BleManager();

    this.manager
      .state()
      .then((state) => {
        if (state === State.PoweredOn) {
          this.start();
        } else {
          this.manager.onStateChange((state) => {
            if (state === State.PoweredOn) {
              this.start();
            } else {
              this.stop();
            }

            this.emit("stateChange", state);
          });
        }
      });
  }

  start() {
    if (this.isScanning) {
      return;
    }

    this.isScanning = true;
    this.scanAndConnect();
  }

  stop() {
    if (!this.isScanning) {
      return;
    }

    this.manager.stopDeviceScan();
    this.isScanning = false;
  }

  scanAndConnect() {
    this.info("Scanning...");

    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        this.warning(error.message);
        return;
      }

      this.emit('discover', device);
    });
  }

  info(message) {
    this.emit('info', { info: message });
  }

  warning(message) {
    this.emit('warning', { info: "ERROR: " + message });
  }
}

export default new RuuviAdapter();
