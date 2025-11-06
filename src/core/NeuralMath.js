/**
 * HAL 9000 Neural Network Beta v.01
 * Written By: David R. Schwartz
 * Email: david@biomance.com
 * Released under MIT License
 *
 * Typed Array Math Library
 * High-performance math operations using Float32Array
 */
export var NeuralMath = (function () {
	"use strict";

	/**
	 * Create a matrix wrapper around Float32Array
	 * Maintains compatibility with existing code that expects ._data
	 */
	function createMatrix(data) {
		var arr;
		if (data instanceof Float32Array) {
			arr = data;
		} else if (Array.isArray(data)) {
			// Flatten nested arrays if needed
			var flat = [];
			for (var i = 0; i < data.length; i++) {
				if (Array.isArray(data[i])) {
					flat = flat.concat(data[i]);
				} else {
					flat.push(data[i]);
				}
			}
			arr = new Float32Array(flat);
		} else if (data && data._data) {
			// Already a matrix-like object
			arr = data._data instanceof Float32Array ? data._data : new Float32Array(data._data);
		} else if (typeof data === "number") {
			arr = new Float32Array([data]);
		} else {
			arr = new Float32Array([data]);
		}

		var matrix = {
			_data: arr,
			length: arr.length,
			size: function () {
				return [arr.length, 1];
			},
		};

		return matrix;
	}

	/**
	 * Convert array/typed array to Float32Array
	 */
	function toFloat32Array(data) {
		if (data instanceof Float32Array) {
			return data;
		}
		if (data && data._data) {
			return data._data instanceof Float32Array ? data._data : new Float32Array(data._data);
		}
		if (Array.isArray(data)) {
			// Flatten if nested
			var flat = [];
			for (var i = 0; i < data.length; i++) {
				if (Array.isArray(data[i])) {
					flat = flat.concat(data[i]);
				} else {
					flat.push(data[i]);
				}
			}
			return new Float32Array(flat);
		}
		if (typeof data === "number") {
			return new Float32Array([data]);
		}
		return new Float32Array([data]);
	}

	return {
		/**
		 * Create a matrix (compatible with mathjs API)
		 */
		matrix: function (data) {
			return createMatrix(data);
		},

		/**
		 * Element-wise multiplication (dotMultiply)
		 */
		dotMultiply: function (a, b) {
			var arrA = toFloat32Array(a);
			var arrB = toFloat32Array(b);
			var len = Math.min(arrA.length, arrB.length);
			var result = new Float32Array(len);

			for (var i = 0; i < len; i++) {
				result[i] = arrA[i] * arrB[i];
			}

			return createMatrix(result);
		},

		/**
		 * Matrix multiplication
		 * Handles: scalar * array, vector * vector (dot product), matrix operations
		 */
		multiply: function (a, b) {
			// Scalar multiplication
			if (typeof a === "number") {
				var arrB = toFloat32Array(b);
				var result = new Float32Array(arrB.length);
				for (var i = 0; i < arrB.length; i++) {
					result[i] = a * arrB[i];
				}
				return createMatrix(result);
			}
			if (typeof b === "number") {
				var arrA = toFloat32Array(a);
				var result = new Float32Array(arrA.length);
				for (var i = 0; i < arrA.length; i++) {
					result[i] = arrA[i] * b;
				}
				return createMatrix(result);
			}

			// Handle 2D array multiplication: transpose(vector) * 2D array
			if (a && a._data && Array.isArray(b) && Array.isArray(b[0])) {
				// a is transposed vector (1D), b is 2D array [rows][cols]
				// Result: [1 x vector_len] * [vector_len x cols] = [1 x cols]
				var vecA = toFloat32Array(a);
				var numCols = b[0].length;
				var result = new Float32Array(numCols);
				
				for (var k = 0; k < numCols; k++) {
					var sum = 0;
					for (var m = 0; m < vecA.length && m < b.length; m++) {
						sum += vecA[m] * b[m][k];
					}
					result[k] = sum;
				}
				return createMatrix(result);
			}

			var arrA = toFloat32Array(a);
			var arrB = toFloat32Array(b);

			// If both are 1D and same length, compute dot product
			if (arrA.length === arrB.length) {
				var sum = 0;
				for (var i = 0; i < arrA.length; i++) {
					sum += arrA[i] * arrB[i];
				}
				return sum;
			}

			// Handle matrix-like objects
			if (a && a._data && b && b._data) {
				var vecA = toFloat32Array(a);
				var vecB = toFloat32Array(b);
				if (vecA.length === vecB.length) {
					var dotSum = 0;
					for (var j = 0; j < vecA.length; j++) {
						dotSum += vecA[j] * vecB[j];
					}
					return dotSum;
				}
			}

			throw new Error("Matrix multiplication: unsupported operation - a:" + (a && a._data ? a._data.length : typeof a) + ", b:" + (b && b._data ? b._data.length : typeof b));
		},

		/**
		 * Transpose (for vectors, just returns copy)
		 */
		transpose: function (a) {
			var arr = toFloat32Array(a);
			return createMatrix(arr); // For vectors, transpose is same
		},

		/**
		 * Subtract
		 */
		subtract: function (a, b) {
			var arrA = toFloat32Array(a);
			var arrB = toFloat32Array(b);
			var len = Math.min(arrA.length, arrB.length);
			var result = new Float32Array(len);

			for (var i = 0; i < len; i++) {
				result[i] = arrA[i] - arrB[i];
			}

			return createMatrix(result);
		},

		/**
		 * Add
		 */
		add: function (a, b) {
			if (typeof b === "number") {
				// Scalar addition
				var arrA = toFloat32Array(a);
				var result = new Float32Array(arrA.length);
				for (var i = 0; i < arrA.length; i++) {
					result[i] = arrA[i] + b;
				}
				return createMatrix(result);
			}

			var arrA = toFloat32Array(a);
			var arrB = toFloat32Array(b);
			var len = Math.min(arrA.length, arrB.length);
			var result = new Float32Array(len);

			for (var i = 0; i < len; i++) {
				result[i] = arrA[i] + arrB[i];
			}

			return createMatrix(result);
		},

		/**
		 * Sum all elements
		 */
		sum: function (a) {
			var arr = toFloat32Array(a);
			var sum = 0;
			for (var i = 0; i < arr.length; i++) {
				sum += arr[i];
			}
			return sum;
		},

		/**
		 * Square each element
		 */
		square: function (a) {
			var arr = toFloat32Array(a);
			var result = new Float32Array(arr.length);
			for (var i = 0; i < arr.length; i++) {
				result[i] = arr[i] * arr[i];
			}
			return createMatrix(result);
		},

		/**
		 * Create array of ones
		 */
		ones: function (size) {
			var result = new Float32Array(size);
			for (var i = 0; i < size; i++) {
				result[i] = 1;
			}
			return createMatrix(result);
		},

		/**
		 * Create array of zeros
		 */
		zeros: function (size) {
			return createMatrix(new Float32Array(size));
		},
	};
})();

// Alias for compatibility - allows existing code to use math.*
export var math = NeuralMath;

// Default export
export default NeuralMath;

