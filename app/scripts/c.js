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
      this.collection.each(_.bind(this.renderChild, this));
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
      this.$el.append('<h2>' + this.model.get('title') + '</h2>');
      this.$el.append('<p>' + this.model.get('body') + '</p>');
      this.$el.append('<a href="#" class="back">back</a>');
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
      this.postsView = new C.Views.PostList({
        collection: this.blogPosts
      });
    },
    routes: {
      ''             : 'list',
      'posts/:title' : 'post'
    },
    list: function() {
      this.postView.remove();
      this.postsView.render();
    },
    post: function(a) {
      this.postsView.$el.empty();
      $('.post-view').remove();
      this.postView = new C.Views.PostView({
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
