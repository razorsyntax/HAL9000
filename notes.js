/**
 * Create separate file for JSON object of the network
 *      * This is used to pre-populate data
 * 

 * 
 * 
 *      LearningFunctions:
 *          Train(data)
 *              -Pass training data to network
 *          Learn(neuralNetworkOBJ)
 *              -Initiates the learning process
 *              -This contains the main thinking loop
 *          StopLearning()
 *              -Stops the thinking loop


 *          Train the Network:
 *              Hal.Train(trainingDataArr, NN);
 * 
 * 
 *          Let the Network Learn:
 *              Hal.Learn(input, NN);
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
