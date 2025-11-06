# Checking Hardware Acceleration Status

## Browser Console Check

Open your browser's developer console and run:

```javascript
// Check current backend
const backend = hal9000.getBackend();
console.log('Current backend:', backend.name);
console.log('Is GPU?', backend.name === 'gpu');

// List all available backends
console.log('Available backends:', hal9000.listBackends());

// Detect best backend
console.log('Best backend:', hal9000.detectBackend());
```

## In Your Code

```javascript
import { getBackend, listBackends, detectBackend, loadGPUBackend, setBackend } from 'hal9000js';

// Load GPU backend
await loadGPUBackend();

// Set to auto-detect best backend
setBackend('auto');

// Check which backend is active
const backend = getBackend();
console.log('Using backend:', backend.name);

if (backend.name === 'gpu') {
    console.log('✅ GPU acceleration is ACTIVE');
} else if (backend.name === 'cpu') {
    console.log('⚠️ Using CPU (no GPU acceleration)');
}

// List all available backends
const available = listBackends();
console.log('Available backends:', available);
```

## Complete Example

```javascript
import { loadGPUBackend, setBackend, getBackend, listBackends } from 'hal9000js';

async function checkHardwareAcceleration() {
    // Try to load GPU backend
    const gpuBackend = await loadGPUBackend();
    
    if (gpuBackend) {
        console.log('✅ GPU backend loaded successfully');
        setBackend('gpu');
    } else {
        console.log('⚠️ GPU backend not available, using CPU');
    }
    
    // Check current backend
    const currentBackend = getBackend();
    console.log('Current backend:', currentBackend.name);
    console.log('Available backends:', listBackends());
    
    return currentBackend.name === 'gpu';
}

// Usage
const isUsingGPU = await checkHardwareAcceleration();
```

## Vanilla JS (Browser)

```html
<script src="https://unpkg.com/hal9000js@latest/dist/hal9000.umd.min.js"></script>
<script>
    async function checkGPU() {
        // Load GPU backend
        await hal9000.loadGPUBackend();
        
        // Set to GPU if available
        hal9000.setBackend('auto');
        
        // Check status
        const backend = hal9000.getBackend();
        console.log('Backend:', backend.name);
        
        if (backend.name === 'gpu') {
            alert('✅ GPU acceleration is ACTIVE!');
        } else {
            alert('⚠️ Using CPU (no GPU acceleration)');
        }
    }
    
    checkGPU();
</script>
```

## Backend Properties

Each backend object has:
- `name`: String ('cpu', 'gpu', or 'tensorflow')
- `isAvailable`: Boolean (for GPU/TensorFlow backends)

```javascript
const backend = getBackend();
console.log('Backend name:', backend.name);
console.log('Is available:', backend.isAvailable); // true for GPU if WebGL works
```

