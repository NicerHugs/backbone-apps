(function(){
  'use strict';

  window.D = {};
  D.Views = {};
  D.Collections = {};
  D.Models = {};

//==============================================================================
                                  //Views
//==============================================================================

  D.Views.LinkList = Backbone.View.extend({
    tagName: 'ul',
    className: 'link-list',
    initialize: function(options) {
      options = options || {};
      this.$container = options.$container || $('main');
      this.$container.prepend(this.el);
      this.tag = options.tag;
      this.render();
      this.listenTo(this.collection, 'add', this.renderChild);
    },
    render: function() {
      this.$el.empty();
      if (this.tag === 'any') {
        this.$el.append('<h2>Your bookmarked links</h2>');
      }
      else {
        this.$el.append('<h2>Your bookmarked links, tagged: ' + this.tag + '</h2>');
      }
      this.collection.each( _.bind(this.renderChild, this));
    },
    renderChild: function(child) {
      if (this.tag === 'any' || child.get('tags').match(this.tag)) {
        new D.Views.LinkListItem({
          model: child,
          $container: this.$el
        });
      }
    }
  });

  D.Views.LinkListItem = Backbone.View.extend({
    tagName: 'li',
    className: 'link-list-item',
    template: _.template($('#link-list-item-template').text()),
    initialize: function(options) {
      options = options || {};
      this.$container = options.$container;
      this.$container.append(this.el);
      this.render();
      this.listenTo(this.model, 'destroy', this.remove);
      this.listenTo(this.model, 'change', this.render);
    },
    render: function() {
      this.$el.html(this.template(this.model.attributes));
    }
  });

  D.Views.TagList = Backbone.View.extend({
    tagName: 'ul',
    className: 'tag-list',
    template: _.template($('#tag-list-template').text()),
    initialize: function(options) {
      options = options || {};
      this.$container = options.$container || $('main');
      this.$container.append(this.el);
      this.$el.append('<h2>Your tags</h2>');
      this.listenTo(this.collection, 'add', this.generateTagList);
    },
    render: function() {
      this.$el.find('li').remove();
      _.each(this.tagList, _.bind(this.addTag, this));
      this.$el.append('<li class="tag-list-item"><a href="#/tag/any">any</a></li>');
    },
    generateTagList: function(){
      var tempTagList = _.map(this.collection.models, function(model){
        return model.get('tags').split(',');
      });
      tempTagList = _.flatten(tempTagList);
      this.tagList = _.union(tempTagList);
      this.render();
    },
    addTag: function(tag) {
      tag = {tag: tag};
      this.$el.append(this.template(tag));
    }
  });

  D.Views.BookmarkForm = Backbone.View.extend({
    tagName: 'form',
    className: 'bookmark-form',
    template: _.template($('#bookmark-form-template').text()),
    initialize: function(options) {
      options = options || {};
      this.$container = options.$container || $('main');
      this.$container.append(this.el);
      this.$el.html(this.template({}));
      this.listenTo(this.collection, 'invalid', this.error);
    },
    events: {
      'submit' : 'saveLink'
    },
    saveLink: function(e) {
      e.preventDefault();
      var formData = {
        wait: true,
        url : $('.url').val(),
        title: $('.title').val(),
        tags: $('.tag').val()
        };
      this.$el.find('.invalid').removeClass('invalid');
      this.$el.find('.error-message').remove();
      this.collection.create(formData);
    },
    error: function(model, errorObject) {
      this.$el.find(errorObject.field).addClass('invalid');
      this.$el.find(errorObject.field).focus();
      this.$el.append('<div class="error-message">' + errorObject.message + '</div>');
    }
  });


//==============================================================================
                                  //Models
//==============================================================================

  D.Models.Link = Backbone.Model.extend({
    idAttribute: '_id',
    validate: function(){
      if (!$('.url').val())
        return {
          message: 'a url is required',
          field: '.url'
        };
      if (!$('.url').val().match('http'))
        return {
          message: 'please include a valid url',
          field: '.url'
        };
      if (!$('.title').val())
        return {
          message: 'a title is required',
          field: '.title'
        };
      if (!$('.tag').val())
        return {
          message: 'a tag is required',
          field: '.tag'
        };
      if ($('.tag').val().match(/\s/))
        return {
          message: 'tags should be separated by commas with no spaces',
          field: '.tag'
        };
    }
  });


//==============================================================================
                              //Collections
//==============================================================================

  D.Collections.LinkList = Backbone.Collection.extend({
    model: D.Models.Link,
    url: '//tiny-pizza-server.herokuapp.com/collections/links',
    initialize: function() {
      this.fetch();
    }
  });


//==============================================================================
                                  //Router
//==============================================================================

  D.Router = Backbone.Router.extend({
    initialize: function(){
      var linkList = new D.Collections.LinkList();
      this.linkList = new D.Views.LinkList({
        collection: linkList,
        tag: 'any'
      });
      new D.Views.TagList({
        collection: linkList
      });
      new D.Views.BookmarkForm({
        collection: linkList
      });
    },
    routes: {
      'tag/:param' : 'tags'
    },
    tags: function(tag) {
      this.linkList.tag = tag;
      this.linkList.render();
    }
  });


//==============================================================================
                              //Document Ready
//==============================================================================

  $(document).ready(function() {
    new D.Router();
    Backbone.history.start();
  });

})();
