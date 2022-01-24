import * as THREE from 'three'

const INTERACTION_COLOR = 0xff0000;

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

    addDomEventListeners(){
        document.addEventListener('mousemove', this.onMouseMove)
        document.addEventListener('click', this.onMouseClick)
    }

    onMouseMove = (event) => {
        this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        this.reycaster.setFromCamera(this.pointer, app.camera);

        const intersects = this.reycaster.intersectObjects( app.scene.children ) || [];

        if ( intersects.length > 0 ) {
            if ( this.targerObject !== intersects[0].object ) {
                if ( this.targerObject ) {
                    this.targerObject.material.emissive.setHex( this.targerObject.currentHex );
                }
                this.targerObject = intersects[0].object;
                if(this.targerObject.interactive){
                    this.targerObject.currentHex = this.targerObject.material.emissive.getHex();
                    this.targerObject.material.emissive.setHex( INTERACTION_COLOR );
                }
            }
        } else {
            if ( this.targerObject && this.targerObject.interactive ) this.targerObject.material.emissive.setHex( this.targerObject.currentHex );
            this.targerObject = null;
        }
    }

    onMouseClick= () =>{
        if(this.targerObject && this.targerObject.interactive){
            this.targerObject.onMouseClick();
        }
    }
}

export {InteractionManager}