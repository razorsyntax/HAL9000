/**
 * Test Backend API
 */
const { NeuralNetwork, Train, Prediction, NeuronArray, setBackend, getBackend, listBackends } = require('../../dist/hal9000.cjs.js');

console.log('Testing Backend API...\n');

// Test default backend
console.log('Default backend:', getBackend().name);
console.log('Available backends:', listBackends());

// Test network still works
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

console.log('\n✓ Backend abstraction works!');
console.log('  Final error:', trainedNN.globalFinal);
console.log('  Prediction:', Prediction(trainedNN, inputs));

// Test backend switching (should still be CPU since that's all we have)
try {
	setBackend('cpu');
	console.log('\n✓ Backend switching works!');
	console.log('  Current backend:', getBackend().name);
} catch (error) {
	console.error('Backend switching error:', error.message);
}

