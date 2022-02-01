import * as THREE from 'three'
import {Color} from "three";

const INTERACTION_COLOR = 0x241a12;

class InteractionManager {
    constructor() {
        this.reycaster = null;
        this.pointer = {
            x: null,
            y: null
        };

        this.targerObject = null;

        this.init();
    }

    init() {
        this.reycaster = new THREE.Raycaster();

        this.addDomEventListeners()
    };

    addDomEventListeners() {
        document.getElementById('ui').addEventListener('mousemove', this.onMouseMove);
        document.getElementById('ui').addEventListener('click', (event)=>{
            this.onMouseClick();
        })
    }

    onMouseMove = (event) => {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.reycaster.setFromCamera(this.pointer, app.camera);

        const intersects = this.reycaster.intersectObjects(app.scene.children) || [];
        if (intersects.length > 0) {
            const interactionObject = this.findInteractiveParent(intersects[0].object);
            if (this.targerObject !== interactionObject) {
                this.onHoverOut(this.targerObject);
                this.targerObject = interactionObject;
                this.onHoverIn(this.targerObject);
            }
        } else {
            this.onHoverOut(this.targerObject);
            this.setMouseDefault();
            this.targerObject = null;
        }
    };

    onMouseClick = () => {
        if (this.targerObject) {
            if (this.targerObject.interactive && this.targerObject.onMouseClick) {
                this.targerObject.onMouseClick();
                if(!this.targerObject.triggerable){
                    this.removeTextureFromObject(this.targerObject);
                }
            }
        }
    };

    onHoverIn(object) {
        if (!object) {
            return
        }
        this.addTextureToObject(object);
        if (object.onHoverIn) {
            object.onHoverIn();
        }
        if(object.onMouseClick){
            this.setMousePointer();
        }
    }

    onHoverOut(object) {
        if (!object) {
            return
        }
        this.setMouseDefault();
        this.removeTextureFromObject(object);
        if (object.onHoverOut) {
            object.onHoverOut();
        }
    }

    addTextureToObject(object) {
        object.currentHex = new Color(object.material?.emissive?.getHex());
        object.material?.emissive?.setHex(INTERACTION_COLOR);
        object.children.forEach((child) => {
            this.addTextureToObject(child)
        })
    }

    removeTextureFromObject(object) {
        object.material?.emissive?.setHex(object.currentHex);
        object.children.forEach((child) => {
            this.removeTextureFromObject(child);
        })
    }

    findInteractiveParent(object) {
        if (object.interactive) {
            return object
        } else {
            if (object.parent) {
                return this.findInteractiveParent(object.parent)
            } else {
                return null
            }
        }
    }

    setMousePointer(){
        document.getElementById('ui').classList.add('cursor_pointer');
    }

    setMouseDefault(){
        document.getElementById('ui').classList.remove('cursor_pointer');
    }

}

export {InteractionManager}