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
					{"id":1, "type": "input",  "items":[]}
					{"id":2, "type": "hidden", "items":[{}]}
					{"id":3, "type": "output", "items":[{}]}
					
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
            /|\	    							  \|/
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
	
	
	
{
	"name": "HAL9000",
	"Layers": {
		"inputLayer": [],
		"hiddenLayer":[{}],
		"outputLayer": [{}]
	},
	"targets":[],
	"wb": {
		"id1": {"w":.7, "b":1},
		"id2": {"w":.4, "b":.7}
	}
}
*/
