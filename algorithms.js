/**
 * Algorithm library
 */

var NeuralMathLib = {
    "activations": function(active, value){
    	var val = value;
        switch(active.activation){
	        case "logsig":
	            return 1 / (1+Math.exp(-val));
	        case "tanh":
	            var posN = Math.exp(val);  // e^(n)
	            var negN = Math.exp(-val); // e^(-n)
	            return (posN - negN) / (posN + negN);
	        case "linear":
	            return value;
            case "satlin":
                if(value < 0){
                    return 0;
                }

                if(value >= 0 && value <= 1){
        	       return value;
                }

                if(value > 1){
                    return 1;
                }
	        case "arctan":
	        	return Math.atan(val);
	        case "gaussian":
	        	return Math.exp(-Math.pow(val,2)); // e^(-(x^2))
        }
    },
    "backpropagation": function(NN, err){
    	//determines gradient descent for weights and bias
        var learningRate = 0.5;



        var wb = NN.wb;

    	//return obj;
    },
    "summation": function(NN, id, inputs){
        var w = NN.wb[id].w; //wArr
        var b = NN.wb[id].b;

        var inputsMAT = math.matrix(inputs);
        var weightsMAT = math.matrix(NN.wb[id].w);
        var sumMAT = math.multiply(inputsMAT, weightsMAT);//Σ(wx)
        return math.add(sumMAT, NN.wb[id].b);//sumMAT + b;
    },
    //Creates pseudo-random values between 0 & 1
    "randomGauss": function() { // Unable to find originator of this function
        var x1, x2, rad, y1;
        do {
            x1 = 2 * Math.random() - 1;
            x2 = 2 * Math.random() - 1;
            rad = x1 * x1 + x2 * x2;
        } while(rad >= 1 || rad == 0);
        var c = Math.sqrt(-2 * Math.log(rad) / rad);
        var num = Math.abs(x1 * c);
        if (num > 1){
            num = 1 / num;
        }
        return num;
    }
};

var Derivatives = {
    "dSig": function(val){
        var sig = 1 / (1+Math.exp(-val));
        return sig * (1 - sig);
    }
}

var LossFunction = function(outputArr, targets){
    targets = math.matrix(targets);
    outputArr = math.matrix(outputArr);

    var Diff = math.square(math.subtract(outputArr, targets));
    console.log("" + Diff._data);
    return Diff._data.reduce(function(previousValue, currentValue, currentIndex, array) {
        return previousValue + currentValue * 0.5;
    });
}

var dErrorFunction = function(wb) {

}

// eArr and array of errDiff from each training pass
var MeanSquaredErr = function(eArr){
    var err = eArr._data.reduce(function(previousValue, currentValue, currentIndex, array) {
        return previousValue + currentValue * 0.5;
    });
    return (err/eArr.length) * 100;
}