# Activation Functions Guide

## What is an Activation Function?

The **activation function** is the second argument in `NeuronArray()` and determines how each neuron transforms its input. This is one of the most important choices when building a neural network.

```javascript
NeuronArray(5, 'logsig')  // ← 'logsig' is the activation function
```

## Why Activation Functions Matter

Activation functions serve three critical purposes:

1. **Non-linearity**: Without activation functions, neural networks would only be able to learn linear relationships. Activation functions introduce non-linearity, allowing networks to learn complex patterns.

2. **Output Range**: Different activation functions produce different output ranges, which affects how the network interprets and learns from data.

3. **Gradient Flow**: During backpropagation, the derivative of the activation function determines how well gradients flow through the network, affecting learning speed and stability.

## Available Activation Functions

### `'logsig'` - Logistic Sigmoid (Default)

**Formula**: `1 / (1 + e^(-x))`

**Output Range**: [0, 1]

**Best For**: 
- Binary classification
- Output layers where you need probabilities
- Hidden layers in shallow networks

**Properties**:
- Smooth, differentiable curve
- Outputs always between 0 and 1
- Can suffer from vanishing gradients in deep networks
- Most commonly used activation function

**Example**:
```javascript
NeuronArray(10, 'logsig')  // Good for classification outputs
```

---

### `'tanh'` - Hyperbolic Tangent

**Formula**: `(e^x - e^(-x)) / (e^x + e^(-x))`

**Output Range**: [-1, 1]

**Best For**:
- Hidden layers in deeper networks
- When you need negative outputs
- Recurrent neural networks

**Properties**:
- Zero-centered (outputs around 0)
- Stronger gradients than sigmoid
- Better for deep networks than logsig
- Still can have vanishing gradient issues

**Example**:
```javascript
NeuronArray(10, 'tanh')  // Good for hidden layers
```

---

### `'linear'` - Linear (No Transformation)

**Formula**: `x` (no transformation)

**Output Range**: (-∞, +∞)

**Best For**:
- Regression problems
- Output layers predicting continuous values
- When you need unbounded outputs

**Properties**:
- No non-linearity (use carefully!)
- No gradient saturation
- Simple and fast
- Only use in output layers for regression

**Example**:
```javascript
NeuronArray(1, 'linear')  // Output layer for regression
```

---

### `'satlin'` - Saturating Linear

**Formula**: 
- Returns 0 if x < 0
- Returns x if 0 ≤ x ≤ 1
- Returns 1 if x > 1

**Output Range**: [0, 1]

**Best For**:
- When you need bounded outputs but want linear behavior in the middle range
- Simpler alternative to sigmoid

**Properties**:
- Piecewise linear function
- Bounded output like sigmoid
- Faster than sigmoid
- Non-differentiable at boundaries (can cause issues)

**Example**:
```javascript
NeuronArray(5, 'satlin')  // Alternative to logsig
```

---

### `'arctan'` - Arctangent

**Formula**: `atan(x)`

**Output Range**: [-π/2, π/2]

**Best For**:
- When you need smooth, bounded outputs
- Alternative to tanh

**Properties**:
- Smooth and differentiable
- Bounded output
- Less commonly used
- Similar properties to tanh

**Example**:
```javascript
NeuronArray(5, 'arctan')  // Alternative to tanh
```

---

### `'gaussian'` - Gaussian

**Formula**: `e^(-x²)`

**Output Range**: [0, 1]

**Best For**:
- Radial basis function networks
- When you need bell-curve shaped responses
- Specialized architectures

**Properties**:
- Bell-shaped curve
- Maximum output at x = 0
- Decreases as input moves away from 0
- Less commonly used in standard feedforward networks

**Example**:
```javascript
NeuronArray(5, 'gaussian')  // Specialized use cases
```

## Choosing the Right Activation Function

### For Hidden Layers

**Recommended**: `'logsig'` or `'tanh'`

```javascript
// Hidden layer with sigmoid
NN.createLayer({
    type: 'hidden',
    neurons: NeuronArray(10, 'logsig')
});

// Hidden layer with tanh (better for deeper networks)
NN.createLayer({
    type: 'hidden',
    neurons: NeuronArray(10, 'tanh')
});
```

### For Output Layers

**Classification** (probabilities): Use `'logsig'`
```javascript
// Output layer for classification (e.g., MNIST digits 0-9)
NN.createLayer({
    type: 'output',
    neurons: NeuronArray(10, 'logsig')  // 10 classes
});
```

**Regression** (continuous values): Use `'linear'`
```javascript
// Output layer for regression (e.g., predicting temperature)
NN.createLayer({
    type: 'output',
    neurons: NeuronArray(1, 'linear')  // Single continuous value
});
```

## Common Patterns

### Pattern 1: Classification Network
```javascript
const NN = new NeuralNetwork('Classifier');
// Hidden layers: logsig or tanh
NN.createLayer({ type: 'hidden', neurons: NeuronArray(20, 'logsig') });
NN.createLayer({ type: 'hidden', neurons: NeuronArray(10, 'logsig') });
// Output layer: logsig for probabilities
NN.createLayer({ type: 'output', neurons: NeuronArray(3, 'logsig') });
```

### Pattern 2: Regression Network
```javascript
const NN = new NeuralNetwork('Regressor');
// Hidden layers: tanh (better gradients)
NN.createLayer({ type: 'hidden', neurons: NeuronArray(15, 'tanh') });
// Output layer: linear for continuous values
NN.createLayer({ type: 'output', neurons: NeuronArray(1, 'linear') });
```

### Pattern 3: Deep Network
```javascript
const NN = new NeuralNetwork('DeepNetwork');
// Use tanh for deeper networks (better gradient flow)
NN.createLayer({ type: 'hidden', neurons: NeuronArray(30, 'tanh') });
NN.createLayer({ type: 'hidden', neurons: NeuronArray(20, 'tanh') });
NN.createLayer({ type: 'hidden', neurons: NeuronArray(10, 'tanh') });
NN.createLayer({ type: 'output', neurons: NeuronArray(5, 'logsig') });
```

## Default Behavior

If you don't specify an activation function, `'logsig'` is used by default:

```javascript
NeuronArray(5)  // Same as NeuronArray(5, 'logsig')
```

## Summary Table

| Function | Output Range | Best For | Gradient Properties |
|----------|--------------|----------|---------------------|
| `logsig` | [0, 1] | Classification, shallow networks | Can vanish in deep networks |
| `tanh` | [-1, 1] | Hidden layers, deep networks | Better than sigmoid |
| `linear` | (-∞, +∞) | Regression outputs | No saturation |
| `satlin` | [0, 1] | Simple bounded outputs | Non-differentiable at edges |
| `arctan` | [-π/2, π/2] | Alternative to tanh | Similar to tanh |
| `gaussian` | [0, 1] | Specialized architectures | Bell-shaped response |

## Key Takeaway

**The activation function determines how your network learns and what it can represent.** Choose:
- `'logsig'` for most classification tasks
- `'tanh'` for deeper networks or when you need negative outputs
- `'linear'` only for regression output layers

For most use cases, `'logsig'` is a safe default choice.

