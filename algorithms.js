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
    "activatedLayer": function (NN, neuronArr, inputs, type) {
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

        return { "activated": activatedLayerArr, "sums": sums };
    },
    "backpropagation": function (inputs, NN, activatedOutputArr, activatedHiddenArr, rate) {

        ///////// Output Layer Calculations
        //
        var layerLen = activatedHiddenArr.length;
        lastLayerInputs = activatedHiddenArr[layerLen-1]; //Last layer of hidden network

        var outputs = NeuralMathLib.FinalOutputWeightCalcs(activatedOutputArr, lastLayerInputs, rate, NN);
        
        var outputWBs = outputs.outputWBs;
        var finalDeltaArr = outputs.finalDeltaArr;
        var NN = outputs.NN;
        var newOutputWeightArr = outputs.newOutputWeightArr;


        ///////// Hidden Layer Calculations
        //

        var prevLayerWBs = [];
        var prevLayerHolder = [];
        var last = NN.layers.hiddenLayer.length - 1;
        var lastLayer = NN.layers.hiddenLayer[last];
        for (let i = 0; i < inputs.length; i++) {
            var wb = lastLayer.neurons[i].wb;
            //var wb = NN.wb["A" + (i + 1)]; //TODO: Update this to take last in hidden layer
            for (var j = 0; j < wb.w.length; j++) {
                prevLayerHolder.push(wb.w[j]);
            }
            prevLayerWBs.push(prevLayerHolder);
            prevLayerHolder = [];
        }


        //use weights from output layer in first round
        var total = NeuralMathLib.eTotal(prevLayerWBs, finalDeltaArr);


        var derivative = [];
        var derivatives = [];
        var derivativeArr = [];
        for (let i = 0; i < prevLayerWBs.length; i++) {
            for (let j = 0; j < prevLayerWBs[i].length; j++) {
                derivative.push(prevLayerWBs[i][j] * (1 - prevLayerWBs[i][j]));
            }
            derivativeArr.push(derivative);
            derivatives.push(derivative);
            derivative = [];
        }

        //Final weight calculation
        //Do this once the first layer is reached
        var finalWeightArr = [];
        var finalWeightArrHolder = [];
        for (let i = 0; i < inputs.length; i++) {
            for (let j = 0; j < derivatives.length; j++) {
                var almostWeight = total * derivatives[i][j] * inputs[i];
                var finalWeight = prevLayerWBs[i][j] - (rate * almostWeight);
                finalWeightArrHolder.push(finalWeight);
            }
            finalWeightArr.push(finalWeightArrHolder);
            finalWeightArrHolder = [];
        }

        var finalOutputWeight = newOutputWeightArr;
        //update all weights in previous layer
        UpdateWeights(finalWeightArr, finalOutputWeight, NN);

    },
    "FinalOutputWeightCalcs": function (activatedOutputArr, lastLayerInputs, rate, NN) {
        var outputWBs = [];
        var delHolder = [];
        var finalDeltaArr = [];

        var oArr = NN.layers.outputLayer.neurons;
        //Get Output Layer weights for each output neuron
        for (let i = 0; i < oArr.length; i++) {
            outputWBs.push(oArr[i].wb.w)
        }

        for (let i = 0; i < activatedOutputArr.length; i++) {
            //delta = -(targetOutput - actualOutput) * (actualOutput * (1 - actualOutput))
            var delta = -1 * (NN.targets[i] - activatedOutputArr[i]) * Derivatives.dSig(activatedOutputArr[i]);
            for (var j = 0; j < lastLayerInputs.length; j++) {
                delHolder.push(rate * delta * lastLayerInputs[j]);
            }
            finalDeltaArr.push(delHolder);
            delHolder = [];
        }

        var newOutputWeightArr = [];
        var nowaHolder = [];
        for (let i = 0; i < outputWBs.length; i++) {
            for (let j = 0; j < outputWBs[i].length; j++) {
                nowaHolder.push(outputWBs[i][j] - finalDeltaArr[i][j]);
            }
            newOutputWeightArr.push(nowaHolder);
            nowaHolder = [];
        }

        return { "outputWBs": outputWBs, "finalDeltaArr": finalDeltaArr, "NN": NN, "newOutputWeightArr": newOutputWeightArr };
    },
    "summation": function (wbObj, inputs) {
        var w = wbObj.w;
        var b = wbObj.b;
        // var w = NN.wb[id].w; //wArr
        // var b = NN.wb[id].b;

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
        var arrHolder = [];
        for (let i = 0; i < prevLayerWBs.length; i++) {
            for (let j = 0; j < finalDeltaArr.length; j++) {
                arrHolder.push(finalDeltaArr[i][j] * prevLayerWBs[i][j]);
            }
            arr.push(arrHolder);
            arrHolder = [];
        }

        var merged = [].concat.apply([], arr);

        var reducing = function (total, num) {
            return total + num;
        };
        return total = merged.reduce(reducing);
    }
};

var Derivatives = {
    "dSig": function (val) {
        //var sig = 1 / (1 + Math.exp(-val));
        return val * (1 - val);
    }
}

//Total Error
var LossFunction = function (outputArr, targets) {
    targets = math.matrix(targets);
    outputArr = math.matrix(outputArr);
    //0.5 * (target - output)^2
    var Diff = math.multiply(math.square(math.subtract(targets, outputArr)), 0.5);
    //SUM(Diff)
    var error = Diff._data.reduce(function (previousValue, currentValue, currentIndex, array) {
        return previousValue + currentValue;
    });
    return error;
}

// eArr and array of errDiff from each training pass
var MeanSquaredErr = function (eArr) {
    var err = eArr._data.reduce(function (previousValue, currentValue, currentIndex, array) {
        return previousValue + currentValue * 0.5;
    });
    return (err / eArr.length) * 100;
}

var UpdateWeights = function (finalWeightArr, newOutputWeightArr, NN) {
    var output, bias, obj;

    //update output array weights
    for (let i = 0; i < newOutputWeightArr.length; i++) {
        NN.layers.outputLayer.neurons[i].wb.w = newOutputWeightArr[i];
        //NN.layers.outputLayer.neurons[i].wb.b = ####;
    }
    $("#NN").data("network", NN);

    //update weights from hidden layer
    //var last = NN.layers.hiddenLayer.length;
    //var lastLayer = last[last-1];
    for (let i = 0; i < finalWeightArr.length; i++) {
        var hLayer = NN.layers.hiddenLayer[i];
        if (typeof hLayer === undefined) {
            for (let j = 0; j < hLayer.neurons.length; j++) {
                hLayer.neurons[j].wb.w = finalWeightArr[j];
                //hLayer.neuron[i].wb.b = ####;
            }
        }
    }
}

var randomValues = function (inputs) {

    var valArr = [];
    for (let i = 0; i < inputs.length; i++) {
        valArr.push(NeuralMathLib.randomGauss());
    }
    return valArr;
}