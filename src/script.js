import './style.css'
import './App/helpers/Tween'
import {App} from "./App/App";
import * as dat from "dat.gui";

global.gui = new dat.GUI();
gui.destroy();
global.app = new App();

app.init();
