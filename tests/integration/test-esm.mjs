/**
 * Test ES Module Build
 * Run with: node --input-type=module test-esm.mjs
 */

import { NeuralNetwork, NeuronArray, Prediction, Train } from '../../dist/hal9000.esm.js';

console.log('Testing ES Module build...\n');

// Create network
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

// Train
const inputs = [0.5, 0.5];
const trainedNN = Train(NN, inputs, 0.5, 10, true);

console.log('✓ ES Module build works!');
console.log('  Final error:', trainedNN.globalFinal);
console.log('  Prediction:', Prediction(trainedNN, inputs));

