/**
 * GPU.js Backend
 * GPU acceleration for browsers using GPU.js and WebGL
 * Falls back to CPU if GPU.js is not available or WebGL is not supported
 */
import { BackendInterface } from './BackendInterface.js';

export class GPUJSBackend extends BackendInterface {
	constructor() {
		super();
		this.name = 'gpu';
		this.gpu = null;
		this.isAvailable = false;
		this.init();
	}

	init() {
		try {
			if (typeof window !== 'undefined') {
				var GPU = null;
				if (typeof window.GPU !== 'undefined') {
					GPU = window.GPU;
					// GPU.js CDN version might export as GPU.GPU or GPU.default
					if (GPU && typeof GPU !== 'function' && GPU.GPU) {
						GPU = GPU.GPU;
					}
					if (GPU && typeof GPU !== 'function' && GPU.default) {
						GPU = GPU.default;
					}
				} else if (typeof require !== 'undefined') {
					try {
						GPU = require('gpu.js');
						if (GPU && typeof GPU !== 'function' && GPU.GPU) {
							GPU = GPU.GPU;
						}
						if (GPU && typeof GPU !== 'function' && GPU.default) {
							GPU = GPU.default;
						}
					} catch (e) {
					}
				}
				if (GPU && typeof GPU === 'function') {
					// Try to create GPU instance with explicit GPU mode
					try {
						this.gpu = new GPU({ mode: 'gpu' });
					} catch (e) {
						// Fallback to default mode if explicit mode fails
						try {
							this.gpu = new GPU();
						} catch (e2) {
							this.isAvailable = false;
							return;
						}
					}
					
					// Check if GPU.js actually got WebGL context
					// We require an actual WebGL context, not just GPU mode
					if (this.gpu) {
						var webglContext = null;
						if (this.gpu.getWebGLContext) {
							webglContext = this.gpu.getWebGLContext();
						}
						
						// Also check if we can create a test kernel (more reliable test)
						var canCreateKernel = false;
						if (webglContext) {
							try {
								var testKernel = this.gpu.createKernel(function() { return 1; }).setOutput([1]);
								if (testKernel) {
									canCreateKernel = true;
									// Clean up test kernel
									if (testKernel.destroy) testKernel.destroy();
								}
							} catch (e) {
								canCreateKernel = false;
							}
						}
						
						// Only enable if we have WebGL context AND can create kernels
						if (webglContext && canCreateKernel) {
							this.isAvailable = true;
							this.setupKernels();
						} else {
							// GPU.js is running in CPU mode or WebGL is blocked
							this.isAvailable = false;
						}
					}
				}
			}
		} catch (error) {
			this.isAvailable = false;
		}
	}

	setupKernels() {
		if (!this.isAvailable) return;

		this.dotMultiplyKernel = this.gpu.createKernel(function(a, b) {
			return a[this.thread.x] * b[this.thread.x];
		}).setOutput([1]);

		this.addKernel = this.gpu.createKernel(function(a, b) {
			return a[this.thread.x] + b[this.thread.x];
		}).setOutput([1]);

		this.subtractKernel = this.gpu.createKernel(function(a, b) {
			return a[this.thread.x] - b[this.thread.x];
		}).setOutput([1]);

		this.squareKernel = this.gpu.createKernel(function(a) {
			return a[this.thread.x] * a[this.thread.x];
		}).setOutput([1]);
	}

	matrix(data) {
		if (!this.isAvailable) {
			throw new Error('GPU.js backend is not available');
		}
		var arr = Array.isArray(data) ? data : (data._data ? Array.from(data._data) : [data]);
		return {
			_data: new Float32Array(arr),
			length: arr.length,
			size: function() { return [arr.length, 1]; }
		};
	}

