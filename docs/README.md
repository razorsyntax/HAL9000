# HAL9000 Documentation

Welcome to the HAL9000 documentation! This directory contains guides and API references to help you get started.

## Quick Links

- [Installation Guide](guides/INSTALLATION.md) - How to install and set up HAL9000
- [API Reference](api/API_REFERENCE.md) - Complete API documentation
- [CDN Usage](CDN_USAGE.md) - Using HAL9000 via CDN

## Core Concepts

- **[How Training Works](#how-training-works)** - Understanding feedforward and backpropagation
- **[Activation Functions Guide](guides/ACTIVATION_FUNCTIONS.md)** - Understanding activation functions and why they matter
- **[Checking GPU Status](guides/CHECKING_GPU.md)** - Verifying hardware acceleration

### How Training Works

HAL9000 uses two fundamental algorithms:

**Feedforward**: Data flows forward through the network (input → hidden layers → output). Each layer computes activations from the previous layer's outputs. This happens during both training and prediction.

**Backpropagation**: During training, after each feedforward pass, HAL9000:
1. Calculates the error between predictions and target values
2. Propagates the error backward through all layers
3. Computes gradients for each weight using the chain rule
4. Updates weights and biases to minimize the error

The `Train()` function performs both feedforward and backpropagation in each iteration. The `Prediction()` function uses only feedforward to generate outputs from trained networks.

## Framework Guides

- [Node.js Guide](guides/NODEJS.md) - Using HAL9000 in Node.js
- [Angular Guide](guides/ANGULAR.md) - Using HAL9000 in Angular
- [React Guide](guides/REACT.md) - Using HAL9000 in React
- [Vanilla JavaScript Guide](guides/VANILLA_JS.md) - Using HAL9000 in plain JavaScript

## Examples

Check out the `examples/` directory in the root of the repository for complete, runnable examples for each framework.

## Getting Started

1. **Install**: `npm install hal9000js`
2. **Import**: Choose your module format (ESM, CommonJS, or UMD)
3. **Create Network**: `new NeuralNetwork('MyNetwork')`
4. **Train**: Use the `Train()` function
5. **Predict**: Use the `Prediction()` function

See the [Installation Guide](guides/INSTALLATION.md) for detailed setup instructions.

