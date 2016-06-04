/** 
 * This is the hidden layer where the neuron layers are stacked.
 * 
 * Takes an array of neurons and a name for the this layer
 */

var Layer = function (neuronArray, layerName) {
  "use strict";

  this.layerName = layerName || "";
  
  if(!Array.isArray(neuronArray)){
    neuronArray = [neuronArray];
  }
  
  try {
    this.neuronCount = neuronArray.length;
  } catch (e) {
    this.neuronCount = 0;
  }

  this.neuronArray = neuronArray || [];
};

/**
 * Specify a neuron object or call it empty and the function
 * will create a generic instance
 */
Layer.prototype.addNeuron = function (neuron) {
  "use strict";
  if (typeof neuron === "undefined") {
    neuron = new Neuron();
  }
  this.neuronArray.push(neuron);
  this.neuronCount++;
};


/**
 * Deletes a Neuron by id string
 */
Layer.prototype.deleteNeuron = function(id){
  "use strict";
  var arr = this.neuronArray;
  
  for(let i=0;i<arr.length;i++){
    if(arr[i].id === id){
      arr.splice(i,1);
      this.neuronArray = arr;
      this.neuronCount--;
      break;
    }
  }
}