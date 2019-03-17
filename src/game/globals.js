/**
 * This file contains all global constants for this game.
 */

//The size in pixels of the assets used for map tiles
export const TILE_SIZE = 512;

//The height and width of each chunk in tiles
export const CHUNK_SIZE = 3;

//The maximum allowable terrestrial height in the game is based on the
//difference between the maximum and minimum elevations on earth
export const EVEREST = 29000;
export const MARIANA = -11000;
export const MAX_TERRAIN_HEIGHT = EVEREST - MARIANA;
export const SEA_LEVEL = Math.abs(MARIANA);

export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 1.0;

//An object containing a property for each control supported by this game
export const CONTROLS = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right',
    SCROLL_UP: 'scrollUp',
    SCROLL_DOWN: 'scrollDown'
};