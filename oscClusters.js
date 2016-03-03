var audioHelpers = (function(){
	var context = new AudioContext();
	OscillatorNode.prototype.WAVETYPES = {
		0: 'sine',
		1: 'square',
		2: 'sawtooth',
		3: 'triangle',
		4: 'custom'
	};

	return {
		newOsc: function(waveType, freq, dur, cb){
			// create a new oscillator
			var osc = context.createOscillator();
			osc.type = waveType;
			osc.frequency.value = freq;
			osc.connect(context.destination);
			osc.start();
			if (dur){
				setTimeout(function(){
					osc.stop();
					cb ? cb() : null;
				}, dur);
			}
			return osc;
		},

		oscCluster: function(baseFreq, totalOscs, freqSep, dur, cb){
			// create a cluster of new oscillators
			for (var i = 0; i < totalOscs; i++){
				var waveType = OscillatorNode.prototype.WAVETYPES[i % 3];
				var freq = freqSep * i + baseFreq;
				var callback = i === totalOscs - 1 ? cb : null;
				this.newOsc(waveType, freq, dur, callback);
			}
		},

		randInRange: function(min,max){
			return Math.floor(Math.random() * (1 + max - min)) + min;
		},

		annoyingClusters: function(){
			// make annoying clusters that never end
			this.oscCluster(this.randInRange(50, 2000), 100, 50, this.randInRange(50, 200), this.annoyingClusters.bind(this));
		}
	};
})();
