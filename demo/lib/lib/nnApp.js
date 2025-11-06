var nnApp = angular.module('nnApp', []);

nnApp.controller('outputController', ['$scope', '$log', function($scope, $log){
    
    // $scope.globalFinalError = localStorage.globalFinalError;
    // $scope.globalOutputArr = localStorage.globalOutputArr.split(",");
    // $scope.rounded = localStorage.rounded.split(",");    

}]);

nnApp.controller('dialogController', ['$scope', '$log', function($scope, $log){
    
    $scope.dialog = [
        {section: 'Network Options', description: 'allow you to modify the network and see how HAL9000 learns over time. The graph shows how the network error changes per 100 cycles- the lower the error, the higher the probability HAL9000 will accurately guess the input.'},
        {section: 'Initial Inputs', description: ': This is the input HAL9000 will learn to recognize. Acceptable inputs are any numbers or decimals between 0 & 1.'},
        {section: 'Select Number of Layers', description: ': This allows you to set up to three hidden network layers.'},
        {section: 'Training Cycles', description: ': HAL9000 learns through training. The default value of "10000" means there are 10000 training cycles.'}
    ];

    $scope.termsTitle = 'Rights & Terms';
    $scope.termsFirstParagraph = 'The name and images of HAL9000 belong to their respective "owners", of which they alone "own" under current intellectual property laws.';
    $scope.termsSecondParagraph = 'This JavaScript library is not for profit and free for everyone to use and modify under the';

    $scope.licenseUrl = 'https://opensource.org/licenses/MIT';

}]);