import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

const resources = {
    mainCharacter: 'Chel/chel.glb'
}

class Loader {
    constructor() {
        this.gltfLoader = new GLTFLoader();
    }

    loadFiles = (onLoadedCallback, onProgressCallback = () =>{}, onErrorCallback = ()=>{}) => {
        app.setState('loading')
        this.loadModels(onLoadedCallback, onProgressCallback, onErrorCallback);
    }

    loadModels(onLoadedCallback, onProgressCallback, onErrorCallback){
        const loadedModels = {};
        const resourcesArray =  Object.entries(resources);
        resourcesArray.forEach(([name, modelUrl], index) => {
            this.gltfLoader.load(`models/${modelUrl}`, (gltfModel)=>{
                console.log(gltfModel);
                loadedModels[name] = gltfModel;
                if(index ===  resourcesArray.length - 1){
                    onLoadedCallback(loadedModels);
                }
            }, (params)=>{{
                console.log(params)
            }
            }, onErrorCallback);
        })
    }
}

export {Loader}