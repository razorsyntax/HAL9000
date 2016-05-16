/**
 * HAL 9000 Neural Network Beta v.01
 * Written By: David R. Schwartz
 * Email: david@biomance.com
 * Released under MIT License 
 * 
 * This is the brain for HAL. It contains the logic to create the hidden deep neural network
 */


var OutputLayer = function(hiddenLayerArray) {
	//TODO: Determine Gradient Decent to update weights and bias
};


/*
	The goal of backpropagation is to optimize the weights so that the neural network can learn how to correctly map arbitrary inputs to outputs.
	y = (Σ(wx))+b
	w is usually a number between -1 & 1 or 0 & 1
	b = bias starts as 1 and is also weighted as bw (it's own w)
*/
