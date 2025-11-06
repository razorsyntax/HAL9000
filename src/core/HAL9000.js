/**
 * HAL 9000 Neural Network Beta v.01
 * Written By: David R. Schwartz
 * Email: david@biomance.com
 * Released under MIT License
 *
 * This is the brain for HAL. It contains the logic to create the neural network
 */

// Import backend manager
import { getMath } from '../backends/BackendManager.js';

// Get current math backend (defaults to CPU)
var math = getMath();

//creates NN obj
var NeuralNetwork = function (name) {
	this.name = name || "NN";
	this.layers = {
		inputLayer: {},
		hiddenLayer: [],
		outputLayer: [],
	};
	this.targets = [];
};

//creates new layer
NeuralNetwork.prototype.createLayer = function () {
	var num = arguments[0];
	var attr = arguments[1];

	if (typeof num !== "number") {
		attr = arguments[0];
		num = 1;
	}

	try {
		num = attr.type === "output" ? 1 : num;
	} catch (e) {
		alert(
			"Please provide an attribute type when creating layers: output or hidden"
		);
		return false;
	}
	//ensures output layer count is always 1

	for (let i = 0; i < num; i++) {
		switch (attr.type) {
			case "hidden":
				var layerID;
				var layerCount = this.layers.hiddenLayer.length;
				layerID = layerCount < 1 ? "A" : utilities.toLetters(layerCount + 1);

				if (attr.neurons.length > 0) {
					for (let i = 0; i < attr.neurons.length; i++) {
						attr.neurons[i].id = layerID + (i + 1).toString();
					}
				}

				this.layers.hiddenLayer.push({
					name: attr.name || "",
					layerID: layerID,
					type: attr.type,
					neurons: attr.neurons,
				});
				break;
			case "output":
				for (let i = 0; i < attr.neurons.length; i++) {
					attr.neurons[i].id = "Output_" + (i + 1);
				}

				this.layers.outputLayer = {
					type: attr.type,
					neurons: attr.neurons,
				};
				//Ensures output layer only ever has one layer
				return;
			default:
				alert("Please specify layer type: 'output' or 'hidden'");
				return false;
		}
	}
};

//sets training targets
NeuralNetwork.prototype.setTarget = function (targets) {
	this.targets = targets;
};

//Creates a JSON obj with all initial weights and biases in NN
NeuralNetwork.prototype.init = function (numInputs) {
	var num;
	var hArr = this.layers.hiddenLayer;
	var oArr = this.layers.outputLayer;
	var iArr = this.layers.inputLayer;
	var valArr = [];

	//adding inputs to input layer
	iArr.inputs = numInputs;

	//seeding random wb data in hidden layer neurons
	var currentInputSize = numInputs;
	for (let i = 0; i < hArr.length; i++) {
		//seeding random wb data in hidden layer neurons
		for (let j = 0; j < hArr[i].neurons.length; j++) {
			valArr = randomValues(currentInputSize);
			hArr[i].neurons[j].wb = { w: valArr, b: NeuralMathLib.randomGauss() };
		}
		// Update input size for next layer to be the current layer's neuron count
		currentInputSize = hArr[i].neurons.length;
	}

	//seeding random wb data in output layer neurons
	// Use the last hidden layer's neuron count as input size
	var numLastInputs = hArr.length > 0 ? hArr[hArr.length - 1].neurons.length : numInputs;
	for (let i = 0; i < oArr.neurons.length; i++) {
		valArr = randomValues(numLastInputs);
		oArr.neurons[i].wb = { w: valArr, b: NeuralMathLib.randomGauss() };
	}
};

// NeuralNetwork.prototype.initTEST = function (numInputs) {
//     var num;
//     var hArr = this.layers.hiddenLayer;
//     var oArr = this.layers.outputLayer;
//     var iArr = this.layers.inputLayer;

//     //seeding random wb data in hidden layer neurons
//     hArr[0].neurons[0].wb = { "w": [.15,.20], "b": .35 };
//     hArr[0].neurons[1].wb =  { "w": [.25,.30], "b": .35 };
//     oArr.neurons[0].wb = { "w": [.40,.45], "b": 0.60 };
//     oArr.neurons[1].wb = { "w": [.50,.55], "b": 0.60 };
// };

NeuralNetwork.prototype.errors = function (
	globalError,
	globalFinal,
	predictionArray
) {
	this.globalError = globalError; //All Errors from each training cycle
	this.globalFinal = globalFinal; //Absolute final error
	this.predictionArray = predictionArray; //Prediction arrays from each cycle
};