	dotMultiply(a, b) {
		if (!this.isAvailable) {
			throw new Error('GPU.js backend is not available');
		}
		var arrA = a._data ? Array.from(a._data) : a;
		var arrB = b._data ? Array.from(b._data) : b;
		var len = Math.min(arrA.length, arrB.length);
		
		var kernel = this.gpu.createKernel(function(a, b) {
			return a[this.thread.x] * b[this.thread.x];
		}).setOutput([len]);
		
		var result = kernel(arrA, arrB);
		return this.matrix(result);
	}

	multiply(a, b) {
		if (!this.isAvailable) {
			throw new Error('GPU.js backend is not available');
		}
		if (typeof a === 'number') {
			var arrB = b._data ? Array.from(b._data) : b;
			var kernel = this.gpu.createKernel(function(scalar, arr) {
				return scalar * arr[this.thread.x];
			}).setOutput([arrB.length]);
			return this.matrix(kernel(a, arrB));
		}
		if (typeof b === 'number') {
			var arrA = a._data ? Array.from(a._data) : a;
			var kernel = this.gpu.createKernel(function(arr, scalar) {
				return arr[this.thread.x] * scalar;
			}).setOutput([arrA.length]);
			return this.matrix(kernel(arrA, b));
		}
		var arrA = a._data ? Array.from(a._data) : a;
		var arrB = b._data ? Array.from(b._data) : b;
		if (arrA.length === arrB.length) {
			var sum = 0;
			for (var i = 0; i < arrA.length; i++) {
				sum += arrA[i] * arrB[i];
			}
			return sum;
		}
		throw new Error('GPU.js multiply: unsupported operation');
	}

	transpose(a) {
		return this.matrix(a);
	}

	subtract(a, b) {
		if (!this.isAvailable) {
			throw new Error('GPU.js backend is not available');
		}
		var arrA = a._data ? Array.from(a._data) : a;
		var arrB = b._data ? Array.from(b._data) : b;
		var len = Math.min(arrA.length, arrB.length);
		
		var kernel = this.gpu.createKernel(function(a, b) {
			return a[this.thread.x] - b[this.thread.x];
		}).setOutput([len]);
		
		return this.matrix(kernel(arrA, arrB));
	}

	add(a, b) {
		if (!this.isAvailable) {
			throw new Error('GPU.js backend is not available');
		}
		if (typeof b === 'number') {
			var arrA = a._data ? Array.from(a._data) : a;
			var kernel = this.gpu.createKernel(function(arr, scalar) {
				return arr[this.thread.x] + scalar;
			}).setOutput([arrA.length]);
			return this.matrix(kernel(arrA, b));
		}
		var arrA = a._data ? Array.from(a._data) : a;
		var arrB = b._data ? Array.from(b._data) : b;
		var len = Math.min(arrA.length, arrB.length);
		
		var kernel = this.gpu.createKernel(function(a, b) {
			return a[this.thread.x] + b[this.thread.x];
		}).setOutput([len]);
		
		return this.matrix(kernel(arrA, arrB));
	}

	sum(a) {
		if (!this.isAvailable) {
			throw new Error('GPU.js backend is not available');
		}
		var arr = a._data ? Array.from(a._data) : a;
		var sum = 0;
		for (var i = 0; i < arr.length; i++) {
			sum += arr[i];
		}
		return sum;
	}

	square(a) {
		if (!this.isAvailable) {
			throw new Error('GPU.js backend is not available');
		}
		var arr = a._data ? Array.from(a._data) : a;
		var kernel = this.gpu.createKernel(function(arr) {
			return arr[this.thread.x] * arr[this.thread.x];
		}).setOutput([arr.length]);
		return this.matrix(kernel(arr));
	}

	ones(size) {
		if (!this.isAvailable) {
			throw new Error('GPU.js backend is not available');
		}
		var result = new Float32Array(size);
		for (var i = 0; i < size; i++) {
			result[i] = 1;
		}
		return this.matrix(result);
	}

	zeros(size) {
		if (!this.isAvailable) {
			throw new Error('GPU.js backend is not available');
		}
		return this.matrix(new Float32Array(size));
	}
}

