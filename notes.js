/**
 * This will be deleted once finalized.
 * This object represents the complete neural network.
 * All work done will be to this obj, which will update over time
 */
var neuralNetwork = {
    id: "",
    type: "training", // strings: training, supervised, notLearning
    inputs: [ //array of input objects
        { 
            inputName: "",
            input: int,
        }
    ],
    hiddenNetwork: {
        name: ""
        layers: [// array of layer objects
            { 
                layer: "name1",
                neurons: [
                    {
                        id: "1",
                        activation: tanh"",
                        weights: [],
                        bias: []
                    }
                ]
            },
            {
                layer: "name2",
                neurons: [
                    {
                        id: "2",
                        activation: "logsig",
                        weights: [],
                        bias: []
                    }
                ]
            }
        ]
    }
}
