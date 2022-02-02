import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";

const resources = {
    gltf: {
        mainCharacter: 'Chel/chel.glb'
    },
    fonts: {
        roboto: 'font/Roboto.typeface.json'
    }
};

class Loader {
    constructor() {
        this.fonts = {};
        this.models = {};
        this.gltfLoader = new GLTFLoader();
        this.fontLoader = new FontLoader();
    }

    loadFiles = async () => {
        return new Promise(async resolve => {
            app.setState('loading');
            await this.loadModels();
            await this.loadFonts();
            resolve()
        })

    };

    async loadModels() {
        return new Promise(resolve => {
            const resourcesArray = Object.entries(resources.gltf);
            resourcesArray.forEach(([name, modelUrl], index) => {
                this.gltfLoader.load(`models/${modelUrl}`, (gltfModel) => {
                    this.models[name] = gltfModel;
                    if (index === resourcesArray.length - 1) {
                        resolve();
                    }
                })
            })
        })
    }

    async loadFonts() {
        return new Promise(resolve => {
            const resourcesArray = Object.entries(resources.fonts);
            resourcesArray.forEach(([name, modelUrl], index)=>{
                this.fontLoader.load(modelUrl, (font)=>{
                    this.fonts[name] = font;
                    if (index === resourcesArray.length - 1) {
                        resolve();
                    }
                })
            });

        })
    }
}

export {Loader}