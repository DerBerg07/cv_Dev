import * as THREE from 'three'
import {InteractionManager} from "../helpers/InteractionManager";
import {Tween} from "@tweenjs/tween.js";
import {Vector3} from "three";

class SceneContent extends THREE.Scene {
    constructor() {
        super()
        this.interactionManager = null;
        this.background = '#ffffff'
        this.mixerAnimations = [];
        this.models = {};
        this.floor = null;
    }

    init() {
        this.addInteraction();
        this.addGround();
        this.addBasicLight();
        this.startMainCharAnimation();
        this.addControls();
    }

    addModels(modelsObj) {
        for (let modelName in modelsObj) {
            const model = modelsObj[modelName];
            model.scene.traverse(node => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            })
            model.scene.gltfAnimation = model.animations;
            this.models[modelName] = model;
            this.add(model.scene);
        }
    }

    addInteraction(){
        this.interactionManager = new InteractionManager();
    }

    addBasicLight() {
        const ambientLight = new THREE.AmbientLight('#929292', 0.5)
        this.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.castShadow = true;
        directionalLight.shadow.bias = -0.00005;


        directionalLight.position.set(-3, 10, 3)

        //debug
        gui.addFolder('dirLight')
        gui.add(directionalLight.position, 'x', -15, 15, 0.2);
        gui.add(directionalLight.position, 'y', 0, 15, 0.2);
        gui.add(directionalLight.position, 'z', -15, 15, 0.2);


        this.add(directionalLight)
    };

    addGround() {
        this.floor = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 10),
            new THREE.MeshStandardMaterial({
                color: '#ffffff',
                metalness: 0,
                roughness: 0.5
            })
        )
        this.floor.receiveShadow = true
        this.floor.rotation.x = -Math.PI * 0.5
        this.add(this.floor)
    }

    startMainCharAnimation() {
        const animationMixer = new THREE.AnimationMixer(this.models.mainCharacter.scene);
        const action = animationMixer.clipAction(this.models.mainCharacter.animations[0]);
        action.play();
        this.mixerAnimations.push(animationMixer)
    }

    addControls(){
        this.diplomaAddControls();
    }

    diplomaAddControls(){
        const diploma  = this.getObjectByName('Diploma');
        diploma.defaultPosition = diploma.position;
        diploma.defaultRotation = new THREE.Euler();
        diploma.defaultRotation.copy(diploma.rotation);
        diploma.interactive = true;
        diploma.onMouseClick = ()=>{
            app.setState('education')
        }
    }

    setState(nextState, prevState){
        switch (nextState) {
            case 'idle':
                break
            case 'education':
                 this.setEducationState()
                break;
        }
    }

    setEducationState(){
        const diploma  = this.getObjectByName('Diploma');
        diploma.interactive = false;
        const moveFromCupTween = new TWEEN.Tween(diploma.position)
            .delay(500)
            .to({z: diploma.defaultPosition.z - 0.3}, 500)
            .onComplete(()=>{

                const cameraPosition = new Vector3();
                const cameraDirectionVector = app.camera.getWorldDirection(new Vector3());
                cameraPosition.copy(app.camera.position);
                cameraPosition.addScaledVector(cameraDirectionVector, 0.3)
                const movetoCameraCupTween = new TWEEN.Tween(diploma.position).to(cameraPosition, 500)
                    .start();

                const lookAtParams = {
                    x: diploma.position.x,
                    y: diploma.position.y + 1,
                    z: -diploma.position.z
                }
                const lookAtTargetParams = {
                    x: app.camera.position.x,
                    y: app.camera.position.y,
                    z: app.camera.position.z,
                }
                const lookAtCameraTween = new TWEEN.Tween(lookAtParams).to(lookAtTargetParams, 500)
                    .onUpdate(()=>{
                        diploma.lookAt(...Object.values(lookAtParams))
                    })
                    .start();
            }).start()
    }

    endEducationState(){

    }
}

export {SceneContent}