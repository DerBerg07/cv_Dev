import * as THREE from "three";
import Tween from "../helpers/Tween";
import {Box3Helper, Vector3} from "three";
import {positionViewDirection, vec3} from "three/examples/jsm/renderers/nodes/ShaderNode";

const TEXT = {
    LOADING: 'Loading',
    NAME: 'OLEH HORA',
    EDUCATION: 'EDUCATION',
    WORK_EXPERIENCE: 'WORK EXPERIENCE',
    HARD_SKILLS: 'HARD SKILLS',
    CONTACTS: 'REACH ME AT:',
    ROTATE: 'ROTATE YOUR DEVICE FOR BETTER EXPERIENCE)'
};

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
        period: "2005 - 2016",
    }
];

const WORK_EXPERIENCE_TEXT = {
    TROPHIES: {
        'Qplaze': {
            period: '2019 - 2020 (0.9 year)',
            tasks: 'Work on small arcade HTML5 games\n' +
                'Technology stack : ES5, Construct 2, different Tween libraries\n' +
                'Usual tasks:\n' +
                '- Fixing bugs for customers\n' +
                '- Port games for new platforms\n' +
                '- Development for mobile devices.'
        },
        'Ejaw': {
            period: '2019 - 2021 (1 year)',
            tasks: 'Create different HTML5 games from scratch as outsource developer\n' +
                'Technology stack : PIXI.JS, Phaser, ThreeJs, BabylonJs, Typescript\n'+
                'Usual tasks:\n' +
                '- Create 3d playable ads.\n' +
                '- Create slot games.\n' +
                '- Create slot-based arcade games.'
        },
        'Evoplay': {
            period: '2021 - 2022 (1.3 year)',
            tasks: 'Work on big game for social medias\n' +
                'Technology stack : PIXI.JS, Redux, React, TweenJs, Gulp\n'+
                'Usual tasks:\n' +
                '- Create new modules.\n' +
                '- Refactor code.\n' +
                '- Implement new technologies to project.\n' +
                '- Create React.js-based middleware for Unity game project.\n' +
                '- Support and bug fixes on project.',
        }
    }
};

const LINKS = {
    Linkedin : {
        value: 'oleg.gora',
        link: 'https://www.linkedin.com/in/oleg-gora-1a87ba19b'
    },
    Mail: {
        value: 'oleh.hora.work@gmail.com',
        link: 'mailto:oleh.hora.work@gmail.com'
    },
    Telegram:{
        value: '@derBerg',
        link: 'https://t.me/derBerg'
    },
    Phone: {
        value: '+(380) 935586283',
        link: 'tel:+380935586283'
    }
};

class UI {
    constructor() {
        this.uiContainer = this.getUiContainer();
        this.loadingContainer = this.createLoadingContainer();
        this.nameBanner = this.createNameBanner();
        this.educationBanner = this.createEducationBanner();
        this.workExperienceBanner = this.createWorkExperienceBanner();
        this.contactsBanner = this.createContactsBanner();
        this.backButton = this.createBackButton();
        this.educationContent = this.createEducationContent();
        this.contactsContent = this.createContactsContent();
        this.hardSkillsButton = this.createGoToHardSkillsButton();
        this.workExperienceButton = this.createGoToWorkExperiencesButton();
        this.rotateDeviceScreen = this.createRotateScreen();

        this.addRotationListener();
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

        app.scene.add(tempPoint1).add(tempPoint2);
        mesh.attach(tempPoint2);
        mesh.attach(tempPoint1);
        mesh.rotation.set(prevRotation.x, prevRotation.y, prevRotation.z);

        const c1Wp = tempPoint1.getWorldPosition(new THREE.Vector3());
        const c2Wp = tempPoint2.getWorldPosition(new THREE.Vector3());


        const minPos = this.getPointOnScreen(c1Wp);
        const maxPos = this.getPointOnScreen(c2Wp);

        const width = Math.abs(maxPos.x - minPos.x);
        const height = Math.abs(maxPos.y - minPos.y);

        const x = Math.min(minPos.x, maxPos.x) + width / 2;
        const y = Math.min(minPos.y, maxPos.y) + height / 2;

        return [{width, height}, {x, y}]
    }

    getPointOnScreen(vector) {
        const projection = new Vector3().copy(vector);
        projection.project(app.camera);
        const x = this.getPointXOnScreen(projection.x);
        const y = this.getPointYOnScreen(projection.y);
        return {x, y}
    }

    getPointXOnScreen(value) {
        return (1 + value) / 2 * window.innerWidth;
    }

    getPointYOnScreen(value) {
        return (1 - value) / 2 * window.innerHeight;
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
        loadingText.classList.add('text');
        loadingText.innerHTML = TEXT.LOADING;
        loadingContainer.appendChild(loadingText);
        this.hide(loadingContainer);

        this.uiContainer.appendChild(loadingContainer);
        return loadingContainer
    }

