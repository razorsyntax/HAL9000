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

var StopLearning = function () {
    return false;
};
/**
 * Neuron Creation
 */
var Neuron = function(act){
	this.activation = act.activation || "logsig",
    this.id = ""
};

Neuron.prototype.update = function(newProperties){
    this.obj = newProperties || this.obj;
};

var NeuronArray = function(numNeurons, actFunc) {
    var neuronArr = [];
    numNeurons = numNeurons || 0;
    actFunc = actFunc || "logsig";
    for(var i=0;i<numNeurons;i++){
        neuronArr.push(new Neuron({
            "activation":actFunc
        }));
    }
    return neuronArr;
};
/**
 * Convenient Utilities
 */
var utilities = {
        "nextLetter": function(letter) {
            var number = utilities.toNumbers(letter);
            var nextLetter = number + 1;
            return utilities.toLetters(nextLetter);
        },
        "lastLetter": function(letter) {
            var number = utilities.toNumbers(letter);
            var nextLetter = number - 1;
            var lastNumber = utilities.toLetters(nextLetter);

            return lastNumber;
        },
        "toLetters": function(num) {
            "use strict";
            var mod = num % 26;
            var pow = num / 26 | 0;
            var out = mod ? String.fromCharCode(64 + mod) : (pow--, "Z");
            return pow ? utilities.toLetters(pow) + out : out;
        },
        "toNumbers": function(str) {
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
        "returnArray": function(quantity){
            var arr = [];
            for(let i=0;i<quantity.length;i++){
                arr.push(quantity[i]);
            }
            return arr;
        }
};

/**
 * Algorithm library
 */

var NeuralMathLib = {
    "activations": function (active, value) {
        var val = value;
        switch (active.activation) {
            case "logsig":
                return 1 / (1 + Math.exp(-val));
            case "tanh":
                var posN = Math.exp(val);  // e^(n)
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
    "activatedLayer": function (neuronArr, inputs, type) {
        "use strict";
        var id, neuron, summed, activatedVal, j;
        var sums = [];
        var activatedLayerArr = [];

        for (let j = 0; j < neuronArr.length; j++) {
            id = neuronArr[j].id;

            switch (type) {
                case "hidden":
                    neuron = neuronArr.filter(function (obj) {
                        return obj.id === id;
                    });
                    break;
                case "output":
                    neuron = neuronArr.filter(function (obj) {
                        return obj.id === "Output_" + (j + 1);
                    });
            }

            summed = NeuralMathLib.summation(neuronArr[j].wb, inputs);
            sums.push(summed);

            activatedVal = NeuralMathLib.activations(neuron[0], summed);
            activatedLayerArr.push(activatedVal);
        }

        return { "activated": math.matrix(activatedLayerArr), "sums": math.matrix(sums) };
    },
    "FinalOutputWeightCalcs": function (activatedOutputArr, lastLayerInputs, rate, NN) {
        var outputWBs = [];
        var delHolder = [];
        var finalDeltaArr = [];

        var oArr = utilities.returnArray(NN.layers.outputLayer.neurons);
        //Get Output Layer weights for each output neuron
        for (let i = 0; i < oArr.length; i++) {
            outputWBs.push(oArr[i].wb.w)
        }
        //sig = (actualOutput * (1 - actualOutput))
        var sig = Derivatives.dSig(activatedOutputArr._data);
        //errorOutput = (actualOutput - targetOutput)
        var errorOutput = math.subtract(activatedOutputArr, math.matrix(NN.targets));
        var delta = [];
        for(let i=0;i<errorOutput._data.length;i++){
            delta.push(errorOutput._data[i]*sig._data[i]);
        }

        for(let i=0;i<errorOutput._data.length;i++){
            finalDeltaArr.push(delta[i] * lastLayerInputs._data[i])
        }

        var holder = [];
        var newOutputWeightArr = [];
        for(let i=0;i<outputWBs.length;i++){
            for(let j=0;j<outputWBs[i].length;j++){
                holder.push(outputWBs[i][j] - (rate * finalDeltaArr[i]));
            }
            newOutputWeightArr.push(holder);
            holder = [];    
        }
        
        return { 
            "outputWBs": math.matrix(outputWBs), 
            "finalDeltaArr": finalDeltaArr, 
            "NN": NN, 
            "newOutputWeightArr": math.matrix(newOutputWeightArr),
            "errorOutput": errorOutput,
            "sig": sig
        };
    },
    "summation": function (wbObj, inputs) {
        var w = wbObj.w;
        var b = wbObj.b;

        var inputsMAT = math.matrix(inputs);
        var weightsMAT = math.matrix(w);
        var sumMAT = math.multiply(inputsMAT, weightsMAT);//Σ(wx)
        return math.add(sumMAT, b);//sumMAT + b;
    },
    //Creates pseudo-random values between 0 & 1
    "randomGauss": function () { // Unable to find originator of this function
        var x1, x2, rad, y1;
        do {
            x1 = 2 * Math.random() - 1;
            x2 = 2 * Math.random() - 1;
            rad = x1 * x1 + x2 * x2;
        } while (rad >= 1 || rad == 0);
        var c = Math.sqrt(-2 * Math.log(rad) / rad);
        var num = Math.abs(x1 * c);
        if (num > 1) {
            num = 1 / num;
        }
        return num;
    },
    "eTotal": function(prevLayerWBs, finalDeltaArr){
        
         var arr = [];
        arr.push(math.multiply(finalDeltaArr, math.matrix(prevLayerWBs)));

        var reducing = function (total, num) {
            return total + num;
        };
        total = arr[0]._data.reduce(reducing);
        return total;
    }
};

var Derivatives = {
    "dSig": function (/*array*/val) {
        //var sig = 1 / (1 + Math.exp(-val));
        var arr = [];
        let i=0;
        while(i<val.length){
            arr.push(val[i] * (1 - val[i]));
            i++;
        }
        return math.matrix(arr);
    }
}

//Total Error
var LossFunction = function (outputArr, targets) {
    targets = math.matrix(targets);
    //0.5 * (target - output)^2
    var sub = math.subtract(targets, outputArr)
    var squ = math.square(sub)
    var diff = math.multiply(squ, 0.5);
    return diff._data;
}

// eArr and array of errDiff from each training pass
var MeanSquaredErr = function (eArr) {
    var err = eArr._data.reduce(function (previousValue, currentValue, currentIndex, array) {
        return previousValue + currentValue * 0.5;
    });
    return (err / eArr.length) * 100;
}

var UpdateWeights = function (finalWeightArr, hiddenLayer) {
    var output, bias, obj;
    var hLayer = hiddenLayer;
    for (let j = 0; j < hLayer.neurons.length; j++) {
        hLayer.neurons[j].wb.w = finalWeightArr._data[j];
        //hLayer.neuron[i].wb.b = ####;
    }
    return hLayer;
}

var randomValues = function (inputs) {
    var valArr = [], count;
    count = (typeof inputs === "number") ? inputs : inputs.length;
    
    for (let i = 0; i < count; i++) {
        valArr.push(NeuralMathLib.randomGauss());
    }
    return valArr;
}