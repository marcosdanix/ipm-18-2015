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
        $('div.right-button').css('font-size', '50%');
        this.rightButtonText = 'MENU';
        this.doRightButton = function() {
          $('div.right-button').css('font-size', '');
          controller.state = new PasseNoLeitor(controller);
        };
      };
      
      var Menu = function(controller) {        
        this.middleButtonText = '⌂';
        this.middleButtonStyle = {'font-size': '150%'};
        this.doMiddleButton = function() {
          controller.state = new Initial(controller);
        }
        
        this.rightButtonText = '→';        
      };
      
      
      var PasseNoLeitor = function(controller) {
        this.titlebar = "Pagar";
        this.mainscreen = 'PASSE\nNO LEITOR'
        this.passeNoLeitor = function() {
          if (saldo > 3.00) {controller.state = new ItemsBought(controller);}
          else {controller.state = new Initial(controller);}
        }
        
        this.leftButtonText = '←';
        this.doLeftButton = function() {
          controller.state = new Initial(controller);
        }
        
        this.middleButtonText = '⌂';
        this.middleButtonStyle = {'font-size': '150%'};
        this.doMiddleButton = function() {
          controller.state = new Initial(controller);
        }
      }
      
      
      var ItemsBought = function(controller) {
        this.titlebar = "Pagar";
        this.hasScroll = true;
        this.moreUpStyle = {'opacity' : '0.5'};
        this.moreDownStyle = {'opacity': '0.5'};
        this.visibleScrollElements = [
          'Total: €3.00',
          '------------',
          '3 Cervejas:',
          '.........€3.00'
        ];
        $('ul.scroll').css('top', '10%').css('left', '-10%');
        this.undo = function() {
          $('ul.scroll').css('top', '').css('left', '');
        }
        
        this.leftButtonText = '←';
        this.doLeftButton = function() {
          this.undo();
          controller.state = new PasseNoLeitor(controller);
        }
        
        this.middleButtonText = '⌂';        
        this.middleButtonStyle = {'font-size': '150%'};
        this.doMiddleButton = function() {
          this.undo();
          controller.state = new Initial(controller);
        }
        
        this.rightButtonText = '→';
        this.doRightButton = function() {
          this.undo();
          controller.state = new PurchaseSuccess(controller);
        };
      }
      
      var PurchaseSuccess = function(controller) {
        this.titlebar = "Pagar";
        this.mainscreen = 'SUCESSO\n(thumbs up)\nSaldo: '.concat(currencyFilter(saldo, '€'));
      
        this.middleButtonText = '⌂';        
        this.middleButtonStyle = {'font-size': '150%'};
        this.doMiddleButton = function() {
          controller.state = new Initial(controller);
        };
      
        this.rightButtonText = '+';
        this.doRightButton = function() {
          controller.state = new PasseNoLeitor(controller);
        };
      
      }   

        
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