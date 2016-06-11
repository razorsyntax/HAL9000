/*
Create Network
	-Create JSON obj
		-Neurons
			-Properties
				-has an activation function
				-has an id (user defined or system generated)
			-Actions
				-Takes inputs, act(SUM(i*w)+b), and outputs the activated value
			JSON:
				{"id":123, "activation": "logsig"}
		-Layers
			-Properties
				-has an id (user defined or system generated)
				-has neurons or not
				-is an input, hidden, or output layer
					-Input layer is a vector of inputs
					-Hidden layer is an array of neurons objs
					-Output layer is final layer & performs error calculations
				-JSON:
					{"id":1, "type": "input",  "neurons":[]}
					{"name":"custName", "id":2, "type": "hidden", "neurons":[{}]}
					{"id":3, "type": "output", "neurons":[{}]}
					
			-Actions
				-distributes all inputs and outputs as vectors
				-takes neurons
				-updates Input layer
		-Network
			-Properties
				-name/id
				-has layers
				-has weights/bias obj
			-Actions
				-takes inputs and distributes them to layers
				-Uses target obj to calculate errors
				-updates weights and bias based on error calculations
			
		


======================================================
Methodology:

   Generate WB's       act(SUM(i*w)+b)   
             |        /|\            |
            \|/        |            \|/
Init Input --->   Hidden Layer  ->   Output Layer  |
            /|\	    				  \|/
New Input -> |    Update WB's   <- Error Calculation

1) Define Network
	-Add Neurons
	-Add them to layers
2) Define Targets
3) Set Inputs
4) Train Network
	-Generate init WB's for each neuron in all hidden layers
	-Calculate activated value vector for layer
		-feedforward in each neuron
	-Output layer performs error calculations
	-Update all previous weights/bias at once
	-Repeat until error is within specified threshold

5) Test Network
	-Provide Network trained json obj of WB's
	


	
Tools:
	Add/Delete/Update Neurons
	Add/Delete/Update Layers
	Create initial weights/bias for each input/output from neuron (runs once)
	Set trained weights/bias for NN
	Error calculations
	Update weights/bias


//creates instance of NN obj
var NN = new NeuralNetwork();

//create neurons with activation attribute
var node = new Neuron({
	"activation":"logsig"
});

var node2 = new Neuron({
	"activation":"logsig"
});

//create layer and give it attributes
NN.createLayer({
	"name": "Edge_Detection",
	"neurons": [node,node2]
});

//set targets
var targetArr = [1,0,1];
NN.targets(targetArr);

//this creates a JSON obj with all initial weights and biases in NN
NN.initWB();


//NN is now set for work

var inputs = [1,1,1];

//send the inputs through your network
//you may also specify optional error threshold obj for when training should end 
NN.Train(inputs, {"error":[0.6,0.7,0.5]});

//test your network with new input data

var testInput = [0,0,1];

NN.Test(testInput);





==============================================

//creates instance of NN obj
var NN = new NeuralNetwork("HAL9000");


//creates NN obj
var NeuralNetwork = function(name){
	this.name = name || "NN";
	this.layers = [];
	this.targets = [];
	this.wb = {};
};

//creates new layer
NeuralNetwork.prototype.createLayer = function(attr){
	this.name = attr.name || "";
	this.type = attr.type;
	this.neurons = attr.neurons;
};

//sets training targets
NeuralNetwork.prototype.targets = function(targets){
	this.targets = targets;
}

NeuralNetwork.prototype.Train = function(inputs, errorOBJ) {
	//counts number of inputs
	//sets weights and biases with SetWB();
	
	//Calculate outputs for all layers
		//Once to the output layers
	//Calculate the errors of output neurons
		//Change the output layer weights
	//Calculate hidden layer errors (back prop)
		//Change hidden layer weights
	
}




//creates single neuron instance
var Neuron = function(activation){
	this.activation = activation || "logsig"
};


var hiddenLayerCal = function(NN){
	var layers = NN.layers;
	var wbs = NN.wb;
	for(let i=0;i<layers.length;i++){
		var neurons = layers[i].neurons;
		for(let j=0;j<neurons.length;j++){
			//sum weights and biases neurons[j];
			
		}
	}
}




*/
