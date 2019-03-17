const DESKTOP = 0;
const MOBILE = 1;
const WEB = 2;

export class NetworkNode {
  constructor(address, inbound, role = WEB) {
    this.address = address;
    this.role = role;
    this.isInbound = inbound;
    this.sendQueue = [];
    this.receiveQueue = [];
  }

  received() {
    this.lastTimestamp = Date.now();
  }
}