const TEXT = {
    LOADING: "Loading",
    NAME: 'OLEH HORA',
    EDUCATION: 'EDUCATION'
}

class UI {
    constructor() {
        this.uiContainer = this.getUiContainer();
        this.loadingContainer = this.createLoadingContainer();
        this.nameBanner = this.createNameBanner();
        this.educationBanner = this.createEducationBanner();
        this.backButton = this.createBackButton();
        this.educationContent = this.createEducationContent();
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
        const nameBannerWrapper = document.createElement('div');
        nameBannerWrapper.classList.add('banner')
        nameBannerWrapper.id = 'name-banner';
        this.hideBanner(nameBannerWrapper);
        const nameBanner = document.createElement('p');
        nameBannerWrapper.appendChild(nameBanner)
        nameBanner.classList.add('text')
        nameBanner.innerHTML = TEXT.NAME;

        this.uiContainer.appendChild(nameBannerWrapper)
        return nameBannerWrapper
    }

    createEducationBanner(){
        const diplomaBannerWrapper = document.createElement('div');
        diplomaBannerWrapper.classList.add('banner')
        diplomaBannerWrapper.id = 'diploma-banner';
        this.hideBanner(diplomaBannerWrapper);
        const diplomaBanner = document.createElement('p');
        diplomaBannerWrapper.appendChild(diplomaBanner);
        diplomaBanner.classList.add('text')
        diplomaBanner.classList.add('background-banner-label')
        diplomaBanner.innerHTML = TEXT.EDUCATION;
        this.uiContainer.appendChild(diplomaBannerWrapper)
        return diplomaBannerWrapper
    }

    createEducationContent(){

    }

    createBackButton(){
        const backButton = document.createElement('div');
        backButton.id = 'back-button';
        const backImage = document.createElement('img');
        backImage.classList.add('back-image')
        backImage.src = 'images/backArrow.png';
        backButton.appendChild(backImage);
        backButton.addEventListener('click', ()=>{
            app.setState('idle');
        })
        this.uiContainer.appendChild(backButton);
        backButton.classList.add('hidden_back-button');
        return backButton;
    }

    hide(element) {
        element.classList.add('hidden');
    }

    show(element) {
        element.classList.remove('hidden');
    }

    hideBanner(banner){
        banner.classList.add('hidden_banner')
    }

    showBanner(banner){
        banner.classList.remove('hidden_banner')
    }

    hideBackButton(){
        this.backButton.classList.add('hidden_back-button');
    }

    showBackButton(){
        this.backButton.classList.remove('hidden_back-button');
    }

    setState(nextState, prevState){

        switch (nextState) {
            case 'loading':
                this.setLoadingState();
                break
            case 'idle':
                this.setIdleState();
                this.hideBackButton();
                break
            case 'education':
                this.showBanner(this.educationBanner)
                break

        }

        switch (prevState) {
            case 'loading':
                this.endLoadingState();
                break
            case 'idle':
                this.endIdleState();
                this.showBackButton();
                break
            case 'education':
                this.hideBanner(this.educationBanner)
                break
        }
    }

    setLoadingState(){
        this.show(this.loadingContainer);
    }

    endLoadingState(){
        this.hide(this.loadingContainer);
    }

    setIdleState(){
        this.showBanner(this.nameBanner);
    }

    endIdleState(){
        this.hideBanner(this.nameBanner);
    }
}

export {UI}