var transparent = {'opacity':'0.5'};
      
      //Prototypes
      var HomeButtonProto = {
        //middleButtonText: '⌂', 
        showHome: true,
      };

      var ScrollProto = {
        hasScroll: true,
        updateScroll: function () {
          this.visibleScrollElements = this.scroll.slice(this.index, this.index+3);
          this.moreUpStyle = this.index == 0 ? transparent : undefined;
          this.moreDownStyle = this.index == this.maxIndex ? transparent : undefined;
        },        
      };
      
      ScrollProto.__proto__ = HomeButtonProto;
      
       
     
      var Initial = function(controller) {
        this.mainscreen = controller.dateFilter(new Date(), "HH:mm")
                          .concat("\nSaldo: ")
                          .concat(controller.currencyFilter(controller.saldo, "€", 2));
        $('div.right-button').css('font-size', '50%');
        this.rightButtonText = 'MENU';
        this.doRightButton = function() {
          $('div.right-button').css('font-size', '');
          controller.nextState(new Menu(controller));
        };
      };
      
      var Menu = function(controller) {        
        this.titlebar = "Menu"; 
        this.index = 0;
        
        this.doMiddleButton = function() {
          controller.goHome();
        }
        
        this.rightButtonText = '→';
        this.doRightButton = function() {
          if (this.index == 0) {
            controller.nextState(new PasseNoLeitor(controller));
          } else {
            controller.nextState(new NotImplemented(controller));
          }
        }
        
        this.scroll = [
          '¯¯¯¯¯',
          'Pagar',
          'Fila',
          'Percurso',
          'Amigos',
          'Transferir',
          'Concertos',
          'Meteo',
          '_____'
        ];
        this.maxIndex = this.scroll.length-3;
        
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
      
      Menu.prototype = ScrollProto;
      
      
      var PasseNoLeitor = function(controller) {
        this.titlebar = "Pagar";
        this.mainscreen = 'PASSE\nNO LEITOR'
        this.passeNoLeitor = function() {
          if (controller.saldo > 3.00) {controller.state = new ItemsBought(controller);}
          else {controller.state = new PurchaseFailure(controller);}
        }
        
        this.leftButtonText = '←';
        this.doLeftButton = function() {
          controller.prevState();
        }
        
        this.doMiddleButton = function() {
          controller.goHome();
        }
      }
      
      PasseNoLeitor.prototype = HomeButtonProto;
      
      
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
          controller.prevState();
        }
        
        this.doMiddleButton = function() {
          this.undo();
          controller.goHome();
        }
        
        this.rightButtonText = '→';
        this.doRightButton = function() {
          this.undo();
          controller.saldo -= 3.00;
          controller.nextState(new PurchaseSuccess(controller));
        };
      }
      
      ItemsBought.prototype = HomeButtonProto;
      
      var PurchaseSuccess = function(controller) {
        this.titlebar = "Pagar";
        this.mainscreen = 'SUCESSO\n(thumbs up)\nSaldo: '.concat(controller.currencyFilter(controller.saldo, '€'));
      
        this.doMiddleButton = function() {
          controller.goHome();
        };
      
        this.showCart = true;
        this.doRightButton = function() {
          //this manipulates the stack differently
          controller.stateStack.pop();
          controller.stateStack.pop();
          controller.state = new PasseNoLeitor(controller);
        };
      }  
      
      PurchaseSuccess.prototype = HomeButtonProto;
      
      var PurchaseFailure = function(controller) {
        this.titlebar = "Pagar";
        this.mainscreen = "Preço: €3.00\nSaldo: €1.20\nSaldo Insuficiente";
        
        this.leftButtonText = '←';
        this.doLeftButton = function() {
          controller.prevState();
        }
        
        this.doMiddleButton = function() {
          controller.goHome();
        }
      }
      
      PurchaseFailure.prototype = HomeButtonProto;
      
      var NotImplemented = function(controller) {
        this.titlebar = 'Erro';
        this.mainscreen = 'NÃO ESTÁ\nIMPLEMENTADO!';
        var color = $('div.mainscreen').css('color');
        $('div.mainscreen').css('color','yellow');
        
        this.leftButtonText = '←';
        this.doLeftButton = function() {
          $('div.mainscreen').css('color', color);
          controller.prevState();
        }
      }