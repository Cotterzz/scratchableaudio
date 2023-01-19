import { ScratchableAudio } from './ScratchableAudio.js'

var scratchable =  new ScratchableAudio('./tune.mp3', setRotation);

var buttons = document.getElementById("overlay_left");
buttons.innerHTML = "<button type='button' id='button1'>START</button><br/>";
var disc = document.getElementById("vc");

document.getElementById("button1").onclick = function () { 
	scratchable.setupSample();
	document.addEventListener( 'touchmove', (event) => {onDocumentMouseMove(event)}, false );
	document.addEventListener( 'touchstart', (event) => {onDocumentMouseDown(event)}, false );
	document.addEventListener( 'touchend', (event) => {onDocumentMouseUp(event)}, false );
	document.addEventListener( 'mousemove', (event) => {onDocumentMouseMove(event)}, false );
	document.addEventListener( 'mousedown', (event) => {onDocumentMouseDown(event)}, false );
	document.addEventListener( 'mouseup', (event) => {onDocumentMouseUp(event)}, false );
	buttons.innerHTML = "";
}

function onDocumentMouseDown(event){ event.preventDefault(); scratchable.down(event.pageX);}
function onDocumentMouseUp(event){ event.preventDefault(); scratchable.up();}
function onDocumentMouseMove(event){ event.preventDefault(); scratchable.move(event.pageX);}

function setRotation(angleTo){
	disc.style.transform = 'rotate('+angleTo+'deg)';
}