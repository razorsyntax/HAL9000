// Angular Example

import { Component } from '@angular/core';
import { NeuralNetwork, NeuronArray, Prediction, Train } from 'hal9000js';

@Component({
	selector: 'app-neural-network',
	template: `
		<button (click)="train()">Train Network</button>
		@if(result){
			<div>
				<p>Error: {{ error }}</p>
				<p>Prediction: {{ result }}</p>
			</div>
		}
	`
})
export class NeuralNetworkComponent {
	result: number[] | null = null;
	error: number | null = null;

	train() {
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

		this.error = trainedNN.globalFinal;
		this.result = Prediction(trainedNN, inputs);
	}
}

