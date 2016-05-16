var HiddenLayer = function(){};
HiddenLayer.prototype.initialize = function(obj){
    this.neurons = obj.neurons; //number neurons in layer
    
    
    
    this.weights = initialWeight(obj.neurons);    
}

var initialSetup = {
    "initBias": function() {
		biasMAT = math.ones(1,3);		 
		return biasMAT;
	},
	"initialWeight": function(inputs) {
		var arr = [];
		for(var i=0;i<inputs;i++) {
			var weight = NeuralMathLib.randomGauss();
			arr.push(weight);
		}
		return math.matrix(arr);
	}
}