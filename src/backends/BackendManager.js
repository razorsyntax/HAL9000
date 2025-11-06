/**
 * Backend Manager
 * Handles backend detection, selection, and switching
 */
import { BackendInterface } from './BackendInterface.js';
import { CPUBackend } from './CPUBackend.js';

var currentBackend = null;
var availableBackends = {};

function initializeBackends() {
	availableBackends.cpu = new CPUBackend();
	currentBackend = availableBackends.cpu;
}

export async function loadGPUBackend() {
	if (typeof window !== 'undefined') {
		try {
			if (typeof GPU !== 'undefined' || (typeof require !== 'undefined' && require('gpu.js'))) {
				var modulePath = './GPUJSBackend.js';
				var { GPUJSBackend } = await import(modulePath);
				var gpuBackend = new GPUJSBackend();
				if (gpuBackend.isAvailable) {
					availableBackends.gpu = gpuBackend;
					return gpuBackend;
				}
			}
		} catch (error) {
		}
	}
	return null;
}

export async function loadTensorFlowBackend() {
	if (typeof require !== 'undefined' && typeof window === 'undefined') {
		try {
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
				var modulePath = './TensorFlowJSBackend.js';
				var { TensorFlowJSBackend } = await import(modulePath);
				var tfBackend = new TensorFlowJSBackend();
				if (tfBackend.isAvailable) {
					availableBackends.tensorflow = tfBackend;
					return tfBackend;
				}
			}
		} catch (error) {
		}
	}
	return null;
}

function detectBestBackend() {
	if (availableBackends.tensorflow && availableBackends.tensorflow.isAvailable) {
		return 'tensorflow';
	}
	if (availableBackends.gpu && availableBackends.gpu.isAvailable) {
		return 'gpu';
	}
	return 'cpu';
}

initializeBackends();

export function setBackend(backendName) {
	if (backendName === 'auto') {
		backendName = detectBestBackend();
	}

	if (typeof backendName === 'string') {
		if (availableBackends[backendName]) {
			currentBackend = availableBackends[backendName];
			return currentBackend;
		} else {
			throw new Error(`Backend "${backendName}" is not available. Available backends: ${Object.keys(availableBackends).join(', ')}`);
		}
	} else if (backendName && typeof backendName.matrix === 'function') {
		currentBackend = backendName;
		return currentBackend;
	} else {
		throw new Error('Invalid backend. Must be a backend name string or BackendInterface instance.');
	}
}

export function getBackend() {
	return currentBackend;
}

export function listBackends() {
	return Object.keys(availableBackends);
}

export function registerBackend(name, backend) {
	if (!(backend instanceof BackendInterface)) {
		throw new Error('Backend must be an instance of BackendInterface');
	}
	availableBackends[name] = backend;
}

export function getMath() {
	return currentBackend;
}

export function detectBackend() {
	return detectBestBackend();
}


