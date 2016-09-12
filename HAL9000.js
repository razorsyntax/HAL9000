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
        "inputLayer": {},
        "hiddenLayer": [],
        "outputLayer": []
    };
    this.targets = [];
};

//creates new layer
NeuralNetwork.prototype.createLayer = function () {

    var num = arguments[0];
    var attr = arguments[1];
    
    if(typeof num !== "number"){
        attr = arguments[0];
        num = 1;
    }

    for (let i = 0; i < num; i++) {
        switch (attr.type) {
            case "hidden":
                var layerID;
                var layerCount = this.layers.hiddenLayer.length;
                layerID = (layerCount < 1) ? "A" : utilities.toLetters(layerCount + 1);

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
    for (let i = 0; i < hArr.length; i++) {//seeding random wb data in hidden layer neurons
        for (let j = 0; j < numInputs.length; j++) {
            valArr = randomValues(numInputs);
            hArr[i].neurons[j].wb = { "w": valArr, "b": NeuralMathLib.randomGauss() };
        }
    }

    var numLayers = hArr.length;
    var numLastInputs = hArr[numLayers-1].neurons.length;
    //seeding random wb data in output layer neurons
    for (let i = 0; i < oArr.neurons.length; i++) {
        for (let j = 0; j < numLastInputs; j++) {
            valArr = randomValues(numInputs);
            oArr.neurons[j].wb = { "w": valArr, "b": NeuralMathLib.randomGauss() };
        }
    }
};


var Train = function (NN, inputs, rate) {
    //console.log("Initial Inputs: \n" + inputs + "\n");
    var newInputs = [];
    var activatedOutputArr = [];
    var activatedHiddenArr =[];
    var sumsOFAllLayers = [];
    var activatedVal, id, wArr, neuron, summed;

    //Calculate Activated Hidden Layer Outputs
    for (let i = 0; i < NN.layers.hiddenLayer.length; i++) {
        var neuronHidArr = NN.layers.hiddenLayer[i].neurons;
        var activatedHiddenObj = NeuralMathLib.activatedLayer(NN, neuronHidArr, inputs, "hidden");

        activatedHiddenArr.push(activatedHiddenObj.activated); //inputs for next layer
        sumsOFAllLayers.push(activatedHiddenObj); //storing activated inputs & sums from layers for later
    }

    //Calculate Activated Output Layers
    var layerLen = activatedHiddenArr.length;
    lastLayerInputs = activatedHiddenArr[layerLen-1]; //Last layer of hidden network
    var neuronOutArr = NN.layers.outputLayer.neurons;
    var activatedOutputObj = NeuralMathLib.activatedLayer(NN, neuronOutArr, lastLayerInputs, "output");

    activatedOutputArr = activatedOutputObj.activated;
    //console.log("Activated Output Layer Array: \n[" + activatedOutputArr + "]\n");

    //Total Error Calculation of the Output Layer
    var errDiff = LossFunction(activatedOutputArr, NN.targets);
    globalError.push(errDiff); //delete when not needed: TESTING ONLY
    globalFinalError = errDiff; //delete when not needed: TESTING ONLY
    //console.log("Total Error of the Output Layer: \n" + errDiff + "\n");

    //Backpropogation for Output weights
    NeuralMathLib.backpropagation(inputs, NN, activatedOutputArr, activatedHiddenArr, rate);
};

var Learn = function (inputArr, NN) { };

var StopLearning = function () {
    return false;
};
