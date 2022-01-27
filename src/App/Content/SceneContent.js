import * as THREE from 'three'
import {Vector3} from "three";
import Tween from "../helpers/Tween";

import {InteractionManager} from "../helpers/InteractionManager";
import {Shelf} from "./Shelf";

class SceneContent extends THREE.Scene {
    constructor() {
        super()
        this.interactionManager = null;
        this.shelfManager = null;
        this.background = '#ffffff'
        this.mixerAnimations = [];
        this.models = {};
        this.mashes = [];
        this.interactionObjects = [];
    }

    init() {
        this.addInteraction();
        this.addFloor();
        this.addShelf();
        this.addBasicLight();
        this.addLampLight();
        this.startMainCharAnimation();
        this.addControls();
        this.addDebugCube();
    }

    addModels(modelsObj) {
        for (let modelName in modelsObj) {
            const model = modelsObj[modelName];
            model.scene.traverse(node => {
                if(node.constructor.name === 'Object3D' || node.isMesh){
                    node.castShadow = true;
                    node.receiveShadow = true;
                    node.defaultScale = new Vector3().copy(node.scale);
                    node.scale.set(0, 0, 0)
                    this.mashes.push(node);
                }

            })
            model.scene.gltfAnimation = model.animations;
            this.models[modelName] = model;
            this.add(model.scene);
        }
    }

    scaleBackMashes(){
        console.log(this.models);
        this.mashes.forEach((mesh)=>{
            const curParams = {
                x: mesh.scale.x,
                y: mesh.scale.y,
                z: mesh.scale.z,
            }

            const targetParams = {
                x: mesh.defaultScale.x,
                y: mesh.defaultScale.y,
                z: mesh.defaultScale.z,
            }

            Tween.get(curParams)
                .to(targetParams, 0.7,  Tween.Ease.cubicOut)
                .addEventListener('change',()=>{
                    mesh.scale.set(...Object.values(curParams))
                })
        })
    }

    addInteraction(){
        this.interactionManager = new InteractionManager();
    }

    addBasicLight() {
        const ambientLight = new THREE.AmbientLight('#929292', 0.5)
        this.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.castShadow = true;
        directionalLight.shadow.bias = -0.00005;


        directionalLight.position.set(-3, 10, 3)

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.1);
        directionalLight2.shadow.mapSize.width = 2048;
        directionalLight2.shadow.mapSize.height = 2048;
        directionalLight2.castShadow = true;
        directionalLight2.shadow.bias = -0.00005;
        directionalLight2.position.set(-6.6, 1.28, -1.15)

        const pointLight = new THREE.PointLight( '#ffffff', 1.66, 1.8, 2.37 );
        pointLight.shadow.mapSize.width = 2048;
        pointLight.shadow.mapSize.height = 2048;
        pointLight.castShadow = true;
        pointLight.shadow.bias = -0.005;
        pointLight.position.set( -0.3, 1.3, -1.1 );

        //debug
        gui.addFolder('dirLight')
        gui.add(directionalLight.position, 'x', -15, 15, 0.02);
        gui.add(directionalLight.position, 'y', 0, 15, 0.02);
        gui.add(directionalLight.position, 'z', -15, 15, 0.02);

        gui.addFolder('pointLight')
        gui.add(pointLight.position, 'x', -3, 3, 0.02);
        gui.add(pointLight.position, 'y', 0, 3, 0.02);
        gui.add(pointLight.position, 'z', -3, 3, 0.02);
        gui.add(pointLight, 'intensity', -3, 3, 0.02);
        gui.add(pointLight, 'distance', -3, 3, 0.02);
        gui.add(pointLight, 'decay', 0, Math.PI*2, 0.01);


