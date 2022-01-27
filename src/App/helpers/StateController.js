class StateController {
    constructor() {

    }

    setState(nextState, prevState) {
        switch (nextState) {
            case 'loading':
                this.setLoadingState();
                break
            case 'idle':
                this.setIdleState();
                break
            case 'education':
                this.setEducationState();
                break
            case 'work_experience':
                this.setWorkExperienceState();
                break
        }

        switch (prevState) {
            case 'loading':
                this.endLoadingState();
                break
            case 'idle':
                this.endIdleState();
                break
            case 'education':
                this.endEducationState();
                break
            case 'work_experience':
                this.endWorkExperienceState();
                break
        }
    }

    async setLoadingState() {
        app.camera.setLoadingState();
        app.scene.setLoadingState();
        app.ui.setLoadingState();
    }

    async endLoadingState() {
        app.camera.endLoadingState();
        app.scene.endLoadingState();
        app.ui.endLoadingState();
    }

    async setIdleState() {
        app.camera.setIdleState();
        app.scene.setIdleState();
        app.ui.setIdleState();
    }

    async endIdleState() {
        app.camera.endIdleState();
        app.scene.endIdleState();
        app.ui.endIdleState();
    }

    async setEducationState() {
        app.camera.setEducationState();
        await app.scene.setEducationState();
        app.ui.setEducationState();
    }

    async endEducationState() {
        app.camera.endEducationState();
        await app.ui.endEducationState();
        app.scene.endEducationState();

    }

    async setWorkExperienceState() {
        await app.camera.setWorkExperienceState();
        await app.scene.setWorkExperienceState();
        await app.ui.setWorkExperienceState();
    }

    async endWorkExperienceState() {
        await app.ui.endWorkExperienceState();
        await app.scene.endWorkExperienceState();
        await app.camera.endWorkExperienceState();
    }
}

export {StateController}