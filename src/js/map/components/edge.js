/**
 * Class that stores both Delaunay and Voronoi edges in the map
 */
export class Edge {
    constructor() {
        //The index of this edge in the graph
        this.index = 0;

        //Delaunay edge
        this.d0 = null;
        this.d1 = null;

        //Voronoi edge
        this.v0 = null;
        this.v1 = null;

        //Halfway between v0 and v1
        this.midpoint = null;
    }
}