/**
 * Instantiating a neuron can be initialized empty
 *          var node = new Neuron();
 * or by passing JSON obj with
 *          var obj = {
 *              input: [1], // an array of initial inputs
 *              weights: [w], // an array of initial weights
 *              bias:  1, // pass the starting initial bias integer
 *              activation: "" //pass string of the name of the activation function you wish to use
 *          };
 *          var node = new Neuron(obj);
 **/
 
// A single neuron instance
var Neuron = function(customNeuron, id){
    "use strict";
    
    this.id = id || "";
    
    var w = (typeof customNeuron === "undefined") ? NeuralMathLib.randomGauss() : 1;
    
    var defaultNeuron = {
        input: [1], //this is determined by previous layer inputs
        weights: [.5],
        bias:  1,
        activation: "logsig"
    };
    this.obj = customNeuron || defaultNeuron;
};

Neuron.prototype.feedForward = function(refined){
    "use strict";
    if(typeof refined !== "undefined"){
        //refined contains the new bias and weights
        this.obj.input = refined.input;
        this.obj.weights = refined.weights;
        this.obj.bias = refined.bias;
    }
    
    var inputsMAT = math.matrix(this.obj.input);
    var weightsMAT = math.matrix(this.obj.weights);
    var sumMAT = math.multiply(inputsMAT, weightsMAT);//Σ(wx)
    var totalMAT = math.add(sumMAT, this.obj.bias);//sumMAT + b
    var result = NeuralMathLib.activations(this.obj.activation, totalMAT); //activation function
    return result;
    //TODO: creates 1 output and sets the new weights and bias
};

Neuron.prototype.update = function(newProperties){
    this.obj = newProperties || this.obj;
};