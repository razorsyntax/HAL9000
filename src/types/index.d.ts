/**
 * HAL9000 TypeScript Definitions
 */

export interface Neuron {
	id: string;
	activation: 'logsig' | 'tanh' | 'linear' | 'satlin' | 'arctan' | 'gaussian';
	wb: {
		w: number[];
		b: number;
	};
}

export interface Layer {
	name?: string;
	layerID?: string;
	type: 'hidden' | 'output';
	neurons: Neuron[];
}

export interface NetworkLayers {
	inputLayer: {
		inputs?: number;
	};
	hiddenLayer: Layer[];
	outputLayer: Layer;
}

export class NeuralNetwork {
	name: string;
	layers: NetworkLayers;
	targets: number[];
	globalError?: number[];
	globalFinal?: number;
	predictionArray?: number[] | any;

	constructor(name?: string);

	createLayer(options: {
		name?: string;
		type: 'hidden' | 'output';
		neurons: Neuron[];
	}): void;

	setTarget(targets: number[]): void;
	init(numInputs: number): void;
	errors(errorArray: number[], totalError: number, activatedArray: any[]): void;
}

export type ActivationFunction = 'logsig' | 'tanh' | 'linear' | 'satlin' | 'arctan' | 'gaussian';

export function NeuronArray(count: number, activation: ActivationFunction): Neuron[];

export function Train(
	NN: NeuralNetwork,
	inputs: number[],
	rate: number,
	iterations: number,
	enableErrors?: boolean
): NeuralNetwork;

export function Prediction(NN: NeuralNetwork, inputs: number[]): number[];

export function StopLearning(NN: NeuralNetwork): void;

export interface BackendInterface {
	matrix(data: any): any;
	dotMultiply(a: any, b: any): any;
	multiply(a: any, b: any): any;
	transpose(a: any): any;
	subtract(a: any, b: any): any;
	add(a: any, b: any): any;
	sum(a: any): number;
	square(a: any): any;
	ones(size: number): any;
	zeros(size: number): any;
}

export class CPUBackend extends BackendInterface {
	name: string;
	math: any;
}

export class GPUJSBackend extends BackendInterface {
	name: string;
	isAvailable: boolean;
}

export class TensorFlowJSBackend extends BackendInterface {
	name: string;
	isAvailable: boolean;
}

export function setBackend(backendName: 'cpu' | 'gpu' | 'tensorflow' | 'auto' | BackendInterface): BackendInterface;
export function getBackend(): BackendInterface;
export function listBackends(): string[];
export function registerBackend(name: string, backend: BackendInterface): void;
export function detectBackend(): string;
export function loadGPUBackend(): Promise<GPUJSBackend | null>;
export function loadTensorFlowBackend(): Promise<TensorFlowJSBackend | null>;

export interface NeuralMath {
	matrix(data: any): any;
	dotMultiply(a: any, b: any): any;
	multiply(a: any, b: any): any;
	transpose(a: any): any;
	subtract(a: any, b: any): any;
	add(a: any, b: any): any;
	sum(a: any): number;
	square(a: any): any;
	ones(size: number): any;
	zeros(size: number): any;
}

export const NeuralMath: NeuralMath;
export const math: NeuralMath;

export namespace utilities {
	function returnArray(quantity: any): any[];
	function toLetters(num: number): string;
}

export namespace NeuralMathLib {
	function activations(neuron: Neuron, value: number): number;
	function activatedLayer(neuronArr: Neuron[], inputs: number[], type: string): {
		activated: any;
		sums: any;
	};
	function summation(wbObj: { w: number[]; b: number }, inputs: number[]): number;
	function randomGauss(): number;
}

export namespace Derivatives {
	function dSig(val: number[] | Float32Array): any;
}

export function LossFunction(outputArr: any, targets: number[]): number[];
export function MeanSquaredErr(outputArr: any, targets: number[]): number;
export function UpdateWeights(newWeights: number[][], layer: Layer): Layer;
export function randomValues(): number;

export default NeuralNetwork;

