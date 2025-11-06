/**
 * Backend Interface
 * Defines the contract that all math backends must implement
 */
export class BackendInterface {
	matrix(data) {
		throw new Error('BackendInterface.matrix() must be implemented');
	}

	dotMultiply(a, b) {
		throw new Error('BackendInterface.dotMultiply() must be implemented');
	}

	multiply(a, b) {
		throw new Error('BackendInterface.multiply() must be implemented');
	}

	transpose(a) {
		throw new Error('BackendInterface.transpose() must be implemented');
	}

	subtract(a, b) {
		throw new Error('BackendInterface.subtract() must be implemented');
	}

	add(a, b) {
		throw new Error('BackendInterface.add() must be implemented');
	}

	sum(a) {
		throw new Error('BackendInterface.sum() must be implemented');
	}

	square(a) {
		throw new Error('BackendInterface.square() must be implemented');
	}

	ones(size) {
		throw new Error('BackendInterface.ones() must be implemented');
	}

	zeros(size) {
		throw new Error('BackendInterface.zeros() must be implemented');
	}
}

