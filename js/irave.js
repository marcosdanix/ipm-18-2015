(function() {
  var app = angular.module("iRave", []);
  
  app.controller('ScreenController', [ 'dateFilter', function(dateFilter) {
    this.display = dateFilter(new Date(), 'HH:mm');
    this.leftButton = '←';
    this.rightButton = '→';
  }]);
  
  //The license in the bottom of the page
  app.directive('imgLicense', function(){
    return {
      restrict: 'E',
      templateUrl: 'licenseTemplate'
    };
  });
  
})();