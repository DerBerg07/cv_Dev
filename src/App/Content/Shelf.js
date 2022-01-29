import {Box3, Euler, Mesh, MeshBasicMaterial, SphereGeometry, Vector3} from "three";
import * as THREE from 'three'
import Tween from "../helpers/Tween";

const TROPHIES = ['Qplaze', 'Evoplay', 'Ejaw']
const FRAMES = ['ThreeJs', 'PixiJs', 'CSS', 'JS', 'React', 'Redux', 'Blender', 'Photoshop', 'Lightroom', 'Figma']

class Shelf {
    constructor() {
        this.interactiveTrophies = false;
        this.trophies = [];
        this.frames = [];
        this.shelf = app.scene.getObjectByName('Shelf')
    }

    init() {
        this.addInteractiveModels();
    }

    addInteractiveModels() {
        this.addTrophies()
        this.addFrames()
    }

    addTrophies() {
        TROPHIES.forEach(trophyName => {
            this.initTrophy(trophyName)
        })
    }

    initTrophy(objectName) {
        const trophy = app.scene.getObjectByName(objectName)
        this.shelf.attach(trophy);
        this.addOnClickTrophy(trophy);
        app.ui.createWorkExpInfoContent(trophy);
        this.addInteractionSphere(trophy);
        this.trophies.push(trophy);
    }

    addInteractionSphere(object) {
        const boxHelper = new Box3().setFromObject(object);
        const objectSize = boxHelper.getSize(new Vector3());
        const geometry = new SphereGeometry(objectSize.y * 1.5 / 2, 4, 5);
        const material = new MeshBasicMaterial({color: 0xffff00});
        const sphere = new Mesh(geometry, material);
        const objectWorldPosition = object.getWorldPosition(new Vector3());
        objectWorldPosition.y += objectSize.y / 2;
        sphere.position.copy(objectWorldPosition);
        sphere.visible = false;
        app.scene.add(sphere);
        object.attach(sphere)
    }

    addOnClickTrophy = (trophy) => {
        trophy.defaultPosition = new Vector3().copy(trophy.position);
        trophy.defaultRotation = new Euler().copy(trophy.rotation);
        trophy.isShowing = false;

        trophy.onMouseClick = () => {
            if (!trophy.isShowing) {
                trophy.show()
                app.ui.hideHardSkillsButton();
            } else {
                trophy.hide();
                app.ui.showHardSkillsButton();
            }
        }

        trophy.show = () => {
            trophy.isShowing = !trophy.isShowing;
            this.setInteractiveTrophies(!trophy.isShowing);
            const targetPosition = new Vector3().copy(app.camera.position);
            const cameraDirectionVector = app.camera.getWorldDirection(new Vector3());
            targetPosition.addScaledVector(cameraDirectionVector, 0.5)
            targetPosition.y = targetPosition.y - 0.12;

            app.scene.attach(trophy)

            Tween.get(trophy.position)
                .to(targetPosition, 0.3)
                .call(() => {
                    this.shelf.attach(trophy)
                    trophy.interactive = true;
                    trophy.showInfo();
                })
        }

        trophy.hide = () => {
            trophy.isShowing = !trophy.isShowing;
            this.setInteractiveTrophies(!trophy.isShowing);
            trophy.hideInfo();
            trophy.interactive = false;
            Tween.get(trophy.position)
                .wait(0.6)
                .to(trophy.defaultPosition, 0.3)
                .call(() => {
                    trophy.interactive = this.interactiveTrophies
                })
        }
    }

    hideTrophies() {
        this.trophies.forEach(trophy => {
            trophy.hide();
        })
    }

    addFrames() {
        FRAMES.forEach(frameName => {
            this.initFrame(frameName)
        })
    }

    initFrame(frameName) {
        const frame = app.scene.getObjectByName(frameName);
        this.addFrameOnHover(frame);
        this.shelf.attach(frame);
        this.frames.push(frame);
    }

    addFrameOnHover(frame){
        const label = app.ui.createFrameLabel(frame);
        const correctionVector = new Vector3(0,0.1, 0)
        app.ui.addHtmlLabelToObject(frame, label, correctionVector);
        frame.onHoverIn = ()=>{
            frame.showInfo()
        }

        frame.onHoverOut = ()=>{
            frame.hideInfo()
        }
    }

    setInteractiveTrophies(interactive) {
        this.interactiveTrophies = interactive;
        this.shelfModelsInteractive(interactive)
    }

    setInteractiveFrames(interactive){
        this.frames.forEach(model => {
            model.interactive = interactive;
        })
    }

    shelfModelsInteractive(interactive) {
        this.trophies.forEach(model => {
            model.interactive = interactive;
        })
    }

    startShelfTrophyScene() {
        this.setInteractiveTrophies(true);
        app.ui.showHardSkillsButton();
    }

    endShelfTrophyScene() {
        this.hideTrophies();
        this.setInteractiveTrophies(false);
    }

    startShelfFrameScene() {
        this.setInteractiveFrames(true);
    }

    endShelfFrameScene() {
        this.setInteractiveFrames(false);
    }



}

export {Shelf}