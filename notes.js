/*

A scratch pad for thoughts and implementation.

Methodology:

   Generate WB's       act(SUM(i*w)+b)   
             |        /|\            |
            \|/        |            \|/
Initial Input --->   Hidden Layer --->  Output Layer  
		   	/|\						 |
             |	    				\|/
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
*/
