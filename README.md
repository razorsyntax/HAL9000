[![solarized dualmode](https://nodepirate-razorium.rhcloud.com/images/halpng.png)]

A JavaScript-based Neural Network

####Wiki: https://github.com/razorsyntax/HAL9000/wiki

####Training Demo Here: http://nodepirate-razorium.rhcloud.com

####This network works for a multple layers with of identical size.  Check the Index.html for a testing sample.

####At the moment, the code needs refactoring to simplify tasks, abstract redundant functions, and organization of the back propagation function into discrete reusable chunks.

To start immediate testing, open Index.html and the code runs a simple test.  I've added a line chart to display the training cycle error over time and the predicted result.



###### The idea behind this Neural Network is ease of use and customization. The toolset will grow over time.

###### The Network is represented by a dynamically updating JSON obj.

Notes: 
* This library depends on math.js to for its matrix math.
* index.html has some basic use case tests- this will grow as the library expands
    
    
Future Tasks:
* Add to npm
* Integration with a JavaScript GPU library for crunching larger data sets
