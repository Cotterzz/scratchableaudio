export class ScratchableAudio {

	audioContext;
	customWaveNode;
	rawAudio;
	mp3Data;
	totalTime;
	rotations = 4;
	rotationTime;
	rotationFunction;
	holdingPlayHead = false;
	holdingVelocity = 0;
	holdingOldPosition = 0;
	constructor(data, rotatorFunction){
		this.mp3Data = data;
		this.rotationFunction = rotatorFunction;
	}

	down (pos) {
		this.holdingPlayHead = true;
		this.holdingOldPosition = pos;
		this.sendData({label:'playheadspeed', velocity: (pos - this.holdingOldPosition)/5});
	}

	up (){
		this.holdingPlayHead = false;
		this.sendData({label:'playheadstatus', status: "free"});
	}

	move(pos){
		if(this.holdingPlayHead){
			this.sendData({label:'playheadspeed', velocity: (pos - this.holdingOldPosition)});
			this.holdingOldPosition = pos;
		}
	}

	async setupSample() {
		this.audioContext = new AudioContext();
    	const filePath = this.mp3Data;
    	const sample = await this.getFile(this.audioContext, filePath);
    	this.rawAudio = sample;
    	this.totalTime= sample.length/48000;
    	this.rotationTime = this.totalTime/this.rotations;
    	this.setUpAudio();
	}

	async setUpAudio(){
	
		await this.audioContext.audioWorklet.addModule('CustomWaveProcessor.js');
		this.customWaveNode = new AudioWorkletNode(this.audioContext, 'CustomWaveProcessor')
		this.customWaveNode.connect(this.audioContext.destination);
		this.customWaveNode.port.onmessage = (e) => {this.setFrame(e.data)};
		this.sendData({label:'raw', rawdata:this.rawAudio.getChannelData(0)});

	}

	async getFile(audioContext, filepath) {
		const response = await fetch(filepath);
		const arrayBuffer = await response.arrayBuffer();
		const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
		return audioBuffer;
	}

	setFrame(samples){

		var currentTime = samples/48000;
		var angleTo = 360-(360*(currentTime/this.rotationTime));
		this.rotationFunction(angleTo)
	}

	sendData(object){
		this.customWaveNode.port.postMessage(object)
	}
}