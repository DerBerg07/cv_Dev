import * as THREE from 'three'
import gsap from 'gsap'
import * as dat from 'dat.gui'

import {Camera} from "./helpers/Camera";
import {UI} from "./helpers/UI";
import {Loader} from "./helpers/Loader";
import {SceneContent} from "./Content/SceneContent";
import Tween from "./helpers/Tween";

const SCENE_BACKGROUND = '#ffffff'
const SIZES = {
    width: window.innerWidth,
    height: window.innerHeight
}

class App {
    constructor() {
        const state = 'idle';

        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.loader = null;
        this.ui = null;
    }

    init(){
        this.renderer = this.createRenderer();
        this.scene = this.createScene();
        this.camera = this.createCamera();
        this.loader = this.createLoader();
        this.ui = this.createUiManager();

        this.addResizeListener();
        this.loader.loadFiles(this.callLoaderCallback);
        this.startRender();
    };


    callLoaderCallback = (modelsArray) => {
        this.scene.addModels(modelsArray)
        this.setState('idle');

        this.scene.init();
        this.camera.init();
    }

    createRenderer(){
        const canvas = document.querySelector('canvas.webgl')
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true
        })
        renderer.gammaOutput = true;
        renderer.gammaFactor = 1.5;
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        renderer.setSize(SIZES.width, SIZES.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.antialias = true;

        return renderer;
    }

    createCamera(){
        const camera = new Camera([50, SIZES.width / SIZES.height, 0.1, 100], this.scene)
        this.scene.add(camera)

        return camera;
    };

    createScene(){
       return new SceneContent();
    };

    createLoader(){
        return new Loader();
    };

    createUiManager(){
        return new UI();
    }

    addResizeListener(){
        window.addEventListener('resize', () =>
        {
            this.updateSizes();
            this.updateCameraSizes();
            this.updateRendererSizes();
        })
    };

    updateSizes(){
        SIZES.width = window.innerWidth
        SIZES.height = window.innerHeight
    };

    updateCameraSizes(){
        this.camera.aspect = SIZES.width / SIZES.height
        this.camera.updateProjectionMatrix()
    };

    updateRendererSizes(){
        this.renderer.setSize(SIZES.width, SIZES.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    };

    startRender(){
        const clock = new THREE.Clock()
        let previousTime = 0

        const tick = () =>{
            const elapsedTime = clock.getElapsedTime()
            const deltaTime = elapsedTime - previousTime
            previousTime = elapsedTime;
            this.renderer.render(this.scene, this.camera)
            if(this.scene.mixerAnimations.length){
                this.scene.mixerAnimations.forEach(mixer =>{
                    mixer.update(deltaTime)
                })
            }
            Tween.tick(deltaTime, false);
            window.requestAnimationFrame(tick)
        }

        tick();
    }

    setState(state){
        if (this.state === state){
            return
        }
        console.log(state);
        this.camera.setState(state, this.state);
        this.scene.setState(state, this.state);
        this.ui.setState(state, this.state);


        this.state = state;
    }
}

export {App}