var Train = function (NN, inputs, rate, iter, error) {
	var errArr = [];
	var tError = [];
	if (typeof iter !== "number") {
		iter = 1;
	}
	if (typeof error !== "boolean") {
		error = true;
	}
	for (let loop = 0; loop < iter; loop++) {
		//console.log("Initial Inputs: \n" + inputs + "\n");
		var newInputs = [];
		var activatedOutputArr = [];
		var activatedHiddenArr = [];
		var sumsOFAllLayers = [];
		var activatedVal, id, wArr, neuron, summed;

		/////// FEED FORWARD
		//
		var layerActivations = [];
		var currentInputs = inputs;
		for (let i = 0; i < NN.layers.hiddenLayer.length; i++) {
			//Calculate Activated Hidden Layer Outputs
			var neuronHidArr = NN.layers.hiddenLayer[i].neurons;
			var activatedHiddenObj = NeuralMathLib.activatedLayer(
				neuronHidArr,
				currentInputs,
				"hidden"
			);
			activatedHiddenArr.push(activatedHiddenObj.activated); //inputs for next layer
			sumsOFAllLayers.push(activatedHiddenObj); //storing activated inputs & sums from layers for later
			layerActivations.push(activatedHiddenObj.activated);
			// Convert Float32Array to regular array for next layer input
			currentInputs = activatedHiddenObj.activated._data 
				? Array.from(activatedHiddenObj.activated._data) 
				: activatedHiddenObj.activated;
		}

		//Calculate Activated Output Layers
		var lastLayerInputs = activatedHiddenArr[activatedHiddenArr.length - 1]; //Last layer of hidden network
		// Convert matrix to array for activatedLayer
		var lastLayerInputsArray = lastLayerInputs._data 
			? Array.from(lastLayerInputs._data) 
			: lastLayerInputs;
		var neuronOutArr = NN.layers.outputLayer.neurons;
		var activatedOutputObj = NeuralMathLib.activatedLayer(
			neuronOutArr,
			lastLayerInputsArray,
			"output"
		);

		activatedOutputArr = activatedOutputObj.activated;
		// Keep lastLayerInputs as matrix for FinalOutputWeightCalcs
		if (!lastLayerInputs._data) {
			lastLayerInputs = math.matrix(lastLayerInputsArray);
		}
		//console.log("Activated Output Layer Array: \n[" + activatedOutputArr + "]\n");

		/////// BACKPROPAGATION
		//
		var errors = LossFunction(activatedOutputArr, NN.targets); //Error Calculation of the Output Layer
		var totalError = errors.reduce(function (
			previousValue,
			currentValue,
			currentIndex,
			array
		) {
			return previousValue + currentValue;
		});

		if (error) {
			tError.push(totalError);
			// Convert to regular array for storage
			var activatedData = activatedOutputArr._data 
				? Array.from(activatedOutputArr._data) 
				: activatedOutputArr;
			errArr.push(activatedData);
			NN.errors(tError, totalError, errArr);
		}

		//console.log("Total Error of the Output Layer: \n" + globalFinalError + "\n");

		///////// Output Layer Calculations
		//
		//Calculates the final output weights of the output layer neurons
		var outputs = NeuralMathLib.FinalOutputWeightCalcs(
			activatedOutputArr,
			lastLayerInputs,
			rate,
			NN
		);

		var outputWBs = outputs.outputWBs;
		var finalDeltaArr = outputs.finalDeltaArr;
		var newOutputWeightArr = outputs.newOutputWeightArr;
		var calculatedOutputErrors = outputs.errorOutput;
		var sigs = outputs.sig;

		var oldOutputWeights = [];
		for (let i = 0; i < NN.layers.outputLayer.neurons.length; i++) {
			oldOutputWeights.push(
				utilities.returnArray(NN.layers.outputLayer.neurons[i].wb.w)
			);
		}

		//Update output array weights
		// newOutputWeightArr is a 2D array: [[weights for neuron 0], [weights for neuron 1], ...]
		for (let i = 0; i < newOutputWeightArr.length; i++) {
			if (newOutputWeightArr[i]) {
				NN.layers.outputLayer.neurons[i].wb.w = Array.isArray(newOutputWeightArr[i])
					? newOutputWeightArr[i]
					: Array.from(newOutputWeightArr[i]);
			}
		}

		///////// Hidden Layer Calculations
		//
		var layers = utilities.returnArray(NN.layers.hiddenLayer);
		var reversedLayers = layers.reverse();

		//------Start of Loop
		for (let q = 0; q < reversedLayers.length; q++) {
			var delta = math.dotMultiply(calculatedOutputErrors, sigs);
			var errorTotals = math.multiply(math.transpose(delta), oldOutputWeights);
			errorTotals = math.transpose(errorTotals);

			var currentLayerIdx = reversedLayers.length - 1 - q;
			var currentLayerActivation =
				currentLayerIdx >= 0 && currentLayerIdx < layerActivations.length
					? layerActivations[currentLayerIdx]
					: math.matrix(inputs);
			var hidDers = Derivatives.dSig(currentLayerActivation._data);
			// Convert to regular array
			var hidDersData = hidDers._data ? Array.from(hidDers._data) : hidDers;

			var currentInputs;
			if (currentLayerIdx === 0) {
				currentInputs = inputs;
			} else {
				// Convert Float32Array to regular array if needed
				var prevActivation = layerActivations[currentLayerIdx - 1];
				currentInputs = prevActivation._data 
					? Array.from(prevActivation._data) 
					: prevActivation;
			}

			// Convert errorTotals to array
			var errorTotalsArr = errorTotals._data ? Array.from(errorTotals._data) : errorTotals;
			// Ensure errorTotalsArr is an array
			if (!Array.isArray(errorTotalsArr)) {
				errorTotalsArr = [errorTotalsArr];
			}

			//Final weight calculation
			// Gradient for weight w[j][i] = errorTotals[j] * hidDersData[j] * currentInputs[i]
			var finalWHold = [];
			var finalWeightArr = [];
			for (let j = 0; j < reversedLayers[q].neurons.length; j++) {
				for (let i = 0; i < currentInputs.length; i++) {
					// Compute gradient for this specific weight connection
					var gradient = errorTotalsArr[j] * hidDersData[j] * currentInputs[i];
					finalWHold.push(
						reversedLayers[q].neurons[j].wb.w[i] - rate * gradient
					);
				}
				finalWeightArr.push(finalWHold);
				finalWHold = [];
			}

			//update all weights in previous layer
			var originalLayerIdx = reversedLayers.length - 1 - q;
			NN.layers.hiddenLayer[originalLayerIdx] = UpdateWeights(
				finalWeightArr,
				reversedLayers[q]
			);
		}
	}
	return NN;
};

