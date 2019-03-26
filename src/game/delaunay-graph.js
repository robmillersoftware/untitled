const Delaunator = require('delaunator');
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

function calculateWeights(point, neighbors) {
  let weights = [];
  for (let n in neighbors) {
    let dist = Math.sqrt((Math.abs(n.x - point.x) * Math.abs(n.x - point.x)) + (Math.abs(n.y - point.y) * Math.abs(n.y - point.y)));
    weights.push(dist);
  }

  return weights;
}

class GraphNode {
  constructor(point, neighbors = [], weights = []) {
    this.id = random.nextRand(1, 9999999);
    this.point = point;
    this.adjacents = new Map();

    for (let i = 0; i < neighbors.length; ++i) {
      this.adjacents.set(weights[i], neighbors[i]);
    }
  }

  getNeighborById(id) {
    return this.neighbors.find(n => n.id === id);
  }

  getNeighborWeight(id) {
    for (let i = 0; i < this.neighbors.length; ++i) {
      if (this.neighbors[i].id === id) {
        return this.weights[i];
      }
    }
  }
}

class TreeEdge {
  constructor(n1, n2) {
    this.origin = n1;
    this.destination = n2;

    this.weight = Math.sqrt((Math.abs(n2.point.x - n1.point.x) * Math.abs(n1.point.x -n2.point.x)) + (Math.abs(n1.point.y - n2.point.y) * Math.abs(n1.point.y - n2.point.y)));
  }
}

class TreeNode {
  constructor(node) {
    this.node = node;
    this.edges = [];

    this.node.neighbors.forEach(n => {
      this.edges.push(new TreeEdge(node, n));
    });
  }

  getShortestEdge() {
    let sorted = this.edges.sort((e1, e2) => e1.weight - e2.weight);
    return sorted[0];
  }
}

class SpanningTree {
  constructor() {
    this.nodes = [];
    this.edges = [];
  }

  addNode(node) {
    let treeNode = new TreeNode(node);
    this.nodes.push(treeNode);
  }

  addEdge(n1, n2) {

  }
}

export class DelaunayGraph {
  constructor(points, r) {
    random = r;

    this.points = points;
    this.nodes = [];

    this.delaunay = Delaunator.from(points, point => point.x, point => point.y);
    this.buildGraph();
    this.buildMinimalSpanningTree();
  }

  buildGraph() {
    for (let i = 0; i < this.delaunay.triangles.length; i++) {
      let point = this.points[this.delaunay.triangles[i]];
      let adjacentPointIndexes = getAdjacentPoints(this.delaunay, this.delaunay.triangles[i]);
      let adjacentPoints = adjacentPointIndexes.map(v => this.points[v]);
      let weights = calculateWeights(point, adjacentPoints);

      this.nodes.push(new GraphNode(point, adjacentPoints, weights));
    }
  }

  buildMinimalSpanningTree() {
    let queue = [];
    let marked = new Map();
    let start = Math.floor(random.nextRand(0, this.nodes.length));

    this.minimalSpanningTree = new SpanningTree();
    this.minimalSpanningTree.push(this.nodes[start]);

    while(marked.size < this.nodes.length) {
      let neighbors = this.minimalSpanningTree.getAllNeighbors();
      const sortedNeighbors = new Map([...neighbors.entries()].sort((a, b) => a[1] - b[1]));
      let iter = sortedNeighbors.keys();
      let lowestWeight = iter.next().value;

      while(marked.has(lowestWeight)) {
        lowestWeight = iter.next().value;
      }

      this.minimalSpanningTree.addNode(lowestWeight);
      this.minimalSpanningTree.addEdge()
      marked.set(lowestWeight, true);
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
