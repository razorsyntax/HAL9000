/**
 * HAL 9000 Neural Network Beta v.01
 * Written By: David R. Schwartz
 * Email: david@biomance.com
 * Released under MIT License 
 * 
 * This is the brain for HAL. It contains the logic to create the hidden deep neural network
 */

var NeuralNetwork = function(layers, id){
	"use static";
	
	if(!Array.isArray(layers)){
		layers = [layers]
	}
	
	var count;
	try{
		count = layers.length;
	} catch (e){
		count = 0;
	}
	
	this.NN = {
		name: id || "",
		layerCount: count,
		layers: layers
	};
};

NeuralNetwork.prototype.deleteLayer = function(id){};

var Custom_NN = function(obj) {
	"use static";
	
	if(typeof obj === "undefined" || typeof obj === null){
		alert("Error Loading Custom Neural Obj");
		return false;
	}
	
	this.NN = {
		name: obj.name,
		layers: layers
	};
};

Custom_NN.prototype.deleteLayer = function(id){}



var Train = function(trainingDataArr, NN){};

var Learn = function(inputArr, NN){};

var StopLearning = function(){
	return false;
};
