const dest = './dest';
const src = './src';

module.exports = {
    dest: dest,
    src: src,
    browserSync: require('browser-sync').create(),
    browserSyncInit: {
        port: 3000
        server: {
            baseDir: dest,
            index: 'index.html'
        },
        open: false
    },
    browserify: {
        entries: src + '/js/app.js', 
        debug: true
    },
    babelify: {
        presets: ["es2015"] 
    }
};