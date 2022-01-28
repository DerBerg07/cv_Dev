import {Euler, Vector3} from "three";
import Tween from "../helpers/Tween";

class Shelf {
    constructor() {
        this.interactive = false;
        this.models = [];
    }

    init(){
        this.addInteractiveModels();
    }

    addInteractiveModels(){
        const trophyEvoplay = app.scene.getObjectByName('Mesh001_5')
        const trophyQplaze = app.scene.getObjectByName('Mesh001_6')
        const trophyEjaw = app.scene.getObjectByName('Mesh001_7')
        this.addOnClickTrophy(trophyEvoplay)
        this.addOnClickTrophy(trophyQplaze)
        this.addOnClickTrophy(trophyEjaw)

        this.models.push(trophyEvoplay, trophyQplaze, trophyEjaw)
    }

    addOnClickTrophy(trophy){
        trophy.defaultPosition = new Vector3().copy(trophy.position);
        trophy.defaultRotation= new Euler().copy(trophy.rotation);
        trophy.isShowing = false;

        trophy.show = () => {
            trophy.isShowing = !trophy.isShowing;
            this.setInteractive(!trophy.isShowing);
            const cameraPosition = new Vector3().copy(app.camera.position);
            const cameraDirectionVector = app.camera.getWorldDirection(new Vector3());
            cameraPosition.addScaledVector(cameraDirectionVector, 0.5)

            app.scene.getObjectByName('Debug').position.copy(cameraPosition);

            cameraPosition.y = -0.12;
            app.scene.attach(trophy)

            Tween.get(trophy.position)
                .to(cameraPosition, 0.5)
                .call(() => {
                    app.scene.getObjectByName('Shelf').attach(trophy)
                    trophy.interactive = true;
                })
        }

        trophy.hide = () => {
            trophy.isShowing = !trophy.isShowing;
            this.setInteractive(!trophy.isShowing);
            console.log(trophy.position);
            Tween.get(trophy.position)
                .to(trophy.defaultPosition, 0.5)
                .call(() => {

                })
        }

        trophy.onMouseClick = () => {
            if(!trophy.isShowing){
                trophy.show()
            }else {
                trophy.hide();
            }


        }
    }

    setInteractive(interactive){
        this.interactive = interactive;
        this.shelfModelsInteractive(interactive)
    }

    shelfModelsInteractive(interactive){
        this.models.forEach(model => {
            model.interactive = interactive;
        })
    }

    startShelfScene(){
        this.setInteractive(true);
    }

    endShelfScene(){
        this.setInteractive(false);
    }


}

export {Shelf}