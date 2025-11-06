/**
 * CPU Backend
 * Wraps NeuralMath as a BackendInterface implementation
 * This is the default backend using Float32Array for performance
 */
import { NeuralMath } from '../core/NeuralMath.js';
import { BackendInterface } from './BackendInterface.js';

export class CPUBackend extends BackendInterface {
	constructor() {
		super();
		this.name = 'cpu';
		this.math = NeuralMath;
	}

	matrix(data) {
		return this.math.matrix(data);
	}

	dotMultiply(a, b) {
		return this.math.dotMultiply(a, b);
	}

	multiply(a, b) {
		return this.math.multiply(a, b);
	}

	transpose(a) {
		return this.math.transpose(a);
	}

	subtract(a, b) {
		return this.math.subtract(a, b);
	}

	add(a, b) {
		return this.math.add(a, b);
	}

	sum(a) {
		return this.math.sum(a);
	}

	square(a) {
		return this.math.square(a);
	}

	ones(size) {
		return this.math.ones(size);
	}

	zeros(size) {
		return this.math.zeros(size);
	}
}

