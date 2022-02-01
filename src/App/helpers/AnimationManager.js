import * as THREE from "three";

class AnimationManager {
    constructor() {
        this.animations = {};
        this.mixerAnimations = [];
    }

    addAnimations(model){
        model.animations.forEach(animation =>{
            const animationMixer = new THREE.AnimationMixer(model.scene);
            this.animations[animation.name] = animationMixer.clipAction(animation);
            this.mixerAnimations.push(animationMixer);
        })
    }

    play(tag){

    }

    stop(tag){

    }

    trigger(isAnimationPlaying){
        if(isAnimationPlaying){
            this.playAll();
        }else {
            this.stopAll();
        }
    }

    playAll(){
        for (let animation in this.animations){
            this.animations[animation].play();
        }
    }

    stopAll(){
        for (let animation in this.animations){
            this.animations[animation].stop();
        }
    }

    tick = (deltaTime) => {
        if (this.mixerAnimations.length) {
            this.mixerAnimations.forEach(mixer => {
                mixer.update(deltaTime)
            })
        }
    }
}

export {AnimationManager}