/**
 * First layer receives the input arr
 * Subsequent layers recieve the previous layers output as input
 * 
 * // Layers recieve variable input
 * // Layers output same number of outputs as neurons in that layer
 *      // Layer with two neurons outputs an array of two outputs
 * // Output is used to update the previous weights and bias 
 * 
 * 
 * 
 * 
 * 
 * 
 * Note:
 *      After input data has been processed, the output data is then used to update the weights/bias for all neurons
 * 
 * 
 * 
 *
 * var OutputLayer = function(hiddenLayerArray) {
 * 	//TODO: Determine Gradient Descent to update weights and bias
 * };
	The goal of backpropagation is to optimize the weights so that the neural network can learn how to correctly map arbitrary inputs to outputs.
	y = (Σ(wx))+b
	w is usually a number between -1 & 1 or 0 & 1
	b = bias starts as 1 and is also weighted as bw (it's own w)
*/
