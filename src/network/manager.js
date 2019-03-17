export class AddressManager {
  constructor() {
    this.peers = [];
  }

  peerDiscovered(address, inbound) {
    let peer = new Node(address, inbound);
    this.peers.push(peer);
  }
}