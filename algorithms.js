// 'a' is the activation into the neuron and 'p' controls the sigmoid curve shape
var NeuralMathLib = {
	"activations": function(active, value){
		switch(active){
			case "logsig":
				return 1 / (1+Math.exp(-value._data[0]));
			case "tanh":
				var posN = Math.exp(value._data[0]);  // e^(n)
				var negN = Math.exp(-value._data[0]); // e^(-n)
				return (posN - negN) / (posN + negN);
			case "softmax":
				return;
		}
	},
	"backpropagation": function(obj){
		//determines gradient decent for weights and bias'
		return obj;
	},
	"randomGauss": function() { // rewrite & credit to the originator shortly
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