/**
 * HAL9000 Main Entry Point
 * Exports all public APIs for use in Node.js, Angular, React, and Vanilla JS
 */

// Import and re-export NeuralMath (for backward compatibility)
export { math, NeuralMath } from './NeuralMath.js';

// Import HAL9000 classes and functions
export {
	Derivatives,
	LossFunction,
	MeanSquaredErr, NeuralMathLib, NeuralNetwork,
	Neuron,
	NeuronArray, Prediction, randomValues, StopLearning, Train, UpdateWeights, utilities
} from './HAL9000.js';

// Export backend management
export { BackendInterface } from '../backends/BackendInterface.js';
export { detectBackend, getBackend, listBackends, loadGPUBackend, loadTensorFlowBackend, registerBackend, setBackend } from '../backends/BackendManager.js';
export { CPUBackend } from '../backends/CPUBackend.js';

// Default export - main NeuralNetwork class
import { NeuralNetwork } from './HAL9000.js';
export default NeuralNetwork;

