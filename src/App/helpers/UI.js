const TEXT = {
    LOADING: "Loading",
    NAME: 'OLEH HORA'
}

class UI {
    constructor() {
        this.uiContainer = this.getUiContainer();
        this.loadingContainer = this.createLoadingContainer();
        this.nameBanner = this.createNameBanner();
    }

    getUiContainer() {
        return document.getElementById("ui");
    }

    createLoadingContainer() {
        const loadingContainer = document.createElement('div');
        loadingContainer.classList.add('loading');

        const loadingText = document.createElement('p');
        loadingText.classList.add('text')
        loadingText.innerHTML = TEXT.LOADING
        loadingContainer.appendChild(loadingText);
        this.hide(loadingContainer)

        this.uiContainer.appendChild(loadingContainer)
        return loadingContainer
    }

    createNameBanner(){
        const nameBanner = document.createElement('p');
        nameBanner.classList.add('text')
        nameBanner.id = 'name-banner';
        nameBanner.innerHTML = TEXT.NAME;

        this.uiContainer.appendChild(nameBanner)
        return nameBanner
    }

    hide(element) {
        element.classList.add('hidden');
    }

    show(element) {
        element.classList.remove('hidden');
    }

    hideNameBanner(){
       // this.hide(this.nameBanner);
        this.nameBanner.classList.add('hidden_banner')
    }

    showNameBanner(){
        //this.show(this.nameBanner)
        this.nameBanner.classList.remove('hidden_banner')
    }


    setState(nextState, prevState){

        switch (nextState) {
            case 'idle':
                this.showNameBanner();
                break
            case 'loading':
                this.hideNameBanner();
                this.show(this.loadingContainer);
                break
        }

        switch (prevState) {
            case 'loading':
                this.hide(this.loadingContainer);
                break
        }
    }
}

export {UI}