import * as THREE from 'three'
import Tween from "./Tween";
import {Vector3} from "three";

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
    },
    workExperience: {
        x: -0.54,
        y: 1.26,
        z: -0.94
    }
}

const IDLE_CAMERA_LOOK = new THREE.Vector3(0, 0.7, 0)

class Camera extends THREE.PerspectiveCamera {
    constructor(cameraParams, scene) {
        super(...cameraParams);
        this.name = 'Camera'
        this.scene = scene;
        this.lookVector = new Vector3().copy(IDLE_CAMERA_LOOK);
    }

    init() {
        this.setDefaultPosition();
        this.setCurrentLookVector(IDLE_CAMERA_LOOK)
    }

    setDefaultPosition() {
        gui.addFolder('camera')
        gui.add(this.position, 'x', -10, 10, 0.02).onChange(() => {
            this.setLook();
        })
        gui.add(this.position, 'y', 0, 15, 0.02).onChange(() => {
            this.setLook();
        })
        gui.add(this.position, 'z', -1, 10, 0.02).onChange(() => {
            this.setLook();
        })

        this.setLook();
    }

    setLook = () => {
        this.lookAt(this.lookVector)
    }

    setCurrentLookVector(vector = new THREE.Vector3(0, 0, 0,)) {
        this.lookVector = new Vector3().copy(vector);
        this.setLook();
    }

    setLoadingState() {
        return new Promise(resolve => {
            resolve();
        })
    }

    endLoadingState() {
        return new Promise(resolve => {
            resolve();
        })
    }

    setIdleState() {
        return new Promise((resolve, reject) => {
            const animationDuration = 1;
            Tween.get(this.position, {override: true})
                .to(CAMERA_POSITIONS.idle, animationDuration, Tween.Ease.cubicOut)
                .addEventListener('change', () => {
                    this.setLook()
                })

            Tween.get(this.lookVector, {override: true})
                .to(IDLE_CAMERA_LOOK, animationDuration, Tween.Ease.cubicOut)
                .call(() => {
                    resolve()
                })
                .addEventListener('change', () => {
                    this.setLook();
                })
        })
    }

    endIdleState() {
    }

    setEducationState() {
        return new Promise((resolve, reject) => {
            const animationDuration = 1;
            const diploma = this.scene.getObjectByName('Diploma');
            Tween.get(this.position, {override: true})
                .to(CAMERA_POSITIONS.education, animationDuration, Tween.Ease.cubicOut)

            const currentLook = {
                x: this.lookVector.x,
                y: this.lookVector.y,
                z: this.lookVector.z,
            }

            const targetLook = {
                x: diploma.position.x,
                y: diploma.position.y,
                z: diploma.position.z,
            }

            Tween.get(currentLook, {override: true})
                .to(targetLook, animationDuration, Tween.Ease.cubicOut)
                .call(() => {
                    resolve()
                })
                .addEventListener('change', () => {
                    this.setCurrentLookVector(new Vector3(currentLook.x, currentLook.y, currentLook.z));
                })
        })
    }

    endEducationState() {
        return new Promise(resolve => {
            resolve();
        })
    }

    setWorkExperienceState() {
        return new Promise((resolve, reject) => {
            const animationDuration = 1;
            const shelf = this.scene.getObjectByName('Shelf');
            Tween.get(this.position, {override: true})
                .to(CAMERA_POSITIONS.workExperience, animationDuration, Tween.Ease.cubicOut)

            const targetLook = new Vector3().copy(shelf.position)
            targetLook.y += 1.2;

            Tween.get(this.lookVector, {override: true})
                .to(targetLook, animationDuration, Tween.Ease.cubicOut)
                .call(() => {
                    resolve();
                })
                .addEventListener('change', () => {
                    this.setLook();
                })
        })
    }

    endWorkExperienceState() {
    }
}

export {Camera}