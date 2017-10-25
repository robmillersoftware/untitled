//Have to use require instead of import for compatibility for this module
let Delaunator = require('delaunator');

/**
 * This class holds terrain data for height, environment, and navigation. This
 * includes a Voronoi diagram, Delaunay triangulation, and a list of all sites
 * in the map.
 */
export class MapMesh {
    constructor() {
        //An instance of the class responsible for calculating the voronoi 
        //diagram. Keep a reference to it to make further calculations less intensive
        this.voronoi = new Voronoi();

        //This will hold a list of all sites on the map
        this.sites = null;

        //The most recently calculated delauanay triangulation
        this.delaunay = null;

        //The most recently calculated voronoi diagram 
        this.diagram = null;
 }    

    /**
     * Update the sites list and recalculate Voronoi and Delaunay using the new
     * info.
     */
    calculate(sites, box) {
        let bBox = { xl: box.left, xr: box.right, yt: box.top, yb: box.bottom };
        this.sites = sites;

        //Recycling the old diagram speeds up the voronoi computation
        this.voronoi.recycle(this.diagram);
        this.diagram = this.voronoi.compute(sites, bBox);

        //Delaunator expects an array unless you specify the second and third arguments
        this.delaunay = new Delaunator(sites, point => point.x, point => point.y);
    }
    
    drawDelaunay(graphics) {
        graphics.clear();
        for (let i = 0; i < this.delaunay.triangles.length; i += 3) {
            let first = this.delaunay.triangles[i];
            let second = this.delaunay.triangles[i+1];
            let third = this.delaunay.triangles[i+2];

            graphics.moveTo(this.sites[first].x, this.sites[first].y);
            graphics.lineStyle(2, 0x882288);
            graphics.lineTo(this.sites[second].x, this.sites[second].y);
            graphics.lineTo(this.sites[third].x, this.sites[third].y);
        }

        return graphics.generateTexture();
    }

    drawVoronoi(graphics) {
        graphics.clear();
        this.diagram.edges.forEach((edge, i) => {
            graphics.lineStyle(2, 0x000088);
            graphics.moveTo(edge.va.x, edge.va.y);
            graphics.lineTo(edge.vb.x, edge.vb.y);
        });

        return graphics.generateTexture();
    }
}