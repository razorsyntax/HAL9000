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

        switch(attr.type){
            case "hidden":
            	var layerCount = this.layers.hiddenLayer.length;
            	layerID = (layerCount < 1) ? "A": utilities.nextletter(layerCount);
	
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
            	break;
            case "output":
                for(let i=0;i<attr.neurons.length;i++){
                    attr.neurons[i].id = "Output_" + (i+1);
                }
                
                this.layers.outputLayer = {
                    type: attr.type,
                    neurons: attr.neurons,
                }
                break;
        }
};

//sets training targets
NeuralNetwork.prototype.setTarget = function(targets){
    this.targets = targets;
};



NeuralNetwork.prototype.init = function(numInputs){
    var keys = [];
    var w = [];
    var obj = {};
    var wb = {};
    var b = 0;
    var num;
    var hArr = this.layers.hiddenLayer;
    var oArr = this.layers.outputLayer.neurons;
    var neurons
    for(let i=0;i<hArr.length;i++){
        neurons = hArr[i].neurons;
        for(let i=0;i<neurons.length;i++){
            keys.push(neurons[i].id);
        }
    }
    for(let i=0;i<keys.length;i++){
        for(let j=0;j<numInputs.length;j++) {
            num = NeuralMathLib.randomGauss();
            w.push(num);
        }
        num = NeuralMathLib.randomGauss();
        wb[keys[i]] = {"w": w, "b": num};
        w = [];
    }
    var numOutputsLastLayer = hArr[(hArr.length-1)].neurons.length;
    
    keys = [];
    obj = {};
    for(let i=0;i<oArr.length;i++){
        neurons = oArr;
        keys.push(neurons[i].id);
    }
    for(let i=0;i<keys.length;i++){
        for(let i=0;i<numOutputsLastLayer;i++){
            num = NeuralMathLib.randomGauss();
            w.push(num);
        }
        wb[keys[i]] = {"w": w, "b": num};
        w=[];
    }

    this.wb = wb;
};


var Train = function(NN, inputs){


    NN.init(inputs); // setting hidden input wb's
    debugger;
	
	//Calculate outputs for all layers
		//Once to the output layers
	//Calculate the errors of output neurons
		//Change the output layer weights
	//Calculate hidden layer errors (back prop)
		//Change hidden layer weights
};

var Learn = function(inputArr, NN){};

var StopLearning = function(){
    return false;
};
