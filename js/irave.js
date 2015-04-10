(function() {
  var app = angular.module("iRave", []);
  
  app.directive('imgLicense', function(){
    return {
      restrict: 'E',
      templateUrl: 'licenseTemplate'
    };
  });
  
})();