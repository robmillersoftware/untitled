/**
 * This class represents the center point of a Voronoi polygon
 */
export class Center {
    constructor() {
        //The index of this object in the graph
        this.index = null;

        //The world location
        this.point = null;

        //True if this polygon is at the edge of the map
        this.border = null;

        //The elevation of the center point. Valid range is 29000 to -11304
        this.elevation = null;

        //Array of neighboring center points
        this.neighbors = [];

        //Array of edges surrounding this point
        this.borders = [];

        //Array of corners for this polygon
        this.corners = [];
    }
}