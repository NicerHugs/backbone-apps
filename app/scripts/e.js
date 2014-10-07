(function(){
  'use strict';

  window.E = {};
  E.Views = {};


//==============================================================================
                              //Views
//==============================================================================

  E.Views.App = Backbone.View.extend({
    className: 'container',
    initialize: function(options) {
      options = options || {};
      $('body').prepend(this.el);
      this.mainView = new E.Views.Main({
        $container: this.$el
      });
      this.footerView = new E.Views.Footer({
        $container: this.$el
      });
    }
  });

  E.Views.Base = Backbone.View.extend({
    initialize: function(options) {
      this.$container = options.$container;
      this.$container.append(this.el);
      this.render();
    }
  });

  E.Views.Main = E.Views.Base.extend({
    tagName: 'main'
  });

  E.Views.Footer = E.Views.Base.extend({
    tagName: 'footer',
    render: function() {
      this.$el.append('<a href="index.html">return home</a>');
    }
  });

//==============================================================================
                              //Models
//==============================================================================





//==============================================================================
                              //Collections
//==============================================================================





//==============================================================================
                              //Router
//==============================================================================

  E.Router = Backbone.Router.extend({
    initialize: function() {
      new E.Views.App();
    }
  });


//==============================================================================
                              //Document Ready
//==============================================================================

  $(document).ready(function() {
    new E.Router();
    Backbone.history.start();
  });

})();
