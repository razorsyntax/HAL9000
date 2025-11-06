/**
 * TensorFlow.js Backend
 * GPU acceleration for Node.js using TensorFlow.js
 * Supports CUDA, ROCm, and Metal
 * Falls back to CPU if TensorFlow.js is not available
 */
import { BackendInterface } from './BackendInterface.js';

export class TensorFlowJSBackend extends BackendInterface {
	constructor() {
		super();
		this.name = 'tensorflow';
		this.tf = null;
		this.isAvailable = false;
		this.init();
	}

	init() {
		try {
			if (typeof require !== 'undefined') {
				var tf = null;
				try {
					tf = require('@tensorflow/tfjs-node');
				} catch (e) {
					try {
						tf = require('@tensorflow/tfjs-node-gpu');
					} catch (e2) {
					}
				}
				if (tf) {
					this.tf = tf;
					this.isAvailable = true;
				}
			}
		} catch (error) {
			this.isAvailable = false;
		}
	}

	matrix(data) {
		if (!this.isAvailable) {
			throw new Error('TensorFlow.js backend is not available');
		}
		var arr = Array.isArray(data) ? data : (data._data ? Array.from(data._data) : [data]);
		var tensor = this.tf.tensor1d(arr);
		return {
			_data: tensor,
			length: arr.length,
			size: function() { return [arr.length, 1]; },
			dispose: function() {
				if (tensor && tensor.dispose) {
					tensor.dispose();
				}
			}
		};
	}

	dotMultiply(a, b) {
		if (!this.isAvailable) {
			throw new Error('TensorFlow.js backend is not available');
		}
		var tensorA = a._data instanceof this.tf.Tensor ? a._data : this.tf.tensor1d(a._data ? Array.from(a._data) : a);
		var tensorB = b._data instanceof this.tf.Tensor ? b._data : this.tf.tensor1d(b._data ? Array.from(b._data) : b);
		var result = tensorA.mul(tensorB);
		var data = result.arraySync();
		if (tensorA !== a._data && tensorA.dispose) tensorA.dispose();
		if (tensorB !== b._data && tensorB.dispose) tensorB.dispose();
		result.dispose();
		return this.matrix(data);
	}

	multiply(a, b) {
		if (!this.isAvailable) {
			throw new Error('TensorFlow.js backend is not available');
		}
		if (typeof a === 'number') {
			var tensorB = b._data instanceof this.tf.Tensor ? b._data : this.tf.tensor1d(b._data ? Array.from(b._data) : b);
			var result = tensorB.mul(a);
			var data = result.arraySync();
			if (tensorB !== b._data && tensorB.dispose) tensorB.dispose();
			result.dispose();
			return this.matrix(data);
		}
		if (typeof b === 'number') {
			var tensorA = a._data instanceof this.tf.Tensor ? a._data : this.tf.tensor1d(a._data ? Array.from(a._data) : a);
			var result = tensorA.mul(b);
			var data = result.arraySync();
			if (tensorA !== a._data && tensorA.dispose) tensorA.dispose();
			result.dispose();
			return this.matrix(data);
		}
		var tensorA = a._data instanceof this.tf.Tensor ? a._data : this.tf.tensor1d(a._data ? Array.from(a._data) : a);
		var tensorB = b._data instanceof this.tf.Tensor ? b._data : this.tf.tensor1d(b._data ? Array.from(b._data) : b);
		if (tensorA.shape[0] === tensorB.shape[0]) {
			var result = tensorA.dot(tensorB);
			var sum = result.arraySync();
			if (tensorA !== a._data && tensorA.dispose) tensorA.dispose();
			if (tensorB !== b._data && tensorB.dispose) tensorB.dispose();
			result.dispose();
			return sum;
		}
		throw new Error('TensorFlow.js multiply: unsupported operation');
	}

	transpose(a) {
		if (!this.isAvailable) {
			throw new Error('TensorFlow.js backend is not available');
		}
		var tensor = a._data instanceof this.tf.Tensor ? a._data : this.tf.tensor1d(a._data ? Array.from(a._data) : a);
		var result = tensor.transpose();
		var data = result.arraySync();
		if (tensor !== a._data && tensor.dispose) tensor.dispose();
		result.dispose();
		return this.matrix(data);
	}

	subtract(a, b) {
		if (!this.isAvailable) {
			throw new Error('TensorFlow.js backend is not available');
		}
		var tensorA = a._data instanceof this.tf.Tensor ? a._data : this.tf.tensor1d(a._data ? Array.from(a._data) : a);
		var tensorB = b._data instanceof this.tf.Tensor ? b._data : this.tf.tensor1d(b._data ? Array.from(b._data) : b);
		var result = tensorA.sub(tensorB);
		var data = result.arraySync();
		if (tensorA !== a._data && tensorA.dispose) tensorA.dispose();
		if (tensorB !== b._data && tensorB.dispose) tensorB.dispose();
		result.dispose();
		return this.matrix(data);
	}

	add(a, b) {
		if (!this.isAvailable) {
			throw new Error('TensorFlow.js backend is not available');
		}
		if (typeof b === 'number') {
			var tensorA = a._data instanceof this.tf.Tensor ? a._data : this.tf.tensor1d(a._data ? Array.from(a._data) : a);
			var result = tensorA.add(b);
			var data = result.arraySync();
			if (tensorA !== a._data && tensorA.dispose) tensorA.dispose();
			result.dispose();
			return this.matrix(data);
		}
		var tensorA = a._data instanceof this.tf.Tensor ? a._data : this.tf.tensor1d(a._data ? Array.from(a._data) : a);
		var tensorB = b._data instanceof this.tf.Tensor ? b._data : this.tf.tensor1d(b._data ? Array.from(b._data) : b);
		var result = tensorA.add(tensorB);
		var data = result.arraySync();
		if (tensorA !== a._data && tensorA.dispose) tensorA.dispose();
		if (tensorB !== b._data && tensorB.dispose) tensorB.dispose();
		result.dispose();
		return this.matrix(data);
	}

	sum(a) {
		if (!this.isAvailable) {
			throw new Error('TensorFlow.js backend is not available');
		}
		var tensor = a._data instanceof this.tf.Tensor ? a._data : this.tf.tensor1d(a._data ? Array.from(a._data) : a);
		var result = tensor.sum();
		var sum = result.arraySync();
		if (tensor !== a._data && tensor.dispose) tensor.dispose();
		result.dispose();
		return sum;
	}

	square(a) {
		if (!this.isAvailable) {
			throw new Error('TensorFlow.js backend is not available');
		}
		var tensor = a._data instanceof this.tf.Tensor ? a._data : this.tf.tensor1d(a._data ? Array.from(a._data) : a);
		var result = tensor.square();
		var data = result.arraySync();
		if (tensor !== a._data && tensor.dispose) tensor.dispose();
		result.dispose();
		return this.matrix(data);
	}

	ones(size) {
		if (!this.isAvailable) {
			throw new Error('TensorFlow.js backend is not available');
		}
		var tensor = this.tf.ones([size]);
		var data = tensor.arraySync();
		tensor.dispose();
		return this.matrix(data);
	}

	zeros(size) {
		if (!this.isAvailable) {
			throw new Error('TensorFlow.js backend is not available');
		}
		var tensor = this.tf.zeros([size]);
		var data = tensor.arraySync();
		tensor.dispose();
		return this.matrix(data);
	}
}

