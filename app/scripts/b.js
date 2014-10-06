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
      this.collection.create(person);
    },
    error: function(model, message) {
      this.$el.append('<div class="error">' + message + '</div>');
    }
  });


//==============================================================================
                            //Models
//==============================================================================

  B.Models.Person = Backbone.Model.extend({
    validate: function(attrs){
      if (!attrs.firstName)
        return "First name is required";
      if (!attrs.lastName)
        return "Last name is required";
      if (!attrs.phone)
        return "Phone number is required";
      if (attrs.phone.length < 10)
        return "Please include your area code with your phone number";
      if (!attrs.address)
        return "Address is required";
      if (!attrs.address.match(/\d/))
        return "Please include a valid address";
      if (!attrs.zipcode)
        return "Zipcode is required";
      var zipNum = +attrs.zipcode;
      console.log(zipNum);
      if (attrs.zipcode.length < 5 || isNaN(zipNum))
        return "Please enter a valid zipcode";
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
