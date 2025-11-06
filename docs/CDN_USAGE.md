# HAL9000 CDN Usage

## CDN Links

HAL9000 is available via free CDNs that automatically serve npm packages.

### unpkg.com (Recommended)

```html
<!-- Full version -->
<script src="https://unpkg.com/hal9000js@latest/dist/hal9000.umd.js"></script>

<!-- Minified version (recommended for production) -->
<script src="https://unpkg.com/hal9000js@latest/dist/hal9000.umd.min.js"></script>

<!-- Specific version -->
<script src="https://unpkg.com/hal9000js@2.0.0/dist/hal9000.umd.min.js"></script>
```

### jsDelivr (Alternative)

```html
<!-- Latest version -->
<script src="https://cdn.jsdelivr.net/npm/hal9000js@latest/dist/hal9000.umd.min.js"></script>

<!-- Specific version -->
<script src="https://cdn.jsdelivr.net/npm/hal9000js@2.0.0/dist/hal9000.umd.min.js"></script>
```

Both CDNs are free and require no setup.

### Usage with CDN

```html
<!DOCTYPE html>
<html>
<head>
    <title>HAL9000 Example</title>
</head>
<body>
    <script src="https://unpkg.com/hal9000js@latest/dist/hal9000.umd.min.js"></script>
    <script>
        // Use hal9000 global variable
        const NN = new hal9000.NeuralNetwork('MyNetwork');
        // ... rest of your code
    </script>
</body>
</html>
```

## Direct Script Reference

You can also download and reference the files directly:

```html
<script src="./dist/hal9000.umd.min.js"></script>
<script>
    const NN = new hal9000.NeuralNetwork('MyNetwork');
</script>
```

## Module Systems

### ES Modules (Angular, React, modern browsers)
```javascript
import { NeuralNetwork, Train, Prediction } from 'hal9000js';
```

### CommonJS (Node.js)
```javascript
const { NeuralNetwork, Train, Prediction } = require('hal9000js');
```

### UMD (Browser, CDN)
```html
<script src="https://unpkg.com/hal9000js@latest/dist/hal9000.umd.min.js"></script>
<script>
    const NN = new hal9000.NeuralNetwork('MyNetwork');
</script>
```

