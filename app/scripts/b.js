(function(){
  'use strict';

  window.B = {};
  B.Views = {};
  B.Models = {};
  B.Collections = {};

//==============================================================================
                            //Views
//==============================================================================

  B.Views.PersonForm = Backbone.View.extend({
    tagName: 'form',
    className: 'person-form',
    template: function(){
      return _.template(this.$template.text());
    },
    initialize: function(options){
      options = options || {};
      this.$container = options.$container || $('main');
      this.$template = options.$template;
      this.$container.append(this.el);
      this.render();
      this.listenTo(this.collection, 'invalid', this.error);
    },
    render: function(){
      this.$el.html(this.template(this.model));
    },
    events: {
      'submit' : 'savePerson'
    },
    savePerson: function(e) {
      e.preventDefault();
      var person = {
        firstName: $('.first-name').val(),
        lastName: $('.last-name').val(),
        phone: $('.phone').val(),
        address: $('.address').val(),
        zipcode: $('.zipcode').val()
      };
      this.$el.find('.error').remove();
      this.$el.find('.invalid').removeClass('invalid');
      this.collection.create(person);
    },
    error: function(model, errorObject) {
      this.$el.find(errorObject.errorField).addClass('invalid');
      this.$el.find(errorObject.errorField).focus();
      this.$el.find(errorObject.errorField).after('<div class="error">' + errorObject.message + '</div>');
    }
  });


//==============================================================================
                            //Models
//==============================================================================

  B.Models.Person = Backbone.Model.extend({
    validate: function(attrs){
      if (!attrs.firstName)
        return {
          errorField: '.first-name',
          message: "First name is required"
        };
      if (!attrs.lastName)
        return {
          errorField: '.last-name',
          message: "Last name is required"
        };
      if (!attrs.phone)
        return {
          errorField: '.phone',
          message: "Phone number is required"
        };
      if (attrs.phone.length < 10)
        return {
          errorField: '.phone',
          message: "Please include a valid 10 digit phone number"
        };
      if (!attrs.address)
        return {
          errorField: '.address',
          message: "Address is required"
        };
      if (!attrs.address.match(/\d/))
        return {
          errorField: '.address',
          message: "Please include a valid address"
        };
      if (!attrs.zipcode)
        return {
          errorField: '.zipcode',
          message: "Zipcode is required"
        };
      var zipNum = +attrs.zipcode;
      if (attrs.zipcode.length < 5 || isNaN(zipNum))
        return {
          errorField: '.zipcode',
          message: "Please enter a valid zipcode"
        };
    },
    idAttribute: '_id'
  });


//==============================================================================
                            //Collections
//==============================================================================

  B.Collections.People = Backbone.Collection.extend({
    model: B.Models.Person,
    url: '//tiny-pizza-server.herokuapp.com/collections/people'
  });


//==============================================================================
                            //Router
//==============================================================================

  B.Router = Backbone.Router.extend({
    initialize: function(){
      new B.Views.PersonForm({
        $template: $('#person-form-template'),
        collection: new B.Collections.People()
      });
    }
  });


//==============================================================================
                            //Document ready
//==============================================================================

  $(document).ready(function(){
    new B.Router();
    Backbone.history.start();
  });

})();
