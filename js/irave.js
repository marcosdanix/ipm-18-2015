(function() {
  var app = angular.module("iRave", []);
  
  var saldo = 4.20;
    
  app.controller('ScreenController', 
                 [ 'dateFilter', 
                   'currencyFilter', 
    function(dateFilter, currencyFilter) {
      var Initial = function(controller) {
        this.mainscreen = dateFilter(new Date(), "HH:mm")
                          .concat("\nSaldo: ")
                          .concat(currencyFilter(saldo, "€", 2));
        this.rightButtonStyle = {'font-size': '50%'};
        this.rightButtonText = 'MENU';
        this.doRightButton = function() {
          controller.state = new Menu(controller);
        };
      };
      
      var Menu = function(controller) {        
        this.middleButtonText = '⌂';
        this.middleButtonStyle = {'font-size': '150%'};
        this.doMiddleButton = function() {
          controller.state = new Initial(controller);
        }
        
        this.rightButtonText = '→'
        
      };

        
      this.state = new Initial(this);    
    }]);
  
  //The license in the bottom of the page
  app.directive('imgLicense', function(){
    return {
      restrict: 'E',
      templateUrl: 'licenseTemplate'
    };
  });
  
})();   