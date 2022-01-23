import * as THREE from 'three'

class Camera extends THREE.PerspectiveCamera {
    constructor(cameraParams, scene) {
        super(...cameraParams);
        this.scene = scene;
        this.lookVector = new THREE.Vector3(0,0,0);
    }

    init() {
        this.setDefaultPosition();
        this.setCurrentLookVector(new THREE.Vector3(0,1,0))
    }

    setDefaultPosition() {
        this.position.set(-2.8, 1.6, -0.4,)
        gui.addFolder('camera')
        gui.add(this.position, 'x', -15, 15, 0.05).onChange(()=>{
            this.setLook();
        })
        gui.add(this.position, 'y', 0, 15, 0.05).onChange(()=>{
            this.setLook();
        })
        gui.add(this.position, 'z', -15, 15, 0.05).onChange(()=>{
            this.setLook();
        })

        this.setLook();
    }

    setLook() {
        this.lookAt(this.lookVector)
    }

    setCurrentLookVector(vector = new THREE.Vector3(0,0,0,)){
        gui.addFolder('camera vector')
        const vectorParams = {
            x: 0,
            y: 0,
            z: 0,
        }
        gui.add(vectorParams, 'x', -15, 15, 0.05).onChange(()=>{
            this.lookVector.setX(vectorParams.x)
            this.setLook();
        })
        gui.add(vectorParams, 'y', 0, 15, 0.05).onChange(()=>{
            this.lookVector.setY(vectorParams.y)
            this.setLook();
        })
        gui.add(vectorParams, 'z', -15, 15,0.05).onChange(()=>{
            this.lookVector.setZ(vectorParams.z)
            this.setLook();
        })

        this.lookVector = vector;
        this.setLook();
    }

    setState(nextState, prevState){

    }
}

export {Camera}