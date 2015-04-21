var transparent = {'opacity':'0.5'};


      //Prototypes
      var HomeButtonProto = {
        //middleButtonText: '⌂', 
        showHome: true,
        doMiddleButton: function() {
          controller.goHome();
        },
      };

      var ScrollProto = {
        hasScroll: true,
        updateScroll: function () {
          this.visibleScrollElements = this.scroll.slice(this.index, this.index+3);
          this.moreUpStyle = this.index == 0 ? transparent : undefined;
          this.moreDownStyle = this.index == this.maxIndex ? transparent : undefined;
        },
        scrollUp: function() {
          if (this.index > 0) {
            this.index -= 1;
            this.updateScroll();
          }
        },     

        scrollDown: function() {
          if (this.index < this.maxIndex) {
            this.index += 1;
            this.updateScroll();
          }
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
        
        
        
        this.rightButtonText = '→';
        this.doRightButton = function() {
          switch (this.index) {
          case 0 : controller.nextState(new PasseNoLeitor(controller)); break;
          case 1 : controller.nextState(new QueueSelectEstablishment(controller)); break;
          case 2 : controller.nextState(new PathChooseEstablishmentType(controller)); break;
          default: controller.nextState(new NotImplemented(controller));
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
        
        this.updateScroll();
      };
      
      Menu.prototype = ScrollProto;
      
      
      var PasseNoLeitor = function(controller) {
        this.titlebar = "Pagar";
        this.mainscreen = 'PASSE\nNO LEITOR'
        this.passeNoLeitor = function() {
          if (controller.saldo > 3.00) {controller.nextState(new ItemsBought(controller));}
          else {controller.nextState(new PurchaseFailure(controller));}
        }
        
        this.leftButtonText = '←';
        this.doLeftButton = function() {
          controller.prevState();
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
        
        this.rightButtonText = '✓';
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
      
      var QueueSelectEstablishment = function(controller) {
        this.titlebar = "Escolha tipo de Establecimento"
        this.titlebarStyle = {'font-size': '8pt'};
        this.index = 0;
        
        
        this.leftButtonText = '←';
        this.doLeftButton = function() {
          controller.prevState();
        }
        
        this.rightButtonText = '→';
        this.doRightButton = function() {
          switch (this.index) {
          case 0 : controller.nextState(new QueueChooseDrink(controller)); break;
          default: controller.nextState(new NotImplemented(controller));
          }
        }
        
        this.scroll = [
          '¯¯¯¯¯',
          'Bebida',
          'Comida',
          'Bilheteira',
          '_____'
        ];
        this.maxIndex = this.scroll.length-3;
        //this.scrollElementStyle = {'font-size': '11pt'};     
        
        this.updateScroll();
      };
      
      QueueSelectEstablishment.prototype = ScrollProto;
      
      var QueueChooseDrink = function(controller) {
        
        this.titlebar = "Escolha Bebida"
        this.titlebarStyle = {'font-size': '9pt'};
        this.index = 0;
        
        
        this.leftButtonText = '←';
        this.doLeftButton = function() {
          controller.prevState();
        }
        
        this.rightButtonText = '→';
        this.doRightButton = function() {
          controller.nextState(new QueueEstablishmentType(controller));
        }
        
        this.scroll = [
          '¯¯¯¯¯',
          'Sagres',
          'Super Bock',
          'Refrigerante',
          'Água',
          'Cerveja s/alcool',
          '_____'
        ];
        this.maxIndex = this.scroll.length-3;
        this.scrollStyle = {'left': '-10%', 'top' : '25%'};
        this.scrollElementStyle = {'font-size': '10pt'};
        
       
        
        this.updateScroll();
      };
      
      QueueChooseDrink.prototype = ScrollProto;
      
      var QueueEstablishmentType = function(controller) {
        
        this.titlebar = "Escolha Tipo"
        this.titlebarStyle = {'font-size': '9pt'};
        this.index = 0;
        
        
        this.leftButtonText = '←';
        this.doLeftButton = function() {
          controller.prevState();
        }
        
        this.rightButtonText = '→';
        this.doRightButton = function() {
          controller.nextState(new QueueEstablishment(controller));
        }
        
        this.scroll = [
          '¯¯¯¯¯',
          'Estab. mais próximo',
          'Fila mais curta',
          'Menor espera',          
          '_____'
        ];
        this.maxIndex = this.scroll.length-3;
        this.scrollStyle = {'left': '-15%', 'top' : '25%'};
        this.scrollElementStyle = {'font-size': '9pt'};
               
        
        this.updateScroll();
      };
      
      QueueEstablishmentType.prototype = ScrollProto;
      
      var QueueEstablishment = function(controller) {
        this.titlebar = "Tasca do Zé"
        this.titlebarStyle = {'font-size': '9pt'};
        this.mainscreen = "Deslocamento:\t10 min\nEspera:\t\t 5 min\nTotal:\t\t15 min";
        this.mainscreenStyle = {'font-size': '10pt', 'text-align': 'left', 'left': '1.2in'};
        
        this.leftButtonText = '←';
        this.doLeftButton = function() {
          controller.prevState();
        }
        
       
        
        this.showRoad = true;
        this.doRightButton = function() {
          controller.nextState(new Path1(controller, this.titlebar));          
        }
      }
      
      QueueEstablishment.prototype = HomeButtonProto;
      
      var PathChooseEstablishmentType = function(controller) {
        this.titlebar = 'Escolha tipo de local'
        this.titlebarStyle = {'font-size': '9pt'};
        this.index = 0;
                
        this.leftButtonText = '←';
        this.doLeftButton = function() {
          controller.prevState();
        }
        
        this.rightButtonText = '→';
        this.doRightButton = function() {
          controller.nextState(new PathChooseEstablishment(controller));
        }
        this.scroll = [
          '¯¯¯¯¯',
          'Bebida',
          'Comida',
          'Higiene',
          '_____'
        ];
        this.maxIndex = this.scroll.length-3;
        
        this.updateScroll();
      }
      
      PathChooseEstablishmentType.prototype = ScrollProto;
      
      var PathChooseEstablishment = function(controller) {
        this.titlebar = 'Escolha local'
        this.titlebarStyle = {'font-size': '9pt'};
        this.index = 0;
                
        this.leftButtonText = '←';
        this.doLeftButton = function() {
          controller.prevState();
        }
        
        this.rightButtonText = '→';
        this.doRightButton = function() {
          var name = this.scroll[this.index+1];
          controller.nextState(new Path1(controller, name));
        }
        this.scroll = [
          '¯¯¯¯¯',
          'Bar do Manel',
          'Tasca do Zé',
          'Estab. X103',
          '_____'
        ];
        this.maxIndex = this.scroll.length-3;        
        this.scrollStyle = {'left': '-5%', 'top' : '25%'};
        this.scrollElementStyle = {'font-size': '10pt'};
        
        this.updateScroll();
      }
      
      PathChooseEstablishment.prototype = ScrollProto;
      
      var Path1 = function(controller, name) {
        
      }