var Prediction = function (NN, inputs) {
	var newInputs = [];
	var activatedOutputArr = [];
	var activatedHiddenArr = [];
	var sumsOFAllLayers = [];

	/////// FEED FORWARD
	//
	var currentInputs = inputs;
	for (let i = 0; i < NN.layers.hiddenLayer.length; i++) {
		//Calculate Activated Hidden Layer Outputs
		var neuronHidArr = NN.layers.hiddenLayer[i].neurons;
		var activatedHiddenObj = NeuralMathLib.activatedLayer(
			neuronHidArr,
			currentInputs,
			"hidden"
		);
		activatedHiddenArr.push(activatedHiddenObj.activated); //inputs for next layer
		sumsOFAllLayers.push(activatedHiddenObj); //storing activated inputs & sums from layers for later
		// Convert Float32Array to regular array for next layer input
		currentInputs = activatedHiddenObj.activated._data 
			? Array.from(activatedHiddenObj.activated._data) 
			: activatedHiddenObj.activated;
	}

	//Calculate Activated Output Layers
	var lastLayerInputs = activatedHiddenArr[activatedHiddenArr.length - 1]; //Last layer of hidden network
	var neuronOutArr = NN.layers.outputLayer.neurons;
	var activatedOutputObj = NeuralMathLib.activatedLayer(
		neuronOutArr,
		lastLayerInputs,
		"output"
	);
	// Convert to regular array
	var result = activatedOutputObj.activated._data 
		? Array.from(activatedOutputObj.activated._data) 
		: activatedOutputObj.activated;
	return result;
};

var StopLearning = function () {
	return false;
};
/**
 * Neuron Creation
 */
var Neuron = function (act) {
	(this.activation = act.activation || "logsig"), (this.id = "");
};

Neuron.prototype.update = function (newProperties) {
	this.obj = newProperties || this.obj;
};

var NeuronArray = function (numNeurons, actFunc) {
	var neuronArr = [];
	numNeurons = numNeurons || 0;
	actFunc = actFunc || "logsig";
	for (var i = 0; i < numNeurons; i++) {
		neuronArr.push(
			new Neuron({
				activation: actFunc,
			})
		);
	}
	return neuronArr;
};
/**
 * Convenient Utilities
 */
