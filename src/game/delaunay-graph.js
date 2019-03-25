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

class SpanningTree {
  constructor() {
    this.nodes = [];
    this.edges = [];
  }

  getAllNeighbors() {
    let neighbors = new Map();

    this.nodes.forEach(node => {
      node.neighbors.forEach(neighbor => {
        if (!neighbors.has(neighbor)) {
          neighbors.set()
        }
      });
    });
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
      if (!this.adjacencyList.has(point)) {
        let adjacentPointIndexes = getAdjacentPoints(this.delaunay, this.delaunay.triangles[i]);
        let adjacentPoints = adjacentPointIndexes.map(v => this.points[v]);
        let weights = calculateWeights(point, adjacentPoints);

        this.nodes.push(new GraphNode(point, adjacentPoints, weights));
      }
    }
  }

  buildMinimalSpanningTree() {
    let queue = [];
    let marked = new Map();
    let start = Math.floor(random.nextRand(0, this.nodes.length));

    this.minimalSpanningTree = new SpanningTree();
    this.minimalSpanningTree.push(this.nodes[start]);

    while(marked.size < this.nodes.length) {

    }

    while(!queue.empty()) {
      let toProcess = queue.top();
      queue.pop();

      let node = toProcess[1];
      if (marked.has(node)) {
        continue;
      }

      marked.set(node, true);
      let minimumCost = [...node.adjacents.keys()].sort((a, b) => a - b);

      if (!marked.has(minimumCost)) {
        queue.push(node.adjacents[minimumCost]);
        this.minimalSpanningTree.push(node, node.adjacents[minimumCost]);
      }
    }

    // Checking for cycle
    if(marked[x] == true)
        continue;
    minimumCost += p.first;
    marked[x] = true;
    for(int i = 0;i < adj[x].size();++i)
    {
        y = adj[x][i].second;
        if(marked[y] == false)
            Q.push(adj[x][i]);
    }
}
return minimumCost;
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
