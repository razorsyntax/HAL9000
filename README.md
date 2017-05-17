[![solarized dualmode](https://nodepirate-razorium.rhcloud.com/images/halpng.png)](#)

A JavaScript-based Neural Network 


### Getting started is really easy...

```javascript
var inputs = [0,0,1];
var learningRate = .05;
var trainingCycles = 10000;
var enableErrors = true; // Enables and appends training errors to the Neural Network json.

// Create the network and give it name
var NN = new NeuralNetwork("HAL9000");
  
// Create a hidden layer with three neurons
var hiddenLayerNeurons = NeuronArray(3, "logsig");

// Create a hidden layer with your hidden layer neurons
NN.createLayer({
    "name": "HiddenLayer",
    "type": "hidden",
    "neurons": hiddenLayerNeurons
}); 

// Create a output layer with three neurons
var outputLayerNeurons = NeuronArray(3, "logsig");


// Create a output layer with your hidden layer neurons
NN.createLayer({
    "name": "MNIST",
    "type": "output",
    "neurons": outputLayerNeurons
});

// Set the target you want your Network to learn (in this case, it's the same as the inputs)
NN.setTarget(inputs);

/* Initialize your Neural Network
 *      This step creates pseudo-random inital weights and biases for your neural network
 *      setting up the initial conditions for training
 */
NN.init(inputs);

// Returns a JSON object representation of your Neural Network
var trainedResult = Train(NN, inputs, learningRate, trainingCycles, enableErrors);
```


#### Wiki: https://github.com/razorsyntax/HAL9000/wiki

#### Training Demo Here: http://nodepirate-razorium.rhcloud.com

#### This network works for multiple layers of identical size.  Check the Index.html for a testing sample.

#### At the moment, the code needs refactoring to simplify tasks, abstract redundant functions, and organization of the back propagation function into discrete reusable chunks.



###### The Network is represented by a dynamically updating JSON obj.

Notes: 
* This library depends on math.js to for its matrix math.
* index.html has some basic use case tests- this will grow as the library expands
    
    
Future Tasks:
* Integration with a JavaScript GPU library for crunching larger data sets
