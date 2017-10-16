/**
 * Gulp build file. Aggregates tasks and configurations found in gulp/tasks folder
 * Any logic that would be added here likely should be added there instead.
 */
const requireDir = require('require-dir');
requireDir('./gulp/tasks', {recurse: true});