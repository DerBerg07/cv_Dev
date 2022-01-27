import * as THREE from 'three'

const INTERACTION_COLOR = 0x241a12;
'#241a12'

class InteractionManager {
    constructor() {
        this.reycaster = null;
        this.pointer = {
            x: null,
            y: null
        }

        this.targerObject = null;

        this.init();
    }

    init() {
        this.reycaster = new THREE.Raycaster();

        this.addDomEventListeners()
    };

    addDomEventListeners() {
        document.addEventListener('mousemove', this.onMouseMove)
        document.addEventListener('click', this.onMouseClick)
    }

    onMouseMove = (event) => {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.reycaster.setFromCamera(this.pointer, app.camera);

        const intersects = this.reycaster.intersectObjects(app.scene.children) || [];

        if (intersects.length > 0) {
            if (this.targerObject !== intersects[0].object) {
                if (this.targerObject) {
                    if (this.targerObject.interactive) {
                        this.removeTextureFromObject(this.targerObject);
                    } else if (this.targerObject.parent?.interactive) {
                        this.removeTextureFromParent(this.targerObject);
                    }
                }

                this.targerObject = intersects[0].object;
                if (this.targerObject.interactive) {
                    this.addTextureToObject(this.targerObject)
                } else if (this.targerObject.parent.interactive) {
                    this.addTextureToParent(this.targerObject)
                }
            }
        } else {
            if (this.targerObject) {
                if (this.targerObject.interactive) {
                    this.removeTextureFromObject(this.targerObject);
                } else if (this.targerObject.parent.interactive) {
                    this.removeTextureFromParent(this.targerObject)
                }
            }
            this.targerObject = null;
        }
    }

    onMouseClick = () => {
        if (this.targerObject) {
            if(this.targerObject.interactive){
                this.targerObject.onMouseClick();
                this.removeTextureFromObject(this.targerObject)
            }else if(this.targerObject.parent.interactive){
                this.targerObject.parent.onMouseClick();
                this.removeTextureFromParent(this.targerObject)
            }

        }
    }

    addTextureToObject(object) {
        object.currentHex = object.material.emissive.getHex();
        object.material.emissive.setHex(INTERACTION_COLOR);
    }

    removeTextureFromObject(object) {
        object.material.emissive.setHex(object.currentHex);
    }

    addTextureToParent(object) {
        object.parent.children.forEach((child) => {
            this.addTextureToObject(child)
        })
    }

    removeTextureFromParent(object) {
        object.parent.children.forEach((child) => {
            this.removeTextureFromObject(child)
        })
    }
}

export {InteractionManager}