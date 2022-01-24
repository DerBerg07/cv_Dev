import * as THREE from 'three'

const CAMERA_POSITIONS = {
    idle: {
        x: -2.8,
        y: 1.6,
        z: -0.4
    },
    education: {
        x: -1.4,
        y: 1.45,
        z: -0.45
    }

}

class Camera extends THREE.PerspectiveCamera {
    constructor(cameraParams, scene) {
        super(...cameraParams);
        this.name = 'Camera'
        this.scene = scene;
        this.lookVector = new THREE.Vector3(0, 0, 0);
    }

    init() {
        this.setDefaultPosition();
        this.setCurrentLookVector(new THREE.Vector3(0, 1, 0))
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

    setLook() {
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
        const tween = new TWEEN.Tween(this.position)
            .to(CAMERA_POSITIONS.idle, 1000)
            .onUpdate(() => {
                this.setLook()
            })
            .start()
    }

    endIdleState() {

    }

    setEducationState() {
        const diploma = this.scene.getObjectByName('Diploma');
        const cameraPositionTween = new TWEEN.Tween(this.position)
            .to(CAMERA_POSITIONS.education, 500)
            .easing(TWEEN.Easing.Exponential.Out);

        const cameraLookAtEasing = new TWEEN.Tween(this.lookVector)
            .to(diploma.position, 500)
            .easing(TWEEN.Easing.Exponential.Out)
            .onUpdate(()=>{
                this.setLook();
            })
        cameraPositionTween.start();
        cameraLookAtEasing.start();
    }

    endEducationState() {

    }
}

export {Camera}