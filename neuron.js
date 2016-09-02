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
 

var Neuron = function(act){
	this.activation = act.activation || "logsig",
    this.id = ""
};

Neuron.prototype.update = function(newProperties){
    this.obj = newProperties || this.obj;
};

var NeuronArray = function(numNeurons, actFunc) {
    var neuronHidArr = [];
    numNeurons = numNeurons || 0;
    actFunc = actFunc || "logsig";
    for(var i=0;i<numNeurons;i++){
        neuronHidArr.push(new Neuron({
            "activation":actFunc
        }));
    }
    return neuronHidArr;
};