        this.add(directionalLight)
        this.add(directionalLight2)
        this.add( pointLight );
    };

    addLampLight(){
        const lampLight = new THREE.PointLight( '#ff8c00', 10, 1, Math.PI/2 );
        lampLight.position.set( 0.2, 1.38, 0.34 );
        this.add( lampLight );
        lampLight.shadow.mapSize.width = 2048;
        lampLight.shadow.mapSize.height = 2048;
        lampLight.castShadow = true;
        lampLight.shadow.bias = -0.005;
    }

    addFloor() {
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
    addShelf() {
        const shelfManager = new Shelf();

    };
    startMainCharAnimation() {
        const animationMixer = new THREE.AnimationMixer(this.models.mainCharacter.scene);
        const action = animationMixer.clipAction(this.models.mainCharacter.animations[0]);
        action.play();
        this.mixerAnimations.push(animationMixer)
    }

    addControls(){
        this.diplomaAddControls();
        this.addShelfControls();
        this.addAudioPlayerControls();
    }

    setInteractionOfObjects(interactive = true){
        this.interactionObjects.forEach((object)=>{
            object.interactive = interactive;
        })
    }

    diplomaAddControls(){
        const diploma  = this.getObjectByName('Diploma');
        diploma.defaultPosition = new THREE.Vector3();
        diploma.defaultPosition.copy(diploma.position)
        diploma.defaultRotation = new THREE.Euler();
        diploma.defaultRotation.copy(diploma.rotation);
        diploma.interactive = true;
        diploma.onMouseClick = ()=>{
            app.setState('education')
        }
        this.interactionObjects.push(diploma);
    }

    addShelfControls(){
        const shelf  = this.getObjectByName('Shelf');
        shelf.interactive = true;
        shelf.onMouseClick = ()=>{
            app.setState('work_experience')
        }
        this.interactionObjects.push(shelf);
    }

    addAudioPlayerControls(){
        const audioplayer  = this.getObjectByName('Audioplayer');
        audioplayer.interactive = true;
        audioplayer.onMouseClick = ()=>{
            console.log('music');
        }
        this.interactionObjects.push(audioplayer);
    }

    setLoadingState(){}

    endLoadingState(){
        return new Promise(resolve => {
            Tween.get({}).wait(0.7).call(()=>{
                this.scaleBackMashes();
                resolve();
            })
        })
    }

    setIdleState(){
        this.setInteractionOfObjects();
    }

    endIdleState(){
        this.setInteractionOfObjects(false);
    }

    setEducationState(){
        return new Promise(resolve => {
            const animationDuration = 0.5;
            const diploma  = this.getObjectByName('Diploma');
            Tween.get(diploma.position)
                .wait(0.5)
                .to({z: diploma.defaultPosition.z - 0.3}, animationDuration)
                .call(()=>{
                    const cameraPosition = new Vector3();
                    const cameraDirectionVector = app.camera.getWorldDirection(new Vector3());
                    cameraPosition.copy(app.camera.position);
                    cameraPosition.addScaledVector(cameraDirectionVector, 0.4)
                    Tween.get(diploma.position)
                        .to(cameraPosition, animationDuration)
                        .call(()=>{
                            resolve();
                        })

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
                    Tween.get(lookAtParams).to(lookAtTargetParams, animationDuration)
                        .addEventListener('change', () => {
                            diploma.lookAt(...Object.values(lookAtParams))
                        })
                })
        })
    }

    endEducationState(){
        return new Promise(resolve => {
            const animationDuration = 0.5;
            const diploma  = this.getObjectByName('Diploma');
            const firstStepPosition = new Vector3().copy(diploma.defaultPosition)
            firstStepPosition.z -= 0.3;
            Tween.get(diploma.position, {override: true})
                .to(firstStepPosition, animationDuration)
                .to(diploma.defaultPosition, animationDuration)
                .call(()=>{
                    resolve();
                })

            const currentRotationParams = {
                x: diploma.rotation.x,
                y: diploma.rotation.y,
                z: diploma.rotation.z,
            }
            const targetRotationParams  = {
                x: diploma.defaultRotation.x,
                y: diploma.defaultRotation.y,
                z: -diploma.defaultRotation.z,
            }
            Tween.get(currentRotationParams,{override: true})
                .to(targetRotationParams, animationDuration)
                .addEventListener('change', () => {
                    diploma.rotation.set(...Object.values(currentRotationParams).slice(0, 3), 'XYZ')
                })
        })
    }

    setWorkExperienceState(){}

    endWorkExperienceState(){}

    addDebugCube(){
        const geometry = new THREE.BoxGeometry( 0.05, 0.05, 0.05 );
        const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        const cube = new THREE.Mesh( geometry, material );
        this.add( cube );

        gui.addFolder('debugCube')
        gui.add(cube.position, 'x', -3, 3, 0.05).onChange(() => {
            app.camera.setCurrentLookVector(cube.position);
        })
        gui.add(cube.position, 'y', 0, 2, 0.05).onChange(() => {
            app.camera.setCurrentLookVector(cube.position);
        })
        gui.add(cube.position, 'z', -3, 3, 0.05).onChange(() => {
            app.camera.setCurrentLookVector(cube.position);
        })

    };
}

export {SceneContent}