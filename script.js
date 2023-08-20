window.AudioContext =
	window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

let audioContext = new AudioContext();
const buttons = {};
const sounds = [];
const audios = [
	'exported 4.m4a',
	'808 [Car].wav',
	'Snare [Rack].wav',

	'_Rave Room MOJI TBR - Money (Extended Mix).mp3'
];

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

	console.log(sounds);
}

function startPlaying() {
	sounds.forEach((sound) => {
		const playSound = audioContext.createBufferSource();

		playSound.buffer = sound;

		//Connections inside the Play function...
		playSound.connect(audioContext.destination);
		playSound.start(audioContext.currentTime);
	});
}

function audioFileLoader(fileName) {
	return new Promise((resolve, reject) => {
		if (fileName) {
			const source = `audios\\${fileName}`;

			const getSound = new XMLHttpRequest();
			getSound.open('GET', source, true);
			getSound.responseType = 'arraybuffer';
			getSound.onreadystatechange = function () {
				if (this.readyState == 4 && this.status === 200) {
					audioContext.decodeAudioData(getSound.response, function (buffer) {
						resolve(buffer);
					});
				} else if (this.readyState === 4) {
					reject({});
				}
			};

			getSound.send();
		} else {
			reject();
		}
	});
}
