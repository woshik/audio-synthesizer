// Define the URLs of your sample audio files
const audioFile1 = './audios/808.wav';
const audioFile2 = './audios/Snare.wav';

// Initialize the Web Audio API context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Load audio files
async function loadAudio(url) {
	const response = await fetch(url);
	const arrayBuffer = await response.arrayBuffer();
	return await audioContext.decodeAudioData(arrayBuffer);
}

// Generate a random melody sequence (you might need to adjust this based on your needs)
function generateRandomMelody(lengthInSeconds) {
	const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];
	const sequence = [];
	const numNotes = Math.floor(lengthInSeconds * 2); // Adjust as needed

	for (let i = 0; i < numNotes; i++) {
		const randomNote = notes[Math.floor(Math.random() * notes.length)];
		sequence.push(randomNote);
	}

	return sequence;
}

// Combine audio files based on the generated melody sequence
async function combineAudioFiles() {
	const audioBuffer1 = await loadAudio(audioFile1);
	const audioBuffer2 = await loadAudio(audioFile2);

	const melodySequence = generateRandomMelody(30); // 30 seconds

	const combinedBuffer = audioContext.createBuffer(
		2, // stereo
		audioContext.sampleRate * 30, // 30 seconds
		audioContext.sampleRate
	);

	const channel1 = combinedBuffer.getChannelData(0);
	const channel2 = combinedBuffer.getChannelData(1);

	let index = 0;
	for (const note of melodySequence) {
		const sourceBuffer = note === 'C4' ? audioBuffer1 : audioBuffer2;
		const sourceData = sourceBuffer.getChannelData(0); // assuming mono audio files

		for (let i = 0; i < sourceData.length; i++) {
			channel1[index] += sourceData[i];
			channel2[index] += sourceData[i];
			index++;
		}
	}

	// Create a buffer source and play the combined melody
	const melodySource = audioContext.createBufferSource();
	melodySource.buffer = combinedBuffer;
	melodySource.connect(audioContext.destination);
	melodySource.start();
}

// Call the combineAudioFiles function to start playing the combined melody
document.getElementById('playButton').addEventListener('click', () => {
	combineAudioFiles();
});
