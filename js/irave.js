(function() {
  var app = angular.module("iRave", []);
  
  app.controller('ScreenController', 
                 [ 'dateFilter', 
                   'currencyFilter',
    function(dateFilter, currencyFilter) {
      this.dateFilter = dateFilter;
      this.currencyFilter = currencyFilter;
      this.saldo = 4.20;
      
      this.stateStack = new Array();        
      this.state = new Initial(this);
      
      this.nextState = function(newState) {
        this.stateStack.push(this.state);
        this.state = newState;
      };
      
      this.prevState = function() {
        this.state = this.stateStack.pop();
      }
      
      this.goHome = function() {
        this.stateStack = new Array();
        this.state = new Initial(this);
      }
    }]);
  
  //The license in the bottom of the page
  app.directive('imgLicense', function(){
    return {
      restrict: 'E',
      templateUrl: 'licenseTemplate'
    };
  });
  
})();   