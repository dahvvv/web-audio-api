// make a bunch of harsh, randomized clusters of oscillators that never end

function newOsc(audio, waveType, freq, duration, callback) {
	var osc = audio.createOscillator();
	osc.type = waveType;
	osc.frequency.value = freq;
	osc.connect(audio.destination);
	osc.start();
	setTimeout(function() {
		osc.stop();
		if (callback)
			callback();
	}, duration);
}

function oscCluster(baseFreq, totalOscs, freqSeparation, duration, callback) {
	var cb = null;
	for (var i = 0; i < totalOscs; i++) {
		var waveType = OscillatorNode.prototype.waveTypes[i % 3];
		var hz = freqSeparation * i + baseFreq;
		if (i == (totalOscs - 1))
			cb = callback;
		newOsc(oscCluster.audio, waveType, hz, duration, cb);
	}
}

OscillatorNode.prototype.waveTypes = {
	0: 'sine',
	1: 'square',
	2: 'sawtooth',
	3: 'triangle',
	4: 'custom'
};

oscCluster.audio = new AudioContext();

function randInRange(min, max) {
	return Math.floor(Math.random() * (1 + max - min)) + min;
}

function annoyingClusters() {
	oscCluster(randInRange(50, 2000), 100, 50, randInRange(50, 200), annoyingClusters);
}

annoyingClusters();


