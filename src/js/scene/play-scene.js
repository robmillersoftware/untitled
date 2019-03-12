import {InputProcessor} from 'input/input-processor';
import {Camera} from 'camera';
import {Terrain} from 'terrain/terrain';

export class PlayScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'play',
        });

        //These correspond to UI elements for the procedural terrain
        //debugging UI
        this.uiPanel = null;
        this.delaunayCheck = null;
        this.voronoiCheck = null;
        this.sitesCheck = null;
        this.terrainCheck = null;
        this.delaunayText = null;
        this.voronoiText = null;
        this.sitesText = null;
        this.terrainCheck = null;
     }

    create() {
        this.sceneryGroup = this.add.group();

        this.terrain = new Terrain(this);
        this.terrain.init();

        this.sceneryGroup.add(this.terrain.baseGroup);

        this.camera = new Camera(this, this.sceneryGroup);
        this.input = new InputProcessor();
        this.input.setTarget(this.camera);

        /**
         * Build the debugging UI
         */
        /*this.slickUI.add(this.uiPanel = new SlickUI.Element.Panel(32, 32, 150, 180));
        this.uiPanel.add(this.sitesCheck = new SlickUI.Element.Checkbox(0, 0));
        this.uiPanel.add(this.sitesText = new SlickUI.Element.Text(40, 5, "Sites", 16, 'minecraftia', 90, 20));
        this.uiPanel.add(this.delaunayCheck = new SlickUI.Element.Checkbox(0, 40));
        this.uiPanel.add(this.delaunayText = new SlickUI.Element.Text(40, 45, "Delaunay", 16, 'minecraftia', 90, 20));
        this.uiPanel.add(this.voronoiCheck = new SlickUI.Element.Checkbox(0, 80));
        this.uiPanel.add(this.voronoiText = new SlickUI.Element.Text(40, 85, "Voronoi", 16, 'minecraftia', 90, 20));
        this.uiPanel.add(this.terrainCheck = new SlickUI.Element.Checkbox(0, 120));
        this.uiPanel.add(this.terrainText = new SlickUI.Element.Text(40, 125, "Terrain", 16, 'minecraftia', 90, 20));
        */
        //this.sitesCheck.checked = true;
        //this.delaunayCheck.checked = true;
        //this.voronoiCheck.checked = true;
        //this.terrainCheck.checked = true;

        //TODO: FIGURE THIS SHIT OUT

    }

    update() {
        this.input.processInput();
        this.terrain.checkPlayerPosition(this.camera.cursor);
    }

    resize(width, height) {
        this.sceneryGroup.centerX = this.game.world.centerX;
        this.sceneryGroup.centerY = this.game.world.centerY;
    }

    render() {
        this.terrain.draw();
        //this.terrain.draw(this.delaunayCheck.checked, this.voronoiCheck.checked, this.sitesCheck.checked, this.terrainCheck.checked);
    }
}