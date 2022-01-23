import * as THREE from 'three'

class SceneContent extends THREE.Scene {
    constructor() {
        super()

        this.background = '#ffffff'
        this.mixerAnimations = [];

        this.models = {};

        this.floor = null;
    }

    init() {
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

    addBasicLight() {
        const ambientLight = new THREE.AmbientLight('#929292', 0.5)
        this.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;

        console.log(directionalLight.shadow);
        directionalLight.castShadow = true;


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
        diploma.cursor = 'pointer';
        diploma.on('click', ()=>{
            app.setState('education')
            debugger
        })
    }

    setState(nextState, prevState){
        switch (nextState) {
            case 'idle':

                break
            case 'education':
                this.goToEducation()
                break;
        }
    }

    goToEducation(){
        debugger
    }
}

export {SceneContent}