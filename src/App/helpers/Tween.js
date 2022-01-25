import * as createjs from 'createjs-module';
const Tween = createjs.Tween;
Tween.Ease = createjs.Ease;
createjs.MotionGuidePlugin.install();
createjs.Ticker = null;

export default Tween;