import {Howl, Howler} from 'howler';

class AudioManager {
    constructor() {
        this.sound = null;
        this.playing = false;
    }
    createSound(){
        return  new Howl({
            html5: true,
            src: ['audio/music.mp3'],
            loop: true,
            volume: 0.5,
            autoplay: true,
        })
    }

    triggerAudio(){
        if(this.playing){
            this.stopAudio();
        }else {
            this.startAudio();
        }

        this.playing = !this.playing;
        return this.playing;
    }

    startAudio(){
        if(!this.sound){
            this.sound = this.createSound();
        }else {
            this.startMusic();
        }
    }

    stopAudio(){
        this.stopMusic();
    }

    startMusic(){
        this.sound.play();
    }

    stopMusic(){
        this.sound.stop();
    }


}

export {AudioManager}