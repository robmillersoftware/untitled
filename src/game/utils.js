/**
 * Map height range to hex colors. 0-255 are valid ranges for each comopnent.
 * The colors go from red to yellow to green. Blue is unused currently
 * 511 is maximum output value (256 * 2 - 1)
 * @param {*} height
 */
export const hexFromHeight = (height) => {
    let output = Math.floor(height / MAX_TERRAIN_HEIGHT * 511);
    let r = output > 255 ? 511 - output : 255;
    let g = output > 255 ? 255 : output;
    let b = 0;

    return '0x' + (Math.abs(r<<16|g<<8|b)).toString(16);
}

/**
 * Safely stringifys a JSON object with circular dependencies
 */
export const safeStringify = obj => {
    var cache = [];

    if (obj === null) return null;

    return JSON.stringify(obj, (key, value) => {
      if (value instanceof Object) {
        if (cache.indexOf(value) !== -1) {
          // Circular reference found, discard key
          return;
        }
        // Store value in our collection
        cache.push(value);
      }
      return value;
    });
  }