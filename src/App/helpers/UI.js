import * as THREE from "three";
import Tween from "./Tween";
import {Box3Helper} from "three";
import {positionViewDirection, vec3} from "three/examples/jsm/renderers/nodes/ShaderNode";

const TEXT = {
    LOADING: 'Loading',
    NAME: 'OLEH HORA',
    EDUCATION: 'EDUCATION',
    WORK_EXPERIENCE: 'WORK EXPERIENCE'
}

const EDUCATION_TITLES = [
    {
        institution: "NTUU KPI",
        mark: "Igor Sikorsky Kyiv Polytechnic Institute",
        period: "2016 - 2022",
        degree: "master",
        speciality: "system automatization"
    },
    {
        institution: "School",
        mark: "with deep learning of foreign languages",
        period: "2006 - 2016",
    }
]

class UI {
    constructor() {
        this.uiContainer = this.getUiContainer();
        this.loadingContainer = this.createLoadingContainer();

        this.nameBanner = this.createNameBanner();
        this.educationBanner = this.createEducationBanner();
        this.workExperienceBanner = this.createWorkExperienceBanner();

        this.backButton = this.createBackButton();
        this.educationContent = this.createEducationContent()
    }

    getUiContainer() {
        return document.getElementById("ui");
    }

    getMeshViewPortSize(mesh) {
        let prevRotation = mesh.rotation.clone();
        mesh.rotation.set(0, 0, 0);
        const box3 = new THREE.Box3().setFromObject(mesh);
        box3.applyMatrix4(new THREE.Matrix4().copy(mesh.matrixWorld).invert().makeScale(1, 1, 1));

        const min = new THREE.Vector3().copy(box3.min);
        const max = new THREE.Vector3().copy(box3.max);

        const tempPoint1 = new THREE.Object3D();
        const tempPoint2 = new THREE.Object3D();
        tempPoint1.position.copy(min);
        tempPoint2.position.copy(max);

        app.scene.add(tempPoint1).add(tempPoint2)
        mesh.attach(tempPoint2);
        mesh.attach(tempPoint1);
        mesh.rotation.set(prevRotation.x, prevRotation.y, prevRotation.z);

        const c1Wp = tempPoint1.getWorldPosition(new THREE.Vector3())
        const c2Wp = tempPoint2.getWorldPosition(new THREE.Vector3())

        c1Wp.project(app.camera);
        c2Wp.project(app.camera);

        const minX = (1 + c1Wp.x) / 2 * window.innerWidth;
        const minY = (1 - c1Wp.y) / 2 * window.innerHeight;
        const maxX = (1 + c2Wp.x) / 2 * window.innerWidth;
        const maxY = (1 - c2Wp.y) / 2 * window.innerHeight;

        const width = Math.abs(maxX - minX);
        const height = Math.abs(maxY - minY)

        const x = Math.min(maxX, minX) + width / 2;
        const y = Math.min(maxY, minY) + height / 2;

        return [{width, height}, {x, y}]
    }

    hide(element) {
        element.classList.add('hidden');
    }

    show(element) {
        element.classList.remove('hidden');
    }

    //Banners
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

    createNameBanner() {
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

    createEducationBanner() {
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

    createWorkExperienceBanner() {
        const workExperienceBannerWrapper = document.createElement('div');
        workExperienceBannerWrapper.classList.add('banner')
        workExperienceBannerWrapper.id = 'work_experience-banner';
        this.hideBanner(workExperienceBannerWrapper);
        const workExperienceBanner = document.createElement('p');
        workExperienceBannerWrapper.appendChild(workExperienceBanner);
        workExperienceBanner.classList.add('text')
        workExperienceBanner.classList.add('background-banner-label')
        workExperienceBanner.innerHTML = TEXT.WORK_EXPERIENCE;
        this.uiContainer.appendChild(workExperienceBannerWrapper)
        return workExperienceBannerWrapper
    }

    hideBanner(banner) {
        banner.classList.add('hidden_banner')
    }

    showBanner(banner) {
        banner.classList.remove('hidden_banner')
    }

    //BackButton
    createBackButton() {
        const backButton = document.createElement('div');
        backButton.id = 'back-button';
        const backImage = document.createElement('img');
        backImage.classList.add('back-image')
        backImage.src = 'images/backArrow.png';
        backButton.appendChild(backImage);
        backButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            app.setState('idle');
        })
        this.uiContainer.appendChild(backButton);
        backButton.classList.add('hidden_back-button');
        return backButton;
    }

    hideBackButton() {
        this.backButton.classList.add('hidden_back-button');
    }

    showBackButton() {
        this.backButton.classList.remove('hidden_back-button');
    }

    //EDUCATION
    createEducationContent() {
        const educationContent = document.createElement('div');
        educationContent.classList.add('content-education');
        educationContent.classList.add('content-education-hidden');
        const titles = this.createEducationTitles();
        titles.forEach((title) => {
            educationContent.appendChild(title);
        })
        this.uiContainer.appendChild(educationContent)
        return educationContent;
    }

    createEducationTitles() {
        const titles = [];
        EDUCATION_TITLES.forEach((titleData) => {
            const title = document.createElement("div");
            title.classList.add('title-education');
            title.classList.add('text')
            if (titleData.institution) {
                const institution = document.createElement('h1');
                institution.innerHTML = titleData.institution;
                title.appendChild(institution);
            }

            if (titleData.mark) {
                const mark = document.createElement('h2');
                mark.innerHTML = titleData.mark;
                title.appendChild(mark);
            }

            if (titleData.period) {
                const period = document.createElement('h3');
                period.innerHTML = titleData.period;
                title.appendChild(period);
            }

            if (titleData.degree) {
                const degree = document.createElement('h3');
                degree.innerHTML = `${titleData.degree} of ${titleData.speciality}`;
                title.appendChild(degree);
            }
            titles.push(title)
        })

        return titles
    }

    showEducationContent() {
        this.educationContent.classList.remove('content-education-hidden');
        const diplomaMesh = app.scene.getObjectByName('Diploma');
        const [size, position] = this.getMeshViewPortSize(diplomaMesh);
        this.educationContent.style.width = size.width + 'px';
        this.educationContent.style.height = size.height + 'px';
        this.educationContent.style.left = position.x + 'px';
        this.educationContent.style.top = position.y + 'px';
    }

    hideEducationContent() {
        this.educationContent.classList.add('content-education-hidden');
    }


    //STATE
    setLoadingState() {
        return new Promise(resolve => {
            this.show(this.loadingContainer);
            resolve();
        })
    }

    endLoadingState() {
        return new Promise(resolve => {
            this.hide(this.loadingContainer);
            resolve();
        })
    }

    setIdleState() {
        return new Promise(resolve => {
            this.showBanner(this.nameBanner);
            this.hideBackButton();
            resolve();
        })
    }

    endIdleState() {
        return new Promise(resolve => {
            this.hideBanner(this.nameBanner);
            this.showBackButton();
            resolve();
        })
    }

    setEducationState() {
        return new Promise(resolve => {
            this.showBanner(this.educationBanner)
            this.showEducationContent();
            resolve();
        })
    }

    endEducationState() {
        return new Promise(resolve => {
            this.hideBanner(this.educationBanner)
            this.hideEducationContent();
            resolve();
        })

    }

    setWorkExperienceState() {
        return new Promise(resolve => {
            this.showBanner(this.workExperienceBanner)
            resolve();
        })
    }

    endWorkExperienceState() {
        return new Promise(resolve => {
            this.hideBanner(this.workExperienceBanner)
            resolve();
        })
    }
}

export {UI}