var utilities = {
	nextLetter: function (letter) {
		var number = utilities.toNumbers(letter);
		var nextLetter = number + 1;
		return utilities.toLetters(nextLetter);
	},
	lastLetter: function (letter) {
		var number = utilities.toNumbers(letter);
		var nextLetter = number - 1;
		var lastNumber = utilities.toLetters(nextLetter);

		return lastNumber;
	},
	toLetters: function (num) {
		"use strict";
		var mod = num % 26;
		var pow = (num / 26) | 0;
		var out = mod ? String.fromCharCode(64 + mod) : (pow--, "Z");
		return pow ? utilities.toLetters(pow) + out : out;
	},
	toNumbers: function (str) {
		"use strict";
		var len;
		var out = 0;
		try {
			len = str.length;
		} catch (err) {
			len = 0;
		}

		var pos = len;
		while ((pos -= 1) > -1) {
			out += (str.charCodeAt(pos) - 64) * Math.pow(26, len - 1 - pos);
		}
		return out;
	},
	returnArray: function (quantity) {
		var arr = [];
		for (let i = 0; i < quantity.length; i++) {
			arr.push(quantity[i]);
		}
		return arr;
	},
};

/**
 * Algorithm library
 */

var NeuralMathLib = {
	activations: function (active, value) {
		var val = value;
		switch (active.activation) {
			case "logsig":
				return 1 / (1 + Math.exp(-val));
			case "tanh":
				var posN = Math.exp(val); // e^(n)
				var negN = Math.exp(-val); // e^(-n)
				return (posN - negN) / (posN + negN);
			case "linear":
				return value;
			case "satlin":
				if (value < 0) {
					return 0;
				}

				if (value >= 0 && value <= 1) {
					return value;
				}

				if (value > 1) {
					return 1;
				}
			case "arctan":
				return Math.atan(val);
			case "gaussian":
				return Math.exp(-Math.pow(val, 2)); // e^(-(x^2))
		}
	},
	activatedLayer: function (neuronArr, inputs, type) {
		"use strict";
		var id, neuron, summed, activatedVal, j;
		var sums = [];
		var activatedLayerArr = [];

		for (let j = 0; j < neuronArr.length; j++) {
			neuron = neuronArr[j];

			summed = NeuralMathLib.summation(neuron.wb, inputs);
			sums.push(summed);

			activatedVal = NeuralMathLib.activations(neuron, summed);
			activatedLayerArr.push(activatedVal);
		}

		return {
			activated: math.matrix(activatedLayerArr),
			sums: math.matrix(sums),
		};
	},
	FinalOutputWeightCalcs: function (
		activatedOutputArr,
		lastLayerInputs,
		rate,
		NN
	) {
		var outputWBs = [];
		var delHolder = [];
		var finalDeltaArr = [];

		var oArr = utilities.returnArray(NN.layers.outputLayer.neurons);
		//Get Output Layer weights for each output neuron
		for (let i = 0; i < oArr.length; i++) {
			outputWBs.push(oArr[i].wb.w);
		}
		//sig = (actualOutput * (1 - actualOutput))
		var sig = Derivatives.dSig(activatedOutputArr._data);
		//errorOutput = (actualOutput - targetOutput)
		var errorOutput = math.subtract(
			activatedOutputArr,
			math.matrix(NN.targets)
		);
		var delta = math.dotMultiply(errorOutput, sig);
		// Convert delta to array - handle both matrix and scalar cases
		var deltaArr;
		if (typeof delta === 'number') {
			deltaArr = [delta];
		} else if (delta && delta._data) {
			deltaArr = Array.from(delta._data);
		} else if (Array.isArray(delta)) {
			deltaArr = delta;
		} else {
			deltaArr = [delta];
		}
		
		var lastLayerMatrix = lastLayerInputs._data
			? lastLayerInputs
			: math.matrix(lastLayerInputs);
		// Convert lastLayerMatrix to array
		var lastLayerArr;
		if (lastLayerMatrix && lastLayerMatrix._data) {
			lastLayerArr = Array.from(lastLayerMatrix._data);
		} else if (Array.isArray(lastLayerMatrix)) {
			lastLayerArr = lastLayerMatrix;
		} else if (Array.isArray(lastLayerInputs)) {
			lastLayerArr = lastLayerInputs;
		} else {
			lastLayerArr = [lastLayerInputs];
		}
		
		// Compute finalDeltaArr: for each output neuron, multiply delta[i] by each hidden neuron activation
		// This gives us the gradient for each weight: delta[i] * lastLayerArr[j]
		var finalDeltaArr = [];
		for (let i = 0; i < deltaArr.length; i++) {
			finalDeltaArr.push(deltaArr[i] * lastLayerArr[i % lastLayerArr.length]);
		}

		var holder = [];
		var newOutputWeightArr = [];
		for (let i = 0; i < outputWBs.length; i++) {
			for (let j = 0; j < outputWBs[i].length; j++) {
				// Weight update: w[i][j] = w[i][j] - rate * delta[i] * lastLayerArr[j]
				var deltaValue = deltaArr[i] * lastLayerArr[j];
				holder.push(outputWBs[i][j] - rate * deltaValue);
			}
			newOutputWeightArr.push(holder);
			holder = [];
		}

		return {
			outputWBs: math.matrix(outputWBs),
			finalDeltaArr: finalDeltaArr,
			NN: NN,
			newOutputWeightArr: newOutputWeightArr, // Keep as 2D array, not matrix
			errorOutput: errorOutput,
			sig: sig,
		};
	},
	summation: function (wbObj, inputs) {
		var w = wbObj.w;
		var b = wbObj.b;

		var inputsMAT = math.matrix(inputs);
		var weightsMAT = math.matrix(w);
		var elementWise = math.dotMultiply(inputsMAT, weightsMAT);
		var sumMAT = math.sum(elementWise);
		// sumMAT is a number, b is a number, just add them
		return sumMAT + b;
	},
	//Creates pseudo-random values between 0 & 1
	randomGauss: function () {
		// Unable to find originator of this function
		var x1, x2, rad, y1;
		do {
			x1 = 2 * Math.random() - 1;
			x2 = 2 * Math.random() - 1;
			rad = x1 * x1 + x2 * x2;
		} while (rad >= 1 || rad == 0);
		var c = Math.sqrt((-2 * Math.log(rad)) / rad);
		var num = Math.abs(x1 * c);
		if (num > 1) {
			num = 1 / num;
		}
		return num;
	},
	eTotal: function (prevLayerWBs, finalDeltaArr) {
		var arr = [];
		arr.push(math.multiply(finalDeltaArr, math.matrix(prevLayerWBs)));

		var reducing = function (total, num) {
			return total + num;
		};
		total = arr[0]._data.reduce(reducing);
		return total;
	},
};

