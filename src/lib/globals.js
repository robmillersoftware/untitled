/**
 * This file contains all global constants for this game.
 */

//The size in pixels of the assets used for map tiles
const TILE_SIZE = 512;

//An object containing a property for each control supported by this game
const CONTROLS = {
    UP: Symbol('up'),
    DOWN: Symbol('down'),
    LEFT: Symbol('left'),
    RIGHT: Symbol('right'),
    SCROLL_UP: Symbol('scrollUp'),
    SCROLL_DOWN: Symbol('scrollDown')
};

//The maximum allowable terrestrial height in the game is based on the 
//difference between the maximum and minimum elevations on earth
const EVEREST = 29000;
const MARIANA = -11000;
const MAX_TERRAIN_HEIGHT = EVEREST - MARIANA;
const SEA_LEVEL = Math.abs(MARIANA);

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 1.0;