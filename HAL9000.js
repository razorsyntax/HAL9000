/**
 * HAL 9000 Neural Network Beta v.01
 * Written By: David R. Schwartz
 * Email: david@biomance.com
 * Released under MIT License 
 * 
 * This is the brain for HAL. It contains the logic to create the neural network
 */

//creates NN obj
var NeuralNetwork = function (name) {
    this.name = name || "NN";
    this.layers = {
        "inputLayer": [],
        "hiddenLayer": [],
        "outputLayer": []
    };
    this.targets = [];
    this.wb = {};
};

//creates new layer
NeuralNetwork.prototype.createLayer = function (attr) {
    switch (attr.type) {
        case "hidden":
            var layerID;
            var layerCount = this.layers.hiddenLayer.length;
            layerID = (layerCount < 1) ? "A" : utilities.nextletter(layerCount);

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
            }
            break;
    }
};

//sets training targets
NeuralNetwork.prototype.setTarget = function (targets) {
    this.targets = targets;
};


//Creates a JSON obj with all initial weights and biases in NN
NeuralNetwork.prototype.init = function (numInputs) {
    var keys = [];
    var w = [];
    var wb = {};
    var b = 0;
    var num, neurons;
    var hArr = this.layers.hiddenLayer;
    var oArr = this.layers.outputLayer.neurons;

    for (let i = 0; i < hArr.length; i++) {
        neurons = hArr[i].neurons;
        for (let i = 0; i < neurons.length; i++) {
            keys.push(neurons[i].id);
        }
    }
    for (let i = 0; i < keys.length; i++) {
        //setting weights
        for (let j = 0; j < numInputs.length; j++) {
            num = NeuralMathLib.randomGauss();
            w.push(num);
        }
        //setting bias
        num = NeuralMathLib.randomGauss();
        wb[keys[i]] = { "w": w, "b": num };
        w = [];
    }
    var numOutputsLastLayer = hArr[(hArr.length - 1)].neurons.length;

    keys = [];
    for (let i = 0; i < oArr.length; i++) {
        neurons = oArr;
        keys.push(neurons[i].id);
    }
    for (let i = 0; i < keys.length; i++) {
        for (let i = 0; i < numOutputsLastLayer; i++) {
            num = NeuralMathLib.randomGauss();
            w.push(num);
        }
        wb[keys[i]] = { "w": w, "b": num };
        w = [];
    }

    this.wb = wb;
};


var Train = function (NN, inputs, rate) {
    //console.log("Initial Inputs: \n" + inputs + "\n");
    var newInputs = [];
    var activatedOutputArr = [];
    var sumsOFAllLayers = [];
    var activatedVal, id, wArr, neuron, summed;

    //Calculate Activated Hidden Layer Outputs
    for (let i = 0; i < NN.layers.hiddenLayer.length; i++) {
        var neuronHidArr = NN.layers.hiddenLayer[i].neurons;
        var activatedHiddenObj = NeuralMathLib.activatedLayer(NN, neuronHidArr, inputs, "hidden");

        activatedHiddenArr = activatedHiddenObj.activated; //inputs for next layer
        sumsOFAllLayers.push(activatedHiddenObj); //storing activated inputs & sums from layers for later
        inputs = activatedHiddenArr;
    }
    
    //Calculate Activated Output Layers
    lastLayerInputs = activatedHiddenArr; //Last layer of hidden network
    var neuronOutArr = NN.layers.outputLayer.neurons;
    var activatedOutputObj = NeuralMathLib.activatedLayer(NN, neuronOutArr, lastLayerInputs, "output");
    var unactivatedOutputSums = activatedOutputObj.sums; //pre-activated net sums of output array

    activatedOutputArr = activatedOutputObj.activated;
    //console.log("Activated Output Layer Array: \n[" + activatedOutputArr + "]\n");
    $("#output").data("output", activatedOutputArr);

    //Total Error Calculation of the Output Layer
    var errDiff = LossFunction(activatedOutputArr, NN.targets);
    //console.log("Total Error of the Output Layer: \n" + errDiff + "\n");
    $("#error").data("error", errDiff);

    //Backpropogation for Output weights
    NeuralMathLib.backpropagation(inputs, NN, activatedOutputArr, lastLayerInputs, rate);    
};

var Learn = function (inputArr, NN) { };

var StopLearning = function () {
    return false;
};
