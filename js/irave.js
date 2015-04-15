(function() {
  var app = angular.module("iRave", []);
  
  var saldo = 4.20;
    
  app.controller('ScreenController', 
                 [ 'dateFilter', 
                   'currencyFilter',
    function(dateFilter, currencyFilter) {
      var transparent = {'opacity':'0.5'};
    
      var Initial = function(controller) {
        this.mainscreen = dateFilter(new Date(), "HH:mm")
                          .concat("\nSaldo: ")
                          .concat(currencyFilter(saldo, "€", 2));
        $('div.right-button').css('font-size', '50%');
        this.rightButtonText = 'MENU';
        this.doRightButton = function() {
          $('div.right-button').css('font-size', '');
          controller.state = new Menu(controller);
        };
      };
      
      var Menu = function(controller) {        
        this.titlebar = "Menu"; 
        this.index = 0;
        
        this.middleButtonText = '⌂';
        this.middleButtonStyle = {'font-size': '150%'};
        this.doMiddleButton = function() {
          controller.state = new Initial(controller);
        }
        
        this.rightButtonText = '→';
        this.doRightButton = function() {
          if (this.index == 0) {
            controller.state = new PasseNoLeitor(controller);          
          } else {
            controller.state = new NotImplemented(controller);
          }
        }        
        
        this.hasScroll = true;
        this.scroll = [
          '\n',
          'Pagar',
          'Fila',
          'Percurso'
        ];
        this.maxIndex = this.scroll.length-2;
        
        this.updateScroll = function () {
          this.visibleScrollElements = this.scroll.slice(this.index, this.index+3);
          this.moreUpStyle = this.index == 0 ? transparent : undefined;
          this.moreDownStyle = this.index == this.maxIndex ? transparent : undefined;
        }
        
        this.scrollUp = function() {
          if (this.index > 0) {
            this.index -= 1;
            this.updateScroll();
          }
        }; 

        this.scrollDown = function() {
          if (this.index < this.maxIndex) {
            this.index += 1;
            this.updateScroll();
          }
        }        
        
        this.updateScroll();        
      };
      
      
      var PasseNoLeitor = function(controller) {
        this.titlebar = "Pagar";
        this.mainscreen = 'PASSE\nNO LEITOR'
        this.passeNoLeitor = function() {
          if (saldo > 3.00) {controller.state = new ItemsBought(controller);}
          else {controller.state = new PurchaseFailure(controller);}
        }
        
        this.leftButtonText = '←';
        this.doLeftButton = function() {
          controller.state = new Menu(controller);
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
          saldo -= 3.00;
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
      
      var PurchaseFailure = function(controller) {
        this.titlebar = "Pagar";
        this.mainscreen = "Preço: €3.00\nSaldo: €1.20\nSaldo Insuficiente";
        
        this.leftButtonText = '←';
        this.doLeftButton = function() {
          controller.state = new PasseNoLeitor(controller);
        }
        
        this.middleButtonText = '⌂';        
        this.middleButtonStyle = {'font-size': '150%'};
        this.doMiddleButton = function() {
          controller.state = new Initial(controller);
        }
      }
      
      var NotImplemented = function(controller) {
        this.titlebar = 'Erro';
        this.mainscreen = 'NÃO ESTÁ\nIMPLEMENTADO!';
        var color = $('div.mainscreen').css('color');
        $('div.mainscreen').css('color','yellow');
        
        this.leftButtonText = '←';
        this.doLeftButton = function() {
          $('div.mainscreen').css('color', color);
          controller.state = new Menu(controller);
        }
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