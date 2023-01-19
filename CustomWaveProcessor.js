class CustomWaveProcessor extends AudioWorkletProcessor {

  sampleData = null;
  sampleLength = 0;
  sampleLoaded = false;

  held = false;

  playOffset = 0;
  playVelocity = 1;
  normalVelocity = 1;

  blockLength = null;

  constructor(...args){
    super(...args);
    this.port.onmessage = (e) => {
      this.receiveMessage(e.data);
    }
  }

  process (inputs, outputs, parameters) {
    const output = outputs[0]
    if(this.sampleLoaded){
      output.forEach(channel => {
        this.blockLength = channel.length;
        for (let i = 0; i < channel.length; i++) {
          channel[i] = this.sampleData[Math.round(this.playOffset+(i*this.playVelocity))];
        }
      })
      this.playOffset += this.blockLength*this.playVelocity;
      if(!this.held){this.playVelocity = ((this.normalVelocity + (this.playVelocity*100))/101)}
     
      if(this.playOffset>this.sampleLength){ this.playOffset = this.playOffset % this.sampleLength;}
      if(this.playOffset<0){ this.playOffset = this.sampleLength-this.playOffset;}
      this.port.postMessage(this.playOffset);
    }

    return true
  }

  getBufferValues(bOffset, bLength){
    var vArray = this.waveData.slice(bOffset, bOffset+bLength);
    return vArray;
  }

  receiveMessage(data){
    if(data.label=='raw'){
      this.sampleLoaded = true;
      this.sampleLength = data.rawdata.length;
      this.sampleData = data.rawdata;
    } else if(data.label=='playheadspeed'){
      //this.playOffset = this.sampleLength*data.position
      this.playVelocity = data.velocity;
      this.held = true;
    } else if(data.label=='playheadstatus'){
      this.held = false;
    }
  }

  createWaveBuffer(waveType, wResolution, bResolution){
    //console.log("createWave");
    var waveData = new Array(bResolution);
    for (let i = 0; i < bResolution; i++) {
        waveData[i] = Math.sin((i*2*Math.PI)/wResolution);
      //  waveData[i] = (Math.random()*2)-1;
    }
    //console.log(waveData);
    return waveData;
  }
}

registerProcessor('CustomWaveProcessor', CustomWaveProcessor)