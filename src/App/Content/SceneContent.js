import * as THREE from 'three'
import {Vector3} from "three";
import Tween from "../helpers/Tween";

import {InteractionManager} from "../helpers/InteractionManager";
import {Shelf} from "./Shelf";
import {AudioManager} from "../helpers/AudioManager";
import {AnimationManager} from "../helpers/AnimationManager";

class SceneContent extends THREE.Scene {
    constructor() {
        super()
        this.interactionManager = null;
        this.shelfManager = null;
        this.background = '#ffffff'
        this.models = {};
        this.mashes = [];
        this.interactionObjects = [];
        this.audioManager = null;
        this.animationManager =   this.addAnimation();
    }

    init() {
        this.addAudio();
        this.addInteraction();
        this.addFloor();
        this.addBasicLight();
        this.addLampLight();
        this.addControls();
        this.addShelf();
    }

    addModels(modelsObj) {
        for (let modelName in modelsObj) {
            const model = modelsObj[modelName];
            model.scene.traverse(node => {
                if (node.constructor.name === 'Object3D' || node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    node.defaultScale = new Vector3().copy(node.scale);
                    this.mashes.push(node);
                }
            })
            this.animationManager.addAnimations(model);
            this.models[modelName] = model;
            this.add(model.scene);
        }
    }

    addAudio(){
        this.audioManager = new AudioManager();
    }

    addAnimation(){
        return  new AnimationManager();
    }

    scaleBackMashes() {
        this.mashes.forEach((mesh) => {
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
                .to(targetParams, 0.7, Tween.Ease.cubicOut)
                .addEventListener('change', () => {
                    mesh.scale.set(...Object.values(curParams))
                })
        })
    }

    addInteraction() {
        this.interactionManager = new InteractionManager();
    }

    addBasicLight() {
        const ambientLight = new THREE.AmbientLight('#929292', 0.7)
        this.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.shadow.camera.left = -2;
        directionalLight.shadow.camera.right = 2;
        directionalLight.shadow.camera.top = 2.5;
        directionalLight.shadow.camera.bottom = -2;
        directionalLight.shadow.mapSize.width = 512;
        directionalLight.shadow.mapSize.height = 512;
        directionalLight.castShadow = true;
        directionalLight.shadow.bias = -0.00005;
        directionalLight.position.set(-3, 10, 3)
        this.add(directionalLight)

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.2);
        directionalLight2.shadow.camera.left = -2;
        directionalLight2.shadow.camera.right = 2;
        directionalLight2.shadow.camera.top = 2;
        directionalLight2.shadow.camera.bottom = -2;
        directionalLight2.shadow.mapSize.width = 512;
        directionalLight2.shadow.mapSize.height = 512;
        directionalLight2.castShadow = true;
        directionalLight2.shadow.bias = -0.00005;
        directionalLight2.position.set(-12, 3, -1.15)
        this.add(directionalLight2);

