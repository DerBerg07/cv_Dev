import './style.css'
import {App} from "./App/App";
import * as dat from "dat.gui";
global.gui = new dat.GUI();
global.app = new App();

app.init();
