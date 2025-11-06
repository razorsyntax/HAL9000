# Installation Guide

## Quick Start

```bash
npm install hal9000js
```

## Installation Methods

### npm (Recommended)

```bash
npm install hal9000js
```

### CDN (Browser)

```html
<script src="https://unpkg.com/hal9000js@latest/dist/hal9000.umd.min.js"></script>
```

**Free CDNs** (no setup required):
- **unpkg.com**: `https://unpkg.com/hal9000js@latest/dist/hal9000.umd.min.js`
- **jsDelivr**: `https://cdn.jsdelivr.net/npm/hal9000js@latest/dist/hal9000.umd.min.js`

### Manual Download

Download the built files from the `dist/` folder:
- `hal9000.esm.js` - ES Modules
- `hal9000.cjs.js` - CommonJS (Node.js)
- `hal9000.umd.js` - Browser (UMD)
- `hal9000.umd.min.js` - Browser (Minified)

## Optional Dependencies

For GPU acceleration (optional):

**Browser:**
```bash
npm install gpu.js
```

**Node.js:**
```bash
npm install @tensorflow/tfjs-node
# or for GPU support:
npm install @tensorflow/tfjs-node-gpu
```

The library will automatically use GPU acceleration if these are installed, otherwise it falls back to CPU.

## Import Methods

### Node.js (CommonJS)
```javascript
const { NeuralNetwork, Train, Prediction, NeuronArray } = require('hal9000js');
```

### Node.js (ES Modules)
```javascript
import { NeuralNetwork, Train, Prediction, NeuronArray } from 'hal9000js';
```

### Browser (ES Modules)
```javascript
import { NeuralNetwork, Train, Prediction, NeuronArray } from './node_modules/hal9000js/dist/hal9000.esm.js';
```

### Browser (UMD/CDN)
```html
<script src="https://unpkg.com/hal9000js@latest/dist/hal9000.umd.min.js"></script>
<script>
  const { NeuralNetwork, Train, Prediction, NeuronArray } = hal9000;
</script>
```

## Framework-Specific Installation

See the framework-specific guides in `docs/guides/` for detailed setup instructions.

