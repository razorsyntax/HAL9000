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
    "feedforward": function(NN){

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
        // for(let i=0;i<prevLayerWBs.length;i++){
        //     var newMatrix = math.matrix(prevLayerWBs[i]);
        //     arr.push(math.multiply(finalDeltaArr, newMatrix));
        // }
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