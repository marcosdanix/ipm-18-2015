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
        
        this.doMiddleButton = function() {
          controller.goHome();
        }
        
        this.rightButtonText = '→';
        this.doRightButton = function() {
          switch (this.index) {
          case 4 : controller.nextState(new PasseNoLeitor(controller)); break;
          case 2 : controller.nextState(new QueueSelectEstablishment(controller)); break;
          case 5 : controller.nextState(new PathChooseEstablishmentType(controller)); break;
          default: controller.nextState(new NotImplemented(controller));
          }
        }
        
        this.scroll = [
          '\n',
          'Amigos',
          'Concertos',
          'Fila',
          'Meteo',
          'Pagar',          
          'Percurso',          
          'Transferir',
          '\n'
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
          '\n',
          '3 Cervejas:',
          '........3×€1.00'
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
      
      var QueueSelectEstablishment = function(controller) {
        this.titlebar = "Escolha tipo de Establecimento"
        this.titlebarStyle = {'font-size': '8pt'};
        this.index = 0;
        
        this.doMiddleButton = function() {
          controller.goHome();
        }
        
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
          '\n',
          'Bebida',
          'Comida',
          'Bilheteira',
          '\n'
        ];
        this.maxIndex = this.scroll.length-3;
        this.updateScroll();
      };
      
      QueueSelectEstablishment.prototype = ScrollProto;
      
      var QueueChooseDrink = function(controller) {
        
        this.titlebar = "Escolha Bebida"
        this.titlebarStyle = {'font-size': '9pt'};
        this.index = 0;
        
        this.doMiddleButton = function() {
          controller.goHome();
        }
        
        this.leftButtonText = '←';
        this.doLeftButton = function() {
          controller.prevState();
        }
        
        this.rightButtonText = '→';
        this.doRightButton = function() {
          controller.nextState(new QueueEstablishmentType(controller));
        }
        
        this.scroll = [
          '\n',
          'Cerveja',
          'Refrigerante',
          'Água',
          'Cerveja s/alcool',
          '\n'
        ];
        this.maxIndex = this.scroll.length-3;
        this.scrollStyle = {'left':'-5%'};
        this.updateScroll();
      };
      
      QueueChooseDrink.prototype = ScrollProto;
      
      var QueueEstablishmentType = function(controller) {
        
        this.titlebar = "Escolha Tipo"
        this.titlebarStyle = {'font-size': '9pt'};
        this.index = 0;
        
        this.doMiddleButton = function() {
          controller.goHome();
        }
        
        this.leftButtonText = '←';
        this.doLeftButton = function() {
          controller.prevState();
        }
        
        this.rightButtonText = '→';
        this.doRightButton = function() {
          controller.nextState(new QueueEstablishment(controller));
        }
        
        this.scroll = [
          '\n',
          'Estab. mais próximo',
          'Fila mais curta',
          'Menor espera',          
          '\n'
        ];
        this.maxIndex = this.scroll.length-3;
        this.scrollStyle = {'left': '-15%'};
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
        
        this.doMiddleButton = function() {
          controller.goHome();
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
        
        this.doMiddleButton = function() {
          controller.goHome();
        }
        
        this.rightButtonText = '→';
        this.doRightButton = function() {
          controller.nextState(new PathChooseEstablishment(controller));
        }
        this.scroll = [
          '\n',
          'Bebida',
          'Comida',
          'Higiene',
          '\n'
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
        
        this.doMiddleButton = function() {
          controller.goHome();
        }
        
        this.rightButtonText = '→';
        this.doRightButton = function() {
          var name = this.scroll[this.index+1];
          controller.nextState(new Path1(controller, name, true));
        }
        this.scroll = [
          '\n',
          'Bar do Manel',
          'Tasca do Zé',
          'Estab. X103',
          '\n'
        ];
        this.maxIndex = this.scroll.length-3;
        this.scrollStyle = {'left': '-5%'};
        this.updateScroll();
      }
      
      PathChooseEstablishment.prototype = ScrollProto;
      
      var Path1 = function(controller, name, pathFeature) {
        this.titlebar = name;
        this.titlebarStyle = {'font-size': '9pt'};
        this.goLeft = true;
        this.compass = true;
        this.pathbar1 = true;
        this.distance = '5 m';
        
        this.leftButtonText = '←';
        this.doLeftButton = function() {
          controller.prevState();
        }
        
        this.doMiddleButton = function() {
          controller.goHome();
        }
        
        this.continuePath = function() {
          //Don't push this state.
          controller.state = new Path2(controller, name, pathFeature);
        }
      }
      
      Path1.prototype = HomeButtonProto;
      
      var Path2 = function(controller, name, pathFeature) {
        this.titlebar = name;
        this.titlebarStyle = {'font-size': '9pt'};
        this.goRight = true;
        this.compass = true;
        this.pathbar2 = true;
        this.distance = '10 m';
        
        this.leftButtonText = '←';
        this.doLeftButton = function() {
          controller.prevState();
        }
        
        this.doMiddleButton = function() {
          controller.goHome();
        }
        
        this.continuePath = function() {
          //Don't push this state.
          controller.state = new Path3(controller, name, pathFeature);
        }
      }
      
      Path2.prototype = HomeButtonProto;
      
      var Path3 = function(controller, name, pathFeature) {
        this.titlebar = name;
        this.titlebarStyle = {'font-size': '9pt'};
        this.compass = true;
        this.pathbar3 = true;
        this.distance = '6 m';
        
        this.leftButtonText = '←';
        this.doLeftButton = function() {
          controller.prevState();
        }
        
        this.doMiddleButton = function() {
          controller.goHome();
        }
        
        this.continuePath = function() {
          //Don't push this state.
          controller.state = new PathFinished(controller, name, pathFeature);
        }
      }
      
      Path3.prototype = HomeButtonProto;
      
      var PathFinished = function(controller, name, pathFeature) {
        this.titlebar = name;
        this.titlebarStyle = {'font-size': '9pt'};
        this.pathfinish = true;
        
        this.mainscreen = "CHEGOU";
        
        this.leftButtonText = '←';
        this.doLeftButton = function() {
          controller.prevState();
        }
        
        this.doMiddleButton = function() {
          controller.goHome();
        }
        
        if (pathFeature) {
        this.showRoadPlus = true;
          this.doRightButton = function() {
            controller.stateStack.pop();
            controller.prevState();
          }
        }
        
      }
      
      PathFinished.prototype = HomeButtonProto;
      
     