    createNameBanner() {
        const nameBannerWrapper = document.createElement('div');
        nameBannerWrapper.classList.add('banner');
        nameBannerWrapper.id = 'name-banner';
        this.hideBanner(nameBannerWrapper);
        const nameBanner = document.createElement('p');
        nameBannerWrapper.appendChild(nameBanner);
        nameBanner.classList.add('text');
        nameBanner.innerHTML = TEXT.NAME;

        this.uiContainer.appendChild(nameBannerWrapper);
        return nameBannerWrapper
    }

    createEducationBanner() {
        const diplomaBannerWrapper = document.createElement('div');
        diplomaBannerWrapper.classList.add('banner');
        diplomaBannerWrapper.id = 'diploma-banner';
        this.hideBanner(diplomaBannerWrapper);
        const diplomaBanner = document.createElement('p');
        diplomaBannerWrapper.appendChild(diplomaBanner);
        diplomaBanner.classList.add('text');
        diplomaBanner.classList.add('background-banner-label');
        diplomaBanner.innerHTML = TEXT.EDUCATION;
        this.uiContainer.appendChild(diplomaBannerWrapper);
        return diplomaBannerWrapper
    }

    createWorkExperienceBanner() {
        const workExperienceBannerWrapper = document.createElement('div');
        workExperienceBannerWrapper.classList.add('banner');
        workExperienceBannerWrapper.id = 'work_experience-banner';
        this.hideBanner(workExperienceBannerWrapper);
        const workExperienceBanner = document.createElement('p');
        workExperienceBannerWrapper.appendChild(workExperienceBanner);
        workExperienceBanner.classList.add('text');
        workExperienceBanner.classList.add('background-banner-label');
        workExperienceBanner.innerHTML = TEXT.WORK_EXPERIENCE;
        this.uiContainer.appendChild(workExperienceBannerWrapper);
        return workExperienceBannerWrapper
    }