var Derivatives = {
	dSig: function (/*array*/ val) {
		var valMatrix = math.matrix(val);
		var ones = math.ones(val.length);
		var oneMinusVal = math.subtract(ones, valMatrix);
		return math.dotMultiply(valMatrix, oneMinusVal);
	},
};

//Total Error
var LossFunction = function (outputArr, targets) {
	targets = math.matrix(targets);
	//0.5 * (target - output)^2
	var sub = math.subtract(targets, outputArr);
	var squ = math.square(sub);
	var diff = math.multiply(squ, 0.5);
	// Convert Float32Array to regular array for compatibility
	return diff._data ? Array.from(diff._data) : diff;
};

// eArr and array of errDiff from each training pass
var MeanSquaredErr = function (eArr) {
	var sum = math.sum(eArr);
	var size = eArr._data ? eArr._data.length : eArr.length;
	var mse = math.multiply(sum, 0.5 / size);
	return mse * 100;
};

var UpdateWeights = function (finalWeightArr, hiddenLayer) {
	var output, bias, obj;
	var hLayer = hiddenLayer;
	// finalWeightArr is a 2D array: [[weights for neuron 0], [weights for neuron 1], ...]
	for (let j = 0; j < hLayer.neurons.length; j++) {
		if (finalWeightArr[j]) {
			// Convert to regular array if it's a Float32Array
			hLayer.neurons[j].wb.w = Array.isArray(finalWeightArr[j]) 
				? finalWeightArr[j] 
				: Array.from(finalWeightArr[j]);
		}
		//hLayer.neuron[i].wb.b = ####;
	}
	return hLayer;
};

var randomValues = function (inputs) {
	var valArr = [],
		count;
	count = typeof inputs === "number" ? inputs : inputs.length;

	for (let i = 0; i < count; i++) {
		valArr.push(NeuralMathLib.randomGauss());
	}
	return valArr;
};

// ES6 Exports
export { Derivatives, LossFunction, MeanSquaredErr, NeuralMathLib, NeuralNetwork, Neuron, NeuronArray, Prediction, randomValues, StopLearning, Train, UpdateWeights, utilities };

// Default export
export default {
	NeuralNetwork,
	Neuron,
	NeuronArray,
	Train,
	Prediction,
	StopLearning,
	utilities,
	NeuralMathLib,
	Derivatives,
	LossFunction,
	MeanSquaredErr,
	UpdateWeights,
	randomValues
};
