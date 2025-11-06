// React Example

import { NeuralNetwork, NeuronArray, Prediction, Train } from 'hal9000js';
import React, { useState } from 'react';

function NeuralNetworkComponent() {
	const [result, setResult] = useState(null);
	const [error, setError] = useState(null);

	const train = () => {
		const NN = new NeuralNetwork('MyNetwork');
		NN.createLayer({
			type: 'hidden',
			neurons: NeuronArray(5, 'logsig')
		});
		NN.createLayer({
			type: 'output',
			neurons: NeuronArray(3, 'logsig')
		});

		NN.setTarget([0.1, 0.9, 0.2]);
		NN.init(3);

		const inputs = [0.5, 0.3, 0.8];
		const trainedNN = Train(NN, inputs, 0.5, 1000, true);

		setError(trainedNN.globalFinal);
		setResult(Prediction(trainedNN, inputs));
	};

	return (
		<div>
			<button onClick={train}>Train Network</button>
			{result && (
				<div>
					<p>Error: {error}</p>
					<p>Prediction: {result.join(', ')}</p>
				</div>
			)}
		</div>
	);
}

export default NeuralNetworkComponent;

