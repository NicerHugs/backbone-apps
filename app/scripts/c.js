(function(){
  'use strict';

  window.C = {};
  C.Views = {};
  C.Collections = {};
  C.Models = {};

//==============================================================================
                                  //Views
//==============================================================================

  C.Views.PostList = Backbone.View.extend({
    tagName: 'ul',
    className: 'post-list',
    template: _.template($('#post-list-template').text()),
    initialize: function(options){
      options = options || {};
      this.$container = options.$container || $('main');
      this.$container.append(this.el);
      this.render();
      this.listenTo(this.collection, 'add', this.renderChild);
    },
    render: function() {
      _.each(this.collection.models, this.renderChild);
    },
    renderChild: function(child) {
      this.$el.append(this.template(child.attributes));
    }
  });

  C.Views.PostView = Backbone.View.extend({
    className: 'post-view',
    initialize: function(options) {
      options = options || {};
      this.$container = options.$container || $('main');
      this.$container.append(this.el);
      this.render();
    },
    render: function() {
      this.$el.html(this.model.get('body'));
    }
  });

//==============================================================================
                                  //Models
//==============================================================================

  C.Models.BlogPost = Backbone.Model.extend({
    idAttribute: '_id'
  });


//==============================================================================
                                //Collections
//==============================================================================

  C.Collections.BlogPosts = Backbone.Collection.extend({
    model: C.Models.BlogPost,
    url: '//tiny-pizza-server.herokuapp.com/collections/posts',
    initialize: function() {
      this.fetch();
    }
  });


//==============================================================================
                                  //Router
//==============================================================================

  C.Router = Backbone.Router.extend({
    initialize: function() {
      this.blogPosts = new C.Collections.BlogPosts();
      new C.Views.PostList({
        collection: this.blogPosts
      });
    },
    routes: {
      'posts/:title' : 'post'
    },
    post: function(a) {
      $('.post-view').remove();
      new C.Views.PostView({
        model: this.blogPosts.get(a)
      });
    }
  });


//==============================================================================
                              //Document Ready
//==============================================================================

  $(document).ready(function(){
    new C.Router();
    Backbone.history.start();
  });

})();
