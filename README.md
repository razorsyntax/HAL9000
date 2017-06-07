[![solarized dualmode](https://nodepirate-razorium.rhcloud.com/images/halpng.png)](#)

### An easy to use JavaScript-based Neural Network for simple classification.

You can train your network and then transfer the learned results!

### tl;dr
```bash
$ npm install hal9000js
```
```javascript
var hal9000 = require('hal9000js');
```
### Getting started is really easy...

1) Create your network
2) Add your neurons and layers
3) Initialize the network
4) Train!

Check out the steps below

## 1) Create your network
```javascript
var inputs = [0,0,1];
var learningRate = .05;
var trainingCycles = 10000;
var enableErrors = true; // Enables and appends training errors to the Neural Network json.

// Create the network and give it name
var NN = new NeuralNetwork("HAL9000");
```

## 2) Add your neurons and layers
```javascript
// Create a hidden layer with three neurons
var hiddenLayerNeurons = NeuronArray(3, "logsig");

// Create a hidden layer with your hidden layer neurons
NN.createLayer({
    "name": "HiddenLayer",
    "type": "hidden",
    "neurons": hiddenLayerNeurons
}); 

// Create an output layer with three neurons
var outputLayerNeurons = NeuronArray(3, "logsig");

// Create a output layer with your hidden layer neurons
NN.createLayer({
    "name": "MNIST",
    "type": "output",
    "neurons": outputLayerNeurons
});
```

## 3) Initialization
```javascript
// Set the training targets you want your Network to learn (in this case, it's the same as the inputs)
NN.setTarget(inputs);

/* Initialize your Neural Network
 *      This step creates pseudo-random inital weights and biases for your neural network
 *      setting up the initial conditions for training
 */
NN.init(inputs);
```

## 4) Train your network
```javascript
// Returns a JSON object representation of your Neural Network
var trainedResult = Train(NN, inputs, learningRate, trainingCycles, enableErrors);
```


## Use Case

```javascript
// This is where the magic starts

var input = [1,0,1]; // <-- This input can represent anything you need classified
/**
 * Note:
 *    Let's say you want to classify apples and oranges.
 *    Apples would be represented by [0,1,0] and oranges would be represented by [1,0,0].
 *    When you give the inputs to Prediction(...), it'll output a classified result
 */

var classified = Prediction(trainedResult, input); // "trainedResult" from step 4)

// If you give [1,0,0] to Prediction, you should have values close to [1,0,0] returned!
//   This means your network is trained!

// I'll have a sample demo of a trained network up shortly

```


#### Wiki: https://github.com/razorsyntax/HAL9000/wiki

#### Training Demo Here: http://nodepirate-razorium.rhcloud.com

#### Check the Index.html for a testing sample.

Notes: 
* This library depends on math.js to for its matrix math.
* index.html has some basic use case tests- this will grow as the library expands
    
    
Future Tasks:
* Integration with a JavaScript GPU library for crunching larger data sets
