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
    console.log("Initial Inputs: \n" + inputs + "\n");
    var newInputs = [];
    var hiddensums = [];
    var hidLayerSums = [];
    var initialInputs = inputs;
    var activatedVal, id, wArr, neuron, summed;
    // initializing inputs
    NN.init(initialInputs); 

    // calculate Outputs
    for(let i=0;i<NN.layers.hiddenLayer.length;i++){
        inputs = (i === 0) ?  inputs : newInputs;

        for(let j=0;j<NN.layers.hiddenLayer[i].neurons.length;j++){
            id = NN.layers.hiddenLayer[i].neurons[j].id;
            neuron = NN.layers.hiddenLayer[i].neurons.filter(function(obj){
                return obj.id === id;
            });
            summed = NeuralMathLib.summation(NN, id, inputs);
            hiddensums.push(summed);
            activatedVal = NeuralMathLib.activations(neuron[0], summed);
            newInputs.push(activatedVal);
        }
        hidLayerSums.push(hiddensums);
    }

    var outputArr = [];
    var outputsums = [];
    for(let i=0;i<NN.layers.outputLayer.neurons.length;i++){
        
        id = NN.layers.outputLayer.neurons[i].id;
        neuron = NN.layers.outputLayer.neurons.filter(function(obj){
            return obj.id === "Output_" + (i+1);
        });
        summed = NeuralMathLib.summation(NN, id, newInputs);
        outputsums.push(summed);
        activatedVal = NeuralMathLib.activations(neuron[0], summed);
        outputArr.push(activatedVal);
    }
    console.log("Output Layer Array: \n[" + outputArr + "]\n");

    //Error Calculation
    var errDiff = LossFunction(outputArr, NN.targets);
    console.log("Error: \n" + errDiff + "\n");
    
    var deltaArr = [];
    var delta;
    for(let i=0;i<outputArr.length;i++) {
    	delta = -1 * errDiff * Derivatives.dSig(outputsums[i]);
    	deltaArr.push(delta);
    }
    console.log("Delta Output Layer Array: \n[" + deltaArr + "]\n");


    gradArr =[];
    deltaArr = math.matrix(deltaArr);
    for(let i=0;i<hidLayerSums.length;i++){
        for(let j=0;j<hidLayerSums[i].length;j++){ // 1 layer of sums
            var hidsums = math.matrix(hidLayerSums[i]);
            
            var weightArr = [];
            var len = NN.layers.hiddenLayer.length;
            var layerID = NN.layers.hiddenLayer[len-1].layerID;

            var nKeys = Object.keys(NN.wb);

            var weightName = nKeys.filter(function(obj){
                var pick = layerID + (j+1);
                return obj === pick;
            });

            weightArr = math.matrix(NN.wb[layerID + (j+1)].w);

            var del = math.multiply(deltaArr, weightArr);
            //Calculate Gradient Array
            gradArr.push(math.multiply(hidsums._data[j], del));
        }
        console.log("Gradient Array: \n[" + gradArr + "]\n");
        



    }


    


    NeuralMathLib.backpropagation(NN, errDiff);

	//Calculate hidden layer errors (back prop)
		//Change hidden layer weights
};

var Learn = function(inputArr, NN){};

var StopLearning = function(){
    return false;
};
