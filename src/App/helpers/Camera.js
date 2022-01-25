import * as THREE from 'three'
import Tween from "./Tween";

const CAMERA_POSITIONS = {
    idle: {
        x: -2.9,
        y: 1.6,
        z: -0.4
    },
    education: {
        x: -1.4,
        y: 1.45,
        z: -0.45
    }
}

const IDLE_CAMERA_LOOK = new THREE.Vector3(0,0.7,0)

class Camera extends THREE.PerspectiveCamera {
    constructor(cameraParams, scene) {
        super(...cameraParams);
        this.name = 'Camera'
        this.scene = scene;
        this.lookVector = IDLE_CAMERA_LOOK;
    }

    init() {
        this.setDefaultPosition();
        this.setCurrentLookVector(IDLE_CAMERA_LOOK)
    }

    setDefaultPosition() {
        gui.addFolder('camera')
        gui.add(this.position, 'x', -15, 15, 0.05).onChange(() => {
            this.setLook();
        })
        gui.add(this.position, 'y', 0, 15, 0.05).onChange(() => {
            this.setLook();
        })
        gui.add(this.position, 'z', -15, 15, 0.05).onChange(() => {
            this.setLook();
        })

        this.setLook();
    }

    setLook =() => {
        this.lookAt(this.lookVector)
    }

    setCurrentLookVector(vector = new THREE.Vector3(0, 0, 0,)) {
        gui.addFolder('camera vector')
        this.lookVector = vector;
        this.setLook();
    }

    setState(nextState, prevState) {
        switch (nextState) {
            case 'idle':
                this.setIdleState();
                break;
            case 'education':
                this.setEducationState();
                break;
        }

        switch (prevState) {
            case 'idle':
                this.endIdleState();
                break
            case 'education':
                this.endEducationState();
                break;
        }
    }

    setIdleState() {
        const tween = Tween.get(this.position, {override: true})
            .to(CAMERA_POSITIONS.idle, 1)
            .addEventListener('change', () => {
                this.setLook()
            })

        Tween.get(this.lookVector, {override: true})
            .to(IDLE_CAMERA_LOOK, 1, Tween.Ease.cubicOut)
            .addEventListener('change', () => {
                this.setLook();
            })
    }

    endIdleState() {

    }

    setEducationState() {
        const diploma = this.scene.getObjectByName('Diploma');
        Tween.get(this.position, {override: true})
            .to(CAMERA_POSITIONS.education, 1, Tween.Ease.cubicOut)

       Tween.get(this.lookVector, {override: true})
            .to(diploma.position, 1, Tween.Ease.cubicOut)
           .addEventListener('change', () => {
                this.setLook();
            })
    }

    endEducationState() {

    }
}

export {Camera}