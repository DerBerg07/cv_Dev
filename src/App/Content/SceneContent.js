import * as THREE from 'three'
import {Vector3} from "three";
import Tween from "../helpers/Tween";

import {InteractionManager} from "../helpers/InteractionManager";
import {Shelf} from "./Shelf";
import {AudioManager} from "../helpers/AudioManager";
import {AnimationManager} from "../helpers/AnimationManager";
import {WorldTag} from "./Components/WorldTag";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";

class SceneContent extends THREE.Scene {
    constructor() {
        super();
        this.interactionManager = null;
        this.shelfManager = null;
        this.background = '#ffffff';
        this.models = {};
        this.mashes = [];
        this.texts = [];
        this.interactionObjects = [];
        this.audioManager = null;
        this.animationManager = this.addAnimation();
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
            });
            this.animationManager.addAnimations(model);
            this.models[modelName] = model;
            this.add(model.scene);
        }
    }

    addAudio() {
        this.audioManager = new AudioManager();
    }

    addAnimation() {
        return new AnimationManager();
    }

    scaleBackMashes() {
        this.mashes.forEach((mesh) => {
            const curParams = {
                x: mesh.scale.x,
                y: mesh.scale.y,
                z: mesh.scale.z,
            };

            const targetParams = {
                x: mesh.defaultScale.x,
                y: mesh.defaultScale.y,
                z: mesh.defaultScale.z,
            };

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
        const ambientLight = new THREE.AmbientLight('#929292', 0.7);
        this.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.shadow.camera.left = -2;
        directionalLight.shadow.camera.right = 2;
        directionalLight.shadow.camera.top = 2.5;
        directionalLight.shadow.camera.bottom = -2;
        directionalLight.shadow.mapSize.width = 512;
        directionalLight.shadow.mapSize.height = 512;
        directionalLight.castShadow = true;
        directionalLight.shadow.bias = -0.00005;
        directionalLight.position.set(-3, 10, 3);
        this.add(directionalLight);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.2);
        directionalLight2.shadow.camera.left = -2;
        directionalLight2.shadow.camera.right = 2;
        directionalLight2.shadow.camera.top = 2;
        directionalLight2.shadow.camera.bottom = -2;
        directionalLight2.shadow.mapSize.width = 512;
        directionalLight2.shadow.mapSize.height = 512;
        directionalLight2.castShadow = true;
        directionalLight2.shadow.bias = -0.00005;
        directionalLight2.position.set(-12, 3, -1.15);
        this.add(directionalLight2);

        //debug
        gui.addFolder('dirLight');
        gui.add(directionalLight2.position, 'x', -15, 15, 0.02);
        gui.add(directionalLight2.position, 'y', 0, 15, 0.02);
        gui.add(directionalLight2.position, 'z', -15, 15, 0.02);
    };

    addLampLight() {
        const lampLight = new THREE.PointLight('#ff8c00', 10, 0.8, Math.PI / 2);
        lampLight.position.set(0.2, 1.38, 0.34);
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
        );
        floor.name = 'Floor';
        floor.receiveShadow = true;
        floor.rotation.x = -Math.PI * 0.5;
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
        this.addCameraControls();
        this.addFloppyControls();
        this.addBackpackControls();
    }

    createText(text, size, element, positionCorrection = new Vector3(), rotationY = Math.PI * 3 / 2) {
        const geometry = new TextGeometry(text, {
            font: app.loader.fonts.roboto,
            size: size,
            height: 0.00001
        });
        geometry.center();
        const material = new THREE.MeshStandardMaterial({color: 0x070707});
        const textMesh = new THREE.Mesh(geometry, material);
        textMesh.position.copy(element.position);
        this.texts.push(textMesh);
        textMesh.rotation.y = rotationY;
        textMesh.position.add(positionCorrection);
        return textMesh;
    }

    hideText() {
        this.texts.forEach(text => {
            Tween.get(text.scale).to({x: 0, y: 0, z: 0}, 0.5)
        })
    }

    showText() {
        this.texts.forEach(text => {
            Tween.get(text.scale).to({x: 1, y: 1, z: 1}, 0.5)
        })
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
        };
        const diplomaText = this.createText('EDUCATION', 0.05, diploma, new Vector3(-0.15, -0.05, 0));
        this.add(diplomaText);
        this.interactionObjects.push(diploma);
    }

    addShelfControls() {
        const shelf = this.getObjectByName('Shelf');
        shelf.interactive = true;
        shelf.onMouseClick = () => {
            app.setState('work_experience')
        };
        const shelfText = this.createText(
            'WORK EXPERIENCE',
            0.1,
            shelf,
            new Vector3(0, 1.6, 0),
            shelf.rotation.y - Math.PI / 2.5
        );
        this.add(shelfText);
        this.interactionObjects.push(shelf);
    }

    addAudioPlayerControls() {
        const audioplayer = this.getObjectByName('Audioplayer');
        audioplayer.interactive = true;
        audioplayer.triggerable = true;
        audioplayer.onMouseClick = () => {
            this.animationManager.trigger(this.audioManager.triggerAudio());
        };
        const audioText = this.createText(
            'MUSIC',
            0.07,
            audioplayer,
            new Vector3(0, 0.6, 0),
            audioplayer.rotation.y - Math.PI / 2
        );
        this.add(audioText);
        this.interactionObjects.push(audioplayer);
    }

    addCameraControls() {
        const camera = this.getObjectByName('PhotoCamera');
        camera.interactive = true;
        camera.triggerable = true;
        camera.onMouseClick = () => {
            window.open('https://www.instagram.com/numb_squirrel/')
        };
        const cameraText = this.createText(
            'MY PHOTOS',
            0.05,
            camera,
            new Vector3(-0.1, 0.1, 0.1),
            camera.rotation.y - Math.PI / 6
        );
        this.add(cameraText);
        this.interactionObjects.push(camera);
    }

    addFloppyControls() {
        const floppy = this.getObjectByName('Floppy');
        floppy.interactive = true;
        floppy.triggerable = true;
        floppy.onMouseClick = () => {
            const element = document.createElement('a');
            element.setAttribute('href', 'docs/CV_OLEH_HORA.pdf');
            element.setAttribute('download', 'docs/CV_OLEH_HORA.pdf');
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        };
        const floppyText = this.createText(
            'DOWNLOAD PDF',
            0.07,
            floppy,
            new Vector3(0, 0.15, 0),
        );
        this.add(floppyText);
        this.interactionObjects.push(floppy);
    }

    addBackpackControls() {
        const backpack = this.getObjectByName('Backpack');
        backpack.interactive = true;
        backpack.triggerable = true;
        backpack.onMouseClick = () => {
            app.setState('contacts')
        };
        const backpackText = this.createText(
            'CONTACTS',
            0.07,
            backpack,
            new Vector3(-0.4, -0.3, -0.5),
            backpack.rotation.y - Math.PI / 1.35
        );
        this.add(backpackText);
        this.interactionObjects.push(backpack);
    }

    setLoadingState() {
    }

    endLoadingState() {
        return new Promise(resolve => {
            Tween.get({}).wait(0.7).call(() => {
                app.renderer.shadowMap.autoUpdate = false;
                this.mashes.forEach(mesh => {
                    mesh.scale.set(0, 0, 0)
                });
                this.scaleBackMashes();
                resolve();
            })
        })
    }

    setIdleState() {
        this.setInteractionOfObjects();
        this.showText();
    }

    endIdleState() {
        this.setInteractionOfObjects(false);
        this.hideText();
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
                    cameraPosition.addScaledVector(cameraDirectionVector, 0.4);
                    Tween.get(diploma.position)
                        .to(cameraPosition, animationDuration)
                        .call(() => {
                            resolve();
                        });

                    const lookAtParams = {
                        x: diploma.position.x,
                        y: diploma.position.y - 1,
                        z: -diploma.position.z
                    };
                    const lookAtTargetParams = {
                        x: app.camera.position.x,
                        y: app.camera.position.y,
                        z: app.camera.position.z,
                    };
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
            const firstStepPosition = new Vector3().copy(diploma.defaultPosition);
            firstStepPosition.z = -firstStepPosition.z;
            Tween.get(diploma.position, {override: true})
                .to(firstStepPosition, animationDuration)
                .to(diploma.defaultPosition, animationDuration)
                .call(() => {
                    resolve();
                });

            const targetRotationVector = new Vector3().copy(diploma.defaultRotation);
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
            this.shelfManager.startShelfFrameScene();
            resolve()
        })
    }

    endStateHardSkills() {
        return new Promise((resolve, reject) => {
            this.shelfManager.endShelfFrameScene();
            resolve()
        })
    }

    setStateContacts() {
        return new Promise((resolve, reject) => {

            resolve()
        })
    }

    endStateContacts() {
        return new Promise((resolve, reject) => {

            resolve()
        })
    }
}

export {SceneContent}