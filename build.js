/**
 * esbuild Build Configuration
 * Lightweight and fast build system for HAL9000
 */

const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Build configuration
const buildConfigs = [
	// ES Module (for Angular, React, modern browsers)
	{
		entryPoints: ['src/core/index.js'],
		bundle: true,
		format: 'esm',
		outfile: 'dist/hal9000.esm.js',
		platform: 'neutral',
		target: ['es2020'],
		sourcemap: true,
		minify: false,
	},
	// CommonJS (for Node.js)
	{
		entryPoints: ['src/core/index.js'],
		bundle: true,
		format: 'cjs',
		outfile: 'dist/hal9000.cjs.js',
		platform: 'node',
		target: ['node14'],
		sourcemap: true,
		minify: false,
		external: ['@tensorflow/tfjs-node', '@tensorflow/tfjs-node-gpu'],
		packages: 'external',
	},
	// UMD (for Vanilla JS browsers, CDN)
	{
		entryPoints: ['src/core/index.js'],
		bundle: true,
		format: 'iife',
		globalName: 'hal9000',
		outfile: 'dist/hal9000.umd.js',
		platform: 'browser',
		target: ['es2015'],
		sourcemap: true,
		minify: false,
		external: ['gpu.js'],
		packages: 'external',
	},
	// UMD Minified (for CDN)
	{
		entryPoints: ['src/core/index.js'],
		bundle: true,
		format: 'iife',
		globalName: 'hal9000',
		outfile: 'dist/hal9000.umd.min.js',
		platform: 'browser',
		target: ['es2015'],
		sourcemap: false,
		minify: true,
		external: ['gpu.js'],
		packages: 'external',
	},
];

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
	fs.mkdirSync('dist', { recursive: true });
}

// Build function
async function build() {
	console.log('Building HAL9000...\n');

	const isWatch = process.argv.includes('--watch');

	if (isWatch) {
		console.log('Watch mode enabled\n');
	}

	const buildPromises = buildConfigs.map(async (config) => {
		try {
			if (isWatch) {
				const ctx = await esbuild.context(config);
				await ctx.watch();
				console.log(`✓ Watching: ${config.outfile}`);
			} else {
				await esbuild.build(config);
				const size = fs.statSync(config.outfile).size;
				const sizeKB = (size / 1024).toFixed(2);
				console.log(`✓ Built: ${config.outfile} (${sizeKB} KB)`);
			}
		} catch (error) {
			console.error(`✗ Error building ${config.outfile}:`, error);
			process.exit(1);
		}
	});

	await Promise.all(buildPromises);

	// Copy TypeScript definitions
	if (!isWatch) {
		if (!fs.existsSync('dist/types')) {
			fs.mkdirSync('dist/types', { recursive: true });
		}
		if (fs.existsSync('src/types/index.d.ts')) {
			fs.copyFileSync('src/types/index.d.ts', 'dist/types/index.d.ts');
		}
	}

	if (!isWatch) {
		console.log('\n✓ Build complete!');
		console.log('\nOutput files:');
		console.log('  - dist/hal9000.esm.js (ES Module)');
		console.log('  - dist/hal9000.cjs.js (CommonJS)');
		console.log('  - dist/hal9000.umd.js (UMD - Browser)');
		console.log('  - dist/hal9000.umd.min.js (UMD - Minified for CDN)');
		console.log('  - dist/types/index.d.ts (TypeScript definitions)');
	} else {
		console.log('\n✓ Watching for changes...');
	}
}

// Run build
build().catch((error) => {
	console.error('Build failed:', error);
	process.exit(1);
});

