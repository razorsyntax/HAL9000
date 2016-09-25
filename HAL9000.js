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

    if (typeof num !== "number") {
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
        for (let j = 0; j < hArr[i].neurons.length; j++) {
            valArr = randomValues(numInputs);
            hArr[i].neurons[j].wb = { "w": valArr, "b": NeuralMathLib.randomGauss() };
        }
    }

    var numLayers = hArr.length;
    var numLastInputs = hArr[numLayers - 1].neurons.length;
    //seeding random wb data in output layer neurons
    for (let i = 0; i < oArr.neurons.length; i++) {
        valArr = randomValues(numLastInputs);
        oArr.neurons[i].wb = { "w": valArr, "b": NeuralMathLib.randomGauss() };
    }
};

NeuralNetwork.prototype.initTEST = function (numInputs) {
    var num;
    var hArr = this.layers.hiddenLayer;
    var oArr = this.layers.outputLayer;
    var iArr = this.layers.inputLayer;

    //seeding random wb data in hidden layer neurons
    hArr[0].neurons[0].wb = { "w": [.15,.20], "b": .35 };
    hArr[0].neurons[1].wb =  { "w": [.25,.30], "b": .35 };
    oArr.neurons[0].wb = { "w": [.40,.45], "b": 0.60 };
    oArr.neurons[1].wb = { "w": [.50,.55], "b": 0.60 };
};


var Train = function (NN, inputs, rate) {
    //console.log("Initial Inputs: \n" + inputs + "\n");
    var newInputs = [];
    var activatedOutputArr = [];
    var activatedHiddenArr = [];
    var sumsOFAllLayers = [];
    var activatedVal, id, wArr, neuron, summed;

    /////// FEED FORWARD
    //
    for (let i = 0; i < NN.layers.hiddenLayer.length; i++) { //Calculate Activated Hidden Layer Outputs
        var neuronHidArr = NN.layers.hiddenLayer[i].neurons;
        var activatedHiddenObj = NeuralMathLib.activatedLayer(neuronHidArr, inputs, "hidden");
        activatedHiddenArr.push(activatedHiddenObj.activated); //inputs for next layer
        sumsOFAllLayers.push(activatedHiddenObj); //storing activated inputs & sums from layers for later
    }

    //Calculate Activated Output Layers
    lastLayerInputs = activatedHiddenArr[activatedHiddenArr.length - 1]; //Last layer of hidden network
    var neuronOutArr = NN.layers.outputLayer.neurons;
    var activatedOutputObj = NeuralMathLib.activatedLayer(neuronOutArr, lastLayerInputs, "output");

    activatedOutputArr = activatedOutputObj.activated;
    //console.log("Activated Output Layer Array: \n[" + activatedOutputArr + "]\n");

    /////// BACKPROPAGATION
    //
    var errors = LossFunction(activatedOutputArr, NN.targets); //Error Calculation of the Output Layer
    var totalError = errors.reduce(function (previousValue, currentValue, currentIndex, array) {
        return previousValue + currentValue;
    });

    globalError.push(totalError); //delete when not needed: TESTING ONLY
    globalFinalError = totalError; //delete when not needed: TESTING ONLY
    globalOutputArr = activatedOutputArr._data; //delete when not needed: TESTING ONLY
    //console.log("Total Error of the Output Layer: \n" + globalFinalError + "\n");    

    ///////// Output Layer Calculations
    //
    //Calculates the final output weights of the output layer neurons
    var outputs = NeuralMathLib.FinalOutputWeightCalcs(activatedOutputArr, lastLayerInputs, rate, NN);

    var outputWBs = outputs.outputWBs;
    var finalDeltaArr = outputs.finalDeltaArr;
    var NN = outputs.NN;
    var newOutputWeightArr = outputs.newOutputWeightArr;
    var calculatedOutputErrors = outputs.errorOutput;
    var sigs = outputs.sig;


    var oldOutputWeights = [];
    for(let i=0;i<NN.layers.outputLayer.neurons.length;i++){
        oldOutputWeights.push(utilities.returnArray(NN.layers.outputLayer.neurons[i].wb.w));
    }
    
    //Update output array weights
        for (let i = 0; i < newOutputWeightArr._data.length; i++) {
            NN.layers.outputLayer.neurons[i].wb.w = newOutputWeightArr._data[i];
            //NN.layers.outputLayer.neurons[i].wb.b = ####;
        }

    ///////// Hidden Layer Calculations
    //
    NN.layers.outputLayer
    var layers = utilities.returnArray(NN.layers.hiddenLayer);
    var reversedLayers = layers.reverse();
    
    //------Start of Loop
    for (let q = 0; q < reversedLayers.length;q++){
        var temp = [];
        var errorArr = [];

        for(let i=0;i<calculatedOutputErrors._data.length;i++){
            for(let j=0;j<oldOutputWeights[i].length;j++){
                temp.push(calculatedOutputErrors._data[i] * sigs._data[i] * oldOutputWeights[i][j]);
            }
            errorArr.push(math.matrix(temp));
            temp = [];
        }

        var errorTotals = math.zeros(errorArr[0]._data.length);
        for(let i=0;i<errorArr.length;i++){
            errorTotals = math.add(errorTotals, errorArr[i]);
        }

        var hidDers = Derivatives.dSig(activatedHiddenObj.activated._data);
        
        inputs = (q === 0) ? inputs : lastLayerInputs._data;
        var hidErrorWeights = [];
        for(let i=0;i<inputs.length;i++){
            hidErrorWeights.push(errorTotals._data[i] * hidDers._data[i] * inputs[i]);
        }

        //Final weight calculation
        var finalWHold = [];
        var finalWeightArr = [];
        for (let i = 0; i < inputs.length; i++) {
            for(let j=0;j<reversedLayers[q].neurons.length;j++){
                    finalWHold.push(reversedLayers[q].neurons[i].wb.w[j] - (rate * hidErrorWeights[i]));
            }
            finalWeightArr.push(finalWHold);
            finalWHold = [];
        }

        //update all weights in previous layer
        NN.layers.hiddenLayer[q] = UpdateWeights(math.matrix(finalWeightArr), reversedLayers[q]);
    }
    
};

var Learn = function (inputArr, NN) { };

var StopLearning = function () {
    return false;
};
