let TinyQueue = require('tinyqueue');

class Edge {
  constructor(r1, r2) {
    this.id = r1.id + r2.id;
    this.rooms = [r1, r2];

    let x = Math.abs(r1.center.x - r2.center.x);
    let y = Math.abs(r1.center.y - r2.center.y);
    this.weight = Math.sqrt(x * x + y * y);
  }

  hasRoom(r) {
    return this.rooms.filter(room => room.id === room.id).length > 0;
  }

  connects(r1, r2) {
    return this.rooms.filter(room => room.id === r1.id || room.id === r2.id).length === 2;
  }

  getOtherRoom(r) {
    if (this.rooms[0].id === r.id) {
      return this.rooms[1];
    } else {
      return this.rooms[0];
    }
  }
}

export class RoomGraph {
  constructor(rooms, graphics) {
    this.rooms = rooms;
    this.graphics = graphics;
    this.edges = [];
    this.adjacencyList = new Map();
    this.buildEdges();
    this.edges = this.pruneEdges();
    this.buildAdjacencyList();
    this.buildMinimalSpanningTree();
    this.drawTree();
  }

  getEdge(p1, p2) {
    return this.edges.filter(e => e.connects(p1, p2))[0];
  }

  buildEdges() {
    for (let i = 0; i < this.rooms.length; ++i) {
      for (let j = i + 1; j < this.rooms.length; ++j) {
        this.edges.push(new Edge(this.rooms[i], this.rooms[j]));
      }
    }
  }

  pruneEdges() {
    return this.edges.filter((e, idx) => this.checkIntersection(idx));
  }

  checkIntersection(idx) {
    for (let i = idx + 1; i < this.edges.length; ++i) {
      //Prune this edge if it intersects with any shorter edge
      if (this.checkIntersectionBetweenEdges(this.edges[idx], this.edges[i]) &&
          this.edges[idx].weight > this.edges[i].weight) {
        return false;
      }
    }

    return true;
  }

  checkIntersectionBetweenEdges(e1, e2) {
    if (e1.hasRoom(e2.rooms[0]) || e1.hasRoom(e2.rooms[1])) {
      return false;
    }

    let determinant, gamma, lambda;
    let a = e1.rooms[0].center.x;
    let b = e1.rooms[0].center.y;
    let c = e1.rooms[1].center.x;
    let d = e1.rooms[1].center.y;
    let p = e2.rooms[0].center.x;
    let q = e2.rooms[0].center.y;
    let r = e2.rooms[1].center.x;
    let s = e2.rooms[1].center.y;

    determinant = (c - a) * (s - q) - (r - p) * (d - b);
    if (determinant === 0) {
      return false;
    } else {
      lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / determinant;
      gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / determinant;
      return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
  }

  buildAdjacencyList() {
    this.rooms.forEach(room => {
      let adjacents = this.edges.filter(e => e.hasRoom(room)).map(e => e.getOtherRoom(room));
      this.adjacencyList.set(room, adjacents);
    });
  }

  buildMinimalSpanningTree() {
    let queue = new TinyQueue([], function (a, b) {
	     return a.weight - b.weight;
     });

    this.minimalSpanningTree = [];

    let checked = new Map();
    let currentRoom = this.rooms[0];

    checked.set(currentRoom.id, true);

    this.adjacencyList.get(currentRoom).forEach(adj => {
      queue.push(this.getEdge(currentRoom, adj));
    });

    while(checked.size < this.rooms.length && queue.peek()) {
      let shortest = queue.pop();
      let other = shortest.getOtherRoom(currentRoom);
      if (!checked.has(other.id)) {
        this.minimalSpanningTree.push(shortest);
        checked.set(currentRoom.id, true);
        currentRoom = other;
        this.adjacencyList.get(currentRoom).forEach(adj => {
          queue.push(this.getEdge(currentRoom, adj));
        });
      }
    }

    //Add some extra paths
    this.edges.sort((e1, e2) => e1.weight - e2.weight);
    let toAdd = [];
    let count = 0;
    while (toAdd.length < this.minimalSpanningTree.length / 10 && count < this.edges.length) {
      let inTree = this.minimalSpanningTree.filter(e => e.id === this.edges[count].id);
      if (inTree.length === 0) {
        toAdd.push(this.edges[count]);
      }
      count++;
    }

    this.minimalSpanningTree.push(...toAdd);
  }

  drawTree() {
    this.graphics.fillStyle(0x00FF00);
    this.rooms.forEach(r => {
      this.graphics.fillCircle(r.center.x, r.center.y, 5);
    });

    this.graphics.lineStyle(5, 0xFF0000, 1.0);
    this.graphics.beginPath();

    this.minimalSpanningTree.forEach(e => {
      this.graphics.moveTo(e.rooms[0].center.x, e.rooms[0].center.y);
      this.graphics.lineTo(e.rooms[1].center.x, e.rooms[1].center.y);
    });

    this.graphics.closePath();
    this.graphics.strokePath();
  }
}
