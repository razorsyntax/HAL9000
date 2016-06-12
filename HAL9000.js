/**
 * HAL 9000 Neural Network Beta v.01
 * Written By: David R. Schwartz
 * Email: david@biomance.com
 * Released under MIT License 
 * 
 * This is the brain for HAL. It contains the logic to create the hidden deep neural network
 */

//creates NN obj
var NeuralNetwork = function(name){
	this.name = name || "NN";
	this.layers = {
		"inputLayer":[],
		"hiddenLayer":[],
		"outputLayer":[]
	};
	this.targets = [];
	this.wb = {};
};

//creates new layer
NeuralNetwork.prototype.createLayer = function(attr){
	var layerID;
	var layerCount = this.layers.hiddenLayer.length;

	if(layerCount < 1){
		layerID = "A";
	} else{
		layerID = utilities.nextletter(layerCount);
	}

	if(attr.neurons.length > 0){
		for(let i=0;i<attr.neurons.length;i++){
			attr.neurons[i].id = layerID + (i + 1).toString();
		}
	}

	this.layers.hiddenLayer.push({
		name: attr.name || "",
		layerID: layerID,
		type: attr.type,
		neurons: attr.neurons,
	});
};

//sets training targets
NeuralNetwork.prototype.setTarget = function(targets){
	this.targets = targets;
};



NeuralNetwork.prototype.init = function(numInputs){
	//not correct... refactor
	var keys = [];
	var wb = {};
	var w = [];
	var b = 0;
	var num;
	var obj = {};
	var arr = this.layers.hiddenLayer;
	for(let i=0;i<arr.length;i++){
		var neurons = arr[i].neurons;
		for(let i=0;i<neurons.length;i++){
			keys.push(neurons[i].id);
		}
	}
	for(let i=0;i<keys.length;i++){
		for(let i=0;i<numInputs.length;i++) {
			num = NeuralMathLib.randomGauss();
			w.push(num);
		}
		num = NeuralMathLib.randomGauss();
		obj = {"w": w, "b": num};
		wb[keys[i]] = obj;
	}
	this.wb = wb;
};







NeuralNetwork.prototype.Train = function(inputs, errorOBJ) {
	//counts number of inputs
	//sets weights and biases with SetWB();
	
	//Calculate outputs for all layers
		//Once to the output layers
	//Calculate the errors of output neurons
		//Change the output layer weights
	//Calculate hidden layer errors (back prop)
		//Change hidden layer weights
	
}



var Train = function(trainingDataArr, NN){};

var Learn = function(inputArr, NN){};

var StopLearning = function(){
	return false;
};
