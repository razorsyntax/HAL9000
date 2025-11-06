/**
 * Test GPU Backend Loading
 */
const { NeuralNetwork, Train, Prediction, NeuronArray, setBackend, getBackend, listBackends, loadGPUBackend, loadTensorFlowBackend } = require('../../dist/hal9000.cjs.js');

console.log('Testing GPU Backend Loading...\n');

console.log('Initial backends:', listBackends());
console.log('Current backend:', getBackend().name);

// Try loading TensorFlow backend (will fail if not installed, which is fine)
loadTensorFlowBackend().then((backend) => {
	if (backend) {
		console.log('\n✓ TensorFlow backend loaded!');
		console.log('Available backends:', listBackends());
	} else {
		console.log('\n✓ TensorFlow backend not available (expected if not installed)');
	}
	
	// Test that CPU backend still works
	const NN = new NeuralNetwork('TestNetwork');
	NN.createLayer({
		type: 'hidden',
		neurons: NeuronArray(3, 'logsig')
	});
	NN.createLayer({
		type: 'output',
		neurons: NeuronArray(1, 'logsig')
	});

	NN.setTarget([0.8]);
	NN.init(2);

	const inputs = [0.5, 0.5];
	const trainedNN = Train(NN, inputs, 0.5, 10, true);

	console.log('\n✓ Backend loading works!');
	console.log('  Final error:', trainedNN.globalFinal);
	console.log('  Prediction:', Prediction(trainedNN, inputs));
	console.log('  Current backend:', getBackend().name);
}).catch((error) => {
	console.error('Error:', error.message);
});

