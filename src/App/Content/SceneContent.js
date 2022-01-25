import * as THREE from 'three'
import {InteractionManager} from "../helpers/InteractionManager";
import {Vector3} from "three";
import Tween from "../helpers/Tween";

class SceneContent extends THREE.Scene {
    constructor() {
        super()
        this.interactionManager = null;
        this.background = '#ffffff'
        this.mixerAnimations = [];
        this.models = {};
    }

    init() {
        this.addInteraction();
        this.Floor();
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

    Floor() {
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 10),
            new THREE.MeshStandardMaterial({
                color: '#ffffff',
                metalness: 0,
                roughness: 0.5
            })
        )
        floor.name = 'Floor';
        floor.receiveShadow = true
        floor.rotation.x = -Math.PI * 0.5
        this.add(floor)
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
        diploma.defaultPosition = new THREE.Vector3();
        diploma.defaultPosition.copy(diploma.position)
        console.log('default pos', diploma.defaultPosition)
        diploma.defaultRotation = new THREE.Euler();
        console.log(diploma.rotation);
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

        switch (prevState) {
            case 'idle':
                break
            case 'education':
                this.endEducationState()
                break;
        }
    }

    setEducationState(){
        const diploma  = this.getObjectByName('Diploma');
        diploma.interactive = false;
        Tween.get(diploma.position)
            .wait(0.5)
            .to({z: diploma.defaultPosition.z - 0.3}, 0.5)
            .call(()=>{
                const cameraPosition = new Vector3();
                const cameraDirectionVector = app.camera.getWorldDirection(new Vector3());
                cameraPosition.copy(app.camera.position);
                cameraPosition.addScaledVector(cameraDirectionVector, 0.4)
                Tween.get(diploma.position)
                    .to(cameraPosition, 0.5)


                const lookAtParams = {
                    x: diploma.position.x,
                    y: diploma.position.y -1 ,
                    z: -diploma.position.z
                }
                const lookAtTargetParams = {
                    x: app.camera.position.x,
                    y: app.camera.position.y,
                    z: app.camera.position.z,
                }
              Tween.get(lookAtParams).to(lookAtTargetParams, 0.5)
                  .addEventListener('change', () => {
                        diploma.lookAt(...Object.values(lookAtParams))
                    })
            })
    }

    endEducationState(){
        const diploma  = this.getObjectByName('Diploma');
        diploma.interactive = true;
        const firstStepPosition = new Vector3().copy(diploma.defaultPosition)
        firstStepPosition.z -= 0.3;
        Tween.get(diploma.position, {override: true})
            .to(firstStepPosition, 0.5)
            .to(diploma.defaultPosition, 0.5)

        const currentRotationParams = {
            x: diploma.rotation.x,
            y: diploma.rotation.y,
            z: diploma.rotation.z,
        }
        console.log(Object.values(currentRotationParams));
        const targetRotationParams  = {
            x: diploma.defaultRotation.x,
            y: diploma.defaultRotation.y,
            z: -diploma.defaultRotation.z,
        }
        Tween.get(currentRotationParams,{override: true})
            .to(targetRotationParams, 0.5)
            .addEventListener('change', () => {
                diploma.rotation.set(...Object.values(currentRotationParams).slice(0, 3), 'XYZ')
            })


    }
}

export {SceneContent}