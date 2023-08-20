const audioFiles = [
	'./audios/808 [Car].wav', // Replace with your audio file paths
	'./audios/Snare [Rack].wav'
];

const melodyDuration = 30; // 30 seconds

// Function to play the melody
function playMelody() {
	const context = new (window.AudioContext || window.webkitAudioContext)();
	const melody = context.createBufferSource();

	// Load and decode audio files
	const buffers = [];
	let loadedCount = 0;

	audioFiles.forEach((filePath, index) => {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', filePath, true);
		xhr.responseType = 'arraybuffer';

		xhr.onload = () => {
			context.decodeAudioData(xhr.response, (buffer) => {
				buffers[index] = buffer;
				loadedCount++;

				if (loadedCount === audioFiles.length) {
					// Generate a random sequence of audio buffers
					const sequence = generateRandomSequence(buffers, melodyDuration);

					// Concatenate the sequence of buffers
					const combinedBuffer = concatenateBuffers(sequence, context);

					melody.buffer = combinedBuffer;
					melody.connect(context.destination);
					melody.start();
				}
			});
		};

		xhr.send();
	});
}

// Function to generate a random sequence of audio buffers
function generateRandomSequence(buffers, duration) {
	const sequence = [];
	let currentTime = 0;

	while (currentTime < duration) {
		const randomIndex = Math.floor(Math.random() * buffers.length);
		sequence.push(buffers[randomIndex]);
		currentTime += buffers[randomIndex].duration;
	}

	return sequence;
}

// Function to concatenate audio buffers
function concatenateBuffers(buffers, context) {
	const totalDuration = buffers.reduce(
		(acc, buffer) => acc + buffer.duration,
		0
	);
	const combinedBuffer = context.createBuffer(
		1,
		context.sampleRate * totalDuration,
		context.sampleRate
	);

	let offset = 0;
	buffers.forEach((buffer) => {
		combinedBuffer.getChannelData(0).set(buffer.getChannelData(0), offset);
		offset += buffer.length;
	});

	return combinedBuffer;
}

// Attach click event to play button
const playButton = document.getElementById('playButton');
playButton.addEventListener('click', playMelody);