        //debug
        gui.addFolder('dirLight')
        gui.add(directionalLight2.position, 'x', -15, 15, 0.02);
        gui.add(directionalLight2.position, 'y', 0, 15, 0.02);
        gui.add(directionalLight2.position, 'z', -15, 15, 0.02);
    };

    addLampLight() {
        const lampLight = new THREE.PointLight('#ff8c00', 10, 0.8, Math.PI / 2);
        lampLight.position.set(0.2, 1.38, 0.34)
        lampLight.shadow.camera.left = -1.5;
        lampLight.shadow.camera.right = 1.5;
        lampLight.shadow.camera.top = 1.5;
        lampLight.shadow.camera.bottom = -1.5;
        lampLight.shadow.mapSize.width = 512;
        lampLight.shadow.mapSize.height = 512;
        lampLight.castShadow = true;
        lampLight.shadow.bias = -0.005;

        this.add(lampLight);
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
        this.shelfManager = new Shelf();
        this.shelfManager.init();
    };

    addControls() {
        this.diplomaAddControls();
        this.addShelfControls();
        this.addAudioPlayerControls();
    }

    setInteractionOfObjects(interactive = true) {
        this.interactionObjects.forEach((object) => {
            object.interactive = interactive;
        })
    }

    diplomaAddControls() {
        const diploma = this.getObjectByName('Diploma');
        diploma.defaultPosition = new THREE.Vector3().copy(diploma.position);
        diploma.defaultRotation = new THREE.Euler().copy(diploma.rotation);
        diploma.interactive = true;
        diploma.onMouseClick = () => {
            app.setState('education')
        }
        this.interactionObjects.push(diploma);
    }

    addShelfControls() {
        const shelf = this.getObjectByName('Shelf');
        shelf.interactive = true;
        shelf.onMouseClick = () => {
            app.setState('work_experience')
        }
        this.interactionObjects.push(shelf);
    }

    addAudioPlayerControls() {
        const audioplayer = this.getObjectByName('Audioplayer');
        audioplayer.interactive = true;
        audioplayer.onMouseClick = () => {
            this.animationManager.trigger(this.audioManager.triggerAudio());
        }
        this.interactionObjects.push(audioplayer);
    }

    setLoadingState() {
    }

    endLoadingState() {
        return new Promise(resolve => {
            Tween.get({}).wait(0.7).call(() => {
                app.renderer.shadowMap.autoUpdate = false;
                this.mashes.forEach(mesh => {
                    mesh.scale.set(0, 0, 0)
                })
                this.scaleBackMashes();
                resolve();
            })
        })
    }

    setIdleState() {
        this.setInteractionOfObjects();
    }

    endIdleState() {
        this.setInteractionOfObjects(false);
    }

    setEducationState() {
        return new Promise(resolve => {
            const animationDuration = 0.4;
            const diploma = this.getObjectByName('Diploma');
            Tween.get(diploma.position)
                .wait(0.5)
                .to({z: diploma.defaultPosition.z - 0.3}, animationDuration)
                .call(() => {
                    const cameraPosition = new Vector3().copy(app.camera.position);
                    const cameraDirectionVector = app.camera.getWorldDirection(new Vector3());
                    cameraPosition.addScaledVector(cameraDirectionVector, 0.4)
                    Tween.get(diploma.position)
                        .to(cameraPosition, animationDuration)
                        .call(() => {
                            resolve();
                        })

                    const lookAtParams = {
                        x: diploma.position.x,
                        y: diploma.position.y - 1,
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

    endEducationState() {
        return new Promise(resolve => {
            const animationDuration = 0.3;
            const diploma = this.getObjectByName('Diploma');
            const firstStepPosition = new Vector3().copy(diploma.defaultPosition)
            firstStepPosition.z = -firstStepPosition.z;
            Tween.get(diploma.position, {override: true})
                .to(firstStepPosition, animationDuration)
                .to(diploma.defaultPosition, animationDuration)
                .call(() => {
                    resolve();
                })

            const targetRotationVector = new Vector3().copy(diploma.defaultRotation)
            targetRotationVector.z = -targetRotationVector.z;

            Tween.get(diploma.rotation, {override: true})
                .to(targetRotationVector, animationDuration)
                .addEventListener('change', () => {
                })
        })
    }

    setWorkExperienceState() {
        return new Promise(resolve => {
            this.shelfManager.startShelfTrophyScene();
            resolve()
        })
    }

    endWorkExperienceState() {
        return new Promise(resolve => {
            this.shelfManager.endShelfTrophyScene();
            resolve()
        })
    }

    setStateHardSkills() {
        return new Promise((resolve, reject) => {
            this.shelfManager.startShelfFrameScene()
            resolve()
        })
    }

    endStateHardSkills() {
        return new Promise((resolve, reject) => {
            this.shelfManager.endShelfFrameScene()
            resolve()
        })
    }
}

export {SceneContent}