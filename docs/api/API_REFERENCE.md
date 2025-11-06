# API Reference

## Core Classes

### NeuralNetwork

The main class for creating and managing neural networks.

#### Constructor

```javascript
const NN = new NeuralNetwork(name);
```

- `name` (string, optional): Name for the network. Defaults to "NN".

#### Methods

##### createLayer(options)

Creates a new layer in the network.

```javascript
NN.createLayer({
  name: "HiddenLayer", // Optional: Layer name
  type: "hidden", // Required: 'hidden' or 'output'
  neurons: NeuronArray(5, "logsig"), // Required args: (number of array neurons, Activation function)
});
```

**Parameters:**

- `name` (string, optional): Name for the layer
- `type` (string, required): Layer type - `'hidden'` or `'output'`
  - **`'hidden'`**: Intermediate processing layers between input and output. Hidden layers extract features and learn patterns from the input data. You can have multiple hidden layers in a network. These layers process information but don't produce the final result.
  - **`'output'`**: The final layer that produces the network's predictions. There can only be one output layer in a network, and it's always the last layer. The output layer's neurons correspond to the number of possible outputs (e.g., 10 neurons for MNIST digit classification 0-9).
- `neurons` (array, required): Array of neurons created with `NeuronArray()`. The second argument to `NeuronArray()` is the **activation function** (e.g., `'logsig'`, `'tanh'`, `'linear'`) which determines how neurons transform their inputs. See [NeuronArray()](#neuronarraycount-activation) for details.

**Example:**
```javascript
// Create a hidden layer (intermediate processing)
NN.createLayer({
  type: "hidden",
  neurons: NeuronArray(10, "logsig")
});

// Create another hidden layer
NN.createLayer({
  type: "hidden",
  neurons: NeuronArray(5, "tanh")
});

// Create the output layer (final predictions - must be last)
NN.createLayer({
  type: "output",
  neurons: NeuronArray(3, "logsig") // 3 possible outputs
});
```

##### setTarget(targets)

Sets the target outputs for training.

```javascript
NN.setTarget([0.1, 0.9, 0.2]); // Array of target values
```

##### init(numInputs)

Initializes the network with random weights and biases.

```javascript
NN.init(3); // Number of input neurons
```

#### Properties

- `name`: Network name
- `layers`: Object containing inputLayer, hiddenLayer[], and outputLayer
- `targets`: Array of target values

---

## Functions

### Train(NN, inputs, rate, iterations, enableErrors)

Trains the neural network using feedforward and backpropagation.

**How Training Works:**

Each training iteration performs two phases:

1. **Feedforward Pass**: Inputs are propagated forward through all hidden layers to the output layer, computing activations at each layer.

2. **Backpropagation Pass**: 
   - Calculates the error between the network's output and the target values
   - Propagates the error backward through the network layers
   - Computes gradients for each weight using the chain rule
   - Updates all weights and biases to reduce the error

The learning rate (`rate`) controls how much the weights are adjusted in each iteration. Higher rates learn faster but may overshoot optimal values; lower rates are more stable but slower.

**Parameters:**

- `NN` (NeuralNetwork): The network to train
- `inputs` (number[]): Input values array
- `rate` (number): Learning rate (typically 0.1 to 0.9). Controls the step size for weight updates during backpropagation.
- `iterations` (number): Number of training cycles. Each iteration performs one complete feedforward + backpropagation cycle.
- `enableErrors` (boolean): Whether to track and store error history

**Returns:** Trained NeuralNetwork object

**Example:**

```javascript
const trainedNN = Train(NN, [0.5, 0.3, 0.8], 0.5, 1000, true);
```

### Prediction(NN, inputs)

Makes a prediction using the trained network via feedforward propagation.

**How Prediction Works:**

The `Prediction()` function performs only the feedforward pass—it propagates inputs forward through all network layers (hidden → output) without any training or weight updates. This is the same forward pass used during training, but without the backpropagation step.

**Parameters:**

- `NN` (NeuralNetwork): Trained network
- `inputs` (number[]): Input values array

**Returns:** Array of output values

**Example:**

```javascript
const result = Prediction(trainedNN, [0.5, 0.3, 0.8]);
// Returns: [0.12, 0.89, 0.21]
```

### NeuronArray(count, activation)

Creates an array of neurons for a layer.

**Parameters:**

- `count` (number): Number of neurons to create
- `activation` (string): **Activation function** - Determines how neurons transform their inputs. This is critical for network performance. Defaults to `'logsig'` if not specified.

**Why Activation Functions Matter:**

The activation function is one of the most important choices when building a neural network. It:

- Introduces **non-linearity** (without it, networks can only learn linear relationships)
- Determines the **output range** of each neuron
- Affects **gradient flow** during training (how well the network learns)

**Available Activation Functions:**

- `'logsig'` (default): Logistic sigmoid - Output range [0, 1]. Best for classification and most general use cases.
- `'tanh'`: Hyperbolic tangent - Output range [-1, 1]. Better for deeper networks than logsig.
- `'linear'`: No transformation - Output range (-∞, +∞). Use only for regression output layers.
- `'satlin'`: Saturating linear - Output range [0, 1]. Simpler alternative to sigmoid.
- `'arctan'`: Arctangent - Output range [-π/2, π/2]. Alternative to tanh.
- `'gaussian'`: Gaussian - Output range [0, 1]. Specialized use cases.

**See [Activation Functions Guide](../guides/ACTIVATION_FUNCTIONS.md) for detailed explanations and when to use each.**

**Returns:** Array of Neuron objects

**Example:**

```javascript
// Create 5 neurons with sigmoid activation (default)
const neurons = NeuronArray(5, "logsig");

// Create neurons with tanh activation (better for deep networks)
const hiddenNeurons = NeuronArray(10, "tanh");

// Create output layer for regression (linear activation)
const outputNeurons = NeuronArray(1, "linear");
```

---

## Backend Management

### setBackend(backendName)

Sets the math backend for computations.

**Parameters:**

- `backendName` (string): Backend name ('cpu', 'gpu', 'tensorflow', or 'auto')

**Example:**

```javascript
setBackend("gpu"); // Use GPU backend
setBackend("auto"); // Auto-detect best backend
```

### getBackend()

Gets the current backend.

**Returns:** Backend object

### listBackends()

Lists all available backends.

**Returns:** Array of backend names

### loadGPUBackend()

Loads GPU.js backend for browser GPU acceleration (async).

**Returns:** Promise<Backend | null>

### loadTensorFlowBackend()

Loads TensorFlow.js backend for Node.js GPU acceleration (async).

**Returns:** Promise<Backend | null>

---

## Activation Functions Reference

For detailed explanations of activation functions, when to use them, and why they matter, see the **[Activation Functions Guide](../guides/ACTIVATION_FUNCTIONS.md)**.

**Quick Reference:**

- **logsig**: `1 / (1 + e^(-x))` - Output range: [0, 1] - Default, best for classification
- **tanh**: `(e^x - e^(-x)) / (e^x + e^(-x))` - Output range: [-1, 1] - Better for deep networks
- **linear**: `x` - Output range: (-∞, +∞) - Use only for regression outputs
- **satlin**: Piecewise linear - Output range: [0, 1] - Simpler alternative to sigmoid
- **arctan**: `atan(x)` - Output range: [-π/2, π/2] - Alternative to tanh
- **gaussian**: `e^(-x²)` - Output range: [0, 1] - Specialized use cases

---

## Training Tips

- **Learning Rate**: Start with 0.5, adjust based on convergence
- **Iterations**: More iterations = better training (but slower)
- **Layer Sizes**: Hidden layers typically 1-3x input size
- **Input Normalization**: Keep inputs in range [0, 1] for best results
