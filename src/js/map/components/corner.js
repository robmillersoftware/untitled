/**
 * This class represents the corner of a Voronoi polygon
 */
export class Corner {
    constructor() {
        //This corner's position on the graph
        this.index = null;

        //The world location of this corner
        this.point = null;

        //Is this corner at the edge of the map
        this.border = null;

        //The elevation of this corner. Valid range is 29000 to -11304
        this.elevation = null;

        //The most downhill adjacent corner
        this.downslope = null

        //TODO: What are these?
        this.touches = null;
        this.protrudes = null;
        this.adjacent = null;
    }
}