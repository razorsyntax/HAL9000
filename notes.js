var neuralNetwork = {
        name: "HAL9000",
        layers: [ // array of layer objects
            {
                layer: "Edge_Detection",
                neurons: [ // array of neuron objects
                    {
                        id: "A1",
                        activation: "tanh",
                        weights: [],
                        bias: 1
                    },
                    {
                        id: "A2",
                        activation: "tanh",
                        weights: [],
                        bias: 1
                    }
                ]
            },
            {
                layer: "Obj_Detection",
                neurons: [
                    {
                        id: "B1",
                        activation: "logsig",
                        weights: [],
                        bias: 1
                    }
                ]
            }
        ]
};
/**
 * Create separate file for JSON object of the network
 *      * This is used to pre-populate data
 * 
 * *** NFD = null for default
 * Write functions based off this JSON structure
 *    Functions:
 *      LayerFunctions:
 *          Layer(obj or arr or NFD)
 *              -Pass obj with neuron properties for homogeneous layer
 *              -Pass array of neurons
 *              -Leave null for empty layer
 *          add(neuronArr)
 *              -To add neurons to the layer
 *          deleteLayer("layerName")
 *              -Deletes specified layer and all contained neurons
 * 
 * 
 * 
 *      NeuronFunctions:
 *          Neuron(neuronObj or NFD)
 *              -Creates a single neuron instance
 *          updateNeuron(obj)
 *              -Updates neuron properties (activation, id)
 *          deleteNeuron("neuronID")
 *              -Deletes specified neuron by id
 * 
 * 
 * 
 *      NeuralNetworkFunctions:
 *          CreateNetwork(layerObj or layerArr or NFD)
 *              -Creates the Neural Network Obj
 * 
 * 
 * 
 *      LearningFunctions:
 *          Train(data)
 *              -Pass training data to network
 *          Learn(neuralNetworkOBJ)
 *              -Initiates the learning process
 *              -This contains the main thinking loop
 *          StopLearning()
 *              -Stops the thinking loop
 *              
 * 
 * 
 * 
 * 
 * 
 *      Steps to create network:
 *          Method 1)
 *              -Define input data
 *              -Create Neurons
 *              -Add neurons to layer
 *              
 *              -Add layer and inputs to network to create NeuralNetwork JSON object
 * 
 *                Example:
 *                  // define inputs
 *                  var inputs = [1,2,3,4];
 * 
 *                  // Create neurons
 *                  var node1 = new Neuron();
 *                  var node2 = new Neuron({bias:1, activation:"logsig"});
 * 
 *                  // Creates a neuron Arr (checks for type)
 *                  var nodeArr = NeuronArr(node1,node2,...); 
 * 
 *                  // Creates a neuron layer
 *                  var layer = new Layer(nodeArr);
 * 
 *                  // Creates Neural Network Object
 *                  var NN = CreateNetwork(layer); 
 * 
 *                  
 * 
 * 
 *          Method 2)
 *              -Define input data
 *              -Create homogeneous layer
 *              -Add layer and inputs to network to create NeuralNetwork JSON object
 * 
 *                Example:
 *                  // define inputs
 *                  var inputs = [1,2,3,4];
 * 
 *                  // Creates a neuron layer and homogeneous neurons
 *                  var neuronProperties = {
 *                      neuronsToCreate: 2,
 *                      activation: "logsig",
 *                      bias: 1
 *                  };
 * 
 *                  // New layer is created with 2 homogeneous neurons
 *                  var layer = new Layer(neuronProperties);
 * 
 *                  // Creates Neural Network Object
 *                  var NN = CreateNetwork(layer); 
 * 
 * 
 *
 * 
 *          Train the Network:
 *              Hal.Train(trainingDataArr, NN);
 * 
 * 
 *          Let the Network Learn:
 *              Hal.Learn(input, NN);
 * 
 * 
 * 
 * 
 * Note:
 *      After input data has been processed, the output data is then used to update the weights/bias for all neurons
 * 
 * 
 * 
 */
