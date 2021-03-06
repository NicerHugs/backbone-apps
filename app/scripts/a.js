(function(){
  'use strict';

  window.A = {};
  A.Views = {};
  A.Models = {};
  A.Collections = {};

//==============================================================================
                                //Views
//==============================================================================

  A.Views.BlogPostForm = Backbone.View.extend({
    tagName: 'form',
    className: 'blog-post-form',
    template: function(){
      return _.template(this.$template.text());
    },
    initialize: function(options) {
      options = options || {};
      this.$container = options.$container || $('main');
      this.$template = options.$template;
      this.$container.append(this.el);
      this.render();
    },
    render: function() {
      this.$el.html(this.template(this.model));
    },
    events: {
      'submit' : 'saveBlogPost'
    },
    saveBlogPost: function(e) {
      e.preventDefault();
      var postData = {
        title: $('.title').val() || 'untitled',
        body: $('.body').val() || ''
      };
      this.collection.create(postData);
      console.log(this.collection);
    }
  });


//==============================================================================
                                //Models
//==============================================================================

  A.Models.BlogPost = Backbone.Model.extend({
    idAttribute: '_id'
  });


//==============================================================================
                              //Collections
//==============================================================================

  A.Collections.BlogPosts = Backbone.Collection.extend({
    model: A.Models.BlogPost,
    url: '//tiny-pizza-server.herokuapp.com/collections/posts',
  });

//==============================================================================
                                //Routers
//==============================================================================

  A.Router = Backbone.Router.extend({
    initialize: function(){
      new A.Views.BlogPostForm({
        collection: new A.Collections.BlogPosts(),
        $template: $('#blog-post-form-template')
      });
    }
  });


//==============================================================================
                          //Document ready code
//==============================================================================

  $(document).ready(function(){
    new A.Router();
    Backbone.history.start();
  });

})();
