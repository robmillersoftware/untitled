const Delaunator = require('delaunator');
const TinyQueue = require('tinyqueue');
const sha256 = require('sha256');

let random;

function getEdgesOfTriangle(t) {
  return [3 * t, 3 * t + 1, 3 * t + 2];
}

function getTriangleOfEdge(e)  {
  return Math.floor(e / 3);
}

function getNextHalfedge(e) {
  return (e % 3 === 2) ? e - 2 : e + 1;
}

function getEdgesAroundPoint(delaunay, start) {
  const result = [];
  let incoming = start;
  do {
    result.push(incoming);
    const outgoing = getNextHalfedge(incoming);
    incoming = delaunay.halfedges[outgoing];
  } while (incoming !== -1 && incoming !== start);
  return result;
}

function getPointsOfTriangle(delaunay, t) {
  return getEdgesOfTriangle(t).map(e => delaunay.triangles[e]);
}

function getAdjacentPoints(delaunay, point) {
  const edges = getEdgesAroundPoint(delaunay, point);
  const triangles = edges.map(getTriangleOfEdge);

  let vertices = [];
  for (let t in triangles) {
    let points = getPointsOfTriangle(delaunay, t);
    vertices.push(...points);
  }

  return [...new Set(vertices)];
}

class GraphNode {
  constructor(point, adjacents = [], neighbors = []) {
    this.id = Math.floor(random.nextRand(1, 9999999));
    this.point = point;
    this.adjacents = adjacents;
    this.neighbors = neighbors
  }
}

class TreeEdge {
  constructor(n1, n2) {
    this.first = n1;
    this.second = n2;

    this.weight = Math.sqrt((Math.abs(n2.x - n1.point.x) * Math.abs(n1.point.x - n2.x)) + (Math.abs(n1.point.y - n2.y) * Math.abs(n1.point.y - n2.y)));
  }
}

class SpanningTree {
  constructor() {
    this.edges = [];
  }

  drawTree(graphics) {
    graphics.beginPath();
    graphics.lineStyle(2, 0x00FF00);

    this.edges.forEach(edge => {
      this.graphics.moveTo(edge.first.point.x, edge.first.point.y);
      this.graphics.lineTo(edge.second.point.x, edge.second.point.y);
    });

    graphics.closePath();
    graphics.strokePath();
  }
}

export class DelaunayGraph {
  constructor(points, r, graphics) {
    random = r;

    this.points = points;
    this.nodes = [];

    this.delaunay = Delaunator.from(points, point => point.x, point => point.y);
    this.buildGraph();
    this.buildMinimalSpanningTree();
    this.minimalSpanningTree.drawGraphics(graphics);
  }

  buildGraph() {
    for (let i = 0; i < this.delaunay.triangles.length; i++) {
      let point = this.points[this.delaunay.triangles[i]];
      let adjacentPointIndexes = getAdjacentPoints(this.delaunay, this.delaunay.triangles[i]);
      let adjacentPoints = adjacentPointIndexes.map(v => this.points[v]);

      this.nodes.push(new GraphNode(point, adjacentPoints));
    }

    this.nodes.forEach(node => {
      node.adjacents.forEach(adjacent => {
        node.neighbors.push(this.nodes.find(n => n.point === adjacent));
      });
    });
  }

  buildMinimalSpanningTree() {
    let queue = new TinyQueue([], function (a, b) {
	     return a.weight - b.weight;
     });

    this.minimalSpanningTree = new SpanningTree();

    let checked = new Map();
    let start = Math.floor(random.nextRand(0, this.nodes.length));
    let currentNode = this.nodes[start];

    checked.set(this.nodes[start], true);

    currentNode.neighbors.forEach(neighbor => {
      let edge = new TreeEdge(currentNode.point, neighbor);
      queue.push(edge);
    });

    while(checked.size < this.nodes.length) {
      console.log(JSON.stringify(currentNode));
      let shortest = queue.pop();
      if (!checked.has(shortest.second)) {
        this.minimalSpanningTree.edges.push(shortest);
        checked.set(currentNode, true);
        currentNode = shortest.second;
        currentNode.neighbors.forEach(neighbor => {
          let edge = new TreeEdge(currentNode, neighbor);
          queue.push(edge);
        });
      }
    }
  }

  bfs(start) {
    // create a visited array
     var visited = [];
     for (var i = 0; i < this.points.length; i++)
       visited[i] = false;

     // Create an object for queue
     var q = new Queue();

     // add the starting node to the queue
     visited[startingNode] = true;
     q.enqueue(startingNode);

     // loop until queue is element
     while (!q.isEmpty()) {
       // get the element from the queue
       var getQueueElement = q.dequeue();

       // passing the current vertex to callback funtion
       console.log(getQueueElement);

       // get the adjacent list for current vertex
       var get_List = this.AdjList.get(getQueueElement);

       // loop through the list and add the elemnet to the
       // queue if it is not processed yet
       for (var i in get_List) {
         var neigh = get_List[i];

         if (!visited[neigh]) {
           visited[neigh] = true;
           q.enqueue(neigh);
         }
       }
     }
  }

  dfs(start) {

  }
}
