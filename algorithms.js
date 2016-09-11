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

            summed = NeuralMathLib.summation(NN, id, inputs);

            sums.push(summed);
            activatedVal = NeuralMathLib.activations(neuron[0], summed);
            activatedLayerArr.push(activatedVal);
        }

        return { "activated": activatedLayerArr, "sums": sums };
    },
    "backpropagation": function (inputs, NN, activatedOutputArr, lastLayerInputs, rate) {
        var outputWBs = [];
        for (let i = 0; i < inputs.length; i++) {
            var wb = NN.wb["Output_" + (i + 1)];
            for (var j = 0; j < wb.w.length; j++) {
                outputWBs.push(wb.w[j]);
            }
        }

        //Delta Calcs for Output weights
        var deltaArr = [];

        for (let i = 0; i < activatedOutputArr.length; i++) {
            var delta = -1 * (NN.targets[i] - activatedOutputArr[i]) * (activatedOutputArr[i] * (1 - activatedOutputArr[i]));
            deltaArr.push(delta);
        }

        var finalDeltaArr = [];
        for (let i = 0; i < deltaArr.length; i++) {
            var delta = deltaArr[i];
            for (var j = 0; j < lastLayerInputs.length; j++) {
                var delWeight = delta * lastLayerInputs[j];
                finalDeltaArr.push(rate * delWeight);
            }
        }

        //Calculates the new weights for the previous layer
        var newOutputWeightArr = [];
        for (let i = 0; i < outputWBs.length; i++) {
            newOutputWeightArr.push(outputWBs[i] - finalDeltaArr[i]);
        }

        var prevLayerWBs = [];
        for (let i = 0; i < inputs.length; i++) {
            var wb = NN.wb["A" + (i + 1)]; //TODO: Update this to take last in hidden layer
            for (var j = 0; j < wb.w.length; j++) {
                prevLayerWBs.push(wb.w[j]);
            }
        }

        //use weights from output layer in first round
        var arr = [];

        for (let i = 0; i < prevLayerWBs.length; i++) {
            for (let j = 0; j < finalDeltaArr.length; j++) {
                arr.push(finalDeltaArr[j] * prevLayerWBs[i]);
            }
        }

        var reducing = function (total, num) {
            return total + num;
        };
        var total = arr.reduce(reducing);

        var derivatives = [];
        var derivativeArr = [];
        for (let i = 0; i < prevLayerWBs.length; i++) {
            var derivative = prevLayerWBs[i] * (1 - prevLayerWBs[i]);
            derivativeArr.push(derivative);
            derivatives.push(derivative);
        }

        //cut derivativeArr into neuron groups
        var neuronGroup = [];
        var group;
        var holder = derivativeArr;
        for(let i = 0;i<inputs.length;i++){
            group = holder.splice(0,inputs.length);
            neuronGroup.push(group);
        }
        
        //Final weight calculation
        var finalWeightArr = [];
        for (let i = 0; i < inputs.length; i++) {
            for (let j = 0; j < neuronGroup.length; j++) {
                var almostWeight = total * neuronGroup[i][j] * inputs[i];
                var finalWeight = prevLayerWBs[i] - (rate * almostWeight);
                finalWeightArr.push(finalWeight);
            }
        }
        //console.log("Final Weights in this layer: \n" + finalWeightArr + "\n");
        
        var finalOutputWeight = [];
        var temp;
        holder = newOutputWeightArr;
        for(let i=0;i<inputs.length;i++){
            var temp = holder.splice(0,inputs.length);
            finalOutputWeight.push(temp);
        }
        
        var finalWeight = [];
        var temp;
        holder = finalWeightArr;
        for(let i=0;i<inputs.length;i++){
            var temp = holder.splice(0,inputs.length);
            finalWeight.push(temp);
        }

        //update all weights in previous layer
        UpdateWeights(finalWeight, finalOutputWeight, NN);

    },
    "summation": function (NN, id, inputs) {
        var w = NN.wb[id].w; //wArr
        var b = NN.wb[id].b;

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
    }
};

var Derivatives = {
    "dSig": function (val) {
        var sig = 1 / (1 + Math.exp(-val));
        return sig * (1 - sig);
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

var UpdateWeights = function(finalWeightArr, newOutputWeightArr, NN){    
    var output, bias, obj;
    //update weights from hidden layer
    for(let i=0;i<finalWeightArr.length;i++){
        output = NN.wb["A" + (i+1)];
        bias = output.b;
        obj = {"w": finalWeightArr[i], "b":bias};
        NN.wb["A" + (i+1)] = obj;
    }

    //update output array weights
    for(let i=0;i<newOutputWeightArr.length;i++){
        output = NN.wb["Output_" + (i + 1)];
        bias = output.b;
        obj = {"w": newOutputWeightArr[i], "b":bias};
        NN.wb["Output_" + (i+1)] = obj;
    }
    $("#NN").data("network", NN);
}
