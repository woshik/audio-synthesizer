let audioContext = null;
const buttons = {};
const sounds = [];
const audios = ['808 [Car].wav', 'Snare [Rack].wav'];

window.addEventListener('load', () => {
	try {
		//Create the Audio Context, compatible with older Firefox and Chrome browsers
		window.AudioContext =
			window.AudioContext ||
			window.webkitAudioContext ||
			window.mozAudioContext;
		audioContext = new AudioContext();
	} catch (e) {
		alert('Web Audio API is not supported in this browser');
	}
});

document.addEventListener('DOMContentLoaded', () => {
	buttons.start = document.getElementById('start');

	buttons.start.addEventListener('click', async () => {
		await getAudioFiles();

		startPlaying();
	});
});

async function getAudioFiles() {
	for (const audio of audios) {
		const audioFile = await audioFileLoader(audio);
		sounds.push(audioFile);
	}
}

function startPlaying() {
	sounds.forEach((sound) => {
		sound.play(0);
	});
}

function audioFileLoader(fileName) {
	return new Promise((resolve, reject) => {
		if (fileName) {
			const soundObj = {};
			soundObj.fileName = fileName;
			const source = `audios\\${fileName}`;
			var playSound = audioContext.createBufferSource();

			const getSound = new XMLHttpRequest();
			getSound.open('GET', source, true);
			getSound.responseType = 'arraybuffer';
			getSound.onreadystatechange = function () {
				if (this.readyState == 4 && this.status === 200) {
					audioContext.decodeAudioData(getSound.response, function (buffer) {
						soundObj.soundToPlay = buffer;
						resolve(soundObj);
					});
				} else if (this.readyState === 4) {
					reject({});
				}
			};

			getSound.send();

			soundObj.play = function (startTime) {
				playSound = audioContext.createBufferSource();
				playSound.buffer = soundObj.soundToPlay;

				//Connections inside the Play function...
				playSound.connect(audioContext.destination);
				playSound.start(audioContext.currentTime + startTime);
			};
		} else {
			reject();
		}
	});
}
