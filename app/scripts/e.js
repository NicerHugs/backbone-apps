(function(){
  'use strict';

  window.E = {};
  E.Views = {};
  E.Collections = {};
  E.Models = {};


//==============================================================================
                              //Views
//==============================================================================

  E.Views.App = Backbone.View.extend({
    className: 'container',
    initialize: function(options) {
      options = options || {};
      $('body').prepend(this.el);
      this.headerView = new E.Views.Header({
        $container: this.$el
      });
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
      this.model = this.model || new Backbone.Model();
      this.listenTo(this.model, 'destroy', this.remove);
      this.listenTo(this.model, 'invalid', this.saveError);
    }
  });

  E.Views.Main = E.Views.Base.extend({
    tagName: 'main'
  });

  E.Views.Header = E.Views.Base.extend({
    tagName: 'header',
    render: function() {
      this.$el.append('<h1>ToDo</h1>');
    }
  });

  E.Views.Footer = E.Views.Base.extend({
    tagName: 'footer',
    render: function() {
      this.$el.append('<a href="index.html">return home</a>');
    }
  });

  E.Views.ToDoList = Backbone.View.extend({
    tagName: 'ul',
    className: 'todo-list',
    template: _.template($('#todo-list-template').text()),
    initialize: function(options) {
      options = options || {};
      this.$container = options.$container || $('main');
      this.$container.append(this.el);
      this.render();
      this.listenTo(this.collection, 'add change', this.render);
    },
    render: function() {
      this.$el.html(this.template());
      this.collection.each(_.bind(this.renderChild, this));
    },
    renderChild: function(item) {
      new E.Views.ListItem({
        model: item,
        $container: this.$el
      });
    }
  });

  E.Views.Form = E.Views.Base.extend({
    tagName: 'form',
    template: _.template($('#form-template').text()),
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
    },
    events: {
      'submit' : 'save'
    },
    save: function(e) {
      e.preventDefault();
      var data = {
        title: $('#title').val(),
        details: $('#details').val(),
        due: moment($('#date').val()).format('YYYY/MM/DD'),
        displayDate: moment($('#date').val()).format('MMM DD, YYYY') ||
          moment(Date.now()).format('MMM DD, YYYY')
      };
      var that = this;
      this.model.save(data, {success: function(){
        E.router.navigate('', {trigger: true});
        that.remove();
      }});
    }
  });

  E.Views.ListItem = E.Views.Base.extend({
    tagName: 'li',
    template: _.template($('#list-item-template').text()),
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      if(this.model.get('complete'))
        this.$('input').attr('checked', 'checked').addClass('complete');
    },
    events: {
      'click .delete' : 'delete',
      'change'        : 'toggleComplete'
    },
    delete: function(e) {
      e.preventDefault();
      this.model.destroy();
    },
    toggleComplete: function(e) {
      var isChecked = $(e.target).is(':checked');
        if (isChecked) {
          this.model.set('complete', true);
        }
        else {
          this.model.set('complete', false);
        }
      this.model.save();
    }
  });

//==============================================================================
                              //Models
//==============================================================================

  E.Models.ListItem = Backbone.Model.extend({
    firebase: new Backbone.Firebase('https://nicerhugstodo.firebaseio.com/'),
    initialize: function() {
      // this.on('invalid', function(model, message) {
      //   console.log(message);
      // });
    },
    defaults: {
      title: '',
      details: '',
      due: '',
      complete: false,
      displayDate: ''
    },
    toJSON: function() {
      var json = _.clone(this.attributes);
      json.date = moment(this.attributes.date).format('YYYY-MM-DD');
      return json;
    },
    validate: function(attrs) {
      if (!attrs.title)
        return {field: '#title', message: 'title is required'};
      }
  });



//==============================================================================
                              //Collections
//==============================================================================

  E.Collections.ToDoList = Backbone.Firebase.Collection.extend({
    model: E.Models.ListItem,
    firebase: 'https://nicerhugstodo.firebaseio.com/',
    comparator: 'due'
  });



//==============================================================================
                              //Router
//==============================================================================

  E.Router = Backbone.Router.extend({
    initialize: function() {
      this.collection = new E.Collections.ToDoList();
      new E.Views.App({
        collection: this.collection,
      });
      this.todoList = new E.Views.ToDoList({
        collection: this.collection
      });
    },
    routes: {
      ''         : 'list',
      'new'      : 'addNew',
      'edit/:id' : 'edit'
    },
    list: function() {
      $('main').empty();
      this.todoList.$container.append(this.todoList.el);
      this.todoList.render();
    },
    addNew: function() {
      $('main').empty();
      new E.Views.Form({
        collection: this.collection,
        model: new E.Models.ListItem(),
        $container: $('main')
      });
    },
    edit: function(e) {
      $('main').empty();
      new E.Views.Form({
        model: this.collection.get(e),
        $container: $('main')
      });
    }
  });


//==============================================================================
                              //Document Ready
//==============================================================================

  $(document).ready(function() {
    E.router = new E.Router();
    Backbone.history.start();
  });

})();