    createContactsBanner() {
        const contactsBannerWrapper = document.createElement('div');
        contactsBannerWrapper.classList.add('banner');
        contactsBannerWrapper.id = 'content-banner';
        this.hideBanner(contactsBannerWrapper);
        const contactsBanner = document.createElement('p');
        contactsBannerWrapper.appendChild(contactsBanner);
        contactsBanner.classList.add('text');
        contactsBanner.classList.add('background-banner-label');
        contactsBanner.innerHTML = TEXT.CONTACTS;
        this.uiContainer.appendChild(contactsBannerWrapper);
        return contactsBannerWrapper
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
        backImage.classList.add('back-image');
        backImage.src = 'images/backArrow.png';
        backButton.appendChild(backImage);
        backButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            app.setState('idle');
        });
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
        });
        this.uiContainer.appendChild(educationContent);
        return educationContent;
    }

    createEducationTitles() {
        const titles = [];
        EDUCATION_TITLES.forEach((titleData) => {
            const title = document.createElement("div");
            title.classList.add('title-education');
            title.classList.add('text');
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
        });

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

    //WORK EXPERIENCE
    createGoToHardSkillsButton(){
        const hardSkillsButton = document.createElement('p');
        hardSkillsButton.classList.add('hidden_hard_skills-button');
        hardSkillsButton.id = 'hard_skills-button';
        hardSkillsButton.classList.add('text');
        hardSkillsButton.classList.add('switcher_button');
        hardSkillsButton.innerHTML = TEXT.HARD_SKILLS;
        hardSkillsButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            app.setState('hard_skills');
        });
        this.uiContainer.appendChild(hardSkillsButton);
        return hardSkillsButton;
    }

    hideHardSkillsButton(){
        this.hardSkillsButton.classList.add('hidden_hard_skills-button')
    }

    showHardSkillsButton(){
        this.hardSkillsButton.classList.remove('hidden_hard_skills-button')
    }

    createGoToWorkExperiencesButton(){
        const workExperienceButton = document.createElement('p');
        workExperienceButton.classList.add('hidden_work_experience-button');
        workExperienceButton.id = 'work_experience-button';
        workExperienceButton.classList.add('text');
        workExperienceButton.classList.add('switcher_button');
        workExperienceButton.innerHTML = TEXT.WORK_EXPERIENCE;
        workExperienceButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            app.setState('work_experience');
        });
        this.uiContainer.appendChild(workExperienceButton);
        return workExperienceButton;
    }

    hideWorkExperienceButton(){
        this.workExperienceButton.classList.add('hidden_work_experience-button')
    }

    showWorkExperienceButton(){
        this.workExperienceButton.classList.remove('hidden_work_experience-button')
    }

    createWorkExpInfoContent(trophyObject){
        const name = trophyObject.name;
        const infoElement = document.createElement('div');
        infoElement.classList.add('element-info');
        infoElement.classList.add('element-info-hidden');
        this.uiContainer.appendChild(infoElement);

        const companyName = document.createElement('p');
        companyName.classList.add('company_name');
        companyName.classList.add('text');
        companyName.innerHTML = this.prepareTextForInnerHtml(name);
        infoElement.appendChild(companyName);

        const companyPeriod = document.createElement('p');
        companyPeriod.classList.add('company_period');
        companyPeriod.classList.add('text');
        companyPeriod.innerHTML = this.prepareTextForInnerHtml(WORK_EXPERIENCE_TEXT.TROPHIES[name].period);
        infoElement.appendChild(companyPeriod);

        const companyTasks = document.createElement('p');
        companyTasks.classList.add('company_tasks');
        companyTasks.classList.add('text');
        companyTasks.innerHTML = this.prepareTextForInnerHtml(WORK_EXPERIENCE_TEXT.TROPHIES[name].tasks);
        infoElement.appendChild(companyTasks);

        const pivotCorrection = new Vector3(0, 0, 0);
        this.addHtmlLabelToObject(trophyObject, infoElement, pivotCorrection);
    }

    createFrameLabel = (frameObject) =>{
        const name = frameObject.name;
        const label = document.createElement('p');
        label.classList.add('label-frame');
        label.classList.add('text');
        label.classList.add('element-info-hidden');
        label.innerHTML = name;
        this.uiContainer.appendChild(label);
        return label;
    };

    //CONTACTS
    createContactsContent(){
        const container = document.createElement('div');
        container.classList.add('contacts');
        container.classList.add('element-info-hidden');

        for(let link in LINKS){
            const linkObj = LINKS[link];
            const contact = this.createContact(link, linkObj.value, linkObj.link);
            container.appendChild(contact)
        }

        this.uiContainer.appendChild(container);
        return container;
    }

    createContact(name, value, link){
        const element = document.createElement('p');
        element.classList.add('contact');
        element.classList.add('text');
        const valueHtml = link ? `<a href="${link}">${value}</a>` : value;
        element.innerHTML = `<p>${name}:</p> ${valueHtml}`;
        return element
    }

    hideContactsContent(){
        this.contactsContent.classList.add('element-info-hidden');
    }

    showContactsContent(){
        this.contactsContent.classList.remove('element-info-hidden');
    }

    //HELPERS
    static isMobile() {
        let check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }

    prepareTextForInnerHtml(string){
        return string.replaceAll('\n', '<br>')
    }

    addHtmlLabelToObject = (object, htmlElement, pivotCorrection = new Vector3()) => {
        object.showInfo = () => {
            const objPosition = object.getWorldPosition(new Vector3());
            objPosition.add(pivotCorrection);
            const screePosition = this.getPointOnScreen(objPosition);
            htmlElement.style.top = screePosition.y + 'px';
            htmlElement.style.left = screePosition.x + 'px';
            htmlElement.classList.remove('element-info-hidden');
        };

        object.hideInfo = () => {
            htmlElement.classList.add('element-info-hidden');
        }
    };

    createRotateScreen(){
        const screen = document.createElement('div');
        screen.classList.add('rotate');
        const rotateText = document.createElement('p');
        rotateText.classList.add('text')
        rotateText.innerHTML = TEXT.ROTATE;
        screen.appendChild(rotateText)
        this.uiContainer.appendChild(screen);
        return screen
    }

    showRotate(){
        this.rotateDeviceScreen.classList.add('element-info-hidden');
    }

    hideRotate(){
        this.rotateDeviceScreen.classList.remove('element-info-hidden');
    }

    addRotationListener(){
        window.addEventListener('resize', this.onOrientationChange, true);
        this.onOrientationChange();
    }

    onOrientationChange=()=>{
       if(window.innerHeight < window.innerWidth){
           this.showRotate()
       }else {
           this.hideRotate()
       }
    };

    //STATE
    setLoadingState() {
        return new Promise(resolve => {
            this.show(this.loadingContainer);
            resolve();
        })
    }

    endLoadingState() {
        return new Promise(resolve => {
            Tween.get({})
                .wait(0.7)
                .call(() => {
                    this.hide(this.loadingContainer);
                    resolve();
                })
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
            this.showBanner(this.educationBanner);
            this.showEducationContent();
            resolve();
        })
    }

    endEducationState() {
        return new Promise(resolve => {
            this.hideBanner(this.educationBanner);
            this.hideEducationContent();
            resolve();
        })

    }

    setWorkExperienceState() {
        return new Promise(resolve => {

            this.showBanner(this.workExperienceBanner);
            resolve();
        })
    }

    endWorkExperienceState() {
        return new Promise(resolve => {
            this.hideBanner(this.workExperienceBanner);
            this.hideHardSkillsButton();
            resolve();
        })
    }

    setStateHardSkills(){
        return new Promise((resolve, reject) => {
            this.showWorkExperienceButton();
            resolve()})
    }

    endStateHardSkills(){
        return new Promise((resolve, reject) => {
            this.hideWorkExperienceButton();
            resolve()
        })
    }

    setStateContacts() {
        return new Promise((resolve, reject) => {
            this.showBanner(this.contactsBanner)
            this.showContactsContent();
            resolve()
        })
    }

    endStateContacts() {
        return new Promise((resolve, reject) => {
            this.hideBanner(this.contactsBanner)
            this.hideContactsContent();
            resolve()
        })
    }
}

export {UI}