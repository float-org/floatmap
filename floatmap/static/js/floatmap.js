(function() {
  alert('Foo');

}).call(this);

//# sourceMappingURL=main.js.map
;//     Backbone.js 1.1.2

//     (c) 2010-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(root, factory) {

  // Set up Backbone appropriately for the environment. Start with AMD.
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'jquery', 'exports'], function(_, $, exports) {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Backbone.
      root.Backbone = factory(root, exports, _, $);
    });

  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore');
    factory(root, exports, _);

  // Finally, as a browser global.
  } else {
    root.Backbone = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
  }

}(this, function(root, Backbone, _, $) {

  // Initial Setup
  // -------------

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create local references to array methods we'll want to use later.
  var array = [];
  var push = array.push;
  var slice = array.slice;
  var splice = array.splice;

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '1.1.2';

  // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
  // the `$` variable.
  Backbone.$ = $;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PATCH"`, `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
      this._events || (this._events = {});
      var events = this._events[name] || (this._events[name] = []);
      events.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      var self = this;
      var once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var retain, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = void 0;
        return this;
      }
      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (events = this._events[name]) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
              ev = events[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) delete this._events[name];
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      if (!this._events) return this;
      var args = slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, arguments);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
      var listeningTo = this._listeningTo;
      if (!listeningTo) return this;
      var remove = !name && !callback;
      if (!callback && typeof name === 'object') callback = this;
      if (obj) (listeningTo = {})[obj._listenId] = obj;
      for (var id in listeningTo) {
        obj = listeningTo[id];
        obj.off(name, callback, this);
        if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
      }
      return this;
    }

  };

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
    }
  };

  var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  _.each(listenMethods, function(implementation, method) {
    Events[method] = function(obj, name, callback) {
      var listeningTo = this._listeningTo || (this._listeningTo = {});
      var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
      listeningTo[id] = obj;
      if (!callback && typeof name === 'object') callback = this;
      obj[implementation](name, callback, this);
      return this;
    };
  });

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Allow the `Backbone` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  _.extend(Backbone, Events);

  // Backbone.Model
  // --------------

  // Backbone **Models** are the basic data object in the framework --
  // frequently representing a row in a table in a database on your server.
  // A discrete chunk of data and a bunch of useful, related methods for
  // performing computations and transformations on that data.

  // Create a new model with the specified attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var attrs = attributes || {};
    options || (options = {});
    this.cid = _.uniqueId('c');
    this.attributes = {};
    if (options.collection) this.collection = options.collection;
    if (options.parse) attrs = this.parse(attrs, options) || {};
    attrs = _.defaults({}, attrs, _.result(this, 'defaults'));
    this.set(attrs, options);
    this.changed = {};
    this.initialize.apply(this, arguments);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // The value returned during the last failed validation.
    validationError: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Proxy `Backbone.sync` by default -- but override this if you need
    // custom syncing semantics for *this* particular model.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      return _.escape(this.get(attr));
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Set a hash of model attributes on the object, firing `"change"`. This is
    // the core primitive operation of a model, updating the data and notifying
    // anyone who needs to know about the change in state. The heart of the beast.
    set: function(key, val, options) {
      var attr, attrs, unset, changes, silent, changing, prev, current;
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Extract attributes and options.
      unset           = options.unset;
      silent          = options.silent;
      changes         = [];
      changing        = this._changing;
      this._changing  = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }
      current = this.attributes, prev = this._previousAttributes;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      // For each `set` attribute, update or delete the current value.
      for (attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          this.changed[attr] = val;
        } else {
          delete this.changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // Trigger all relevant attribute changes.
      if (!silent) {
        if (changes.length) this._pending = options;
        for (var i = 0, l = changes.length; i < l; i++) {
          this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
      }

      // You might be wondering why there's a `while` loop here. Changes can
      // be recursively nested within `"change"` events.
      if (changing) return this;
      if (!silent) {
        while (this._pending) {
          options = this._pending;
          this._pending = false;
          this.trigger('change', this, options);
        }
      }
      this._pending = false;
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"`. `unset` is a noop
    // if the attribute doesn't exist.
    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    // Clear all attributes on the model, firing `"change"`.
    clear: function(options) {
      var attrs = {};
      for (var key in this.attributes) attrs[key] = void 0;
      return this.set(attrs, _.extend({}, options, {unset: true}));
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (attr == null) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var val, changed = false;
      var old = this._changing ? this._previousAttributes : this.attributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (attr == null || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overridden,
    // triggering a `"change"` event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        if (!model.set(model.parse(resp, options), options)) return false;
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, val, options) {
      var attrs, method, xhr, attributes = this.attributes;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (key == null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options = _.extend({validate: true}, options);

      // If we're not waiting and attributes exist, save acts as
      // `set(attr).save(null, opts)` with validation. Otherwise, check if
      // the model will be valid when the attributes, if any, are set.
      if (attrs && !options.wait) {
        if (!this.set(attrs, options)) return false;
      } else {
        if (!this._validate(attrs, options)) return false;
      }

      // Set temporary attributes if `{wait: true}`.
      if (attrs && options.wait) {
        this.attributes = _.extend({}, attributes, attrs);
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        // Ensure attributes are restored during synchronous saves.
        model.attributes = attributes;
        var serverAttrs = model.parse(resp, options);
        if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
        if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
          return false;
        }
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);

      method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
      if (method === 'patch') options.attrs = attrs;
      xhr = this.sync(method, this, options);

      // Restore attributes.
      if (attrs && options.wait) this.attributes = attributes;

      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      var destroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      options.success = function(resp) {
        if (options.wait || model.isNew()) destroy();
        if (success) success(model, resp, options);
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      if (this.isNew()) {
        options.success();
        return false;
      }
      wrapError(this, options);

      var xhr = this.sync('delete', this, options);
      if (!options.wait) destroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base =
        _.result(this, 'urlRoot') ||
        _.result(this.collection, 'url') ||
        urlError();
      if (this.isNew()) return base;
      return base.replace(/([^\/])$/, '$1/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return !this.has(this.idAttribute);
    },

    // Check if the model is currently in a valid state.
    isValid: function(options) {
      return this._validate({}, _.extend(options || {}, { validate: true }));
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationError = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, _.extend(options, {validationError: error}));
      return false;
    }

  });

  // Underscore methods that we want to implement on the Model.
  var modelMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit'];

  // Mix in each Underscore method as a proxy to `Model#attributes`.
  _.each(modelMethods, function(method) {
    Model.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.attributes);
      return _[method].apply(_, args);
    };
  });

  // Backbone.Collection
  // -------------------

  // If models tend to represent a single row of data, a Backbone Collection is
  // more analagous to a table full of data ... or a small slice or page of that
  // table, or a collection of rows that belong together for a particular reason
  // -- all of the messages in this particular folder, all of the documents
  // belonging to this particular author, and so on. Collections maintain
  // indexes of their models, both in order, and for lookup by `id`.

  // Create a new **Collection**, perhaps to contain a specific type of `model`.
  // If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, _.extend({silent: true}, options));
  };

  // Default options for `Collection#set`.
  var setOptions = {add: true, remove: true, merge: true};
  var addOptions = {add: true, remove: false};

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model){ return model.toJSON(options); });
    },

    // Proxy `Backbone.sync` by default.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Add a model, or list of models to the set.
    add: function(models, options) {
      return this.set(models, _.extend({merge: false}, options, addOptions));
    },

    // Remove a model, or a list of models from the set.
    remove: function(models, options) {
      var singular = !_.isArray(models);
      models = singular ? [models] : _.clone(models);
      options || (options = {});
      var i, l, index, model;
      for (i = 0, l = models.length; i < l; i++) {
        model = models[i] = this.get(models[i]);
        if (!model) continue;
        delete this._byId[model.id];
        delete this._byId[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model, options);
      }
      return singular ? models[0] : models;
    },

    // Update a collection by `set`-ing a new list of models, adding new ones,
    // removing models that are no longer present, and merging models that
    // already exist in the collection, as necessary. Similar to **Model#set**,
    // the core operation for updating the data contained by the collection.
    set: function(models, options) {
      options = _.defaults({}, options, setOptions);
      if (options.parse) models = this.parse(models, options);
      var singular = !_.isArray(models);
      models = singular ? (models ? [models] : []) : _.clone(models);
      var i, l, id, model, attrs, existing, sort;
      var at = options.at;
      var targetModel = this.model;
      var sortable = this.comparator && (at == null) && options.sort !== false;
      var sortAttr = _.isString(this.comparator) ? this.comparator : null;
      var toAdd = [], toRemove = [], modelMap = {};
      var add = options.add, merge = options.merge, remove = options.remove;
      var order = !sortable && add && remove ? [] : false;

      // Turn bare objects into model references, and prevent invalid models
      // from being added.
      for (i = 0, l = models.length; i < l; i++) {
        attrs = models[i] || {};
        if (attrs instanceof Model) {
          id = model = attrs;
        } else {
          id = attrs[targetModel.prototype.idAttribute || 'id'];
        }

        // If a duplicate is found, prevent it from being added and
        // optionally merge it into the existing model.
        if (existing = this.get(id)) {
          if (remove) modelMap[existing.cid] = true;
          if (merge) {
            attrs = attrs === model ? model.attributes : attrs;
            if (options.parse) attrs = existing.parse(attrs, options);
            existing.set(attrs, options);
            if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
          }
          models[i] = existing;

        // If this is a new, valid model, push it to the `toAdd` list.
        } else if (add) {
          model = models[i] = this._prepareModel(attrs, options);
          if (!model) continue;
          toAdd.push(model);
          this._addReference(model, options);
        }

        // Do not add multiple models with the same `id`.
        model = existing || model;
        if (order && (model.isNew() || !modelMap[model.id])) order.push(model);
        modelMap[model.id] = true;
      }

      // Remove nonexistent models if appropriate.
      if (remove) {
        for (i = 0, l = this.length; i < l; ++i) {
          if (!modelMap[(model = this.models[i]).cid]) toRemove.push(model);
        }
        if (toRemove.length) this.remove(toRemove, options);
      }

      // See if sorting is needed, update `length` and splice in new models.
      if (toAdd.length || (order && order.length)) {
        if (sortable) sort = true;
        this.length += toAdd.length;
        if (at != null) {
          for (i = 0, l = toAdd.length; i < l; i++) {
            this.models.splice(at + i, 0, toAdd[i]);
          }
        } else {
          if (order) this.models.length = 0;
          var orderedModels = order || toAdd;
          for (i = 0, l = orderedModels.length; i < l; i++) {
            this.models.push(orderedModels[i]);
          }
        }
      }

      // Silently sort the collection if appropriate.
      if (sort) this.sort({silent: true});

      // Unless silenced, it's time to fire all appropriate add/sort events.
      if (!options.silent) {
        for (i = 0, l = toAdd.length; i < l; i++) {
          (model = toAdd[i]).trigger('add', model, this, options);
        }
        if (sort || (order && order.length)) this.trigger('sort', this, options);
      }

      // Return the added (or merged) model (or models).
      return singular ? models[0] : models;
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any granular `add` or `remove` events. Fires `reset` when finished.
    // Useful for bulk operations and optimizations.
    reset: function(models, options) {
      options || (options = {});
      for (var i = 0, l = this.models.length; i < l; i++) {
        this._removeReference(this.models[i], options);
      }
      options.previousModels = this.models;
      this._reset();
      models = this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return models;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      return this.add(model, _.extend({at: this.length}, options));
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      this.remove(model, options);
      return model;
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      return this.add(model, _.extend({at: 0}, options));
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      this.remove(model, options);
      return model;
    },

    // Slice out a sub-array of models from the collection.
    slice: function() {
      return slice.apply(this.models, arguments);
    },

    // Get a model from the set by id.
    get: function(obj) {
      if (obj == null) return void 0;
      return this._byId[obj] || this._byId[obj.id] || this._byId[obj.cid];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of
    // `filter`.
    where: function(attrs, first) {
      if (_.isEmpty(attrs)) return first ? void 0 : [];
      return this[first ? 'find' : 'filter'](function(model) {
        for (var key in attrs) {
          if (attrs[key] !== model.get(key)) return false;
        }
        return true;
      });
    },

    // Return the first model with matching attributes. Useful for simple cases
    // of `find`.
    findWhere: function(attrs) {
      return this.where(attrs, true);
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      options || (options = {});

      // Run sort based on type of `comparator`.
      if (_.isString(this.comparator) || this.comparator.length === 1) {
        this.models = this.sortBy(this.comparator, this);
      } else {
        this.models.sort(_.bind(this.comparator, this));
      }

      if (!options.silent) this.trigger('sort', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return _.invoke(this.models, 'get', attr);
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `reset: true` is passed, the response
    // data will be passed through the `reset` method instead of `set`.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        collection[method](resp, options);
        if (success) success(collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      if (!(model = this._prepareModel(model, options))) return false;
      if (!options.wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(model, resp) {
        if (options.wait) collection.add(model, options);
        if (success) success(model, resp, options);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new collection with an identical list of models as this one.
    clone: function() {
      return new this.constructor(this.models);
    },

    // Private method to reset all internal state. Called when the collection
    // is first initialized or reset.
    _reset: function() {
      this.length = 0;
      this.models = [];
      this._byId  = {};
    },

    // Prepare a hash of attributes (or other model) to be added to this
    // collection.
    _prepareModel: function(attrs, options) {
      if (attrs instanceof Model) return attrs;
      options = options ? _.clone(options) : {};
      options.collection = this;
      var model = new this.model(attrs, options);
      if (!model.validationError) return model;
      this.trigger('invalid', this, model.validationError, options);
      return false;
    },

    // Internal method to create a model's ties to a collection.
    _addReference: function(model, options) {
      this._byId[model.cid] = model;
      if (model.id != null) this._byId[model.id] = model;
      if (!model.collection) model.collection = this;
      model.on('all', this._onModelEvent, this);
    },

    // Internal method to sever a model's ties to a collection.
    _removeReference: function(model, options) {
      if (this === model.collection) delete model.collection;
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if ((event === 'add' || event === 'remove') && collection !== this) return;
      if (event === 'destroy') this.remove(model, options);
      if (model && event === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        if (model.id != null) this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  // 90% of the core usefulness of Backbone Collections is actually implemented
  // right here:
  var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
    'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
    'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
    'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
    'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',
    'lastIndexOf', 'isEmpty', 'chain', 'sample'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Collection.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.models);
      return _[method].apply(_, args);
    };
  });

  // Underscore methods that take a property name as an argument.
  var attributeMethods = ['groupBy', 'countBy', 'sortBy', 'indexBy'];

  // Use attributes instead of properties.
  _.each(attributeMethods, function(method) {
    Collection.prototype[method] = function(value, context) {
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _[method](this.models, iterator, context);
    };
  });

  // Backbone.View
  // -------------

  // Backbone Views are almost more convention than they are actual code. A View
  // is simply a JavaScript object that represents a logical chunk of UI in the
  // DOM. This might be a single item, an entire list, a sidebar or panel, or
  // even the surrounding frame which wraps your whole app. Defining a chunk of
  // UI as a **View** allows you to define your DOM events declaratively, without
  // having to worry about render order ... and makes it easy for the view to
  // react to specific changes in the state of your models.

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    options || (options = {});
    _.extend(this, _.pick(options, viewOptions));
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be preferred to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable Backbone.Events listeners.
    remove: function() {
      this.$el.remove();
      this.stopListening();
      return this;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      if (this.$el) this.undelegateEvents();
      this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = _.result(this, 'events')))) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) continue;

        var match = key.match(delegateEventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.on(eventName, method);
        } else {
          this.$el.on(eventName, selector, method);
        }
      }
      return this;
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.off('.delegateEvents' + this.cid);
      return this;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        var $el = Backbone.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
        this.setElement($el, false);
      } else {
        this.setElement(_.result(this, 'el'), false);
      }
    }

  });

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON
    });

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    // If we're sending a `PATCH` request, and we're in an old Internet Explorer
    // that still has ActiveX enabled by default, override jQuery to use that
    // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
    if (params.type === 'PATCH' && noXhrPatch) {
      params.xhr = function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
      };
    }

    // Make the request, allowing the user to override any Ajax options.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  var noXhrPatch =
    typeof window !== 'undefined' && !!window.ActiveXObject &&
      !(window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent);

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch':  'PATCH',
    'delete': 'DELETE',
    'read':   'GET'
  };

  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
  // Override this if you'd like to use a different library.
  Backbone.ajax = function() {
    return Backbone.$.ajax.apply(Backbone.$, arguments);
  };

  // Backbone.Router
  // ---------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        router.execute(callback, args);
        router.trigger.apply(router, ['route:' + name].concat(args));
        router.trigger('route', name, args);
        Backbone.history.trigger('route', router, name, args);
      });
      return this;
    },

    // Execute a route handler with the provided parameters.  This is an
    // excellent place to do pre-route setup or post-route cleanup.
    execute: function(callback, args) {
      if (callback) callback.apply(this, args);
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
      return this;
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      this.routes = _.result(this, 'routes');
      var route, routes = _.keys(this.routes);
      while ((route = routes.pop()) != null) {
        this.route(route, this.routes[route]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional) {
                     return optional ? match : '([^/?]+)';
                   })
                   .replace(splatParam, '([^?]*?)');
      return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param, i) {
        // Don't decode the search params.
        if (i === params.length - 1) return param || null;
        return param ? decodeURIComponent(param) : null;
      });
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on either
  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
  // and URL fragments. If the browser supports neither (old IE, natch),
  // falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');

    // Ensure that `History` can be used outside of the browser.
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  };

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Cached regex for removing a trailing slash.
  var trailingSlash = /\/$/;

  // Cached regex for stripping urls of hash.
  var pathStripper = /#.*$/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Are we at the app root?
    atRoot: function() {
      return this.location.pathname.replace(/[^\/]$/, '$&/') === this.root;
    },

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || !this._wantsHashChange || forcePushState) {
          fragment = decodeURI(this.location.pathname + this.location.search);
          var root = this.root.replace(trailingSlash, '');
          if (!fragment.indexOf(root)) fragment = fragment.slice(root.length);
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error("Backbone.history has already been started");
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && this.history && this.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      if (oldIE && this._wantsHashChange) {
        var frame = Backbone.$('<iframe src="javascript:0" tabindex="-1">');
        this.iframe = frame.hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        Backbone.$(window).on('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        Backbone.$(window).on('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = this.location;

      // Transition from hashChange to pushState or vice versa if both are
      // requested.
      if (this._wantsHashChange && this._wantsPushState) {

        // If we've started off with a route from a `pushState`-enabled
        // browser, but we're currently in a browser that doesn't support it...
        if (!this._hasPushState && !this.atRoot()) {
          this.fragment = this.getFragment(null, true);
          this.location.replace(this.root + '#' + this.fragment);
          // Return immediately as browser will do redirect to new url
          return true;

        // Or if we've started out with a hash-based route, but we're currently
        // in a browser where it could be `pushState`-based instead...
        } else if (this._hasPushState && this.atRoot() && loc.hash) {
          this.fragment = this.getHash().replace(routeStripper, '');
          this.history.replaceState({}, document.title, this.root + this.fragment);
        }

      }

      if (!this.options.silent) return this.loadUrl();
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      Backbone.$(window).off('popstate', this.checkUrl).off('hashchange', this.checkUrl);
      if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current === this.fragment && this.iframe) {
        current = this.getFragment(this.getHash(this.iframe));
      }
      if (current === this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl();
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragment) {
      fragment = this.fragment = this.getFragment(fragment);
      return _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: !!options};

      var url = this.root + (fragment = this.getFragment(fragment || ''));

      // Strip the hash for matching.
      fragment = fragment.replace(pathStripper, '');

      if (this.fragment === fragment) return;
      this.fragment = fragment;

      // Don't include a trailing slash on the root.
      if (fragment === '' && url !== '/') url = url.slice(0, -1);

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a
          // history entry on hash-tag change.  When replace is true, we don't
          // want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, fragment, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
      }
      if (options.trigger) return this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // Some browsers require that `hash` contains a leading #.
        location.hash = '#' + fragment;
      }
    }

  });

  // Create the default Backbone.history.
  Backbone.history = new History;

  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set up inheritance for the model, collection, router, view and history.
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error(model, resp, options);
      model.trigger('error', model, resp, options);
    };
  };

  return Backbone;

}));;/*!
* Bootstrap.js by @fat & @mdo
* Copyright 2013 Twitter, Inc.
* http://www.apache.org/licenses/LICENSE-2.0.txt
*/
!function(e){"use strict";e(function(){e.support.transition=function(){var e=function(){var e=document.createElement("bootstrap"),t={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"},n;for(n in t)if(e.style[n]!==undefined)return t[n]}();return e&&{end:e}}()})}(window.jQuery),!function(e){"use strict";var t='[data-dismiss="alert"]',n=function(n){e(n).on("click",t,this.close)};n.prototype.close=function(t){function s(){i.trigger("closed").remove()}var n=e(this),r=n.attr("data-target"),i;r||(r=n.attr("href"),r=r&&r.replace(/.*(?=#[^\s]*$)/,"")),i=e(r),t&&t.preventDefault(),i.length||(i=n.hasClass("alert")?n:n.parent()),i.trigger(t=e.Event("close"));if(t.isDefaultPrevented())return;i.removeClass("in"),e.support.transition&&i.hasClass("fade")?i.on(e.support.transition.end,s):s()};var r=e.fn.alert;e.fn.alert=function(t){return this.each(function(){var r=e(this),i=r.data("alert");i||r.data("alert",i=new n(this)),typeof t=="string"&&i[t].call(r)})},e.fn.alert.Constructor=n,e.fn.alert.noConflict=function(){return e.fn.alert=r,this},e(document).on("click.alert.data-api",t,n.prototype.close)}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.options=e.extend({},e.fn.button.defaults,n)};t.prototype.setState=function(e){var t="disabled",n=this.$element,r=n.data(),i=n.is("input")?"val":"html";e+="Text",r.resetText||n.data("resetText",n[i]()),n[i](r[e]||this.options[e]),setTimeout(function(){e=="loadingText"?n.addClass(t).attr(t,t):n.removeClass(t).removeAttr(t)},0)},t.prototype.toggle=function(){var e=this.$element.closest('[data-toggle="buttons-radio"]');e&&e.find(".active").removeClass("active"),this.$element.toggleClass("active")};var n=e.fn.button;e.fn.button=function(n){return this.each(function(){var r=e(this),i=r.data("button"),s=typeof n=="object"&&n;i||r.data("button",i=new t(this,s)),n=="toggle"?i.toggle():n&&i.setState(n)})},e.fn.button.defaults={loadingText:"loading..."},e.fn.button.Constructor=t,e.fn.button.noConflict=function(){return e.fn.button=n,this},e(document).on("click.button.data-api","[data-toggle^=button]",function(t){var n=e(t.target);n.hasClass("btn")||(n=n.closest(".btn")),n.button("toggle")})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.$indicators=this.$element.find(".carousel-indicators"),this.options=n,this.options.pause=="hover"&&this.$element.on("mouseenter",e.proxy(this.pause,this)).on("mouseleave",e.proxy(this.cycle,this))};t.prototype={cycle:function(t){return t||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(e.proxy(this.next,this),this.options.interval)),this},getActiveIndex:function(){return this.$active=this.$element.find(".item.active"),this.$items=this.$active.parent().children(),this.$items.index(this.$active)},to:function(t){var n=this.getActiveIndex(),r=this;if(t>this.$items.length-1||t<0)return;return this.sliding?this.$element.one("slid",function(){r.to(t)}):n==t?this.pause().cycle():this.slide(t>n?"next":"prev",e(this.$items[t]))},pause:function(t){return t||(this.paused=!0),this.$element.find(".next, .prev").length&&e.support.transition.end&&(this.$element.trigger(e.support.transition.end),this.cycle(!0)),clearInterval(this.interval),this.interval=null,this},next:function(){if(this.sliding)return;return this.slide("next")},prev:function(){if(this.sliding)return;return this.slide("prev")},slide:function(t,n){var r=this.$element.find(".item.active"),i=n||r[t](),s=this.interval,o=t=="next"?"left":"right",u=t=="next"?"first":"last",a=this,f;this.sliding=!0,s&&this.pause(),i=i.length?i:this.$element.find(".item")[u](),f=e.Event("slide",{relatedTarget:i[0],direction:o});if(i.hasClass("active"))return;this.$indicators.length&&(this.$indicators.find(".active").removeClass("active"),this.$element.one("slid",function(){var t=e(a.$indicators.children()[a.getActiveIndex()]);t&&t.addClass("active")}));if(e.support.transition&&this.$element.hasClass("slide")){this.$element.trigger(f);if(f.isDefaultPrevented())return;i.addClass(t),i[0].offsetWidth,r.addClass(o),i.addClass(o),this.$element.one(e.support.transition.end,function(){i.removeClass([t,o].join(" ")).addClass("active"),r.removeClass(["active",o].join(" ")),a.sliding=!1,setTimeout(function(){a.$element.trigger("slid")},0)})}else{this.$element.trigger(f);if(f.isDefaultPrevented())return;r.removeClass("active"),i.addClass("active"),this.sliding=!1,this.$element.trigger("slid")}return s&&this.cycle(),this}};var n=e.fn.carousel;e.fn.carousel=function(n){return this.each(function(){var r=e(this),i=r.data("carousel"),s=e.extend({},e.fn.carousel.defaults,typeof n=="object"&&n),o=typeof n=="string"?n:s.slide;i||r.data("carousel",i=new t(this,s)),typeof n=="number"?i.to(n):o?i[o]():s.interval&&i.pause().cycle()})},e.fn.carousel.defaults={interval:5e3,pause:"hover"},e.fn.carousel.Constructor=t,e.fn.carousel.noConflict=function(){return e.fn.carousel=n,this},e(document).on("click.carousel.data-api","[data-slide], [data-slide-to]",function(t){var n=e(this),r,i=e(n.attr("data-target")||(r=n.attr("href"))&&r.replace(/.*(?=#[^\s]+$)/,"")),s=e.extend({},i.data(),n.data()),o;i.carousel(s),(o=n.attr("data-slide-to"))&&i.data("carousel").pause().to(o).cycle(),t.preventDefault()})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.options=e.extend({},e.fn.collapse.defaults,n),this.options.parent&&(this.$parent=e(this.options.parent)),this.options.toggle&&this.toggle()};t.prototype={constructor:t,dimension:function(){var e=this.$element.hasClass("width");return e?"width":"height"},show:function(){var t,n,r,i;if(this.transitioning||this.$element.hasClass("in"))return;t=this.dimension(),n=e.camelCase(["scroll",t].join("-")),r=this.$parent&&this.$parent.find("> .accordion-group > .in");if(r&&r.length){i=r.data("collapse");if(i&&i.transitioning)return;r.collapse("hide"),i||r.data("collapse",null)}this.$element[t](0),this.transition("addClass",e.Event("show"),"shown"),e.support.transition&&this.$element[t](this.$element[0][n])},hide:function(){var t;if(this.transitioning||!this.$element.hasClass("in"))return;t=this.dimension(),this.reset(this.$element[t]()),this.transition("removeClass",e.Event("hide"),"hidden"),this.$element[t](0)},reset:function(e){var t=this.dimension();return this.$element.removeClass("collapse")[t](e||"auto")[0].offsetWidth,this.$element[e!==null?"addClass":"removeClass"]("collapse"),this},transition:function(t,n,r){var i=this,s=function(){n.type=="show"&&i.reset(),i.transitioning=0,i.$element.trigger(r)};this.$element.trigger(n);if(n.isDefaultPrevented())return;this.transitioning=1,this.$element[t]("in"),e.support.transition&&this.$element.hasClass("collapse")?this.$element.one(e.support.transition.end,s):s()},toggle:function(){this[this.$element.hasClass("in")?"hide":"show"]()}};var n=e.fn.collapse;e.fn.collapse=function(n){return this.each(function(){var r=e(this),i=r.data("collapse"),s=e.extend({},e.fn.collapse.defaults,r.data(),typeof n=="object"&&n);i||r.data("collapse",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.collapse.defaults={toggle:!0},e.fn.collapse.Constructor=t,e.fn.collapse.noConflict=function(){return e.fn.collapse=n,this},e(document).on("click.collapse.data-api","[data-toggle=collapse]",function(t){var n=e(this),r,i=n.attr("data-target")||t.preventDefault()||(r=n.attr("href"))&&r.replace(/.*(?=#[^\s]+$)/,""),s=e(i).data("collapse")?"toggle":n.data();n[e(i).hasClass("in")?"addClass":"removeClass"]("collapsed"),e(i).collapse(s)})}(window.jQuery),!function(e){"use strict";function r(){e(".dropdown-backdrop").remove(),e(t).each(function(){i(e(this)).removeClass("open")})}function i(t){var n=t.attr("data-target"),r;n||(n=t.attr("href"),n=n&&/#/.test(n)&&n.replace(/.*(?=#[^\s]*$)/,"")),r=n&&e(n);if(!r||!r.length)r=t.parent();return r}var t="[data-toggle=dropdown]",n=function(t){var n=e(t).on("click.dropdown.data-api",this.toggle);e("html").on("click.dropdown.data-api",function(){n.parent().removeClass("open")})};n.prototype={constructor:n,toggle:function(t){var n=e(this),s,o;if(n.is(".disabled, :disabled"))return;return s=i(n),o=s.hasClass("open"),r(),o||("ontouchstart"in document.documentElement&&e('<div class="dropdown-backdrop"/>').insertBefore(e(this)).on("click",r),s.toggleClass("open")),n.focus(),!1},keydown:function(n){var r,s,o,u,a,f;if(!/(38|40|27)/.test(n.keyCode))return;r=e(this),n.preventDefault(),n.stopPropagation();if(r.is(".disabled, :disabled"))return;u=i(r),a=u.hasClass("open");if(!a||a&&n.keyCode==27)return n.which==27&&u.find(t).focus(),r.click();s=e("[role=menu] li:not(.divider):visible a",u);if(!s.length)return;f=s.index(s.filter(":focus")),n.keyCode==38&&f>0&&f--,n.keyCode==40&&f<s.length-1&&f++,~f||(f=0),s.eq(f).focus()}};var s=e.fn.dropdown;e.fn.dropdown=function(t){return this.each(function(){var r=e(this),i=r.data("dropdown");i||r.data("dropdown",i=new n(this)),typeof t=="string"&&i[t].call(r)})},e.fn.dropdown.Constructor=n,e.fn.dropdown.noConflict=function(){return e.fn.dropdown=s,this},e(document).on("click.dropdown.data-api",r).on("click.dropdown.data-api",".dropdown form",function(e){e.stopPropagation()}).on("click.dropdown.data-api",t,n.prototype.toggle).on("keydown.dropdown.data-api",t+", [role=menu]",n.prototype.keydown)}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.options=n,this.$element=e(t).delegate('[data-dismiss="modal"]',"click.dismiss.modal",e.proxy(this.hide,this)),this.options.remote&&this.$element.find(".modal-body").load(this.options.remote)};t.prototype={constructor:t,toggle:function(){return this[this.isShown?"hide":"show"]()},show:function(){var t=this,n=e.Event("show");this.$element.trigger(n);if(this.isShown||n.isDefaultPrevented())return;this.isShown=!0,this.escape(),this.backdrop(function(){var n=e.support.transition&&t.$element.hasClass("fade");t.$element.parent().length||t.$element.appendTo(document.body),t.$element.show(),n&&t.$element[0].offsetWidth,t.$element.addClass("in").attr("aria-hidden",!1),t.enforceFocus(),n?t.$element.one(e.support.transition.end,function(){t.$element.focus().trigger("shown")}):t.$element.focus().trigger("shown")})},hide:function(t){t&&t.preventDefault();var n=this;t=e.Event("hide"),this.$element.trigger(t);if(!this.isShown||t.isDefaultPrevented())return;this.isShown=!1,this.escape(),e(document).off("focusin.modal"),this.$element.removeClass("in").attr("aria-hidden",!0),e.support.transition&&this.$element.hasClass("fade")?this.hideWithTransition():this.hideModal()},enforceFocus:function(){var t=this;e(document).on("focusin.modal",function(e){t.$element[0]!==e.target&&!t.$element.has(e.target).length&&t.$element.focus()})},escape:function(){var e=this;this.isShown&&this.options.keyboard?this.$element.on("keyup.dismiss.modal",function(t){t.which==27&&e.hide()}):this.isShown||this.$element.off("keyup.dismiss.modal")},hideWithTransition:function(){var t=this,n=setTimeout(function(){t.$element.off(e.support.transition.end),t.hideModal()},500);this.$element.one(e.support.transition.end,function(){clearTimeout(n),t.hideModal()})},hideModal:function(){var e=this;this.$element.hide(),this.backdrop(function(){e.removeBackdrop(),e.$element.trigger("hidden")})},removeBackdrop:function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},backdrop:function(t){var n=this,r=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var i=e.support.transition&&r;this.$backdrop=e('<div class="modal-backdrop '+r+'" />').appendTo(document.body),this.$backdrop.click(this.options.backdrop=="static"?e.proxy(this.$element[0].focus,this.$element[0]):e.proxy(this.hide,this)),i&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in");if(!t)return;i?this.$backdrop.one(e.support.transition.end,t):t()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),e.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(e.support.transition.end,t):t()):t&&t()}};var n=e.fn.modal;e.fn.modal=function(n){return this.each(function(){var r=e(this),i=r.data("modal"),s=e.extend({},e.fn.modal.defaults,r.data(),typeof n=="object"&&n);i||r.data("modal",i=new t(this,s)),typeof n=="string"?i[n]():s.show&&i.show()})},e.fn.modal.defaults={backdrop:!0,keyboard:!0,show:!0},e.fn.modal.Constructor=t,e.fn.modal.noConflict=function(){return e.fn.modal=n,this},e(document).on("click.modal.data-api",'[data-toggle="modal"]',function(t){var n=e(this),r=n.attr("href"),i=e(n.attr("data-target")||r&&r.replace(/.*(?=#[^\s]+$)/,"")),s=i.data("modal")?"toggle":e.extend({remote:!/#/.test(r)&&r},i.data(),n.data());t.preventDefault(),i.modal(s).one("hide",function(){n.focus()})})}(window.jQuery),!function(e){"use strict";var t=function(e,t){this.init("tooltip",e,t)};t.prototype={constructor:t,init:function(t,n,r){var i,s,o,u,a;this.type=t,this.$element=e(n),this.options=this.getOptions(r),this.enabled=!0,o=this.options.trigger.split(" ");for(a=o.length;a--;)u=o[a],u=="click"?this.$element.on("click."+this.type,this.options.selector,e.proxy(this.toggle,this)):u!="manual"&&(i=u=="hover"?"mouseenter":"focus",s=u=="hover"?"mouseleave":"blur",this.$element.on(i+"."+this.type,this.options.selector,e.proxy(this.enter,this)),this.$element.on(s+"."+this.type,this.options.selector,e.proxy(this.leave,this)));this.options.selector?this._options=e.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},getOptions:function(t){return t=e.extend({},e.fn[this.type].defaults,this.$element.data(),t),t.delay&&typeof t.delay=="number"&&(t.delay={show:t.delay,hide:t.delay}),t},enter:function(t){var n=e.fn[this.type].defaults,r={},i;this._options&&e.each(this._options,function(e,t){n[e]!=t&&(r[e]=t)},this),i=e(t.currentTarget)[this.type](r).data(this.type);if(!i.options.delay||!i.options.delay.show)return i.show();clearTimeout(this.timeout),i.hoverState="in",this.timeout=setTimeout(function(){i.hoverState=="in"&&i.show()},i.options.delay.show)},leave:function(t){var n=e(t.currentTarget)[this.type](this._options).data(this.type);this.timeout&&clearTimeout(this.timeout);if(!n.options.delay||!n.options.delay.hide)return n.hide();n.hoverState="out",this.timeout=setTimeout(function(){n.hoverState=="out"&&n.hide()},n.options.delay.hide)},show:function(){var t,n,r,i,s,o,u=e.Event("show");if(this.hasContent()&&this.enabled){this.$element.trigger(u);if(u.isDefaultPrevented())return;t=this.tip(),this.setContent(),this.options.animation&&t.addClass("fade"),s=typeof this.options.placement=="function"?this.options.placement.call(this,t[0],this.$element[0]):this.options.placement,t.detach().css({top:0,left:0,display:"block"}),this.options.container?t.appendTo(this.options.container):t.insertAfter(this.$element),n=this.getPosition(),r=t[0].offsetWidth,i=t[0].offsetHeight;switch(s){case"bottom":o={top:n.top+n.height,left:n.left+n.width/2-r/2};break;case"top":o={top:n.top-i,left:n.left+n.width/2-r/2};break;case"left":o={top:n.top+n.height/2-i/2,left:n.left-r};break;case"right":o={top:n.top+n.height/2-i/2,left:n.left+n.width}}this.applyPlacement(o,s),this.$element.trigger("shown")}},applyPlacement:function(e,t){var n=this.tip(),r=n[0].offsetWidth,i=n[0].offsetHeight,s,o,u,a;n.offset(e).addClass(t).addClass("in"),s=n[0].offsetWidth,o=n[0].offsetHeight,t=="top"&&o!=i&&(e.top=e.top+i-o,a=!0),t=="bottom"||t=="top"?(u=0,e.left<0&&(u=e.left*-2,e.left=0,n.offset(e),s=n[0].offsetWidth,o=n[0].offsetHeight),this.replaceArrow(u-r+s,s,"left")):this.replaceArrow(o-i,o,"top"),a&&n.offset(e)},replaceArrow:function(e,t,n){this.arrow().css(n,e?50*(1-e/t)+"%":"")},setContent:function(){var e=this.tip(),t=this.getTitle();e.find(".tooltip-inner")[this.options.html?"html":"text"](t),e.removeClass("fade in top bottom left right")},hide:function(){function i(){var t=setTimeout(function(){n.off(e.support.transition.end).detach()},500);n.one(e.support.transition.end,function(){clearTimeout(t),n.detach()})}var t=this,n=this.tip(),r=e.Event("hide");this.$element.trigger(r);if(r.isDefaultPrevented())return;return n.removeClass("in"),e.support.transition&&this.$tip.hasClass("fade")?i():n.detach(),this.$element.trigger("hidden"),this},fixTitle:function(){var e=this.$element;(e.attr("title")||typeof e.attr("data-original-title")!="string")&&e.attr("data-original-title",e.attr("title")||"").attr("title","")},hasContent:function(){return this.getTitle()},getPosition:function(){var t=this.$element[0];return e.extend({},typeof t.getBoundingClientRect=="function"?t.getBoundingClientRect():{width:t.offsetWidth,height:t.offsetHeight},this.$element.offset())},getTitle:function(){var e,t=this.$element,n=this.options;return e=t.attr("data-original-title")||(typeof n.title=="function"?n.title.call(t[0]):n.title),e},tip:function(){return this.$tip=this.$tip||e(this.options.template)},arrow:function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},validate:function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},enable:function(){this.enabled=!0},disable:function(){this.enabled=!1},toggleEnabled:function(){this.enabled=!this.enabled},toggle:function(t){var n=t?e(t.currentTarget)[this.type](this._options).data(this.type):this;n.tip().hasClass("in")?n.hide():n.show()},destroy:function(){this.hide().$element.off("."+this.type).removeData(this.type)}};var n=e.fn.tooltip;e.fn.tooltip=function(n){return this.each(function(){var r=e(this),i=r.data("tooltip"),s=typeof n=="object"&&n;i||r.data("tooltip",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.tooltip.Constructor=t,e.fn.tooltip.defaults={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1},e.fn.tooltip.noConflict=function(){return e.fn.tooltip=n,this}}(window.jQuery),!function(e){"use strict";var t=function(e,t){this.init("popover",e,t)};t.prototype=e.extend({},e.fn.tooltip.Constructor.prototype,{constructor:t,setContent:function(){var e=this.tip(),t=this.getTitle(),n=this.getContent();e.find(".popover-title")[this.options.html?"html":"text"](t),e.find(".popover-content")[this.options.html?"html":"text"](n),e.removeClass("fade top bottom left right in")},hasContent:function(){return this.getTitle()||this.getContent()},getContent:function(){var e,t=this.$element,n=this.options;return e=(typeof n.content=="function"?n.content.call(t[0]):n.content)||t.attr("data-content"),e},tip:function(){return this.$tip||(this.$tip=e(this.options.template)),this.$tip},destroy:function(){this.hide().$element.off("."+this.type).removeData(this.type)}});var n=e.fn.popover;e.fn.popover=function(n){return this.each(function(){var r=e(this),i=r.data("popover"),s=typeof n=="object"&&n;i||r.data("popover",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.popover.Constructor=t,e.fn.popover.defaults=e.extend({},e.fn.tooltip.defaults,{placement:"right",trigger:"click",content:"",template:'<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),e.fn.popover.noConflict=function(){return e.fn.popover=n,this}}(window.jQuery),!function(e){"use strict";function t(t,n){var r=e.proxy(this.process,this),i=e(t).is("body")?e(window):e(t),s;this.options=e.extend({},e.fn.scrollspy.defaults,n),this.$scrollElement=i.on("scroll.scroll-spy.data-api",r),this.selector=(this.options.target||(s=e(t).attr("href"))&&s.replace(/.*(?=#[^\s]+$)/,"")||"")+" .nav li > a",this.$body=e("body"),this.refresh(),this.process()}t.prototype={constructor:t,refresh:function(){var t=this,n;this.offsets=e([]),this.targets=e([]),n=this.$body.find(this.selector).map(function(){var n=e(this),r=n.data("target")||n.attr("href"),i=/^#\w/.test(r)&&e(r);return i&&i.length&&[[i.position().top+(!e.isWindow(t.$scrollElement.get(0))&&t.$scrollElement.scrollTop()),r]]||null}).sort(function(e,t){return e[0]-t[0]}).each(function(){t.offsets.push(this[0]),t.targets.push(this[1])})},process:function(){var e=this.$scrollElement.scrollTop()+this.options.offset,t=this.$scrollElement[0].scrollHeight||this.$body[0].scrollHeight,n=t-this.$scrollElement.height(),r=this.offsets,i=this.targets,s=this.activeTarget,o;if(e>=n)return s!=(o=i.last()[0])&&this.activate(o);for(o=r.length;o--;)s!=i[o]&&e>=r[o]&&(!r[o+1]||e<=r[o+1])&&this.activate(i[o])},activate:function(t){var n,r;this.activeTarget=t,e(this.selector).parent(".active").removeClass("active"),r=this.selector+'[data-target="'+t+'"],'+this.selector+'[href="'+t+'"]',n=e(r).parent("li").addClass("active"),n.parent(".dropdown-menu").length&&(n=n.closest("li.dropdown").addClass("active")),n.trigger("activate")}};var n=e.fn.scrollspy;e.fn.scrollspy=function(n){return this.each(function(){var r=e(this),i=r.data("scrollspy"),s=typeof n=="object"&&n;i||r.data("scrollspy",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.scrollspy.Constructor=t,e.fn.scrollspy.defaults={offset:10},e.fn.scrollspy.noConflict=function(){return e.fn.scrollspy=n,this},e(window).on("load",function(){e('[data-spy="scroll"]').each(function(){var t=e(this);t.scrollspy(t.data())})})}(window.jQuery),!function(e){"use strict";var t=function(t){this.element=e(t)};t.prototype={constructor:t,show:function(){var t=this.element,n=t.closest("ul:not(.dropdown-menu)"),r=t.attr("data-target"),i,s,o;r||(r=t.attr("href"),r=r&&r.replace(/.*(?=#[^\s]*$)/,""));if(t.parent("li").hasClass("active"))return;i=n.find(".active:last a")[0],o=e.Event("show",{relatedTarget:i}),t.trigger(o);if(o.isDefaultPrevented())return;s=e(r),this.activate(t.parent("li"),n),this.activate(s,s.parent(),function(){t.trigger({type:"shown",relatedTarget:i})})},activate:function(t,n,r){function o(){i.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),t.addClass("active"),s?(t[0].offsetWidth,t.addClass("in")):t.removeClass("fade"),t.parent(".dropdown-menu")&&t.closest("li.dropdown").addClass("active"),r&&r()}var i=n.find("> .active"),s=r&&e.support.transition&&i.hasClass("fade");s?i.one(e.support.transition.end,o):o(),i.removeClass("in")}};var n=e.fn.tab;e.fn.tab=function(n){return this.each(function(){var r=e(this),i=r.data("tab");i||r.data("tab",i=new t(this)),typeof n=="string"&&i[n]()})},e.fn.tab.Constructor=t,e.fn.tab.noConflict=function(){return e.fn.tab=n,this},e(document).on("click.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"]',function(t){t.preventDefault(),e(this).tab("show")})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.options=e.extend({},e.fn.typeahead.defaults,n),this.matcher=this.options.matcher||this.matcher,this.sorter=this.options.sorter||this.sorter,this.highlighter=this.options.highlighter||this.highlighter,this.updater=this.options.updater||this.updater,this.source=this.options.source,this.$menu=e(this.options.menu),this.shown=!1,this.listen()};t.prototype={constructor:t,select:function(){var e=this.$menu.find(".active").attr("data-value");return this.$element.val(this.updater(e)).change(),this.hide()},updater:function(e){return e},show:function(){var t=e.extend({},this.$element.position(),{height:this.$element[0].offsetHeight});return this.$menu.insertAfter(this.$element).css({top:t.top+t.height,left:t.left}).show(),this.shown=!0,this},hide:function(){return this.$menu.hide(),this.shown=!1,this},lookup:function(t){var n;return this.query=this.$element.val(),!this.query||this.query.length<this.options.minLength?this.shown?this.hide():this:(n=e.isFunction(this.source)?this.source(this.query,e.proxy(this.process,this)):this.source,n?this.process(n):this)},process:function(t){var n=this;return t=e.grep(t,function(e){return n.matcher(e)}),t=this.sorter(t),t.length?this.render(t.slice(0,this.options.items)).show():this.shown?this.hide():this},matcher:function(e){return~e.toLowerCase().indexOf(this.query.toLowerCase())},sorter:function(e){var t=[],n=[],r=[],i;while(i=e.shift())i.toLowerCase().indexOf(this.query.toLowerCase())?~i.indexOf(this.query)?n.push(i):r.push(i):t.push(i);return t.concat(n,r)},highlighter:function(e){var t=this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&");return e.replace(new RegExp("("+t+")","ig"),function(e,t){return"<strong>"+t+"</strong>"})},render:function(t){var n=this;return t=e(t).map(function(t,r){return t=e(n.options.item).attr("data-value",r),t.find("a").html(n.highlighter(r)),t[0]}),t.first().addClass("active"),this.$menu.html(t),this},next:function(t){var n=this.$menu.find(".active").removeClass("active"),r=n.next();r.length||(r=e(this.$menu.find("li")[0])),r.addClass("active")},prev:function(e){var t=this.$menu.find(".active").removeClass("active"),n=t.prev();n.length||(n=this.$menu.find("li").last()),n.addClass("active")},listen:function(){this.$element.on("focus",e.proxy(this.focus,this)).on("blur",e.proxy(this.blur,this)).on("keypress",e.proxy(this.keypress,this)).on("keyup",e.proxy(this.keyup,this)),this.eventSupported("keydown")&&this.$element.on("keydown",e.proxy(this.keydown,this)),this.$menu.on("click",e.proxy(this.click,this)).on("mouseenter","li",e.proxy(this.mouseenter,this)).on("mouseleave","li",e.proxy(this.mouseleave,this))},eventSupported:function(e){var t=e in this.$element;return t||(this.$element.setAttribute(e,"return;"),t=typeof this.$element[e]=="function"),t},move:function(e){if(!this.shown)return;switch(e.keyCode){case 9:case 13:case 27:e.preventDefault();break;case 38:e.preventDefault(),this.prev();break;case 40:e.preventDefault(),this.next()}e.stopPropagation()},keydown:function(t){this.suppressKeyPressRepeat=~e.inArray(t.keyCode,[40,38,9,13,27]),this.move(t)},keypress:function(e){if(this.suppressKeyPressRepeat)return;this.move(e)},keyup:function(e){switch(e.keyCode){case 40:case 38:case 16:case 17:case 18:break;case 9:case 13:if(!this.shown)return;this.select();break;case 27:if(!this.shown)return;this.hide();break;default:this.lookup()}e.stopPropagation(),e.preventDefault()},focus:function(e){this.focused=!0},blur:function(e){this.focused=!1,!this.mousedover&&this.shown&&this.hide()},click:function(e){e.stopPropagation(),e.preventDefault(),this.select(),this.$element.focus()},mouseenter:function(t){this.mousedover=!0,this.$menu.find(".active").removeClass("active"),e(t.currentTarget).addClass("active")},mouseleave:function(e){this.mousedover=!1,!this.focused&&this.shown&&this.hide()}};var n=e.fn.typeahead;e.fn.typeahead=function(n){return this.each(function(){var r=e(this),i=r.data("typeahead"),s=typeof n=="object"&&n;i||r.data("typeahead",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.typeahead.defaults={source:[],items:8,menu:'<ul class="typeahead dropdown-menu"></ul>',item:'<li><a href="#"></a></li>',minLength:1},e.fn.typeahead.Constructor=t,e.fn.typeahead.noConflict=function(){return e.fn.typeahead=n,this},e(document).on("focus.typeahead.data-api",'[data-provide="typeahead"]',function(t){var n=e(this);if(n.data("typeahead"))return;n.typeahead(n.data())})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.options=e.extend({},e.fn.affix.defaults,n),this.$window=e(window).on("scroll.affix.data-api",e.proxy(this.checkPosition,this)).on("click.affix.data-api",e.proxy(function(){setTimeout(e.proxy(this.checkPosition,this),1)},this)),this.$element=e(t),this.checkPosition()};t.prototype.checkPosition=function(){if(!this.$element.is(":visible"))return;var t=e(document).height(),n=this.$window.scrollTop(),r=this.$element.offset(),i=this.options.offset,s=i.bottom,o=i.top,u="affix affix-top affix-bottom",a;typeof i!="object"&&(s=o=i),typeof o=="function"&&(o=i.top()),typeof s=="function"&&(s=i.bottom()),a=this.unpin!=null&&n+this.unpin<=r.top?!1:s!=null&&r.top+this.$element.height()>=t-s?"bottom":o!=null&&n<=o?"top":!1;if(this.affixed===a)return;this.affixed=a,this.unpin=a=="bottom"?r.top-n:null,this.$element.removeClass(u).addClass("affix"+(a?"-"+a:""))};var n=e.fn.affix;e.fn.affix=function(n){return this.each(function(){var r=e(this),i=r.data("affix"),s=typeof n=="object"&&n;i||r.data("affix",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.affix.Constructor=t,e.fn.affix.defaults={offset:0},e.fn.affix.noConflict=function(){return e.fn.affix=n,this},e(window).on("load",function(){e('[data-spy="affix"]').each(function(){var t=e(this),n=t.data();n.offset=n.offset||{},n.offsetBottom&&(n.offset.bottom=n.offsetBottom),n.offsetTop&&(n.offset.top=n.offsetTop),t.affix(n)})})}(window.jQuery);;/*
 @preserve Leaflet Data Visualization Framework, a JavaScript library for creating thematic maps using Leaflet
 (c) 2013-2014, Scott Fairgrieve, HumanGeo
*/
L.LinearFunction = L.Class.extend({
    initialize: function(minPoint, maxPoint, options) {
        this.setOptions(options);
        this.setRange(minPoint, maxPoint);
    },
    _calculateParameters: function(minPoint, maxPoint) {
        if (this._xRange === 0) {
            this._slope = 0;
            this._b = minPoint.y;
        } else {
            this._slope = (maxPoint.y - minPoint.y) / this._xRange;
            this._b = minPoint.y - this._slope * minPoint.x;
        }
    },
    _arrayToPoint: function(array) {
        return {
            x: array[0],
            y: array[1]
        };
    },
    setOptions: function(options) {
        L.Util.setOptions(this, options);
        this._preProcess = this.options.preProcess;
        this._postProcess = this.options.postProcess;
    },
    getBounds: function() {
        var minX = Math.min(this._minPoint.x, this._maxPoint.x);
        var maxX = Math.max(this._minPoint.x, this._maxPoint.x);
        var minY = Math.min(this._minPoint.y, this._maxPoint.y);
        var maxY = Math.max(this._minPoint.y, this._maxPoint.y);
        return [ new L.Point(minX, minY), new L.Point(maxX, maxY) ];
    },
    setRange: function(minPoint, maxPoint) {
        minPoint = minPoint instanceof Array ? this._arrayToPoint(minPoint) : minPoint;
        maxPoint = maxPoint instanceof Array ? this._arrayToPoint(maxPoint) : maxPoint;
        this._minPoint = minPoint;
        this._maxPoint = maxPoint;
        this._xRange = maxPoint.x - minPoint.x;
        this._calculateParameters(minPoint, maxPoint);
        return this;
    },
    setMin: function(point) {
        this.setRange(point, this._maxPoint);
        return this;
    },
    setMax: function(point) {
        this.setRange(this._minPoint, point);
        return this;
    },
    setPreProcess: function(preProcess) {
        this._preProcess = preProcess;
        return this;
    },
    setPostProcess: function(postProcess) {
        this._postProcess = postProcess;
        return this;
    },
    evaluate: function(x) {
        var y;
        if (this._preProcess) {
            x = this._preProcess(x);
        }
        y = Number((this._slope * x).toFixed(6)) + Number(this._b.toFixed(6));
        if (this._postProcess) {
            y = this._postProcess(y);
        }
        return y;
    },
    random: function() {
        var randomX = Math.random() * this._xRange + this._minPoint.x;
        return this.evaluate(randomX);
    },
    sample: function(count) {
        count = Math.max(count, 2);
        var segmentCount = count - 1;
        var segmentSize = this._xRange / segmentCount;
        var x = this._minPoint.x;
        var yValues = [];
        while (x <= this._maxPoint.x) {
            yValues.push(this.evaluate(x));
            x += segmentSize;
        }
        return yValues;
    },
    samplePoints: function(count) {
        count = Math.max(count, 2);
        var segmentCount = count - 1;
        var segmentSize = this._xRange / segmentCount;
        var x = this._minPoint.x;
        var points = [];
        while (x <= this._maxPoint.x) {
            points.push(new L.Point(x, this.evaluate(x)));
            x += segmentSize;
        }
        return points;
    },
    getIntersectionPoint: function(otherFunction) {
        var point = null;
        if (this._slope !== otherFunction._slope) {
            var x = (this._b - otherFunction._b) / (otherFunction._slope - this._slope);
            var y = this.evaluate(x);
            point = new L.Point(x, y);
        }
        return point;
    }
});

L.ColorFunction = L.LinearFunction.extend({
    options: {
        alpha: 1,
        includeAlpha: false
    },
    initialize: function(minPoint, maxPoint, options) {
        L.Util.setOptions(this, options);
        this._parts = [];
        this._dynamicPart = null;
        this._outputPrecision = 0;
        this._prefix = null;
        this._formatOutput = function(y) {
            return y.toFixed(this._outputPrecision);
        }, this._mapOutput = function(parts) {
            var outputParts = [];
            for (var i = 0; i < this._parts.length; ++i) {
                var part = this._parts[i];
                outputParts.push(parts[part]);
            }
            if (this.options.includeAlpha) {
                outputParts.push(this.options.alpha);
            }
            return outputParts;
        };
        this._getColorString = function(y) {
            y = this._formatOutput(y);
            this.options[this._dynamicPart] = y;
            var parts = this._mapOutput(this.options);
            return this._writeColor(this._prefix, parts);
        };
        this._writeColor = function(prefix, parts) {
            if (this.options.includeAlpha) {
                prefix += "a";
            }
            return prefix + "(" + parts.join(",") + ")";
        };
        options = this.options;
        var postProcess = function(y) {
            if (options && options.postProcess) {
                y = options.postProcess.call(this, y);
            }
            var colorString = this._getColorString(y);
            if (L.Browser.ie && colorString.indexOf("hsl") > -1 || options.rgb) {
                colorString = L.hslColor(colorString).toRGBString();
            }
            return colorString;
        };
        L.LinearFunction.prototype.initialize.call(this, minPoint, maxPoint, {
            preProcess: this.options.preProcess,
            postProcess: postProcess
        });
    }
});

L.HSLColorFunction = L.ColorFunction.extend({
    initialize: function(minPoint, maxPoint, options) {
        L.ColorFunction.prototype.initialize.call(this, minPoint, maxPoint, options);
        this._parts = [ "outputHue", "outputSaturation", "outputLuminosity" ];
        this._prefix = "hsl";
        this._outputPrecision = 2;
    }
});

L.RGBColorFunction = L.ColorFunction.extend({
    initialize: function(minPoint, maxPoint, options) {
        L.ColorFunction.prototype.initialize.call(this, minPoint, maxPoint, options);
        this._parts = [ "outputRed", "outputBlue", "outputGreen" ];
        this._prefix = "rgb";
        this._outputPrecision = 0;
    }
});

L.RGBRedFunction = L.LinearFunction.extend({
    options: {
        outputGreen: 0,
        outputBlue: 0
    },
    initialize: function(minPoint, maxPoint, options) {
        L.RGBColorFunction.prototype.initialize.call(this, minPoint, maxPoint, options);
        this._dynamicPart = "outputRed";
    }
});

L.RGBBlueFunction = L.LinearFunction.extend({
    options: {
        outputRed: 0,
        outputGreen: 0
    },
    initialize: function(minPoint, maxPoint, options) {
        L.RGBColorFunction.prototype.initialize.call(this, minPoint, maxPoint, options);
        this._dynamicPart = "outputBlue";
    }
});

L.RGBGreenFunction = L.LinearFunction.extend({
    options: {
        outputRed: 0,
        outputBlue: 0
    },
    initialize: function(minPoint, maxPoint, options) {
        L.RGBColorFunction.prototype.initialize.call(this, minPoint, maxPoint, options);
        this._dynamicPart = "outputGreen";
    }
});

L.RGBColorBlendFunction = L.LinearFunction.extend({
    initialize: function(minX, maxX, rgbMinColor, rgbMaxColor) {
        rgbMinColor = new L.RGBColor(rgbMinColor);
        rgbMaxColor = new L.RGBColor(rgbMaxColor);
        var red1 = rgbMinColor.r();
        var red2 = rgbMaxColor.r();
        var green1 = rgbMinColor.g();
        var green2 = rgbMaxColor.g();
        var blue1 = rgbMinColor.b();
        var blue2 = rgbMaxColor.b();
        this._minX = minX;
        this._maxX = maxX;
        this._redFunction = new L.LinearFunction(new L.Point(minX, red1), new L.Point(maxX, red2));
        this._greenFunction = new L.LinearFunction(new L.Point(minX, green1), new L.Point(maxX, green2));
        this._blueFunction = new L.LinearFunction(new L.Point(minX, blue1), new L.Point(maxX, blue2));
    },
    getBounds: function() {
        var redBounds = this._redFunction.getBounds();
        var greenBounds = this._greenFunction.getBounds();
        var blueBounds = this._blueFunction.getBounds();
        var minY = Math.min(redBounds[0].y, greenBounds[0].y, blueBounds[0].y);
        var maxY = Math.max(redBounds[0].y, greenBounds[0].y, blueBounds[0].y);
        return [ new L.Point(redBounds[0].x, minY), new L.Point(redBounds[1].x, maxY) ];
    },
    evaluate: function(x) {
        return new L.RGBColor([ this._redFunction.evaluate(x), this._greenFunction.evaluate(x), this._blueFunction.evaluate(x) ]).toRGBString();
    }
});

L.HSLHueFunction = L.HSLColorFunction.extend({
    options: {
        outputSaturation: "100%",
        outputLuminosity: "50%"
    },
    initialize: function(minPoint, maxPoint, options) {
        L.HSLColorFunction.prototype.initialize.call(this, minPoint, maxPoint, options);
        this._dynamicPart = "outputHue";
    }
});

L.HSLSaturationFunction = L.LinearFunction.extend({
    options: {
        outputHue: 0,
        outputLuminosity: "50%"
    },
    initialize: function(minPoint, maxPoint, options) {
        L.HSLColorFunction.prototype.initialize.call(this, minPoint, maxPoint, options);
        this._formatOutput = function(y) {
            return (y * 100).toFixed(this._outputPrecision) + "%";
        };
        this._dynamicPart = "outputSaturation";
    }
});

L.HSLLuminosityFunction = L.LinearFunction.extend({
    options: {
        outputHue: 0,
        outputSaturation: "100%"
    },
    initialize: function(minPoint, maxPoint, options) {
        L.HSLColorFunction.prototype.initialize.call(this, minPoint, maxPoint, options);
        this._formatOutput = function(y) {
            return (y * 100).toFixed(this._outputPrecision) + "%";
        };
        this._dynamicPart = "outputLuminosity";
    }
});

L.HSLColorBlendFunction = L.LinearFunction.extend({
    initialize: function(minX, maxX, hslMinColor, hslMaxColor) {
        hslMinColor = new L.HSLColor(hslMinColor);
        hslMaxColor = new L.HSLColor(hslMaxColor);
        var h1 = hslMinColor.h();
        var h2 = hslMaxColor.h();
        var s1 = hslMinColor.s();
        var s2 = hslMaxColor.s();
        var l1 = hslMinColor.l();
        var l2 = hslMaxColor.l();
        this._minX = minX;
        this._maxX = maxX;
        this._hueFunction = new L.LinearFunction(new L.Point(minX, h1), new L.Point(maxX, h2));
        this._saturationFunction = new L.LinearFunction(new L.Point(minX, s1), new L.Point(maxX, s2));
        this._luminosityFunction = new L.LinearFunction(new L.Point(minX, l1), new L.Point(maxX, l2));
    },
    getBounds: function() {
        var hBounds = this._hueFunction.getBounds();
        var sBounds = this._saturationFunction.getBounds();
        var lBounds = this._luminosityFunction.getBounds();
        var minY = Math.min(hBounds[0].y, sBounds[0].y, lBounds[0].y);
        var maxY = Math.max(hBounds[0].y, sBounds[0].y, lBounds[0].y);
        return [ new L.Point(hBounds[0].x, minY), new L.Point(hBounds[1].x, maxY) ];
    },
    evaluate: function(x) {
        return new L.HSLColor([ this._hueFunction.evaluate(x), this._saturationFunction.evaluate(x), this._luminosityFunction.evaluate(x) ]).toHSLString();
    }
});

L.PiecewiseFunction = L.LinearFunction.extend({
    initialize: function(functions, options) {
        L.Util.setOptions(this, options);
        this._functions = functions;
        var startPoint;
        var endPoint;
        startPoint = functions[0].getBounds()[0];
        endPoint = functions[functions.length - 1].getBounds()[1];
        L.LinearFunction.prototype.initialize.call(this, startPoint, endPoint, {
            preProcess: this.options.preProcess,
            postProcess: this.options.postProcess
        });
    },
    _getFunction: function(x) {
        var bounds;
        var startPoint;
        var endPoint;
        var found = false;
        var currentFunction;
        for (var index = 0; index < this._functions.length; ++index) {
            currentFunction = this._functions[index];
            bounds = currentFunction.getBounds();
            startPoint = bounds[0];
            endPoint = bounds[1];
            if (x >= startPoint.x && x < endPoint.x) {
                found = true;
                break;
            }
        }
        return found ? currentFunction : this._functions[this._functions.length - 1];
    },
    evaluate: function(x) {
        var currentFunction;
        var y = null;
        if (this._preProcess) {
            x = this._preProcess(x);
        }
        currentFunction = this._getFunction(x);
        if (currentFunction) {
            y = currentFunction.evaluate(x);
            if (this._postProcess) {
                y = this._postProcess(y);
            }
        }
        return y;
    }
});

L.CustomColorFunction = L.PiecewiseFunction.extend({
    options: {
        interpolate: true
    },
    initialize: function(minX, maxX, colors, options) {
        var range = maxX - minX;
        var xRange = range / (colors.length - 1);
        var functions = [];
        var colorFunction;
        L.Util.setOptions(this, options);
        for (var i = 0; i < colors.length; ++i) {
            var next = Math.min(i + 1, colors.length - 1);
            colorFunction = this.options.interpolate ? new L.RGBColorBlendFunction(minX + xRange * i, minX + xRange * next, colors[i], colors[next]) : new L.RGBColorBlendFunction(minX + xRange * i, minX + xRange * next, colors[i], colors[i]);
            functions.push(colorFunction);
        }
        L.PiecewiseFunction.prototype.initialize.call(this, functions);
    }
});

L.CategoryFunction = L.Class.extend({
    initialize: function(categoryMap, options) {
        L.Util.setOptions(this, options);
        this._categoryKeys = Object.keys(categoryMap);
        this._categoryMap = categoryMap;
        this._preProcess = this.options.preProcess;
        this._postProcess = this.options.postProcess;
    },
    evaluate: function(x) {
        var y;
        if (this._preProcess) {
            x = this._preProcess(x);
        }
        y = this._categoryMap[x];
        if (this._postProcess) {
            y = this._postProcess(y);
        }
        return y;
    },
    getCategories: function() {
        return this._categoryKeys;
    }
});

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
        for (var i = start || 0, j = this.length; i < j; i++) {
            if (this[i] === obj) {
                return i;
            }
        }
        return -1;
    };
}

if (!Object.keys) {
    Object.keys = function() {
        var hasOwnProperty = Object.prototype.hasOwnProperty, hasDontEnumBug = !{
            toString: null
        }.propertyIsEnumerable("toString"), dontEnums = [ "toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor" ], dontEnumsLength = dontEnums.length;
        return function(obj) {
            var result, prop, i;
            if (typeof obj !== "object" && typeof obj !== "function" || obj === null) {
                throw new TypeError("Object.keys called on non-object");
            }
            result = [];
            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }
            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }();
}

L.Util.guid = function() {
    var s4 = function() {
        return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
    };
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
};

L.Util.getProperty = function(obj, property, defaultValue) {
    return property in obj ? obj[property] : defaultValue;
};

L.Util.setFieldValue = function(record, fieldName, value) {
    var keyParts = fieldName.split(".");
    var pointer = record;
    var part;
    for (var i = 0; i < keyParts.length - 1; ++i) {
        part = keyParts[i];
        pointer[part] = pointer[part] || {};
        pointer = pointer[part];
    }
    pointer[keyParts[keyParts.length - 1]] = value;
};

L.Util.getFieldValue = function(record, fieldName) {
    var value = null;
    if (fieldName) {
        var parts = fieldName.split(".");
        var valueField = record;
        var part;
        var searchParts;
        var searchKey;
        var searchValue;
        var testObject;
        var searchPart;
        var bracketIndex = -1;
        var testValue;
        for (var partIndex = 0; partIndex < parts.length; ++partIndex) {
            part = parts[partIndex];
            bracketIndex = part.indexOf("[");
            if (bracketIndex > -1) {
                searchPart = part.substring(bracketIndex);
                part = part.substring(0, bracketIndex);
                searchPart = searchPart.replace("[", "").replace("]", "");
                searchParts = searchPart.split("=");
                searchKey = searchParts[0];
                searchValue = searchParts[1];
                valueField = valueField[part];
                for (var valueIndex = 0; valueIndex < valueField.length; ++valueIndex) {
                    testObject = valueField[valueIndex];
                    testValue = testObject[searchKey];
                    if (testValue && testValue === searchValue) {
                        valueField = testObject;
                    }
                }
            } else if (valueField && valueField.hasOwnProperty(part)) {
                valueField = valueField[part];
            } else {
                valueField = null;
                break;
            }
        }
        value = valueField;
    } else {
        value = record;
    }
    return value;
};

L.Util.getNumericRange = function(records, fieldName) {
    var min = Number.MAX_VALUE;
    var max = Number.MIN_VALUE;
    for (var index in records) {
        if (records.hasOwnProperty(index)) {
            var record = records[index];
            var value = L.Util.getFieldValue(record, fieldName);
            min = Math.min(min, value);
            max = Math.max(max, value);
        }
    }
    return [ min, max ];
};

L.Util.pointToGeoJSON = function() {
    var feature = {
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: [ this._latlng[1], this._latlng[0] ]
        },
        properties: {}
    };
    for (var key in this.options) {
        if (this.options.hasOwnProperty(key)) {
            var value = this.options[key];
            if (typeof value !== "function") {
                feature.properties[key] = value;
            }
        }
    }
    return feature;
};

L.Util.updateLayer = function(layer, updateFunction) {
    if (layer.eachLayer && !layer instanceof L.FeatureGroup) {
        layer.eachLayer(function(layer) {
            L.Util.updateLayer(layer, updateFunction);
        });
    } else {
        updateFunction.call(this, layer);
    }
};

L.CategoryLegend = L.Class.extend({
    initialize: function(options) {
        L.Util.setOptions(this, options);
    },
    generate: function(options) {
        options = options || {};
        var container = document.createElement("div");
        var legend = L.DomUtil.create("div", "legend", container);
        var className = options.className;
        var legendOptions = this.options;
        if (className) {
            L.DomUtil.addClass(legend, className);
        }
        if (options.title) {
            L.DomUtil.create("div", "legend-title", legend).innerHTML = options.title;
        }
        for (var key in legendOptions) {
            categoryOptions = legendOptions[key];
            var displayName = categoryOptions.displayName || key;
            var legendElement = L.DomUtil.create("div", "data-layer-legend", legend);
            var legendBox = L.DomUtil.create("div", "legend-box", legendElement);
            L.DomUtil.create("div", "key", legendElement).innerHTML = displayName;
            L.StyleConverter.applySVGStyle(legendBox, categoryOptions);
        }
        return container.innerHTML;
    }
});

L.LegendIcon = L.DivIcon.extend({
    initialize: function(fields, layerOptions, options) {
        var container = document.createElement("div");
        var legendContent = L.DomUtil.create("div", "legend", container);
        var legendTitle = L.DomUtil.create("div", "title", legendContent);
        var legendBox = L.DomUtil.create("div", "legend-box", legendContent);
        var legendValues = L.DomUtil.create("div", "legend-values", legendContent);
        var field;
        var title = layerOptions.title || layerOptions.name;
        if (title) {
            legendTitle.innerHTML = title;
        }
        for (var key in fields) {
            field = fields[key];
            L.DomUtil.create("div", "key", legendValues).innerHTML = field.name || key;
            L.DomUtil.create("div", "value", legendValues).innerHTML = field.value;
        }
        L.StyleConverter.applySVGStyle(legendBox, layerOptions);
        legendBox.style.height = "5px";
        options.html = container.innerHTML;
        options.className = options.className || "legend-icon";
        L.DivIcon.prototype.initialize.call(this, options);
    }
});

L.legendIcon = function(fields, layerOptions, options) {
    return new L.LegendIcon(fields, layerOptions, options);
};

L.GeometryUtils = {
    getName: function(geoJSON) {
        var name = null;
        if (geoJSON && geoJSON.features) {
            for (var index = 0; index < geoJSON.features.length; ++index) {
                var feature = geoJSON.features[index];
                if (feature.properties && feature.properties.name) {
                    name = feature.properties.name;
                    break;
                }
            }
        }
        return name;
    },
    getGeoJSONLocation: function(geoJSON, record, locationTextField, recordToLayer) {
        var geoJSONLayer = new L.GeoJSON(geoJSON, {
            pointToLayer: function(feature, latlng) {
                var location = {
                    location: latlng,
                    text: locationTextField ? L.Util.getFieldValue(record, locationTextField) : [ latlng.lat.toFixed(3), latlng.lng.toFixed(3) ].join(", "),
                    center: latlng
                };
                return recordToLayer(location, record);
            }
        });
        var center = null;
        try {
            center = L.GeometryUtils.loadCentroid(geoJSON);
        } catch (ex) {
            console.log("Error loading centroid for " + JSON.stringify(geoJSON));
        }
        return {
            location: geoJSONLayer,
            text: locationTextField ? L.Util.getFieldValue(record, locationTextField) : null,
            center: center
        };
    },
    mergeProperties: function(properties, featureCollection, mergeKey) {
        var features = featureCollection["features"];
        var featureIndex = L.GeometryUtils.indexFeatureCollection(features, mergeKey);
        var property;
        var mergeValue;
        var newFeatureCollection = {
            type: "FeatureCollection",
            features: []
        };
        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                property = properties[key];
                mergeValue = property[mergeKey];
                if (mergeValue) {
                    var feature = featureIndex[mergeValue];
                    for (var prop in property) {
                        feature.properties[prop] = property[prop];
                    }
                    newFeatureCollection.features.push(feature);
                }
            }
        }
        return newFeatureCollection;
    },
    indexFeatureCollection: function(featureCollection, indexKey) {
        var features = featureCollection.features;
        var feature;
        var properties;
        var featureIndex = {};
        var value;
        for (var index = 0; index < features.length; ++index) {
            feature = features[index];
            properties = feature.properties;
            value = properties[indexKey];
            if (value in featureIndex) {
                var existingFeature = featureIndex[value];
                if (existingFeature.geometry.type !== "GeometryCollection") {
                    featureIndex[value] = {
                        type: "Feature",
                        geometry: {
                            type: "GeometryCollection",
                            geometries: [ feature.geometry, existingFeature.geometry ]
                        }
                    };
                } else {
                    existingFeature.geometry.geometries.push(feature.geometry);
                }
            } else {
                featureIndex[value] = feature;
            }
        }
        return featureIndex;
    },
    arrayToMap: function(array, fromKey, toKey) {
        var map = {};
        var item;
        var from;
        var to;
        for (var index = 0; index < array.length; ++index) {
            item = array[index];
            from = item[fromKey];
            to = toKey ? item[toKey] : item;
            map[from] = to;
        }
        return map;
    },
    arrayToMaps: function(array, mapLinks) {
        var map;
        var item;
        var from;
        var to;
        var maps = [];
        var mapLink;
        var fromKey;
        var toKey;
        for (var i = 0; i < mapLinks.length; ++i) {
            maps.push({});
        }
        for (var index = 0; index < array.length; ++index) {
            item = array[index];
            for (var keyIndex = 0; keyIndex < mapLinks.length; ++keyIndex) {
                map = maps[keyIndex];
                mapLink = mapLinks[keyIndex];
                fromKey = mapLink.from;
                toKey = mapLink.to;
                from = item[fromKey];
                to = toKey ? item[toKey] : item;
                map[from] = to;
            }
        }
        return maps;
    },
    loadCentroid: function(feature) {
        var centroidLatLng = null;
        var centroid;
        var x, y;
        if (feature.geometry && feature.geometry.type === "Point") {
            centroidLatLng = new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
        } else if (typeof jsts !== "undefined") {
            var parser = new jsts.io.GeoJSONParser();
            var jstsFeature = parser.read(feature);
            if (jstsFeature.getCentroid) {
                centroid = jstsFeature.getCentroid();
                x = centroid.coordinate.x;
                y = centroid.coordinate.y;
            } else if (jstsFeature.features) {
                var totalCentroidX = 0;
                var totalCentroidY = 0;
                for (var i = 0; i < jstsFeature.features.length; ++i) {
                    centroid = jstsFeature.features[i].geometry.getCentroid();
                    totalCentroidX += centroid.coordinate.x;
                    totalCentroidY += centroid.coordinate.y;
                }
                x = totalCentroidX / jstsFeature.features.length;
                y = totalCentroidY / jstsFeature.features.length;
            } else {
                centroid = jstsFeature.geometry.getCentroid();
                x = centroid.coordinate.x;
                y = centroid.coordinate.y;
            }
            centroidLatLng = new L.LatLng(y, x);
        }
        return centroidLatLng;
    },
    loadCentroids: function(dictionary) {
        var centroids = {};
        var feature;
        for (var key in dictionary) {
            feature = dictionary[key];
            centroids[key] = L.GeometryUtils.loadCentroid(feature);
        }
        return centroids;
    }
};

L.SVGPathBuilder = L.Class.extend({
    initialize: function(points, innerPoints, options) {
        this._points = points || [];
        this._innerPoints = innerPoints || [];
        L.Util.setOptions(this, options);
    },
    options: {
        closePath: true
    },
    _getPathString: function(points, digits) {
        var pathString = "";
        if (points.length > 0) {
            var point = points[0];
            var digits = digits !== null ? digits : 2;
            var startChar = "M";
            var lineToChar = "L";
            var closePath = "Z";
            if (L.Browser.vml) {
                digits = 0;
                startChar = "m";
                lineToChar = "l";
                closePath = "xe";
            }
            pathString = startChar + point.x.toFixed(digits) + "," + point.y.toFixed(digits);
            for (var index = 1; index < points.length; index++) {
                point = points[index];
                pathString += lineToChar + point.x.toFixed(digits) + "," + point.y.toFixed(digits);
            }
            if (this.options.closePath) {
                pathString += closePath;
            }
        }
        return pathString;
    },
    addPoint: function(point, inner) {
        inner ? this._innerPoints.push(point) : this._points.push(point);
    },
    build: function(digits) {
        digits = digits || this.options.digits;
        var pathString = this._getPathString(this._points, digits);
        if (this._innerPoints) {
            pathString += this._getPathString(this._innerPoints, digits);
        }
        return pathString;
    }
});

L.StyleConverter = {
    keyMap: {
        fillColor: {
            property: [ "background-color" ],
            valueFunction: function(value) {
                return value;
            }
        },
        color: {
            property: [ "color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color" ],
            valueFunction: function(value) {
                return value;
            }
        },
        weight: {
            property: [ "border-width" ],
            valueFunction: function(value) {
                return Math.ceil(value) + "px";
            }
        },
        stroke: {
            property: [ "border-style" ],
            valueFunction: function(value) {
                return value === true ? "solid" : "none";
            }
        },
        dashArray: {
            property: [ "border-style" ],
            valueFunction: function(value) {
                var style = "solid";
                if (value) {
                    style = "dashed";
                }
                return style;
            }
        },
        barThickness: {
            property: [ "height" ],
            valueFunction: function(value) {
                return value + "px";
            }
        },
        radius: {
            property: [ "height" ],
            valueFunction: function(value) {
                return 2 * value + "px";
            }
        },
        fillOpacity: {
            property: [ "opacity" ],
            valueFunction: function(value) {
                return value;
            }
        }
    },
    applySVGStyle: function(element, svgStyle, additionalKeys) {
        var keyMap = L.StyleConverter.keyMap;
        if (additionalKeys) {
            keyMap = L.Util.extend(keyMap, additionalKeys);
        }
        element.style.borderStyle = "solid";
        for (var property in svgStyle) {
            L.StyleConverter.setCSSProperty(element, property, svgStyle[property], keyMap);
        }
        return element;
    },
    setCSSProperty: function(element, key, value, keyMap) {
        var keyMap = keyMap || L.StyleConverter.keyMap;
        var cssProperty = keyMap[key];
        var cssText = "";
        if (cssProperty) {
            var propertyKey = cssProperty.property;
            for (var propertyIndex = 0, propertyLength = propertyKey.length; propertyIndex < propertyLength; ++propertyIndex) {
                cssText += propertyKey[propertyIndex] + ":" + cssProperty.valueFunction(value) + ";";
            }
        }
        element.style.cssText += cssText;
        return element;
    }
};

L.StylesBuilder = L.Class.extend({
    initialize: function(categories, styleFunctionMap) {
        this._categories = categories;
        this._styleFunctionMap = styleFunctionMap;
        this._buildStyles();
    },
    _buildStyles: function() {
        var map = {};
        var category;
        var styleFunction;
        var styleValue;
        for (var index = 0; index < this._categories.length; ++index) {
            category = this._categories[index];
            map[category] = {};
            for (var property in this._styleFunctionMap) {
                styleFunction = this._styleFunctionMap[property];
                styleValue = styleFunction.evaluate ? styleFunction.evaluate(index) : typeof styleFunction === "function" ? styleFunction(index) : styleFunction;
                map[category][property] = styleValue;
            }
        }
        this._styleMap = map;
    },
    getStyles: function() {
        return this._styleMap;
    }
});

L.PaletteBuilder = L.Class.extend({
    initialize: function(styleFunctionMap) {
        this._styleFunctionMap = styleFunctionMap;
    },
    generate: function(options) {
        options = options || {};
        var container = document.createElement("div");
        var paletteElement = L.DomUtil.create("div", "palette", container);
        var count = options.count || 10;
        var categories = function(count) {
            var categoryArray = [];
            for (var i = 0; i < count; ++i) {
                categoryArray.push(i);
            }
            return categoryArray;
        }(count);
        var styleBuilder = new L.StylesBuilder(categories, this._styleFunctionMap);
        var styles = styleBuilder.getStyles();
        if (options.className) {
            L.DomUtil.addClass(paletteElement, options.className);
        }
        for (var styleKey in styles) {
            var i = L.DomUtil.create("i", "palette-element", paletteElement);
            var style = styles[styleKey];
            L.StyleConverter.applySVGStyle(i, style);
        }
        return container.innerHTML;
    }
});

L.HTMLUtils = {
    buildTable: function(obj, className, ignoreFields) {
        className = className || "table table-condensed table-striped table-bordered";
        var table = L.DomUtil.create("table", className);
        var thead = L.DomUtil.create("thead", "", table);
        var tbody = L.DomUtil.create("tbody", "", table);
        thead.innerHTML = "<tr><th>Name</th><th>Value</th></tr>";
        ignoreFields = ignoreFields || [];
        function inArray(arrayObj, value) {
            for (var i = 0, l = arrayObj.length; i < l; i++) {
                if (arrayObj[i] === value) {
                    return true;
                }
            }
            return false;
        }
        for (var property in obj) {
            if (obj.hasOwnProperty(property) && !inArray(ignoreFields, property)) {
                var value = obj[property];
                if (typeof value === "object") {
                    var container = document.createElement("div");
                    container.appendChild(L.HTMLUtils.buildTable(value, ignoreFields));
                    value = container.innerHTML;
                }
                tbody.innerHTML += "<tr><td>" + property + "</td><td>" + value + "</td></tr>";
            }
        }
        return table;
    }
};

L.AnimationUtils = {
    animate: function(layer, from, to, options) {
        var delay = options.delay || 0;
        var frames = options.frames || 30;
        var duration = options.duration || 500;
        var linearFunctions = {};
        var easeFunction = options.easeFunction || function(step) {
            return step;
        };
        var complete = options.complete;
        var step = duration / frames;
        for (var key in from) {
            if (key != "color" && key != "fillColor" && to[key]) {
                linearFunctions[key] = new L.LinearFunction([ 0, from[key] ], [ frames - 1, to[key] ]);
            } else if (key == "color" || key == "fillColor") {
                linearFunctions[key] = new L.RGBColorBlendFunction(0, frames - 1, from[key], to[key]);
            }
        }
        var layerOptions = {};
        var frame = 0;
        var updateLayer = function() {
            for (var key in linearFunctions) {
                layerOptions[key] = linearFunctions[key].evaluate(frame);
            }
            layer.options = L.extend({}, layer.options, layerOptions);
            layer.setStyle(layer.options).redraw();
            frame++;
            step = easeFunction(step);
            if (frame < frames) {
                setTimeout(updateLayer, step);
            } else {
                complete();
            }
        };
        setTimeout(updateLayer, delay);
    }
};

L.Color = L.Class.extend({
    initialize: function(colorDef) {
        this._rgb = [ 0, 0, 0 ];
        this._hsl = [ 0, 1, .5 ];
        this._a = 1;
        if (colorDef) {
            this.parseColorDef(colorDef);
        }
    },
    parseColorDef: function(colorDef) {},
    rgbToHSL: function(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
        if (max == min) {
            h = s = 0;
        } else {
            var d = max - min;
            s = l > .5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
              case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;

              case g:
                h = (b - r) / d + 2;
                break;

              case b:
                h = (r - g) / d + 4;
                break;
            }
            h /= 6;
        }
        return [ h, s, l ];
    },
    hslToRGB: function(h, s, l) {
        var r, g, b;
        if (s == 0) {
            r = g = b = l;
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }
            var q = l < .5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return [ Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255) ];
    },
    setRGB: function(r, g, b) {
        this._rgb = [ r, g, b ];
        this._hsl = this.rgbToHSL(r, g, b);
        return this;
    },
    setHSL: function(h, s, l) {
        this._hsl = [ h, s, l ];
        this._rgb = this.hslToRGB(h, s, l);
        return this;
    },
    toHSL: function() {
        return this._hsl;
    },
    toHSLString: function() {
        var prefix = "hsl";
        if (this._a < 1) {
            prefix += "a";
        }
        return prefix + "(" + (this._hsl[0] * 360).toFixed(1) + "," + (this._hsl[1] * 100).toFixed(0) + "%," + (this._hsl[2] * 100).toFixed(0) + "%)";
    },
    toRGB: function() {
        return this._rgb;
    },
    toRGBString: function() {
        var rgbString;
        if (this._a < 1) {
            rgbString = "rgba(" + this._rgb[0].toFixed(0) + "," + this._rgb[1].toFixed(0) + "," + this._rgb[2].toFixed(0) + "," + this._a.toFixed(1) + ")";
        } else {
            var parts = [ this._rgb[0].toString(16), this._rgb[1].toString(16), this._rgb[2].toString(16) ];
            for (var i = 0; i < parts.length; ++i) {
                if (parts[i].length === 1) {
                    parts[i] = "0" + parts[i];
                }
            }
            rgbString = "#" + parts.join("");
        }
        return rgbString;
    },
    r: function(newR) {
        if (!arguments.length) return this._rgb[0];
        return this.setRGB(newR, this._rgb[1], this._rgb[2]);
    },
    g: function(newG) {
        if (!arguments.length) return this._rgb[1];
        return this.setRGB(this._rgb[0], newG, this._rgb[2]);
    },
    b: function(newB) {
        if (!arguments.length) return this._rgb[2];
        return this.setRGB(this._rgb[0], this._rgb[1], newB);
    },
    h: function(newH) {
        if (!arguments.length) return this._hsl[0];
        return this.setHSL(newH, this._hsl[1], this._hsl[2]);
    },
    s: function(newS) {
        if (!arguments.length) return this._hsl[1];
        return this.setHSL(this._hsl[0], newS, this._hsl[2]);
    },
    l: function(newL) {
        if (!arguments.length) return this._hsl[2];
        return this.setHSL(this._hsl[0], this._hsl[1], newL);
    },
    a: function(newA) {
        if (!arguments.length) return this._a;
        this._a = newA;
        return this;
    }
});

L.RGBColor = L.Color.extend({
    initialize: function(colorDef) {
        L.Color.prototype.initialize.call(this, colorDef);
    },
    parseColorDef: function(colorDef) {
        var isArray = colorDef instanceof Array;
        var isHex = colorDef.indexOf("#") === 0;
        var parts = [];
        var r, g, b, a;
        if (isArray) {
            r = Math.floor(colorDef[0]);
            g = Math.floor(colorDef[1]);
            b = Math.floor(colorDef[2]);
            a = colorDef.length === 4 ? colorDef[3] : 1;
        } else if (isHex) {
            colorDef = colorDef.replace("#", "");
            r = parseInt(colorDef.substring(0, 2), 16);
            g = parseInt(colorDef.substring(2, 4), 16);
            b = parseInt(colorDef.substring(4, 6), 16);
            a = colorDef.length === 8 ? parseInt(colorDef.substring(6, 8), 16) : 1;
        } else {
            parts = colorDef.replace("rgb", "").replace("a", "").replace(/\s+/g, "").replace("(", "").replace(")", "").split(",");
            r = parseInt(parts[0]);
            g = parseInt(parts[1]);
            b = parseInt(parts[2]);
            a = parts.length === 4 ? parseInt(parts[3]) : 1;
        }
        this.setRGB(r, g, b);
        this._a = a;
    }
});

L.rgbColor = function(colorDef) {
    return new L.RGBColor(colorDef);
};

L.HSLColor = L.Color.extend({
    initialize: function(colorDef) {
        L.Color.prototype.initialize.call(this, colorDef);
    },
    parseColorDef: function(colorDef) {
        var isArray = colorDef instanceof Array;
        var h, s, l, a;
        if (isArray) {
            h = colorDef[0];
            s = colorDef[1];
            l = colorDef[2];
            a = colorDef.length === 4 ? colorDef[3] : 1;
        } else {
            var parts = colorDef.replace("hsl", "").replace("a", "").replace("(", "").replace(/\s+/g, "").replace(/%/g, "").replace(")", "").split(",");
            h = Number(parts[0]) / 360;
            s = Number(parts[1]) / 100;
            l = Number(parts[2]) / 100;
            a = parts.length === 4 ? parseInt(parts[3]) : 1;
        }
        this.setHSL(h, s, l);
        this._a = a;
    }
});

L.hslColor = function(colorDef) {
    return new L.HSLColor(colorDef);
};

L.Animation = L.Class.extend({
    initialize: function(easeFunction, animateFrame) {
        this._easeFunction = easeFunction;
        this._animateFrame = animateFrame;
    },
    run: function(el, options) {
        this.stop();
        this._el = el;
        this._inProgress = true;
        this._duration = options.duration || .25;
        this._animationOptions = options;
        this._startTime = +new Date();
        this.fire("start");
        this._animate();
    },
    stop: function() {
        if (!this._inProgress) {
            return;
        }
        this._step();
        this._complete();
    },
    _animate: function() {
        this._animId = L.Util.requestAnimFrame(this._animate, this);
        this._step();
    },
    _step: function() {
        var elapsed = +new Date() - this._startTime, duration = this._duration * 1e3;
        if (elapsed < duration) {
            this._runFrame(this._easeFunction(elapsed / duration));
        } else {
            this._runFrame(1);
            this._complete();
        }
    },
    _runFrame: function(progress) {
        this._animateFrame(progress);
        this.fire("step");
    },
    _complete: function() {
        L.Util.cancelAnimFrame(this._animId);
        this._inProgress = false;
        this.fire("end");
    }
});

L.ColorBrewer = {
    Sequential: {
        YlGn: {
            3: [ "#f7fcb9", "#addd8e", "#31a354" ],
            4: [ "#ffffcc", "#c2e699", "#78c679", "#238443" ],
            5: [ "#ffffcc", "#c2e699", "#78c679", "#31a354", "#006837" ],
            6: [ "#ffffcc", "#d9f0a3", "#addd8e", "#78c679", "#31a354", "#006837" ],
            7: [ "#ffffcc", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#005a32" ],
            8: [ "#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#005a32" ],
            9: [ "#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#006837", "#004529" ]
        },
        YlGnBu: {
            3: [ "#edf8b1", "#7fcdbb", "#2c7fb8" ],
            4: [ "#ffffcc", "#a1dab4", "#41b6c4", "#225ea8" ],
            5: [ "#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494" ],
            6: [ "#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#2c7fb8", "#253494" ],
            7: [ "#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#0c2c84" ],
            8: [ "#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#0c2c84" ],
            9: [ "#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58" ]
        },
        GnBu: {
            3: [ "#e0f3db", "#a8ddb5", "#43a2ca" ],
            4: [ "#f0f9e8", "#bae4bc", "#7bccc4", "#2b8cbe" ],
            5: [ "#f0f9e8", "#bae4bc", "#7bccc4", "#43a2ca", "#0868ac" ],
            6: [ "#f0f9e8", "#ccebc5", "#a8ddb5", "#7bccc4", "#43a2ca", "#0868ac" ],
            7: [ "#f0f9e8", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#08589e" ],
            8: [ "#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#08589e" ],
            9: [ "#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac", "#084081" ]
        },
        BuGn: {
            3: [ "#e5f5f9", "#99d8c9", "#2ca25f" ],
            4: [ "#edf8fb", "#b2e2e2", "#66c2a4", "#238b45" ],
            5: [ "#edf8fb", "#b2e2e2", "#66c2a4", "#2ca25f", "#006d2c" ],
            6: [ "#edf8fb", "#ccece6", "#99d8c9", "#66c2a4", "#2ca25f", "#006d2c" ],
            7: [ "#edf8fb", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#005824" ],
            8: [ "#f7fcfd", "#e5f5f9", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#005824" ],
            9: [ "#f7fcfd", "#e5f5f9", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#006d2c", "#00441b" ]
        },
        PuBuGn: {
            3: [ "#ece2f0", "#a6bddb", "#1c9099" ],
            4: [ "#f6eff7", "#bdc9e1", "#67a9cf", "#02818a" ],
            5: [ "#f6eff7", "#bdc9e1", "#67a9cf", "#1c9099", "#016c59" ],
            6: [ "#f6eff7", "#d0d1e6", "#a6bddb", "#67a9cf", "#1c9099", "#016c59" ],
            7: [ "#f6eff7", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016450" ],
            8: [ "#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016450" ],
            9: [ "#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016c59", "#014636" ]
        },
        PuBu: {
            3: [ "#ece7f2", "#a6bddb", "#2b8cbe" ],
            4: [ "#f1eef6", "#bdc9e1", "#74a9cf", "#0570b0" ],
            5: [ "#f1eef6", "#bdc9e1", "#74a9cf", "#2b8cbe", "#045a8d" ],
            6: [ "#f1eef6", "#d0d1e6", "#a6bddb", "#74a9cf", "#2b8cbe", "#045a8d" ],
            7: [ "#f1eef6", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#034e7b" ],
            8: [ "#fff7fb", "#ece7f2", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#034e7b" ],
            9: [ "#fff7fb", "#ece7f2", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#045a8d", "#023858" ]
        },
        BuPu: {
            3: [ "#e0ecf4", "#9ebcda", "#8856a7" ],
            4: [ "#edf8fb", "#b3cde3", "#8c96c6", "#88419d" ],
            5: [ "#edf8fb", "#b3cde3", "#8c96c6", "#8856a7", "#810f7c" ],
            6: [ "#edf8fb", "#bfd3e6", "#9ebcda", "#8c96c6", "#8856a7", "#810f7c" ],
            7: [ "#edf8fb", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#6e016b" ],
            8: [ "#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#6e016b" ],
            9: [ "#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#810f7c", "#4d004b" ]
        },
        RdPu: {
            3: [ "#fde0dd", "#fa9fb5", "#c51b8a" ],
            4: [ "#feebe2", "#fbb4b9", "#f768a1", "#ae017e" ],
            5: [ "#feebe2", "#fbb4b9", "#f768a1", "#c51b8a", "#7a0177" ],
            6: [ "#feebe2", "#fcc5c0", "#fa9fb5", "#f768a1", "#c51b8a", "#7a0177" ],
            7: [ "#feebe2", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177" ],
            8: [ "#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177" ],
            9: [ "#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177", "#49006a" ]
        },
        PuRd: {
            3: [ "#e7e1ef", "#c994c7", "#dd1c77" ],
            4: [ "#f1eef6", "#d7b5d8", "#df65b0", "#ce1256" ],
            5: [ "#f1eef6", "#d7b5d8", "#df65b0", "#dd1c77", "#980043" ],
            6: [ "#f1eef6", "#d4b9da", "#c994c7", "#df65b0", "#dd1c77", "#980043" ],
            7: [ "#f1eef6", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#91003f" ],
            8: [ "#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#91003f" ],
            9: [ "#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#980043", "#67001f" ]
        },
        OrRd: {
            3: [ "#fee8c8", "#fdbb84", "#e34a33" ],
            4: [ "#fef0d9", "#fdcc8a", "#fc8d59", "#d7301f" ],
            5: [ "#fef0d9", "#fdcc8a", "#fc8d59", "#e34a33", "#b30000" ],
            6: [ "#fef0d9", "#fdd49e", "#fdbb84", "#fc8d59", "#e34a33", "#b30000" ],
            7: [ "#fef0d9", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#990000" ],
            8: [ "#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#990000" ],
            9: [ "#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000" ]
        },
        YlOrRd: {
            3: [ "#ffeda0", "#feb24c", "#f03b20" ],
            4: [ "#ffffb2", "#fecc5c", "#fd8d3c", "#e31a1c" ],
            5: [ "#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026" ],
            6: [ "#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#f03b20", "#bd0026" ],
            7: [ "#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#b10026" ],
            8: [ "#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#b10026" ],
            9: [ "#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026" ]
        },
        YlOrBr: {
            3: [ "#fff7bc", "#fec44f", "#d95f0e" ],
            4: [ "#ffffd4", "#fed98e", "#fe9929", "#cc4c02" ],
            5: [ "#ffffd4", "#fed98e", "#fe9929", "#d95f0e", "#993404" ],
            6: [ "#ffffd4", "#fee391", "#fec44f", "#fe9929", "#d95f0e", "#993404" ],
            7: [ "#ffffd4", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#8c2d04" ],
            8: [ "#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#8c2d04" ],
            9: [ "#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506" ]
        },
        Purples: {
            3: [ "#efedf5", "#bcbddc", "#756bb1" ],
            4: [ "#f2f0f7", "#cbc9e2", "#9e9ac8", "#6a51a3" ],
            5: [ "#f2f0f7", "#cbc9e2", "#9e9ac8", "#756bb1", "#54278f" ],
            6: [ "#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f" ],
            7: [ "#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#4a1486" ],
            8: [ "#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#4a1486" ],
            9: [ "#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#54278f", "#3f007d" ]
        },
        Blues: {
            3: [ "#deebf7", "#9ecae1", "#3182bd" ],
            4: [ "#eff3ff", "#bdd7e7", "#6baed6", "#2171b5" ],
            5: [ "#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c" ],
            6: [ "#eff3ff", "#c6dbef", "#9ecae1", "#6baed6", "#3182bd", "#08519c" ],
            7: [ "#eff3ff", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#084594" ],
            8: [ "#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#084594" ],
            9: [ "#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b" ]
        },
        Greens: {
            3: [ "#e5f5e0", "#a1d99b", "#31a354" ],
            4: [ "#edf8e9", "#bae4b3", "#74c476", "#238b45" ],
            5: [ "#edf8e9", "#bae4b3", "#74c476", "#31a354", "#006d2c" ],
            6: [ "#edf8e9", "#c7e9c0", "#a1d99b", "#74c476", "#31a354", "#006d2c" ],
            7: [ "#edf8e9", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#005a32" ],
            8: [ "#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#005a32" ],
            9: [ "#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b" ]
        },
        Oranges: {
            3: [ "#fee6ce", "#fdae6b", "#e6550d" ],
            4: [ "#feedde", "#fdbe85", "#fd8d3c", "#d94701" ],
            5: [ "#feedde", "#fdbe85", "#fd8d3c", "#e6550d", "#a63603" ],
            6: [ "#feedde", "#fdd0a2", "#fdae6b", "#fd8d3c", "#e6550d", "#a63603" ],
            7: [ "#feedde", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#8c2d04" ],
            8: [ "#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#8c2d04" ],
            9: [ "#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704" ]
        },
        Reds: {
            3: [ "#fee0d2", "#fc9272", "#de2d26" ],
            4: [ "#fee5d9", "#fcae91", "#fb6a4a", "#cb181d" ],
            5: [ "#fee5d9", "#fcae91", "#fb6a4a", "#de2d26", "#a50f15" ],
            6: [ "#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15" ],
            7: [ "#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#99000d" ],
            8: [ "#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#99000d" ],
            9: [ "#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d" ]
        },
        Greys: {
            3: [ "#f0f0f0", "#bdbdbd", "#636363" ],
            4: [ "#f7f7f7", "#cccccc", "#969696", "#525252" ],
            5: [ "#f7f7f7", "#cccccc", "#969696", "#636363", "#252525" ],
            6: [ "#f7f7f7", "#d9d9d9", "#bdbdbd", "#969696", "#636363", "#252525" ],
            7: [ "#f7f7f7", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525" ],
            8: [ "#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525" ],
            9: [ "#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525", "#000000" ]
        }
    },
    Diverging: {
        PuOr: {
            3: [ "#f1a340", "#f7f7f7", "#998ec3" ],
            4: [ "#e66101", "#fdb863", "#b2abd2", "#5e3c99" ],
            5: [ "#e66101", "#fdb863", "#f7f7f7", "#b2abd2", "#5e3c99" ],
            6: [ "#b35806", "#f1a340", "#fee0b6", "#d8daeb", "#998ec3", "#542788" ],
            7: [ "#b35806", "#f1a340", "#fee0b6", "#f7f7f7", "#d8daeb", "#998ec3", "#542788" ],
            8: [ "#b35806", "#e08214", "#fdb863", "#fee0b6", "#d8daeb", "#b2abd2", "#8073ac", "#542788" ],
            9: [ "#b35806", "#e08214", "#fdb863", "#fee0b6", "#f7f7f7", "#d8daeb", "#b2abd2", "#8073ac", "#542788" ],
            10: [ "#7f3b08", "#b35806", "#e08214", "#fdb863", "#fee0b6", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b" ],
            11: [ "#7f3b08", "#b35806", "#e08214", "#fdb863", "#fee0b6", "#f7f7f7", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b" ]
        },
        BrBG: {
            3: [ "#d8b365", "#f5f5f5", "#5ab4ac" ],
            4: [ "#a6611a", "#dfc27d", "#80cdc1", "#018571" ],
            5: [ "#a6611a", "#dfc27d", "#f5f5f5", "#80cdc1", "#018571" ],
            6: [ "#8c510a", "#d8b365", "#f6e8c3", "#c7eae5", "#5ab4ac", "#01665e" ],
            7: [ "#8c510a", "#d8b365", "#f6e8c3", "#f5f5f5", "#c7eae5", "#5ab4ac", "#01665e" ],
            8: [ "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#c7eae5", "#80cdc1", "#35978f", "#01665e" ],
            9: [ "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e" ],
            10: [ "#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30" ],
            11: [ "#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30" ]
        },
        PRGn: {
            3: [ "#af8dc3", "#f7f7f7", "#7fbf7b" ],
            4: [ "#7b3294", "#c2a5cf", "#a6dba0", "#008837" ],
            5: [ "#7b3294", "#c2a5cf", "#f7f7f7", "#a6dba0", "#008837" ],
            6: [ "#762a83", "#af8dc3", "#e7d4e8", "#d9f0d3", "#7fbf7b", "#1b7837" ],
            7: [ "#762a83", "#af8dc3", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#7fbf7b", "#1b7837" ],
            8: [ "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837" ],
            9: [ "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837" ],
            10: [ "#40004b", "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837", "#00441b" ],
            11: [ "#40004b", "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837", "#00441b" ]
        },
        PiYG: {
            3: [ "#e9a3c9", "#f7f7f7", "#a1d76a" ],
            4: [ "#d01c8b", "#f1b6da", "#b8e186", "#4dac26" ],
            5: [ "#d01c8b", "#f1b6da", "#f7f7f7", "#b8e186", "#4dac26" ],
            6: [ "#c51b7d", "#e9a3c9", "#fde0ef", "#e6f5d0", "#a1d76a", "#4d9221" ],
            7: [ "#c51b7d", "#e9a3c9", "#fde0ef", "#f7f7f7", "#e6f5d0", "#a1d76a", "#4d9221" ],
            8: [ "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221" ],
            9: [ "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221" ],
            10: [ "#8e0152", "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419" ],
            11: [ "#8e0152", "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419" ]
        },
        RdBu: {
            3: [ "#ef8a62", "#f7f7f7", "#67a9cf" ],
            4: [ "#ca0020", "#f4a582", "#92c5de", "#0571b0" ],
            5: [ "#ca0020", "#f4a582", "#f7f7f7", "#92c5de", "#0571b0" ],
            6: [ "#b2182b", "#ef8a62", "#fddbc7", "#d1e5f0", "#67a9cf", "#2166ac" ],
            7: [ "#b2182b", "#ef8a62", "#fddbc7", "#f7f7f7", "#d1e5f0", "#67a9cf", "#2166ac" ],
            8: [ "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac" ],
            9: [ "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac" ],
            10: [ "#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061" ],
            11: [ "#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061" ]
        },
        RdGy: {
            3: [ "#ef8a62", "#ffffff", "#999999" ],
            4: [ "#ca0020", "#f4a582", "#bababa", "#404040" ],
            5: [ "#ca0020", "#f4a582", "#ffffff", "#bababa", "#404040" ],
            6: [ "#b2182b", "#ef8a62", "#fddbc7", "#e0e0e0", "#999999", "#4d4d4d" ],
            7: [ "#b2182b", "#ef8a62", "#fddbc7", "#ffffff", "#e0e0e0", "#999999", "#4d4d4d" ],
            8: [ "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#e0e0e0", "#bababa", "#878787", "#4d4d4d" ],
            9: [ "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#ffffff", "#e0e0e0", "#bababa", "#878787", "#4d4d4d" ],
            10: [ "#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#e0e0e0", "#bababa", "#878787", "#4d4d4d", "#1a1a1a" ],
            11: [ "#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#ffffff", "#e0e0e0", "#bababa", "#878787", "#4d4d4d", "#1a1a1a" ]
        },
        RdYlBu: {
            3: [ "#fc8d59", "#ffffbf", "#91bfdb" ],
            4: [ "#d7191c", "#fdae61", "#abd9e9", "#2c7bb6" ],
            5: [ "#d7191c", "#fdae61", "#ffffbf", "#abd9e9", "#2c7bb6" ],
            6: [ "#d73027", "#fc8d59", "#fee090", "#e0f3f8", "#91bfdb", "#4575b4" ],
            7: [ "#d73027", "#fc8d59", "#fee090", "#ffffbf", "#e0f3f8", "#91bfdb", "#4575b4" ],
            8: [ "#d73027", "#f46d43", "#fdae61", "#fee090", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4" ],
            9: [ "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4" ],
            10: [ "#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695" ],
            11: [ "#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695" ]
        },
        Spectral: {
            3: [ "#fc8d59", "#ffffbf", "#99d594" ],
            4: [ "#d7191c", "#fdae61", "#abdda4", "#2b83ba" ],
            5: [ "#d7191c", "#fdae61", "#ffffbf", "#abdda4", "#2b83ba" ],
            6: [ "#d53e4f", "#fc8d59", "#fee08b", "#e6f598", "#99d594", "#3288bd" ],
            7: [ "#d53e4f", "#fc8d59", "#fee08b", "#ffffbf", "#e6f598", "#99d594", "#3288bd" ],
            8: [ "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#e6f598", "#abdda4", "#66c2a5", "#3288bd" ],
            9: [ "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd" ],
            10: [ "#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2" ],
            11: [ "#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2" ]
        },
        RdYlGn: {
            3: [ "#fc8d59", "#ffffbf", "#91cf60" ],
            4: [ "#d7191c", "#fdae61", "#a6d96a", "#1a9641" ],
            5: [ "#d7191c", "#fdae61", "#ffffbf", "#a6d96a", "#1a9641" ],
            6: [ "#d73027", "#fc8d59", "#fee08b", "#d9ef8b", "#91cf60", "#1a9850" ],
            7: [ "#d73027", "#fc8d59", "#fee08b", "#ffffbf", "#d9ef8b", "#91cf60", "#1a9850" ],
            8: [ "#d73027", "#f46d43", "#fdae61", "#fee08b", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850" ],
            9: [ "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850" ],
            10: [ "#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837" ],
            11: [ "#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837" ]
        }
    },
    Qualitative: {
        Accent: {
            3: [ "#7fc97f", "#beaed4", "#fdc086" ],
            4: [ "#7fc97f", "#beaed4", "#fdc086", "#ffff99" ],
            5: [ "#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0" ],
            6: [ "#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f" ],
            7: [ "#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f", "#bf5b17" ],
            8: [ "#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f", "#bf5b17", "#666666" ]
        },
        Dark2: {
            3: [ "#1b9e77", "#d95f02", "#7570b3" ],
            4: [ "#1b9e77", "#d95f02", "#7570b3", "#e7298a" ],
            5: [ "#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e" ],
            6: [ "#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02" ],
            7: [ "#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d" ],
            8: [ "#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d", "#666666" ]
        },
        Paired: {
            3: [ "#a6cee3", "#1f78b4", "#b2df8a" ],
            4: [ "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c" ],
            5: [ "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99" ],
            6: [ "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c" ],
            7: [ "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f" ],
            8: [ "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00" ],
            9: [ "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6" ],
            10: [ "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a" ],
            11: [ "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99" ],
            12: [ "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928" ]
        },
        Pastel1: {
            3: [ "#fbb4ae", "#b3cde3", "#ccebc5" ],
            4: [ "#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4" ],
            5: [ "#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6" ],
            6: [ "#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc" ],
            7: [ "#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd" ],
            8: [ "#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec" ],
            9: [ "#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec", "#f2f2f2" ]
        },
        Pastel2: {
            3: [ "#b3e2cd", "#fdcdac", "#cbd5e8" ],
            4: [ "#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4" ],
            5: [ "#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9" ],
            6: [ "#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae" ],
            7: [ "#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae", "#f1e2cc" ],
            8: [ "#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae", "#f1e2cc", "#cccccc" ]
        },
        Set1: {
            3: [ "#e41a1c", "#377eb8", "#4daf4a" ],
            4: [ "#e41a1c", "#377eb8", "#4daf4a", "#984ea3" ],
            5: [ "#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00" ],
            6: [ "#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33" ],
            7: [ "#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628" ],
            8: [ "#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf" ],
            9: [ "#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf", "#999999" ]
        },
        Set2: {
            3: [ "#66c2a5", "#fc8d62", "#8da0cb" ],
            4: [ "#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3" ],
            5: [ "#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854" ],
            6: [ "#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f" ],
            7: [ "#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494" ],
            8: [ "#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3" ]
        },
        Set3: {
            3: [ "#8dd3c7", "#ffffb3", "#bebada" ],
            4: [ "#8dd3c7", "#ffffb3", "#bebada", "#fb8072" ],
            5: [ "#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3" ],
            6: [ "#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462" ],
            7: [ "#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69" ],
            8: [ "#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5" ],
            9: [ "#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9" ],
            10: [ "#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd" ],
            11: [ "#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5" ],
            12: [ "#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f" ]
        }
    }
};

L.Palettes = {
    huePalette: function(min, max, minH, maxH, options) {
        return new L.HSLHueFunction(new L.Point(min, minH), new L.Point(max, maxH), options);
    },
    luminosityPalette: function(min, max, minL, maxL, options) {
        return new L.HSLLuminosityFunction(new L.Point(min, minL), new L.Point(max, maxL), options);
    },
    saturationPalette: function(min, max, minS, maxS, options) {
        return new L.HSLSaturationFunction(new L.Point(min, minS), new L.Point(max, maxS), options);
    },
    rgbBlendPalette: function(min, max, minColor, maxColor, options) {
        return new L.RGBColorBlendFunction(min, max, minColor, maxColor, options);
    },
    hslBlendPalette: function(min, max, minColor, maxColor, options) {
        return new L.HSLColorBlendFunction(min, max, minColor, maxColor, options);
    },
    customColorPalette: function(min, max, colors, options) {
        return new L.CustomColorFunction(min, max, colors, options);
    }
};

L.DynamicColorPalettes = {
    rainbow: {
        text: "Rainbow",
        getPalette: function(min, max, options) {
            return L.Palettes.huePalette(min, max, 0, 300, options);
        }
    },
    greentored: {
        text: "Green - Red",
        getPalette: function(min, max, options) {
            return L.Palettes.huePalette(min, max, 120, 0, options);
        }
    },
    yellowtored: {
        text: "Yellow - Red",
        getPalette: function(min, max, options) {
            return L.Palettes.huePalette(min, max, 60, 0, options);
        }
    },
    orangetored: {
        text: "Orange - Red",
        getPalette: function(min, max, options) {
            return L.Palettes.huePalette(min, max, 30, 0, options);
        }
    },
    redtopurple: {
        text: "Red - Purple",
        getPalette: function(min, max, options) {
            return L.Palettes.huePalette(min, max, 360, 270, options);
        }
    },
    bluetored: {
        text: "Blue - Red",
        getPalette: function(min, max, options) {
            return L.Palettes.huePalette(min, max, 210, 360, options);
        }
    },
    bluetored2: {
        text: "Blue - Red 2",
        getPalette: function(min, max, options) {
            return L.Palettes.huePalette(min, max, 180, 0, options);
        }
    },
    whitetored: {
        text: "White - Red",
        getPalette: function(min, max, options) {
            return L.Palettes.luminosityPalette(min, max, 1, .5, L.Util.extend(option, {
                outputHue: 0
            }));
        }
    },
    whitetoorange: {
        text: "White - Orange",
        getPalette: function(min, max, options) {
            return L.Palettes.luminosityPalette(min, max, 1, .5, L.Util.extend(option, {
                outputHue: 30
            }));
        }
    },
    whitetoyellow: {
        text: "White - Yellow",
        getPalette: function(min, max, options) {
            return L.Palettes.luminosityPalette(min, max, 1, .5, L.Util.extend(option, {
                outputHue: 60
            }));
        }
    },
    whitetogreen: {
        text: "White - Green",
        getPalette: function(min, max, options) {
            return L.Palettes.luminosityPalette(min, max, 1, .5, L.Util.extend(option, {
                outputHue: 120
            }));
        }
    },
    whitetoltblue: {
        text: "White - Lt. Blue",
        getPalette: function(min, max, options) {
            return L.Palettes.luminosityPalette(min, max, 1, .5, L.Util.extend(option, {
                outputHue: 180
            }));
        }
    },
    whitetoblue: {
        text: "White - Blue",
        getPalette: function(min, max, options) {
            return L.Palettes.luminosityPalette(min, max, 1, .5, L.Util.extend(option, {
                outputHue: 240
            }));
        }
    },
    whitetopurple: {
        text: "White - Purple",
        getPalette: function(min, max, options) {
            return L.Palettes.luminosityPalette(min, max, 1, .5, L.Util.extend(option, {
                outputHue: 270
            }));
        }
    },
    graytored: {
        text: "Gray - Red",
        getPalette: function(min, max, options) {
            return L.Palettes.saturationPalette(min, max, 0, 1, L.Util.extend(option, {
                outputHue: 0
            }));
        }
    },
    graytoorange: {
        text: "Gray - Orange",
        getPalette: function(min, max, options) {
            return L.Palettes.saturationPalette(min, max, 0, 1, L.Util.extend(option, {
                outputHue: 30
            }));
        }
    },
    graytoyellow: {
        text: "Gray - Yellow",
        getPalette: function(min, max, options) {
            return L.Palettes.saturationPalette(min, max, 0, 1, L.Util.extend(option, {
                outputHue: 60
            }));
        }
    },
    graytogreen: {
        text: "Gray - Green",
        getPalette: function(min, max, options) {
            return L.Palettes.saturationPalette(min, max, 0, 1, L.Util.extend(option, {
                outputHue: 120
            }));
        }
    },
    graytoltblue: {
        text: "Gray - Lt. Blue",
        getPalette: function(min, max, options) {
            return L.Palettes.saturationPalette(min, max, 0, 1, L.Util.extend(option, {
                outputHue: 180
            }));
        }
    },
    graytoblue: {
        text: "Gray - Blue",
        getPalette: function(min, max, options) {
            return L.Palettes.saturationPalette(min, max, 0, 1, L.Util.extend(option, {
                outputHue: 240
            }));
        }
    },
    graytopurple: {
        text: "Gray - Purple",
        getPalette: function(min, max, options) {
            return L.Palettes.saturationPalette(min, max, 0, 1, L.Util.extend(option, {
                outputHue: 270
            }));
        }
    }
};

L.DynamicPaletteElement = L.Class.extend({
    initialize: function(key, dynamicPalette) {
        this._key = key;
        this._dynamicPalette = dynamicPalette;
    },
    generate: function(options) {
        var paletteElement = L.DomUtil.create("div", "palette");
        var count = options.count;
        var palette = this._dynamicPalette.getPalette(0, count - 1);
        var width = options.width;
        var showText = true;
        if (options.showText != undefined) {
            showText = options.showText;
        }
        paletteElement.setAttribute("data-palette-key", this._key);
        if (this._dynamicPalette.text && showText) {
            L.DomUtil.create("div", "palette-text", paletteElement).innerHTML = '<i class="icon-ok hidden"></i>' + this._dynamicPalette.text;
        }
        var elementWidth = width / count;
        if (options.className) {
            L.DomUtil.addClass(paletteElement, options.className);
        }
        for (var i = 0; i < count; ++i) {
            var i = L.DomUtil.create("i", "palette-element");
            for (var styleKey in palette) {
                var styleValue = palette[styleKey];
                var style = styleValue.evaluate ? styleValue.evaluate(i) : styleValue;
                L.StyleConverter.setCSSProperty(i, styleKey, style);
            }
            i.style.width = elementWidth + "px";
            paletteElement.appendChild(i);
        }
        return paletteElement;
    }
});

L.RegularPolygon = L.Polygon.extend({
    statics: {
        R: 6378.137,
        M_PER_KM: 1e3
    },
    initialize: function(centerLatLng, options) {
        this._centerLatLng = centerLatLng;
        L.Util.setOptions(this, options);
        L.Polygon.prototype.initialize.call(this, this._getLatLngs(), options);
    },
    options: {
        fill: true,
        radius: 1e3,
        numberOfSides: 4,
        rotation: 0,
        maxDegrees: 360
    },
    getLatLng: function() {
        return this._centerLatLng;
    },
    setRadius: function(radius) {
        this.options.radius = radius;
        this._latlngs = this._getLatLngs();
        this.redraw();
    },
    _getLatLngs: function() {
        var maxDegrees = this.options.maxDegrees || 360;
        var angleSize = maxDegrees / Math.max(this.options.numberOfSides, 3);
        var degrees = maxDegrees + this.options.rotation;
        var angle = this.options.rotation;
        var latlngs = [];
        var newLatLng;
        while (angle < degrees) {
            newLatLng = this._getPoint(angle);
            latlngs.push(newLatLng);
            angle += angleSize;
        }
        return latlngs;
    },
    _getPoint: function(angle) {
        var toRad = function(number) {
            return number * L.LatLng.DEG_TO_RAD;
        };
        var toDeg = function(number) {
            return number * L.LatLng.RAD_TO_DEG;
        };
        var angleRadians = toRad(angle);
        var angularDistance = this.options.radius / L.RegularPolygon.M_PER_KM / L.RegularPolygon.R;
        var lat1 = toRad(this._centerLatLng.lat);
        var lon1 = toRad(this._centerLatLng.lng);
        var lat2 = Math.asin(Math.sin(lat1) * Math.cos(angularDistance) + Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(angleRadians));
        var lon2 = lon1 + Math.atan2(Math.sin(angleRadians) * Math.sin(angularDistance) * Math.cos(lat1), Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2));
        lat2 = toDeg(lat2);
        lon2 = toDeg(lon2);
        return new L.LatLng(lat2, lon2);
    },
    toGeoJSON: function() {
        var feature = {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [ [], [] ]
            },
            properties: this.options
        };
        for (var i = 0; i < this._latlngs.length; ++i) {
            var latlng = this._latlngs[i];
            feature.coordinates[0].push([ latlng[1], latlng[0] ]);
        }
        return feature;
    }
});

L.regularPolygon = function(centerLatLng, options) {
    return new L.RegularPolygon(centerLatLng, options);
};

L.Path.XLINK_NS = "http://www.w3.org/1999/xlink";

var TextFunctions = TextFunctions || {
    __updatePath: L.Path.prototype._updatePath,
    _updatePath: function() {
        this.__updatePath.call(this);
        if (this.options.text) {
            this._createText(this.options.text);
        }
    },
    _initText: function() {
        if (this.options.text) {
            this._createText(this.options.text);
        }
    },
    getTextAnchor: function() {
        if (this._point) {
            return this._point;
        }
    },
    setTextAnchor: function(anchorPoint) {
        if (this._text) {
            this._text.setAttribute("x", anchorPoint.x);
            this._text.setAttribute("y", anchorPoint.y);
        }
    },
    _createText: function(options) {
        if (this._text) {
            this._container.removeChild(this._text);
        }
        if (this._pathDef) {
            this._defs.removeChild(this._pathDef);
        }
        var setStyle = function(element, style) {
            var styleString = "";
            for (var key in style) {
                styleString += key + ": " + style[key] + ";";
            }
            element.setAttribute("style", styleString);
            return element;
        };
        var setAttr = function(element, attr) {
            for (var key in attr) {
                element.setAttribute(key, attr[key]);
            }
            return element;
        };
        this._text = this._createElement("text");
        var textNode = document.createTextNode(options.text);
        if (options.path) {
            var pathOptions = options.path;
            var pathID = L.Util.guid();
            var clonedPath = this._createElement("path");
            clonedPath.setAttribute("d", this._path.getAttribute("d"));
            clonedPath.setAttribute("id", pathID);
            if (!this._defs) {
                this._defs = this._createElement("defs");
                this._container.appendChild(this._defs);
            }
            this._defs.appendChild(clonedPath);
            this._pathDef = clonedPath;
            var textPath = this._createElement("textPath");
            if (pathOptions.startOffset) {
                textPath.setAttribute("startOffset", pathOptions.startOffset);
            }
            if (pathOptions.attr) {
                setAttr(textPath, pathOptions.attr);
            }
            if (pathOptions.style) {
                setStyle(textPath, pathOptions.style);
            }
            textPath.setAttributeNS(L.Path.XLINK_NS, "xlink:href", "#" + pathID);
            textPath.appendChild(textNode);
            this._text.appendChild(textPath);
        } else {
            this._text.appendChild(textNode);
            var anchorPoint = this.getTextAnchor();
            this.setTextAnchor(anchorPoint);
        }
        if (options.className) {
            this._text.setAttribute("class", options.className);
        } else {
            this._text.setAttribute("class", "leaflet-svg-text");
        }
        if (options.attr) {
            setAttr(this._text, options.attr);
        }
        if (options.style) {
            setStyle(this._text, options.style);
        }
        this._container.appendChild(this._text);
    }
};

var PathFunctions = PathFunctions || {
    __updateStyle: L.Path.prototype._updateStyle,
    _createDefs: function() {
        this._defs = this._createElement("defs");
        this._container.appendChild(this._defs);
    },
    _createGradient: function(options) {
        if (!this._defs) {
            this._createDefs();
        }
        if (this._gradient) {
            this._defs.removeChild(this._gradient);
        }
        options = options !== true ? L.extend({}, options) : {};
        var gradientGuid = L.Util.guid();
        this._gradientGuid = gradientGuid;
        var gradient;
        var gradientOptions;
        if (options.gradientType == "radial") {
            gradient = this._createElement("radialGradient");
            var gradientOptions = options.radial || {
                cx: "50%",
                cy: "50%",
                r: "50%",
                fx: "50%",
                fy: "50%"
            };
        } else {
            gradient = this._createElement("linearGradient");
            var vector = options.vector || [ [ "0%", "0%" ], [ "100%", "100%" ] ];
            var gradientOptions = {
                x1: vector[0][0],
                x2: vector[1][0],
                y1: vector[0][1],
                y2: vector[1][1]
            };
        }
        gradientOptions.id = "grad" + gradientGuid;
        var stops = options.stops || [ {
            offset: "0%",
            style: {
                color: "rgb(255, 255, 255)",
                opacity: 1
            }
        }, {
            offset: "60%",
            style: {
                color: this.options.fillColor || this.options.color,
                opacity: 1
            }
        } ];
        for (var key in gradientOptions) {
            gradient.setAttribute(key, gradientOptions[key]);
        }
        for (var i = 0; i < stops.length; ++i) {
            var stop = stops[i];
            var stopElement = this._createElement("stop");
            stop.style = stop.style || {};
            for (var key in stop) {
                var stopProperty = stop[key];
                if (key === "style") {
                    var styleProperty = "";
                    stopProperty.color = stopProperty.color || (this.options.fillColor || this.options.color);
                    stopProperty.opacity = typeof stopProperty.opacity === "undefined" ? 1 : stopProperty.opacity;
                    for (var propKey in stopProperty) {
                        styleProperty += "stop-" + propKey + ":" + stopProperty[propKey] + ";";
                    }
                    stopProperty = styleProperty;
                }
                stopElement.setAttribute(key, stopProperty);
            }
            gradient.appendChild(stopElement);
        }
        this._gradient = gradient;
        this._defs.appendChild(gradient);
    },
    _createDropShadow: function(options) {
        if (!this._defs) {
            this._createDefs();
        }
        if (this._dropShadow) {
            this._defs.removeChild(this._dropShadow);
        }
        var filterGuid = L.Util.guid();
        var filter = this._createElement("filter");
        var feOffset = this._createElement("feOffset");
        var feGaussianBlur = this._createElement("feGaussianBlur");
        var feBlend = this._createElement("feBlend");
        options = options || {
            width: "200%",
            height: "200%"
        };
        options.id = "filter" + filterGuid;
        for (var key in options) {
            filter.setAttribute(key, options[key]);
        }
        var offsetOptions = {
            result: "offOut",
            "in": "SourceAlpha",
            dx: "2",
            dy: "2"
        };
        var blurOptions = {
            result: "blurOut",
            "in": "offOut",
            stdDeviation: "2"
        };
        var blendOptions = {
            "in": "SourceGraphic",
            in2: "blurOut",
            mode: "lighten"
        };
        for (var key in offsetOptions) {
            feOffset.setAttribute(key, offsetOptions[key]);
        }
        for (var key in blurOptions) {
            feGaussianBlur.setAttribute(key, blurOptions[key]);
        }
        for (var key in blendOptions) {
            feBlend.setAttribute(key, blendOptions[key]);
        }
        filter.appendChild(feOffset);
        filter.appendChild(feGaussianBlur);
        filter.appendChild(feBlend);
        this._dropShadow = filter;
        this._defs.appendChild(filter);
    },
    _createCustomElement: function(tag, attributes) {
        var element = this._createElement(tag);
        for (var key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                element.setAttribute(key, attributes[key]);
            }
        }
        return element;
    },
    _createImage: function(imageOptions) {
        var image = this._createElement("image");
        image.setAttribute("width", imageOptions.width);
        image.setAttribute("height", imageOptions.height);
        image.setAttribute("x", imageOptions.x || 0);
        image.setAttribute("y", imageOptions.y || 0);
        image.setAttributeNS(L.Path.XLINK_NS, "xlink:href", imageOptions.url);
        return image;
    },
    _createPattern: function(patternOptions) {
        if (this._pattern) {
            this._defs.removeChild(this._pattern);
        }
        var pattern = this._createCustomElement("pattern", patternOptions);
        this._pattern = pattern;
        return pattern;
    },
    _createShape: function(type, shapeOptions) {
        if (this._shape) {
            this._container.removeChild(this._shape);
        }
        var shape = this._createCustomElement(type, shapeOptions);
        return shape;
    },
    _applyCustomStyles: function() {},
    _createFillPattern: function(imageOptions) {
        var patternGuid = L.Util.guid();
        var patternOptions = imageOptions.pattern;
        patternOptions.id = patternGuid;
        patternOptions.patternUnits = patternOptions.patternUnits || "objectBoundingBox";
        var pattern = this._createPattern(patternOptions);
        var image = this._createImage(imageOptions.image);
        image.setAttributeNS(L.Path.XLINK_NS, "xlink:href", imageOptions.url);
        pattern.appendChild(image);
        if (!this._defs) {
            this._createDefs();
        }
        this._defs.appendChild(pattern);
        this._path.setAttribute("fill", "url(#" + patternGuid + ")");
    },
    _getDefaultDiameter: function(radius) {
        return 1.75 * radius;
    },
    _createShapeImage: function(imageOptions) {
        imageOptions = imageOptions || {};
        var patternGuid = L.Util.guid();
        var radius = this.options.radius || Math.max(this.options.radiusX, this.options.radiusY);
        var diameter = this._getDefaultDiameter(radius);
        var imageSize = imageOptions.imageSize || new L.Point(diameter, diameter);
        var circleSize = imageOptions.radius || diameter / 2;
        var shapeOptions = imageOptions.shape || {
            circle: {
                r: circleSize,
                cx: 0,
                cy: 0
            }
        };
        var patternOptions = imageOptions.pattern || {
            width: imageSize.x,
            height: imageSize.y,
            x: 0,
            y: 0
        };
        var shapeKeys = Object.keys(shapeOptions);
        var shapeType = shapeKeys.length > 0 ? shapeKeys[0] : "circle";
        shapeOptions[shapeType].fill = "url(#" + patternGuid + ")";
        var shape = this._createShape(shapeType, shapeOptions[shapeType]);
        if (this.options.clickable) {
            shape.setAttribute("class", "leaflet-clickable");
        }
        patternOptions.id = patternGuid;
        patternOptions.patternUnits = patternOptions.patternUnits || "objectBoundingBox";
        var pattern = this._createPattern(patternOptions);
        var imageOptions = imageOptions.image || {
            width: imageSize.x,
            height: imageSize.y,
            x: 0,
            y: 0,
            url: this.options.imageCircleUrl
        };
        var image = this._createImage(imageOptions);
        image.setAttributeNS(L.Path.XLINK_NS, "xlink:href", imageOptions.url);
        pattern.appendChild(image);
        this._defs.appendChild(pattern);
        this._container.insertBefore(shape, this._defs);
        this._shape = shape;
        var me = this;
        this._shape.addEventListener("mouseover", function() {
            me.fire("mouseover");
        });
        this._shape.addEventListener("mouseout", function() {
            me.fire("mouseout");
        });
        this._shape.addEventListener("mousemove", function() {
            me.fire("mousemove");
        });
        var anchorPoint = this.getTextAnchor();
        if (this._shape && anchorPoint) {
            if (this._shape.tagName === "circle" || this._shape.tagName === "ellipse") {
                this._shape.setAttribute("cx", anchorPoint.x);
                this._shape.setAttribute("cy", anchorPoint.y);
            } else {
                var width = this._shape.getAttribute("width");
                var height = this._shape.getAttribute("height");
                this._shape.setAttribute("x", anchorPoint.x - Number(width) / 2);
                this._shape.setAttribute("y", anchorPoint.y - Number(height) / 2);
            }
        }
    },
    _updateStyle: function(layer) {
        this.__updateStyle.call(this, layer);
        var context = layer ? layer : this;
        if (context.options.stroke) {
            if (context.options.lineCap) {
                context._path.setAttribute("stroke-linecap", context.options.lineCap);
            }
            if (context.options.lineJoin) {
                context._path.setAttribute("stroke-linejoin", context.options.lineJoin);
            }
        }
        if (context.options.gradient) {
            context._createGradient(context.options.gradient);
            context._path.setAttribute("fill", "url(#" + context._gradient.getAttribute("id") + ")");
        } else if (!context.options.fill) {
            context._path.setAttribute("fill", "none");
        }
        if (context.options.dropShadow) {
            context._createDropShadow();
            context._path.setAttribute("filter", "url(#" + context._dropShadow.getAttribute("id") + ")");
        } else {
            context._path.removeAttribute("filter");
        }
        if (context.options.fillPattern) {
            context._createFillPattern(context.options.fillPattern);
        }
        context._applyCustomStyles();
    }
};

if (L.SVG) {
    var SVGStyleFunctions = L.Util.extend(PathFunctions, {
        __updateStyle: L.SVG.prototype._updateStyle
    });
    var SVGTextFunctions = L.Util.extend(TextFunctions, {
        __updatePath: L.SVG.prototype._updatePath
    });
    L.SVG.include(SVGStyleFunctions);
    L.SVG.include(SVGTextFunctions);
}

var LineTextFunctions = L.extend({}, TextFunctions);

LineTextFunctions.__updatePath = L.Polyline.prototype._updatePath;

LineTextFunctions.getCenter = function() {
    var latlngs = this._latlngs, len = latlngs.length, i, j, p1, p2, f, center;
    for (i = 0, j = len - 1, area = 0, lat = 0, lng = 0; i < len; j = i++) {
        p1 = latlngs[i];
        p2 = latlngs[j];
        f = p1.lat * p2.lng - p2.lat * p1.lng;
        lat += (p1.lat + p2.lat) * f;
        lng += (p1.lng + p2.lng) * f;
        area += f / 2;
    }
    center = area ? new L.LatLng(lat / (6 * area), lng / (6 * area)) : latlngs[0];
    center.area = area;
    return center;
};

LineTextFunctions.getTextAnchor = function() {
    var center = this.getCenter();
    return this._map.latLngToLayerPoint(center);
};

L.Polyline.include(LineTextFunctions);

L.CircleMarker.include(TextFunctions);

L.Path.include(PathFunctions);

L.Polygon.include(PathFunctions);

L.Polyline.include(PathFunctions);

L.CircleMarker.include(PathFunctions);

L.CircleMarker = L.CircleMarker.extend({
    _applyCustomStyles: function() {
        if (this.options.shapeImage || this.options.imageCircleUrl) {
            this._createShapeImage(this.options.shapeImage);
        }
    },
    getTextAnchor: function() {
        var point = null;
        if (this._point) {
            point = new L.Point(this._point.x, this._point.y);
        }
        return point;
    }
});

L.Point.prototype.rotate = function(angle, point) {
    var radius = this.distanceTo(point);
    var theta = angle * L.LatLng.DEG_TO_RAD + Math.atan2(this.y - point.y, this.x - point.x);
    this.x = point.x + radius * Math.cos(theta);
    this.y = point.y + radius * Math.sin(theta);
};

L.MapMarker = L.Path.extend({
    includes: TextFunctions,
    initialize: function(centerLatLng, options) {
        L.Path.prototype.initialize.call(this, options);
        this._latlng = centerLatLng;
    },
    options: {
        fill: true,
        fillOpacity: 1,
        opacity: 1,
        radius: 15,
        innerRadius: 5,
        position: {
            x: 0,
            y: 0
        },
        rotation: 0,
        numberOfSides: 50,
        color: "#000000",
        fillColor: "#0000FF",
        weight: 1,
        gradient: true,
        dropShadow: true,
        clickable: true
    },
    setLatLng: function(latlng) {
        this._latlng = latlng;
        return this.redraw();
    },
    projectLatlngs: function() {
        this._point = this._map.latLngToLayerPoint(this._latlng);
        this._points = this._getPoints();
        if (this.options.innerRadius > 0) {
            this._innerPoints = this._getPoints(true).reverse();
        }
    },
    getBounds: function() {
        var map = this._map, height = this.options.radius * 3, point = map.project(this._latlng), swPoint = new L.Point(point.x - this.options.radius, point.y), nePoint = new L.Point(point.x + this.options.radius, point.y - height), sw = map.unproject(swPoint), ne = map.unproject(nePoint);
        return new L.LatLngBounds(sw, ne);
    },
    getLatLng: function() {
        return this._latlng;
    },
    setRadius: function(radius) {
        this.options.radius = radius;
        return this.redraw();
    },
    setInnerRadius: function(innerRadius) {
        this.options.innerRadius = innerRadius;
        return this.redraw();
    },
    setRotation: function(rotation) {
        this.options.rotation = rotation;
        return this.redraw();
    },
    setNumberOfSides: function(numberOfSides) {
        this.options.numberOfSides = numberOfSides;
        return this.redraw();
    },
    getPathString: function() {
        var anchorPoint = this.getTextAnchor();
        if (this._shape) {
            if (this._shape.tagName === "circle" || this._shape.tagName === "ellipse") {
                this._shape.setAttribute("cx", anchorPoint.x);
                this._shape.setAttribute("cy", anchorPoint.y);
            } else {
                var width = this._shape.getAttribute("width");
                var height = this._shape.getAttribute("height");
                this._shape.setAttribute("x", anchorPoint.x - Number(width) / 2);
                this._shape.setAttribute("y", anchorPoint.y - Number(height) / 2);
            }
        }
        this._path.setAttribute("shape-rendering", "geometricPrecision");
        return new L.SVGPathBuilder(this._points, this._innerPoints).build(6);
    },
    getTextAnchor: function() {
        var point = null;
        if (this._point) {
            point = new L.Point(this._point.x, this._point.y - 2 * this.options.radius);
        }
        return point;
    },
    _getPoints: function(inner) {
        var maxDegrees = !inner ? 210 : 360;
        var angleSize = !inner ? maxDegrees / 50 : maxDegrees / Math.max(this.options.numberOfSides, 3);
        var degrees = !inner ? maxDegrees : maxDegrees + this.options.rotation;
        var angle = !inner ? -30 : this.options.rotation;
        var points = [];
        var newPoint;
        var angleRadians;
        var radius = this.options.radius;
        var multiplier = Math.sqrt(.75);
        var toRad = function(number) {
            return number * L.LatLng.DEG_TO_RAD;
        };
        var startPoint = this._point;
        if (!inner) {
            points.push(startPoint);
            points.push(new L.Point(startPoint.x + multiplier * radius, startPoint.y - 1.5 * radius));
        }
        while (angle < degrees) {
            angleRadians = toRad(angle);
            newPoint = this._getPoint(angleRadians, radius, inner);
            points.push(newPoint);
            angle += angleSize;
        }
        if (!inner) {
            points.push(new L.Point(startPoint.x - multiplier * radius, startPoint.y - 1.5 * radius));
        }
        return points;
    },
    _getPoint: function(angle, radius, inner) {
        var markerRadius = radius;
        radius = !inner ? radius : this.options.innerRadius;
        return new L.Point(this._point.x + this.options.position.x + radius * Math.cos(angle), this._point.y - 2 * markerRadius + this.options.position.y - radius * Math.sin(angle));
    },
    _applyCustomStyles: function() {
        if (this.options.shapeImage || this.options.imageCircleUrl) {
            this._createShapeImage(this.options.shapeImage);
        }
    },
    toGeoJSON: function() {
        return L.Util.pointToGeoJSON.call(this);
    }
});

L.mapMarker = function(centerLatLng, options) {
    return new L.MapMarker(centerLatLng, options);
};

L.RegularPolygonMarker = L.Path.extend({
    includes: TextFunctions,
    initialize: function(centerLatLng, options) {
        L.Path.prototype.initialize ? L.Path.prototype.initialize.call(this, options) : L.setOptions(this, options);
        this._latlng = centerLatLng;
        this.options.numberOfSides = Math.max(this.options.numberOfSides, 3);
    },
    options: {
        fill: true,
        radiusX: 10,
        radiusY: 10,
        rotation: 0,
        numberOfSides: 3,
        position: {
            x: 0,
            y: 0
        },
        maxDegrees: 360,
        gradient: true,
        dropShadow: false,
        clickable: true
    },
    setLatLng: function(latlng) {
        this._latlng = latlng;
        return this.redraw();
    },
    projectLatlngs: function() {
        this._point = this._map.latLngToLayerPoint(this._latlng);
        this._points = this._getPoints();
        if (this.options.innerRadius || this.options.innerRadiusX && this.options.innerRadiusY) {
            this._innerPoints = this._getPoints(true).reverse();
        }
    },
    getBounds: function() {
        var map = this._map, radiusX = this.options.radius || this.options.radiusX, radiusY = this.options.radius || this.options.radiusY, deltaX = radiusX * Math.cos(Math.PI / 4), deltaY = radiusY * Math.sin(Math.PI / 4), point = map.project(this._latlng), swPoint = new L.Point(point.x - deltaX, point.y + deltaY), nePoint = new L.Point(point.x + deltaX, point.y - deltaY), sw = map.unproject(swPoint), ne = map.unproject(nePoint);
        return new L.LatLngBounds(sw, ne);
    },
    setRadius: function(radius) {
        this.options.radius = radius;
        return this.redraw();
    },
    setRadiusXY: function(radiusX, radiusY) {
        this.options.radius = null;
        this.options.radiusX = radiusX;
        this.options.radiusY = radiusY;
        return this.redraw();
    },
    setInnerRadius: function(innerRadius) {
        this.options.innerRadius = innerRadius;
        return this.redraw();
    },
    setInnerRadiusXY: function(innerRadiusX, innerRadiusY) {
        this.options.innerRadius = null;
        this.options.innerRadiusX = innerRadiusX;
        this.options.innerRadiusY = innerRadiusY;
        return this.redraw();
    },
    setRotation: function(rotation) {
        this.options.rotation = rotation;
        return this.redraw();
    },
    setNumberOfSides: function(numberOfSides) {
        this.options.numberOfSides = numberOfSides;
        return this.redraw();
    },
    getLatLng: function() {
        return this._latlng;
    },
    getPathString: function() {
        var anchorPoint = this.getTextAnchor();
        if (this._shape) {
            if (this._shape.tagName === "circle" || this._shape.tagName === "ellipse") {
                this._shape.setAttribute("cx", anchorPoint.x);
                this._shape.setAttribute("cy", anchorPoint.y);
            } else {
                var width = this._shape.getAttribute("width");
                var height = this._shape.getAttribute("height");
                this._shape.setAttribute("x", anchorPoint.x - Number(width) / 2);
                this._shape.setAttribute("y", anchorPoint.y - Number(height) / 2);
            }
        }
        this._path.setAttribute("shape-rendering", "geometricPrecision");
        return new L.SVGPathBuilder(this._points, this._innerPoints).build(6);
    },
    _getPoints: function(inner) {
        var maxDegrees = this.options.maxDegrees || 360;
        var angleSize = maxDegrees / Math.max(this.options.numberOfSides, 3);
        var degrees = maxDegrees;
        var angle = 0;
        var points = [];
        var newPoint;
        var angleRadians;
        var radiusX = !inner ? this.options.radius || this.options.radiusX : this.options.innerRadius || this.options.innerRadiusX;
        var radiusY = !inner ? this.options.radius || this.options.radiusY : this.options.innerRadius || this.options.innerRadiusY;
        var toRad = function(number) {
            return number * L.LatLng.DEG_TO_RAD;
        };
        while (angle < degrees) {
            angleRadians = toRad(angle);
            newPoint = this._getPoint(angleRadians, radiusX, radiusY);
            points.push(newPoint);
            angle += angleSize;
        }
        return points;
    },
    _getPoint: function(angle, radiusX, radiusY) {
        var startPoint = this.options.position ? this._point.add(new L.Point(this.options.position.x, this.options.position.y)) : this._point;
        var point = new L.Point(startPoint.x + radiusX * Math.cos(angle), startPoint.y + radiusY * Math.sin(angle));
        point.rotate(this.options.rotation, startPoint);
        return point;
    },
    _getDefaultDiameter: function(radius) {
        var angle = Math.PI / this.options.numberOfSides;
        var minLength = radius * Math.cos(angle);
        return 1.75 * minLength;
    },
    _applyCustomStyles: function() {
        if (this.options.shapeImage || this.options.imageCircleUrl) {
            this._createShapeImage(this.options.shapeImage);
        }
    },
    toGeoJSON: function() {
        return L.Util.pointToGeoJSON.call(this);
    }
});

L.regularPolygonMarker = function(centerLatLng, options) {
    return new L.RegularPolygonMarker(centerLatLng, options);
};

L.StarMarker = L.RegularPolygonMarker.extend({
    options: {
        numberOfPoints: 5,
        rotation: -15,
        maxDegrees: 360,
        gradient: true,
        dropShadow: true
    },
    setNumberOfPoints: function(numberOfPoints) {
        this.options.numberOfPoints = numberOfPoints;
        return this.redraw();
    },
    _getPoints: function(inner) {
        var maxDegrees = this.options.maxDegrees || 360;
        var angleSize = maxDegrees / this.options.numberOfPoints;
        var degrees = maxDegrees;
        var angle = 0;
        var points = [];
        var newPoint, newPointInner;
        var angleRadians;
        var radiusX = !inner ? this.options.radius || this.options.radiusX : this.options.innerRadius || this.options.innerRadiusX;
        var radiusY = !inner ? this.options.radius || this.options.radiusY : this.options.innerRadius || this.options.innerRadiusY;
        var toRad = function(number) {
            return number * L.LatLng.DEG_TO_RAD;
        };
        while (angle < degrees) {
            angleRadians = toRad(angle);
            newPoint = this._getPoint(angleRadians, radiusX, radiusY);
            newPointInner = this._getPoint(angleRadians + toRad(angleSize) / 2, radiusX / 2, radiusY / 2);
            points.push(newPoint);
            points.push(newPointInner);
            angle += angleSize;
        }
        return points;
    }
});

L.starMarker = function(centerLatLng, options) {
    return new L.StarMarker(centerLatLng, options);
};

L.TriangleMarker = L.RegularPolygonMarker.extend({
    options: {
        numberOfSides: 3,
        rotation: 30,
        radius: 5
    }
});

L.triangleMarker = function(centerLatLng, options) {
    return new L.TriangleMarker(centerLatLng, options);
};

L.DiamondMarker = L.RegularPolygonMarker.extend({
    options: {
        numberOfSides: 4,
        radiusX: 5,
        radiusY: 10
    }
});

L.diamondMarker = function(centerLatLng, options) {
    return new L.DiamondMarker(centerLatLng, options);
};

L.SquareMarker = L.RegularPolygonMarker.extend({
    options: {
        numberOfSides: 4,
        rotation: 45,
        radius: 5
    }
});

L.squareMarker = function(centerLatLng, options) {
    return new L.SquareMarker(centerLatLng, options);
};

L.PentagonMarker = L.RegularPolygonMarker.extend({
    options: {
        numberOfSides: 5,
        rotation: -18,
        radius: 5
    }
});

L.pentagonMarker = function(centerLatLng, options) {
    return new L.PentagonMarker(centerLatLng, options);
};

L.HexagonMarker = L.RegularPolygonMarker.extend({
    options: {
        numberOfSides: 6,
        rotation: 30,
        radius: 5
    }
});

L.hexagonMarker = function(centerLatLng, options) {
    return new L.HexagonMarker(centerLatLng, options);
};

L.OctagonMarker = L.RegularPolygonMarker.extend({
    options: {
        numberOfSides: 8,
        rotation: 22.5,
        radius: 5
    }
});

L.octagonMarker = function(centerLatLng, options) {
    return new L.OctagonMarker(centerLatLng, options);
};

L.SVGMarker = L.Path.extend({
    initialize: function(latlng, options) {
        L.Path.prototype.initialize.call(this, options);
        this._svg = options.svg;
        if (this._svg.indexOf("<") === 0) {
            this._data = this._svg;
        }
        this._latlng = latlng;
    },
    projectLatlngs: function() {
        this._point = this._map.latLngToLayerPoint(this._latlng);
    },
    setLatLng: function(latlng) {
        this._latlng = latlng;
        this.redraw();
    },
    getLatLng: function() {
        return this._latlng;
    },
    getPathString: function() {
        var me = this;
        var addSVG = function() {
            var g = me._path.parentNode;
            while (g.nodeName.toLowerCase() !== "g") {
                g = g.parentNode;
            }
            if (me.options.clickable) {
                g.setAttribute("class", "leaflet-clickable");
            }
            var data = me._data;
            var svg = data.nodeName.toLowerCase() === "svg" ? data.cloneNode(true) : data.querySelector("svg").cloneNode(true);
            if (me.options.setStyle) {
                me.options.setStyle.call(me, svg);
            }
            var elementWidth = svg.getAttribute("width");
            var elementHeight = svg.getAttribute("height");
            var width = elementWidth ? elementWidth.replace("px", "") : "100%";
            var height = elementHeight ? elementHeight.replace("px", "") : "100%";
            if (width === "100%") {
                width = me.options.size.x;
                height = me.options.size.y;
                svg.setAttribute("width", width + (String(width).indexOf("%") !== -1 ? "" : "px"));
                svg.setAttribute("height", height + (String(height).indexOf("%") !== -1 ? "" : "px"));
            }
            var size = me.options.size || new L.Point(width, height);
            var scaleSize = new L.Point(size.x / width, size.y / height);
            var old = g.getElementsByTagName("svg");
            if (old.length > 0) {
                old[0].parentNode.removeChild(old[0]);
            }
            g.appendChild(svg);
            var transforms = [];
            var anchor = me.options.anchor || new L.Point(-size.x / 2, -size.y / 2);
            var x = me._point.x + anchor.x;
            var y = me._point.y + anchor.y;
            transforms.push("translate(" + x + " " + y + ")");
            transforms.push("scale(" + scaleSize.x + " " + scaleSize.y + ")");
            if (me.options.rotation) {
                transforms.push("rotate(" + me.options.rotation + " " + width / 2 + " " + height / 2 + ")");
            }
            g.setAttribute("transform", transforms.join(" "));
        };
        if (!this._data) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    me._data = this.responseXML;
                    addSVG();
                }
            };
            xhr.open("GET", this._svg, true);
            xhr.send(null);
        } else {
            addSVG();
        }
    },
    toGeoJSON: function() {
        return pointToGeoJSON.call(this);
    }
});

L.MarkerGroup = L.FeatureGroup.extend({
    initialize: function(latlng, markers) {
        L.FeatureGroup.prototype.initialize.call(this, markers);
        this.setLatLng(latlng);
    },
    setStyle: function(style) {
        return this;
    },
    setLatLng: function(latlng) {
        this._latlng = latlng;
        this.eachLayer(function(layer) {
            if (layer.setLatLng) {
                layer.setLatLng(latlng);
            }
        });
        return this;
    },
    getLatLng: function(latlng) {
        return this._latlng;
    },
    toGeoJSON: function() {
        var featureCollection = {
            type: "FeatureCollection",
            features: []
        };
        var eachLayerFunction = function(featureCollection) {
            return function(layer) {
                featureCollection.features.push(L.Util.pointToGeoJSON.call(layer));
            };
        };
        this.eachLayer(eachLayerFunction(featureCollection));
        return featureCollection;
    }
});

L.BarMarker = L.Path.extend({
    initialize: function(centerLatLng, options) {
        L.Path.prototype.initialize.call(this, options);
        this._latlng = centerLatLng;
    },
    options: {
        fill: true,
        width: 2,
        maxHeight: 10,
        position: {
            x: 0,
            y: 0
        },
        weight: 1,
        color: "#000",
        opacity: 1,
        gradient: true,
        dropShadow: false,
        lineCap: "square",
        lineJoin: "miter"
    },
    setLatLng: function(latlng) {
        this._latlng = latlng;
        return this.redraw();
    },
    projectLatlngs: function() {
        this._point = this._map.latLngToLayerPoint(this._latlng);
        this._points = this._getPoints();
    },
    getBounds: function() {
        var map = this._map, point = map.project(this._latlng), halfWidth = this.options.width / 2, swPoint = new L.Point(point.x - halfWidth, point.y), nePoint = new L.Point(point.x + halfWidth, point.y - this.options.maxHeight), sw = map.unproject(swPoint), ne = map.unproject(nePoint);
        return new L.LatLngBounds(sw, ne);
    },
    getLatLng: function() {
        return this._latlng;
    },
    getPathString: function() {
        this._path.setAttribute("shape-rendering", "crispEdges");
        return new L.SVGPathBuilder(this._points).build();
    },
    _getPoints: function() {
        var points = [];
        var startX = this._point.x + this.options.position.x;
        var startY = this._point.y + this.options.position.y;
        var halfWidth = this.options.width / 2;
        var sePoint, nePoint, nwPoint, swPoint;
        var height = this.options.value / this.options.maxValue * this.options.maxHeight;
        sePoint = new L.Point(startX + halfWidth, startY);
        nePoint = new L.Point(startX + halfWidth, startY - height);
        nwPoint = new L.Point(startX - halfWidth, startY - height);
        swPoint = new L.Point(startX - halfWidth, startY);
        points = [ sePoint, nePoint, nwPoint, swPoint ];
        return points;
    }
});

L.barMarker = function(centerLatLng, options) {
    return new L.BarMarker(centerLatLng, options);
};

L.ChartMarker = L.FeatureGroup.extend({
    initialize: function(centerLatLng, options) {
        L.Util.setOptions(this, options);
        this._layers = {};
        this._latlng = centerLatLng;
        this._loadComponents();
    },
    setLatLng: function(latlng) {
        this._latlng = latlng;
        return this.redraw();
    },
    getLatLng: function() {
        return this._latlng;
    },
    _loadComponents: function() {},
    _highlight: function(options) {
        if (options.weight) {
            options.weight *= 2;
        }
        return options;
    },
    _unhighlight: function(options) {
        if (options.weight) {
            options.weight /= 2;
        }
        return options;
    },
    _bindMouseEvents: function(chartElement) {
        var self = this;
        var tooltipOptions = this.options.tooltipOptions;
        chartElement.on("mouseover", function(e) {
            var currentOptions = this.options;
            var key = currentOptions.key;
            var value = currentOptions.value;
            var layerPoint = e.layerPoint;
            var x = layerPoint.x - this._point.x;
            var y = layerPoint.y - this._point.y;
            var iconSize = currentOptions.iconSize;
            var newX = x;
            var newY = y;
            var newPoint;
            var offset = 5;
            newX = x < 0 ? iconSize.x - x + offset : -x - offset;
            newY = y < 0 ? iconSize.y - y + offset : -y - offset;
            newPoint = new L.Point(newX, newY);
            var legendOptions = {};
            var displayText = currentOptions.displayText ? currentOptions.displayText(value) : value;
            legendOptions[key] = {
                name: currentOptions.displayName,
                value: displayText
            };
            var icon = new L.LegendIcon(legendOptions, currentOptions, {
                className: "leaflet-div-icon",
                iconSize: tooltipOptions ? tooltipOptions.iconSize : iconSize,
                iconAnchor: newPoint
            });
            currentOptions.marker = new L.Marker(self._latlng, {
                icon: icon
            });
            currentOptions = self._highlight(currentOptions);
            this.initialize(self._latlng, currentOptions);
            this.redraw();
            this.setStyle(currentOptions);
            self.addLayer(currentOptions.marker);
        });
        chartElement.on("mouseout", function(e) {
            var currentOptions = this.options;
            currentOptions = self._unhighlight(currentOptions);
            this.initialize(self._latlng, currentOptions);
            this.redraw();
            this.setStyle(currentOptions);
            self.removeLayer(currentOptions.marker);
        });
    },
    bindPopup: function(content, options) {
        this.eachLayer(function(layer) {
            layer.bindPopup(content, options);
        });
    },
    openPopup: function(latlng) {
        for (var i in this._layers) {
            var layer = this._layers[i];
            latlng = latlng || this._latlng;
            layer.openPopup(latlng);
            break;
        }
    },
    closePopup: function() {
        for (var i in this._layers) {
            var layer = this._layers[i];
            latlng = latlng || this._latlng;
            layer.closePopup();
            break;
        }
    },
    redraw: function() {
        this.clearLayers();
        this._loadComponents();
    },
    toGeoJSON: function() {
        return L.Util.pointToGeoJSON.call(this);
    }
});

L.BarChartMarker = L.ChartMarker.extend({
    initialize: function(centerLatLng, options) {
        L.Util.setOptions(this, options);
        L.ChartMarker.prototype.initialize.call(this, centerLatLng, options);
    },
    options: {
        weight: 1,
        opacity: 1,
        color: "#000",
        fill: true,
        position: {
            x: 0,
            y: 0
        },
        width: 10,
        offset: 0,
        iconSize: new L.Point(50, 40)
    },
    _loadComponents: function() {
        var value, minValue, maxValue;
        var bar;
        var options = this.options;
        var x;
        var y;
        var keys = Object.keys(this.options.data);
        var count = keys.length;
        var width = this.options.width;
        var offset = this.options.offset || 0;
        var data = this.options.data;
        var chartOptions = this.options.chartOptions;
        var chartOption;
        x = -(width * count + offset * (count - 1)) / 2 + width / 2;
        y = 0;
        for (var key in data) {
            value = data[key];
            chartOption = chartOptions[key];
            minValue = chartOption.minValue || 0;
            maxValue = chartOption.maxValue || 100;
            options.fillColor = chartOption.fillColor || this.options.fillColor;
            options.value = value;
            options.minValue = minValue;
            options.maxValue = maxValue;
            options.position = {
                x: x,
                y: y
            };
            options.width = width;
            options.maxHeight = chartOption.maxHeight || 10;
            options.key = key;
            options.value = value;
            options.displayName = chartOption.displayName;
            options.opacity = this.options.opacity || 1;
            options.fillOpacity = this.options.fillOpacity || .7;
            options.weight = this.options.weight || 1;
            options.color = chartOption.color || this.options.color;
            options.displayText = chartOption.displayText;
            bar = new L.BarMarker(this._latlng, options);
            this._bindMouseEvents(bar);
            this.addLayer(bar);
            x += width + offset;
        }
    }
});

L.RadialBarMarker = L.Path.extend({
    initialize: function(centerLatLng, options) {
        L.Path.prototype.initialize.call(this, options);
        this._latlng = centerLatLng;
    },
    options: {
        fill: true,
        radius: 10,
        rotation: 0,
        numberOfSides: 30,
        position: {
            x: 0,
            y: 0
        },
        gradient: true,
        dropShadow: false
    },
    setLatLng: function(latlng) {
        this._latlng = latlng;
        return this.redraw();
    },
    projectLatlngs: function() {
        this._point = this._map.latLngToLayerPoint(this._latlng);
        this._points = this._getPoints();
    },
    getBounds: function() {
        var map = this._map, radiusX = this.options.radiusX || this.options.radius, radiusY = this.options.radiusY || this.options.radius, deltaX = radiusX * Math.cos(Math.PI / 4), deltaY = radiusY * Math.sin(Math.PI / 4), point = map.project(this._latlng), swPoint = new L.Point(point.x - deltaX, point.y + deltaY), nePoint = new L.Point(point.x + deltaX, point.y - deltaY), sw = map.unproject(swPoint), ne = map.unproject(nePoint);
        return new L.LatLngBounds(sw, ne);
    },
    getLatLng: function() {
        return this._latlng;
    },
    getPathString: function() {
        var angle = this.options.endAngle - this.options.startAngle;
        var largeArc = angle >= 180 ? "1" : "0";
        var radiusX = this.options.radiusX || this.options.radius;
        var radiusY = this.options.radiusY || this.options.radius;
        var path = "M" + this._points[0].x.toFixed(2) + "," + this._points[0].y.toFixed(2) + "A" + radiusX.toFixed(2) + "," + radiusY.toFixed(2) + " 0 " + largeArc + ",1 " + this._points[1].x.toFixed(2) + "," + this._points[1].y.toFixed(2) + "L";
        if (this._innerPoints) {
            path = path + this._innerPoints[0].x.toFixed(2) + "," + this._innerPoints[0].y.toFixed(2);
            path = path + "A" + (radiusX - this.options.barThickness).toFixed(2) + "," + (radiusY - this.options.barThickness).toFixed(2) + " 0 " + largeArc + ",0 " + this._innerPoints[1].x.toFixed(2) + "," + this._innerPoints[1].y.toFixed(2) + "z";
        } else {
            path = path + this._point.x.toFixed(2) + "," + this._point.y.toFixed(2) + "z";
        }
        if (L.Browser.vml) {
            path = Core.SVG.path(path);
        }
        this._path.setAttribute("shape-rendering", "geometricPrecision");
        return path;
    },
    _getPoints: function() {
        var angleDelta = this.options.endAngle - this.options.startAngle;
        var degrees = this.options.endAngle + this.options.rotation;
        var angle = this.options.startAngle + this.options.rotation;
        var points = [];
        var radiusX = "radiusX" in this.options ? this.options.radiusX : this.options.radius;
        var radiusY = "radiusY" in this.options ? this.options.radiusY : this.options.radius;
        var toRad = function(number) {
            return number * L.LatLng.DEG_TO_RAD;
        };
        if (angleDelta === 360) {
            degrees = degrees - .1;
        }
        var startRadians = toRad(angle);
        var endRadians = toRad(degrees);
        points.push(this._getPoint(startRadians, radiusX, radiusY));
        points.push(this._getPoint(endRadians, radiusX, radiusY));
        if (this.options.barThickness) {
            this._innerPoints = [];
            this._innerPoints.push(this._getPoint(endRadians, radiusX - this.options.barThickness, radiusY - this.options.barThickness));
            this._innerPoints.push(this._getPoint(startRadians, radiusX - this.options.barThickness, radiusY - this.options.barThickness));
        }
        return points;
    },
    _getPoint: function(angle, radiusX, radiusY) {
        return new L.Point(this._point.x + this.options.position.x + radiusX * Math.cos(angle), this._point.y + this.options.position.y + radiusY * Math.sin(angle));
    }
});

L.radialBarMarker = function(centerLatLng, options) {
    return new L.RadialBarMarker(centerLatLng, options);
};

L.PieChartMarker = L.ChartMarker.extend({
    initialize: function(centerLatLng, options) {
        L.Util.setOptions(this, options);
        L.ChartMarker.prototype.initialize.call(this, centerLatLng, options);
    },
    options: {
        weight: 1,
        opacity: 1,
        color: "#000",
        fill: true,
        radius: 10,
        rotation: 0,
        numberOfSides: 50,
        mouseOverExaggeration: 1.2,
        maxDegrees: 360,
        iconSize: new L.Point(50, 40)
    },
    _highlight: function(options) {
        var oldRadiusX = options.radiusX;
        var oldRadiusY = options.radiusY;
        var oldBarThickness = options.barThickness;
        options.oldBarThickness = oldBarThickness;
        options.oldRadiusX = oldRadiusX;
        options.oldRadiusY = oldRadiusY;
        options.radiusX *= options.mouseOverExaggeration;
        options.radiusY *= options.mouseOverExaggeration;
        options.barThickness = options.radiusX - oldRadiusX + oldBarThickness;
        return options;
    },
    _unhighlight: function(options) {
        options.radiusX = options.oldRadiusX;
        options.radiusY = options.oldRadiusY;
        options.barThickness = options.oldBarThickness;
        return options;
    },
    _loadComponents: function() {
        var value;
        var sum = 0;
        var angle = 0;
        var percentage = 0;
        var maxDegrees = this.options.maxDegrees || 360;
        var lastAngle = this.options.rotation;
        var bar;
        var options = this.options;
        var data = this.options.data;
        var chartOptions = this.options.chartOptions;
        var chartOption;
        var key;
        var getValue = function(data, key) {
            var value = 0;
            if (data[key]) {
                value = parseFloat(data[key]);
            }
            return value;
        };
        for (key in data) {
            value = getValue(data, key);
            sum += value;
        }
        if (sum > 0) {
            for (key in data) {
                value = parseFloat(data[key]);
                chartOption = chartOptions[key];
                percentage = value / sum;
                angle = percentage * maxDegrees;
                options.startAngle = lastAngle;
                options.endAngle = lastAngle + angle;
                options.fillColor = chartOption.fillColor;
                options.color = chartOption.color || "#000";
                options.radiusX = this.options.radiusX || this.options.radius;
                options.radiusY = this.options.radiusY || this.options.radius;
                options.rotation = 0;
                options.key = key;
                options.value = value;
                options.displayName = chartOption.displayName;
                options.displayText = chartOption.displayText;
                bar = new L.RadialBarMarker(this._latlng, options);
                this._bindMouseEvents(bar);
                lastAngle = options.endAngle;
                this.addLayer(bar);
            }
        }
    }
});

L.pieChartMarker = function(centerLatLng, options) {
    return new L.PieChartMarker(centerLatLng, options);
};

L.CoxcombChartMarker = L.PieChartMarker.extend({
    statics: {
        SIZE_MODE_RADIUS: "radius",
        SIZE_MODE_AREA: "area"
    }
});

L.CoxcombChartMarker = L.CoxcombChartMarker.extend({
    initialize: function(centerLatLng, options) {
        L.Util.setOptions(this, options);
        L.PieChartMarker.prototype.initialize.call(this, centerLatLng, options);
    },
    options: {
        weight: 1,
        opacity: 1,
        color: "#000",
        fill: true,
        radius: 10,
        rotation: 0,
        numberOfSides: 50,
        mouseOverExaggeration: 1.2,
        maxDegrees: 360,
        iconSize: new L.Point(50, 40),
        sizeMode: L.CoxcombChartMarker.SIZE_MODE_AREA
    },
    _loadComponents: function() {
        var value, minValue, maxValue;
        var angle = 0;
        var maxDegrees = this.options.maxDegrees || 360;
        var lastAngle = this.options.rotation;
        var bar;
        var options = this.options;
        var radiusX = "radiusX" in this.options ? this.options.radiusX : this.options.radius;
        var radiusY = "radiusY" in this.options ? this.options.radiusY : this.options.radius;
        var keys = Object.keys(this.options.data);
        var count = keys.length;
        var data = this.options.data;
        var chartOptions = this.options.chartOptions;
        var chartOption;
        angle = maxDegrees / count;
        for (var key in data) {
            value = parseFloat(data[key]);
            chartOption = chartOptions[key];
            var minValue = chartOption.minValue || 0;
            var maxValue = chartOption.maxValue;
            if (this.options.sizeMode === L.CoxcombChartMarker.SIZE_MODE_RADIUS) {
                var evalFunctionX = new L.LinearFunction(new L.Point(minValue, 0), new L.Point(maxValue, radiusX));
                var evalFunctionY = new L.LinearFunction(new L.Point(minValue, 0), new L.Point(maxValue, radiusY));
                options.radiusX = evalFunctionX.evaluate(value);
                options.radiusY = evalFunctionY.evaluate(value);
            } else {
                var radius = Math.max(radiusX, radiusY);
                var maxArea = Math.PI * Math.pow(radius, 2) / count;
                var evalFunctionArea = new L.LinearFunction(new L.Point(minValue, 0), new L.Point(maxValue, maxArea), {
                    postProcess: function(value) {
                        return Math.sqrt(count * value / Math.PI);
                    }
                });
                options.radiusX = evalFunctionArea.evaluate(value);
                options.radiusY = options.radiusX;
            }
            options.startAngle = lastAngle;
            options.endAngle = lastAngle + angle;
            options.fillColor = chartOption.fillColor;
            options.color = chartOption.color || "#000";
            options.rotation = 0;
            options.key = key;
            options.value = value;
            options.displayName = chartOption.displayName;
            options.displayText = chartOption.displayText;
            bar = new L.RadialBarMarker(this._latlng, options);
            this._bindMouseEvents(bar);
            lastAngle = options.endAngle;
            this.addLayer(bar);
        }
    }
});

L.coxcombChartMarker = function(centerLatLng, options) {
    return new L.CoxcombChartMarker(centerLatLng, options);
};

L.RadialBarChartMarker = L.ChartMarker.extend({
    initialize: function(centerLatLng, options) {
        L.Util.setOptions(this, options);
        L.ChartMarker.prototype.initialize.call(this, centerLatLng, options);
    },
    options: {
        weight: 1,
        opacity: 1,
        color: "#000",
        fill: true,
        radius: 10,
        rotation: 0,
        numberOfSides: 30,
        offset: 2,
        barThickness: 5,
        maxDegrees: 360,
        iconSize: new L.Point(50, 40)
    },
    _loadComponents: function() {
        var value, minValue, maxValue;
        var angle = this.options.rotation;
        var maxDegrees = this.options.maxDegrees || 360;
        var bar;
        var options = this.options;
        var lastRadiusX = this.options.radiusX || this.options.radius;
        var lastRadiusY = this.options.radiusY || this.options.radius;
        var data = this.options.data;
        var chartOptions = this.options.chartOptions;
        var chartOption;
        var barThickness = this.options.barThickness || 4;
        var offset = this.options.offset || 2;
        for (var key in data) {
            value = parseFloat(data[key]);
            chartOption = chartOptions[key];
            minValue = chartOption.minValue || 0;
            maxValue = chartOption.maxValue || 100;
            var angleFunction = new L.LinearFunction(new L.Point(minValue, 0), new L.Point(maxValue, maxDegrees));
            angle = angleFunction.evaluate(value);
            options.startAngle = this.options.rotation;
            options.endAngle = this.options.rotation + angle;
            options.fillColor = chartOption.fillColor;
            options.radiusX = lastRadiusX;
            options.radiusY = lastRadiusY;
            options.barThickness = barThickness;
            options.rotation = 0;
            options.key = key;
            options.value = value;
            options.displayName = chartOption.displayName;
            options.displayText = chartOption.displayText;
            options.weight = this.options.weight || 1;
            bar = new L.RadialBarMarker(this._latlng, options);
            this._bindMouseEvents(bar);
            this.addLayer(bar);
            lastRadiusX += barThickness + offset;
            lastRadiusY += barThickness + offset;
        }
    }
});

L.radialBarChartMarker = function(centerLatLng, options) {
    return new L.RadialBarChartMarker(centerLatLng, options);
};

L.StackedRegularPolygonMarker = L.ChartMarker.extend({
    options: {
        iconSize: new L.Point(50, 40)
    },
    initialize: function(centerLatLng, options) {
        L.Util.setOptions(this, options);
        L.ChartMarker.prototype.initialize.call(this, centerLatLng, options);
    },
    _loadComponents: function() {
        var value;
        var lastRadiusX = 0;
        var lastRadiusY = 0;
        var bar;
        var options = this.options;
        var data = this.options.data;
        var chartOptions = this.options.chartOptions;
        var chartOption;
        var key;
        var bars = [];
        for (key in data) {
            value = parseFloat(data[key]);
            chartOption = chartOptions[key];
            minValue = chartOption.minValue || 0;
            maxValue = chartOption.maxValue || 100;
            minRadius = chartOption.minRadius || 0;
            maxRadius = chartOption.maxRadius || 10;
            options.fillColor = chartOption.fillColor || this.options.fillColor;
            options.value = value;
            options.minValue = minValue;
            options.maxValue = maxValue;
            var evalFunction = new L.LinearFunction(new L.Point(minValue, minRadius), new L.Point(maxValue, maxRadius));
            var barThickness = evalFunction.evaluate(value);
            options.radiusX = lastRadiusX + barThickness;
            options.radiusY = lastRadiusY + barThickness;
            options.innerRadiusX = lastRadiusX;
            options.innerRadiusY = lastRadiusY;
            options.key = key;
            options.displayName = chartOption.displayName;
            options.opacity = this.options.opacity || 1;
            options.fillOpacity = this.options.fillOpacity || .7;
            options.weight = this.options.weight || 1;
            options.color = chartOption.color || this.options.color;
            options.displayText = chartOption.displayText;
            bar = new L.RegularPolygonMarker(this._latlng, options);
            this._bindMouseEvents(bar);
            lastRadiusX = options.radiusX;
            lastRadiusY = options.radiusY;
            if (this.options.drawReverse) {
                bars.push(bar);
            } else {
                this.addLayer(bar);
            }
        }
        if (this.options.drawReverse) {
            var item = bars.pop();
            while (item) {
                this.addLayer(item);
                item = bars.pop();
            }
        }
    }
});

L.RadialMeterMarker = L.ChartMarker.extend({
    initialize: function(centerLatLng, options) {
        L.Util.setOptions(this, options);
        L.ChartMarker.prototype.initialize.call(this, centerLatLng, options);
    },
    options: {
        weight: 1,
        opacity: 1,
        color: "#000",
        fill: true,
        radius: 10,
        rotation: 180,
        numberOfSides: 30,
        offset: 2,
        barThickness: 5,
        maxDegrees: 180,
        iconSize: new L.Point(50, 40),
        backgroundStyle: {
            fill: true,
            fillColor: "#707070",
            fillOpacity: .2,
            opacity: .8,
            color: "#505050"
        }
    },
    _loadComponents: function() {
        var value, minValue, maxValue;
        var startAngle = this.options.rotation;
        var maxDegrees = this.options.maxDegrees || 360;
        var bar;
        var options = this.options;
        var radiusX = this.options.radiusX || this.options.radius;
        var radiusY = this.options.radiusY || this.options.radius;
        var data = this.options.data;
        var chartOptions = this.options.chartOptions;
        var chartOption;
        var barThickness = this.options.barThickness || 4;
        var lastAngle = startAngle;
        var numSegments = this.options.numSegments || 10;
        var angleDelta = maxDegrees / numSegments;
        var displayOptions;
        for (var key in data) {
            value = parseFloat(data[key]);
            chartOption = chartOptions[key];
            displayOptions = this.options.displayOptions ? this.options.displayOptions[key] : {};
            minValue = chartOption.minValue || 0;
            maxValue = chartOption.maxValue || 100;
            var range = maxValue - minValue;
            var angle = maxDegrees / range * (value - minValue);
            var endAngle = startAngle + angle;
            var maxAngle = startAngle + maxDegrees;
            var evalFunction = new L.LinearFunction(new L.Point(startAngle, minValue), new L.Point(maxAngle, maxValue));
            while (lastAngle < endAngle) {
                options.startAngle = lastAngle;
                var delta = Math.min(angleDelta, endAngle - lastAngle);
                options.endAngle = lastAngle + delta;
                options.fillColor = chartOption.fillColor;
                options.radiusX = radiusX;
                options.radiusY = radiusY;
                options.barThickness = barThickness;
                options.rotation = 0;
                options.key = key;
                options.value = value;
                options.displayName = chartOption.displayName;
                options.displayText = chartOption.displayText;
                var evalValue = evalFunction.evaluate(lastAngle + delta);
                for (var displayKey in displayOptions) {
                    options[displayKey] = displayOptions[displayKey].evaluate ? displayOptions[displayKey].evaluate(evalValue) : displayOptions[displayKey];
                }
                bar = new L.RadialBarMarker(this._latlng, options);
                this._bindMouseEvents(bar);
                this.addLayer(bar);
                lastAngle += delta;
            }
            if (this.options.backgroundStyle) {
                if (lastAngle < maxAngle) {
                    var delta = maxAngle - lastAngle;
                    options.endAngle = lastAngle + delta;
                    options.radiusX = radiusX;
                    options.radiusY = radiusY;
                    options.barThickness = barThickness;
                    options.rotation = 0;
                    options.key = key;
                    options.value = value;
                    options.displayName = chartOption.displayName;
                    options.displayText = chartOption.displayText;
                    options.fillColor = null;
                    options.fill = false;
                    options.gradient = false;
                    for (var property in this.options.backgroundStyle) {
                        options[property] = this.options.backgroundStyle[property];
                    }
                    var evalValue = evalFunction.evaluate(lastAngle + delta);
                    bar = new L.RadialBarMarker(this._latlng, options);
                    this.addLayer(bar);
                }
            }
        }
    }
});

L.LocationModes = {
    LATLNG: function(record, index) {
        var getLocation = function(latitudeField, longitudeField) {
            var latitude = L.Util.getFieldValue(record, latitudeField);
            var longitude = L.Util.getFieldValue(record, longitudeField);
            var location = null;
            if (latitude && longitude) {
                var latlng = new L.LatLng(latitude, longitude);
                location = {
                    location: latlng,
                    text: [ latlng.lat.toFixed(3), latlng.lng.toFixed(3) ].join(", "),
                    center: latlng
                };
            }
            return location;
        };
        var location = getLocation(this.options.latitudeField, this.options.longitudeField);
        if (!location && this.options.fallbackLocationFields) {
            var index = 0;
            var fallbackLocationFields;
            while (!location && index < this.options.fallbackLocationFields.length) {
                fallbackLocationFields = this.options.fallbackLocationFields[index];
                location = getLocation(fallbackLocationFields.latitudeField, fallbackLocationFields.longitudeField);
                index++;
            }
        }
        return location;
    },
    GEOHASH: function(record, index) {
        var geohash = this.options.geohashField ? L.Util.getFieldValue(record, this.options.geohashField) : index;
        var locationInfo = decodeGeoHash(geohash);
        var bounds;
        if (locationInfo.latitude[2] && locationInfo.longitude[2]) {
            bounds = new L.LatLngBounds(new L.LatLng(locationInfo.latitude[0], locationInfo.longitude[0]), new L.LatLng(locationInfo.latitude[1], locationInfo.longitude[1]));
        }
        return {
            location: bounds,
            text: geohash,
            center: bounds.getCenter()
        };
    },
    GWCOUNTRY: function(record, index) {
        var code = this.options.codeField ? L.Util.getFieldValue(record, this.options.codeField) : index;
        var geoJSON;
        var centroid;
        var gwNoLookup = L.gwNoLookup || {};
        var countries = L.countries || {};
        var countryCentroids = L.countryCentroids || {};
        var originalCode = code.toUpperCase();
        code = originalCode;
        var gwNo = originalCode in gwNoLookup;
        if (gwNo) {
            code = gwNoLookup[originalCode] || code;
        }
        if (code) {
            geoJSON = countries[code];
            centroid = countryCentroids[code];
        } else {
            console.log("Code not found: " + originalCode);
        }
        var geoJSONLayer = new L.GeoJSON(geoJSON);
        return {
            location: geoJSONLayer,
            text: L.GeometryUtils.getName(geoJSON) || code,
            center: centroid
        };
    },
    COUNTRY: function(record, index) {
        var code = this.options.codeField ? L.Util.getFieldValue(record, this.options.codeField) : index;
        var geoJSON;
        var centroid;
        var codeLookup = L.codeLookup || {};
        var alpha2Lookup = L.alpha2Lookup || {};
        var fips2Lookup = L.fips2Lookup || {};
        var countries = L.countries || {};
        var countryCentroids = L.countryCentroids || {};
        var originalCode = code.toUpperCase();
        code = originalCode;
        if (code.length === 2) {
            code = alpha2Lookup[originalCode] || fips2Lookup[originalCode];
        } else if (code.length === 3) {
            code = codeLookup[originalCode] || code;
        }
        if (code) {
            geoJSON = countries[code];
            centroid = countryCentroids[code];
        } else {
            console.log("Code not found: " + originalCode);
        }
        var geoJSONLayer = new L.GeoJSON(geoJSON);
        return {
            location: geoJSONLayer,
            text: L.GeometryUtils.getName(geoJSON) || code,
            center: centroid
        };
    },
    STATE: function(record, index) {
        var code = this.options.codeField ? L.Util.getFieldValue(record, this.options.codeField) : index;
        var geoJSON;
        var centroid;
        var states = L.states || {};
        var stateCentroids = L.stateCentroids || {};
        var originalCode = code.toUpperCase();
        code = originalCode;
        geoJSON = states[code];
        centroid = stateCentroids[code];
        var geoJSONLayer = new L.GeoJSON(geoJSON);
        return {
            location: geoJSONLayer,
            text: L.GeometryUtils.getName(geoJSON) || code,
            center: centroid
        };
    },
    GEOJSON: function(record, index) {
        var locationField = this.options.geoJSONField;
        var geoJSON = locationField ? L.Util.getFieldValue(record, locationField) : record;
        var location = null;
        if (geoJSON) {
            var me = this;
            var recordToLayer = function(location, record) {
                return me.recordToLayer(location, record);
            };
            location = L.GeometryUtils.getGeoJSONLocation(geoJSON, record, this.options.locationTextField, recordToLayer);
        }
        return location;
    },
    LOOKUP: function(record, index) {
        var code = this.options.codeField ? L.Util.getFieldValue(record, this.options.codeField) : index;
        this._lookupIndex = this._lookupIndex || L.GeometryUtils.indexFeatureCollection(this.options.locationLookup, this.options.locationIndexField || this.options.codeField);
        var geoJSON = this._lookupIndex[code];
        var location = null;
        if (!geoJSON && code.indexOf("0") === 0) {
            geoJSON = this._lookupIndex[code.substring(1)];
        }
        if (geoJSON) {
            var me = this;
            var recordToLayer = function(location, record) {
                return me.recordToLayer(location, record);
            };
            location = L.GeometryUtils.getGeoJSONLocation(geoJSON, record, this.options.locationTextField, recordToLayer);
        }
        return location;
    },
    CUSTOM: function(record, index) {
        var locationField = this.options.codeField;
        var fieldValue = L.Util.getFieldValue(record, locationField);
        var context = {};
        var location;
        context[fieldValue] = record;
        if (this.options.getLocation) {
            var self = this;
            var callback = function(key, location) {
                self.locationToLayer(location, context[key]);
            };
            location = this.options.getLocation(context, locationField, [ fieldValue ], callback);
        }
        return location;
    }
};

L.DataLayer = L.LayerGroup.extend({
    includes: L.Mixin.Events,
    options: {
        recordsField: "features",
        locationMode: L.LocationModes.LATLNG,
        latitudeField: "geometry.coordinates.1",
        longitudeField: "geometry.coordinates.0",
        displayField: null,
        displayOptions: null,
        layerOptions: {
            numberOfSides: 4,
            radius: 10,
            weight: 1,
            color: "#000"
        },
        showLegendTooltips: true,
        tooltipOptions: {
            iconSize: new L.Point(60, 50),
            iconAnchor: new L.Point(-5, 50),
            mouseOverExaggeration: 2
        },
        setHighlight: function(layerStyle) {
            layerStyle.weight = layerStyle.weight || 1;
            layerStyle.fillOpacity = layerStyle.fillOpacity || .5;
            layerStyle.weight *= 2;
            layerStyle.fillOpacity /= 1.5;
            return layerStyle;
        },
        unsetHighlight: function(layerStyle) {
            layerStyle.weight = layerStyle.weight || 1;
            layerStyle.fillOpacity = layerStyle.fillOpacity || .25;
            layerStyle.weight /= 2;
            layerStyle.fillOpacity *= 1.5;
            return layerStyle;
        }
    },
    initialize: function(data, options) {
        L.Util.setOptions(this, options);
        L.LayerGroup.prototype.initialize.call(this, options);
        data = data || {};
        this._includeFunction = this.options.filter || this.options.includeLayer;
        this._markerFunction = this.options.getMarker || this._getMarker;
        this._addChildLayers();
        this.addData(data);
    },
    _addChildLayers: function() {
        this._boundaryLayer = new L.LayerGroup();
        this.addLayer(this._boundaryLayer);
        this._trackLayer = new L.LayerGroup();
        this.addLayer(this._trackLayer);
    },
    _zoomFunction: function(e) {
        var map = this._map;
        var self = this;
        var zoom = map.getZoom();
        if (this.options.maxZoom && zoom > this.options.maxZoom) {
            this.hiddenLayers = [];
            this.eachLayer(function(layer) {
                self.hiddenLayers.push(layer);
                map.removeLayer(layer);
            });
        } else if (this.hiddenLayers) {
            while (this.hiddenLayers.length > 0) {
                var layer = this.hiddenLayers.pop();
                map.addLayer(layer);
                if (this.options.backgroundLayer && layer.bringToBack) {
                    layer.bringToBack();
                }
            }
            this.hiddenLayers = null;
        }
    },
    onAdd: function(map) {
        L.LayerGroup.prototype.onAdd.call(this, map);
        map.on("zoomend", this._zoomFunction, this);
    },
    onRemove: function(map) {
        L.LayerGroup.prototype.onRemove.call(this, map);
        map.off("zoomend", this._zoomFunction, this);
    },
    bringToBack: function() {
        this.invoke("bringToBack");
        if (this._trackLayer) {
            this._trackLayer.invoke("bringToBack");
        }
        if (this._boundaryLayer) {
            this._boundaryLayer.invoke("bringToBack");
        }
    },
    bringToFront: function() {
        if (this._boundaryLayer) {
            this._boundaryLayer.invoke("bringToFront");
        }
        if (this._trackLayer) {
            this._trackLayer.invoke("bringToFront");
        }
        this.invoke("bringToFront");
    },
    getBounds: function() {
        var bounds;
        this.eachLayer(function(layer) {
            if (layer.getBounds) {
                if (!bounds) {
                    bounds = layer.getBounds();
                } else {
                    bounds.extend(layer.getBounds());
                }
            }
        });
        return bounds;
    },
    _getLocation: function(record, index) {
        return this.options.locationMode.call(this, record, index);
    },
    _processLocation: function(location) {
        var processedLocation = location.center;
        return processedLocation;
    },
    _styleBoundary: function(layer, options, record) {
        if (layer.setStyle) {
            var style;
            if (this.options.boundaryStyle instanceof Function) {
                style = this.options.boundaryStyle.call(this, record, layer);
            }
            style = style || this.options.boundaryStyle || L.extend({}, options, {
                fillOpacity: .2,
                clickable: false
            });
            layer.setStyle(style);
        }
        return layer;
    },
    _addBoundary: function(location, options, record) {
        var layer = location.location;
        var boundaryLayer;
        if (this.options.includeBoundary) {
            if (layer instanceof L.LatLngBounds) {
                layer = new L.Rectangle(layer);
            }
            layer = this._styleBoundary(layer, options, record);
            this._boundaryLayer.addLayer(layer);
            boundaryLayer = layer;
        }
        return boundaryLayer;
    },
    _getLayer: function(location, options, record) {
        var boundaryLayer = this._addBoundary(location, options, record);
        location = this._processLocation(location);
        var markerLayer;
        if (location) {
            markerLayer = this._markerFunction.call(this, location, options, record);
            markerLayer.boundaryLayer = boundaryLayer;
        }
        return markerLayer;
    },
    _getMarker: function(location, options, record) {
        var marker;
        if (location) {
            if (options.numberOfSides >= 30 && !(options.innerRadius || options.innerRadiusX && options.innerRadiusY)) {
                marker = new L.CircleMarker(location, options);
            } else {
                marker = new L.RegularPolygonMarker(location, options);
            }
        }
        return marker;
    },
    _preProcessRecords: function(records) {
        return records;
    },
    _shouldLoadRecord: function(record) {
        return this._includeFunction ? this._includeFunction.call(this, record) : true;
    },
    _loadRecords: function(records) {
        var location;
        records = this._preProcessRecords(records);
        for (var recordIndex in records) {
            if (records.hasOwnProperty(recordIndex)) {
                var record = records[recordIndex];
                record = this.options.deriveProperties ? this.options.deriveProperties(record) : record;
                var includeLayer = this._shouldLoadRecord(record);
                if (includeLayer) {
                    location = this._getLocation(record, recordIndex);
                    this.locationToLayer(location, record);
                }
            }
        }
    },
    _preloadLocations: function(records) {
        var locationField = this.options.codeField;
        var locationValues = [];
        var indexedRecords = {};
        for (var recordIndex in records) {
            if (records.hasOwnProperty(recordIndex)) {
                var record = records[recordIndex];
                var fieldValue = L.Util.getFieldValue(record, locationField);
                indexedRecords[fieldValue] = record;
                locationValues.push(fieldValue);
            }
        }
        if (this.options.getLocation) {
            var self = this;
            var callback = function(key, location) {
                self.locationToLayer(location, indexedRecords[key]);
            };
            this.options.getLocation(indexedRecords, locationField, locationValues, callback);
        }
    },
    setDisplayOptions: function(displayOptions) {
        this.options.displayOptions = displayOptions;
        this.reloadData();
        return this;
    },
    setDisplayOption: function(key, options) {
        this.options.displayOptions = this.options.displayOptions || {};
        if (key in this.options.displayOptions) {
            var existingOption = this.options.displayOptions[key];
            this.options.displayOptions[key] = L.extend({}, existingOption, options);
        } else {
            this.options.displayOptions[key] = options;
        }
        this.reloadData();
        return this;
    },
    setFilter: function(filterFunction) {
        this.options.filter = filterFunction;
        this.reloadData();
        return this;
    },
    setData: function(data) {
        this._data = data;
        this.reloadData();
    },
    reloadData: function() {
        if (!this._layerIndex) {
            this.clearLayers();
            this._addChildLayers();
        }
        if (this._data) {
            this.addData(this._data);
        }
        this.fire("legendChanged", this);
        return this;
    },
    addData: function(data) {
        var records = this.options.recordsField !== null && this.options.recordsField.length > 0 ? L.Util.getFieldValue(data, this.options.recordsField) : data;
        if (this.options.getIndexKey && !this._layerIndex) {
            this._layerIndex = {};
            this._boundaryIndex = {};
        }
        if (this.options.locationMode === L.LocationModes.CUSTOM && this.options.preload) {
            this._preloadLocations(records);
        } else {
            this._loadRecords(records);
        }
        this._data = data;
    },
    locationToLayer: function(location, record) {
        var layer;
        layer = this.recordToLayer(location, record);
        if (layer) {
            this.addLayer(layer);
        }
    },
    _bindMouseEvents: function(layer, layerOptions, legendDetails) {
        var self = this;
        var options = this.options;
        var setHighlight = options.setHighlight;
        var unsetHighlight = options.unsetHighlight;
        var tooltipOptions = options.tooltipOptions;
        var highlight = function(e) {
            var target = e.target;
            var layerOptions = this.options || target.options;
            var icon = new L.LegendIcon(legendDetails, layerOptions, {
                className: tooltipOptions.className || "leaflet-div-icon",
                iconSize: tooltipOptions.iconSize,
                iconAnchor: tooltipOptions.iconAnchor
            });
            var latlng = e.latlng || e.target._latlng;
            var tooltip = new L.Marker(latlng, {
                icon: icon
            });
            self.addLayer(tooltip);
            if (self.tooltip) {
                self.removeLayer(self.tooltip);
                self.tooltip = null;
            }
            self.tooltip = tooltip;
            if (setHighlight) {
                layerOptions = setHighlight(layerOptions);
            }
            if (target.setStyle) {
                target.setStyle(layerOptions);
            }
            target.isHighlighted = true;
        };
        var move = function(e) {
            if (self.tooltip) {
                self.tooltip.setLatLng(e.latlng);
            }
        };
        var unhighlight = function(e) {
            if (!e.target.isHighlighted) {
                return;
            }
            e.target.isHighlighted = false;
            if (self.tooltip) {
                self.removeLayer(self.tooltip);
                self.tooltip = null;
            }
            var target = e.target;
            var layerOptions = this.options || target.options;
            if (unsetHighlight) {
                layerOptions = unsetHighlight(layerOptions);
            }
            if (target.setStyle) {
                target.setStyle(layerOptions);
            }
        };
        var bindLayerEvents = function(layer) {
            layer.off("mouseover");
            layer.off("mouseout");
            layer.off("mousemove");
            layer.on({
                mouseover: highlight,
                mouseout: unhighlight,
                mousemove: move
            });
        };
        var bindEvents = function(layer) {
            if (layer.eachLayer) {
                layer.eachLayer(function(subLayer) {
                    bindEvents(subLayer);
                });
            } else {
                bindLayerEvents(layer);
            }
        };
        bindEvents(layer);
    },
    _getDynamicOptions: function(record) {
        var layerOptions = L.Util.extend({}, this.options.layerOptions);
        var displayOptions = this.options.displayOptions;
        var legendDetails = {};
        if (displayOptions) {
            for (var property in displayOptions) {
                var propertyOptions = displayOptions[property];
                var fieldValue = L.Util.getFieldValue(record, property);
                var valueFunction;
                var displayText = propertyOptions.displayText ? propertyOptions.displayText(fieldValue) : fieldValue;
                legendDetails[property] = {
                    name: propertyOptions.displayName,
                    value: displayText
                };
                if (propertyOptions.styles) {
                    layerOptions = L.Util.extend(layerOptions, propertyOptions.styles[fieldValue]);
                    propertyOptions.styles[fieldValue] = layerOptions;
                } else {
                    for (var layerProperty in propertyOptions) {
                        valueFunction = propertyOptions[layerProperty];
                        layerOptions[layerProperty] = valueFunction.evaluate ? valueFunction.evaluate(fieldValue) : valueFunction.call ? valueFunction.call(this, fieldValue) : valueFunction;
                    }
                }
            }
        }
        return {
            layerOptions: layerOptions,
            legendDetails: legendDetails
        };
    },
    _getIndexedLayer: function(index, location, layerOptions, record) {
        if (this.options.getIndexKey) {
            var indexKey = this.options.getIndexKey.call(this, location, record);
            if (indexKey in index) {
                layer = index[indexKey];
                var updateFunction = function(layer) {
                    if (layerOptions.radius && layer instanceof L.CircleMarker) {
                        layer.setRadius(layerOptions.radius);
                    }
                    layer.setStyle(layerOptions);
                    if (layer.setLatLng && layer.getLatLng() !== location.center) {
                        layer.setLatLng(location.center);
                    } else {
                        layer.redraw();
                    }
                };
                L.Util.updateLayer(layer, updateFunction);
                if (layer.boundaryLayer) {
                    layer.boundaryLayer = this._styleBoundary(layer.boundaryLayer, layerOptions, record);
                }
            } else {
                layer = this._getLayer(location, layerOptions, record);
                index[indexKey] = layer;
            }
            if (this.options.getTrack) {
                var shouldAdd = !layer.trackLayer;
                layer.trackLayer = this.options.getTrack.call(this, layer, location, layer.trackLayer);
                if (shouldAdd) {
                    this._trackLayer.addLayer(layer.trackLayer);
                }
            }
        } else {
            layer = this._getLayer(location, layerOptions, record);
        }
        return layer;
    },
    recordToLayer: function(location, record) {
        var layerOptions = L.Util.extend({}, this.options.layerOptions);
        var layer;
        var legendDetails = {};
        var includeLayer = true;
        var me = this;
        if (this._includeFunction) {
            includeLayer = this._includeFunction.call(this, record);
        }
        if (includeLayer) {
            var dynamicOptions = this._getDynamicOptions(record);
            layerOptions = dynamicOptions.layerOptions;
            legendDetails = dynamicOptions.legendDetails;
            if (location && layerOptions) {
                layerOptions.title = location.text;
                layer = this._getIndexedLayer(this._layerIndex, location, layerOptions, record);
                if (layer) {
                    if (this.options.showLegendTooltips) {
                        this._bindMouseEvents(layer, layerOptions, legendDetails);
                    }
                    if (this.options.onEachRecord) {
                        this.options.onEachRecord.call(this, layer, record, location, this);
                    }
                }
            }
        }
        return layer;
    },
    getLegend: function(legendOptions) {
        return this.options.getLegend ? this.options.getLegend.call(this, legendOptions) : this._getLegend(legendOptions);
    },
    _getLegendElement: function(params) {
        var displayMin;
        var displayMax;
        var i = document.createElement("i");
        var displayProperties = params.displayProperties;
        var layerOptions = params.layerOptions;
        var ignoreProperties = params.ignoreProperties;
        var displayTextFunction = params.displayTextFunction;
        var index = params.index;
        var numSegments = params.numSegments;
        var segmentWidth = params.segmentWidth;
        var minValue = params.minValue;
        var maxValue = params.maxValue;
        L.StyleConverter.applySVGStyle(i, layerOptions);
        for (var property in displayProperties) {
            if (ignoreProperties.indexOf(property) === -1) {
                valueFunction = displayProperties[property];
                if (valueFunction && (valueFunction.getBounds || displayProperties.minValue && displayProperties.maxValue)) {
                    var bounds = valueFunction.getBounds ? valueFunction.getBounds() : null;
                    var minX = bounds ? bounds[0].x : displayProperties.minValue;
                    var maxX = bounds ? bounds[1].x : displayProperties.maxValue;
                    var binFunction = new L.LinearFunction(new L.Point(0, minX), new L.Point(numSegments, maxX));
                    displayMin = minX;
                    displayMax = maxX;
                    if (displayTextFunction) {
                        displayMin = displayTextFunction(minX);
                        displayMax = displayTextFunction(maxX);
                    }
                    if (index === 0) {
                        minValue.innerHTML = displayMin;
                        maxValue.innerHTML = displayMax;
                    }
                    var segmentSize = (maxX - minX) / numSegments;
                    var x = binFunction.evaluate(index);
                    var nextX = binFunction.evaluate(index + 1);
                    var value = valueFunction.evaluate ? valueFunction.evaluate(x) : valueFunction(x);
                    var nextValue = valueFunction.evaluate ? valueFunction.evaluate(nextX) : valueFunction(nextX);
                    L.StyleConverter.setCSSProperty(i, property, value);
                    if (property === "fillColor") {
                        if (params.gradient) {
                            i.style.cssText += "background-image:linear-gradient(left , " + value + " 0%, " + nextValue + " 100%);" + "background-image:-ms-linear-gradient(left , " + value + " 0%, " + nextValue + " 100%);" + "background-image:-moz-linear-gradient(left , " + value + " 0%, " + nextValue + " 100%);" + "background-image:-webkit-linear-gradient(left , " + value + " 0%, " + nextValue + " 100%);";
                        } else {
                            i.style.cssText += "background-color:" + nextValue + ";";
                        }
                    }
                    if (property === "color") {
                        i.style.cssText += "border-top-color:" + value + ";" + "border-bottom-color:" + nextValue + ";" + "border-left-color:" + value + ";" + "border-right-color:" + nextValue + ";";
                    }
                    if (property === "weight") {
                        i.style.cssText += "border-top-width:" + value + ";" + "border-bottom-width:" + nextValue + ";" + "border-left-width:" + value + ";" + "border-right-width:" + nextValue + ";";
                    }
                    var min = segmentSize * index + minX;
                    var max = min + segmentSize;
                    if (displayTextFunction && valueFunction) {
                        min = displayTextFunction(min);
                        max = displayTextFunction(max);
                    }
                    i.setAttribute("title", min + " - " + max);
                }
            }
        }
        i.style.width = segmentWidth + "px";
        return i;
    },
    _getLegend: function(legendOptions) {
        legendOptions = legendOptions || this.options.legendOptions || {};
        var className = legendOptions.className;
        var container = document.createElement("div");
        var legendElement = L.DomUtil.create("div", "legend", container);
        var numSegments = legendOptions.numSegments || 10;
        var legendWidth = legendOptions.width || 100;
        var layerOptions = this.options.layerOptions || {};
        var weight = layerOptions.weight || 0;
        var segmentWidth = legendWidth / numSegments - 2 * weight;
        var displayText;
        var displayOptions = this.options.displayOptions || {};
        if (className) {
            L.DomUtil.addClass(legendElement, className);
        }
        if (legendOptions.title) {
            L.DomUtil.create("legend", "", legendElement).innerHTML = legendOptions.title;
        }
        var defaultFunction = function(value) {
            return value;
        };
        for (var field in displayOptions) {
            var displayProperties = displayOptions[field];
            if (!displayProperties.excludeFromLegend) {
                var displayName = displayProperties.displayName || field;
                displayText = displayProperties.displayText;
                var displayTextFunction = displayText ? displayText : defaultFunction;
                var styles = displayProperties.styles;
                L.DomUtil.create("div", "legend-title", legendElement).innerHTML = displayName;
                if (styles) {
                    legendElement.innerHTML += new L.CategoryLegend(styles).generate();
                } else {
                    var legendItems = L.DomUtil.create("div", "data-layer-legend");
                    var minValue = L.DomUtil.create("div", "min-value", legendItems);
                    var scaleBars = L.DomUtil.create("div", "scale-bars", legendItems);
                    var maxValue = L.DomUtil.create("div", "max-value", legendItems);
                    var ignoreProperties = [ "displayName", "displayText", "minValue", "maxValue" ];
                    for (var index = 0; index < numSegments; ++index) {
                        var legendParams = {
                            displayProperties: displayProperties,
                            layerOptions: layerOptions,
                            ignoreProperties: ignoreProperties,
                            displayTextFunction: displayTextFunction,
                            index: index,
                            numSegments: numSegments,
                            segmentWidth: segmentWidth,
                            minValue: minValue,
                            maxValue: maxValue,
                            gradient: legendOptions.gradient
                        };
                        var element = this._getLegendElement(legendParams);
                        scaleBars.appendChild(element);
                    }
                    legendElement.appendChild(legendItems);
                }
            }
        }
        return container.innerHTML;
    }
});

L.dataLayer = function(data, options) {
    return new L.DataLayer(data, options);
};

L.MapMarkerDataLayer = L.DataLayer.extend({
    _getMarker: function(latLng, layerOptions, record) {
        return new L.MapMarker(latLng, layerOptions);
    }
});

L.mapMarkerDataLayer = function(data, options) {
    return new L.MapMarkerDataLayer(data, options);
};

L.MarkerDataLayer = L.DataLayer.extend({
    initialize: function(data, options) {
        this._markerMap = {};
        L.DataLayer.prototype.initialize.call(this, data, options);
    },
    options: {
        recordsField: "features",
        locationMode: L.LocationModes.LATLNG,
        latitudeField: "latitude",
        longitudeField: "longitude",
        layerOptions: {
            icon: null
        },
        showLegendTooltips: false
    },
    _getMarker: function(latLng, layerOptions, record) {
        if (this.options.setIcon) {
            layerOptions.icon = this.options.setIcon.call(this, record, layerOptions);
        }
        return new L.Marker(latLng, layerOptions);
    },
    _getLegendElement: function(params) {},
    _getLegend: function(options) {
        return "<span>No legend available</span>";
    }
});

L.markerDataLayer = function(data, options) {
    return new L.MarkerDataLayer(data, options);
};

L.PanoramioLayer = L.MarkerDataLayer.extend({
    statics: {
        UPLOAD_DATE_FORMAT: "DD MMM YYYY",
        SIZE_BY_DATE: "date",
        SIZE_BY_POPULARITY: "popularity",
        SIZE_BY_NONE: "none",
        SIZES: {
            square: [ 60, 60 ],
            mini_square: [ 32, 32 ]
        },
        NUM_PHOTOS: 50
    }
});

L.PanoramioLayer = L.PanoramioLayer.extend({
    initialize: function(options) {
        L.MarkerDataLayer.prototype.initialize.call(this, {}, options);
        this._from = 0;
        this._to = L.PanoramioLayer.NUM_PHOTOS;
        this._calls = [];
    },
    options: {
        recordsField: "photos",
        latitudeField: "latitude",
        longitudeField: "longitude",
        locationMode: L.LocationModes.LATLNG,
        showLegendTooltips: false,
        sizeBy: L.PanoramioLayer.SIZE_BY_DATE,
        layerOptions: {
            opacity: 1
        },
        onEachRecord: function(layer, record) {
            var photoUrl = record["photo_file_url"];
            var title = record["photo_title"];
            var me = this;
            var width = record["width"];
            var height = record["height"];
            var offset = 2e4;
            layer.on("click", function(e) {
                var container = document.createElement("div");
                var content = L.DomUtil.create("div", "", container);
                var photo = L.DomUtil.create("img", "photo", content);
                photo.setAttribute("onload", "this.style.opacity=1;");
                photo.setAttribute("src", photoUrl);
                photo.style.width = width + "px";
                var photoInfo = L.DomUtil.create("div", "photo-info", content);
                photoInfo.style.width = width - 20 + "px";
                photoInfo.innerHTML = "<span>" + title + "</span>" + '<a class="photo-link" target="_blank" href="' + record["photo_url"] + '">' + '<img src="http://www.panoramio.com/img/glass/components/logo_bar/panoramio.png" style="height: 14px;"/>' + "</a>";
                var authorLink = L.DomUtil.create("a", "author-link", content);
                authorLink.setAttribute("target", "_blank");
                authorLink.setAttribute("href", record["owner_url"]);
                authorLink.innerHTML = "by " + record["owner_name"];
                var icon = new L.DivIcon({
                    className: "photo-details",
                    html: container.innerHTML,
                    iconAnchor: [ width / 2, height / 2 ]
                });
                var marker = new L.Marker(e.target._latlng, {
                    icon: icon,
                    zIndexOffset: offset
                });
                marker.on("click", function(e) {
                    me.removeLayer(e.target);
                });
                layer.viewedImage = marker;
                me.viewedImage = marker;
                me.addLayer(marker);
            });
            if (this.options.onEachPhoto) {
                this.options.onEachPhoto.call(this, layer, record);
            }
        },
        setIcon: function(record, options) {
            var title = L.Util.getFieldValue(record, "photo_title");
            var size = null;
            if (this._sizeFunction) {
                size = this._sizeFunction.evaluate(record.index);
            }
            var iconSize = size ? new L.Point(size, size) : L.PanoramioLayer.SIZES[this.options.size];
            var url = record["photo_file_url"].replace("/medium/", "/" + this.options.size + "/");
            var icon = new L.DivIcon({
                iconSize: iconSize,
                className: "",
                html: '<img class="photo" onload="this.style.opacity=1" title="' + title + '" src="' + url + '"/>'
            });
            return icon;
        },
        updateInterval: 3e5,
        size: "square",
        attributionText: 'Photos provided by <a href="http://www.panoramio.com"><img src="http://www.panoramio.com/img/glass/components/logo_bar/panoramio.png" style="height: 10px;"/></a>.  Photos provided by <a href="http://www.panoramio.com"><img src="http://www.panoramio.com/img/glass/components/logo_bar/panoramio.png" style="height: 10px;"/></a> are under the copyright of their owners',
        refreshEvents: "moveend",
        photoSet: "public"
    },
    includes: L.Mixin.Events,
    onAdd: function(map) {
        L.DataLayer.prototype.onAdd.call(this, map);
        if (map.attributionControl) {
            map.attributionControl.addAttribution(this.options.attributionText);
        }
        var me = this;
        var resetFunction = function(e) {
            me._from = 0;
            me._to = L.PanoramioLayer.NUM_PHOTOS;
            me.fire("requestingPhotos");
            if (me._call) {
                clearTimeout(me._call);
            }
            var request = function() {
                me.requestPhotos();
            };
            me._call = setTimeout(request, 1e3);
        };
        this.requestPhotos();
        this._interval = setInterval(resetFunction, this.options.updateInterval);
        this._resetFunction = resetFunction;
        map.on(this.options.refreshEvents, resetFunction);
    },
    onRemove: function(map) {
        L.DataLayer.prototype.onRemove.call(this, map);
        if (map.attributionControl) {
            map.attributionControl.removeAttribution(this.options.attributionText);
        }
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }
        map.off(this.options.refreshEvents, this._resetFunction);
    },
    calculateSizeByDate: function(data) {
        var photos = data.photos;
        var timestamps = [];
        for (var i = 0; i < photos.length; ++i) {
            var photo = photos[i];
            var timestamp = moment(photo["upload_date"], L.PanoramioLayer.UPLOAD_DATE_FORMAT);
            timestamps.push(timestamp);
            photos[i].index = timestamp;
        }
        timestamps.sort(function(t1, t2) {
            return t1 - t2;
        });
        var size = L.PanoramioLayer.SIZES[this.options.size][0];
        this._sizeFunction = new L.LinearFunction([ timestamps[0], size / 2 ], [ timestamps[timestamps.length - 1], size ]);
        return data;
    },
    calculateSizeByPopularity: function(data) {
        var photos = data.photos;
        for (var i = 0; i < photos.length; ++i) {
            photos[i].index = i;
        }
        var size = L.PanoramioLayer.SIZES[this.options.size][0];
        this._sizeFunction = new L.LinearFunction([ 0, size / 2 ], [ photos.length, size ]);
        return data;
    },
    next: function() {
        this._from = this._to;
        this._to = this._from + L.PanoramioLayer.NUM_PHOTOS;
        this.requestPhotos();
    },
    previous: function() {
        this._to = this._from;
        this._from = this._from - L.PanoramioLayer.NUM_PHOTOS;
        this.requestPhotos();
    },
    requestJsonp: function(url, data, callback) {
        var self = this, key = "function" + new Date().getTime(), params = [];
        data.callback = "window.LeafletDvfJsonpCallbacks." + key;
        for (property in data) {
            if (data.hasOwnProperty(property)) {
                params.push(property + "=" + encodeURIComponent(data[property]));
            }
        }
        url += (url.indexOf("?") > 0 ? "&" : "?") + params.join("&");
        if (typeof window.LeafletDvfJsonpCallbacks === "undefined") {
            window.LeafletDvfJsonpCallbacks = {};
        }
        window.LeafletDvfJsonpCallbacks[key] = function(data) {
            callback.call(self, data);
            delete window.LeafletDvfJsonpCallbacks[key];
        };
        if (this.jsonpScript) {
            document.head.removeChild(this.jsonpScript);
            this.jsonpScript = null;
        }
        this.jsonpScript = document.createElement("script");
        this.jsonpScript.setAttribute("type", "text/javascript");
        this.jsonpScript.setAttribute("async", "true");
        this.jsonpScript.setAttribute("src", url);
        document.head.appendChild(this.jsonpScript);
        return {
            abort: function() {
                if (key in window.LeafletDvfJsonpCallbacks) {
                    window.LeafletDvfJsonpCallbacks[key] = function() {
                        delete window.LeafletDvfJsonpCallbacks[key];
                    };
                }
            }
        };
    },
    requestPhotos: function() {
        var me = this;
        var bounds = this._map.getBounds();
        var southWest = bounds.getSouthWest();
        var northEast = bounds.getNorthEast();
        while (me._calls.length > 0) {
            me._calls.pop().abort();
        }
        var request = this.requestJsonp("http://www.panoramio.com/map/get_panoramas.php", {
            set: this.options.photoSet,
            from: me._from,
            to: me._to,
            minx: southWest.lng,
            miny: southWest.lat,
            maxx: northEast.lng,
            maxy: northEast.lat,
            size: "medium",
            mapfilter: "true"
        }, function(data) {
            me._count = data.count;
            if (moment && me.options.sizeBy === L.PanoramioLayer.SIZE_BY_DATE) {
                data = me.calculateSizeByDate(data);
            } else if (me.options.sizeBy === L.PanoramioLayer.SIZE_BY_POPULARITY) {
                data = me.calculateSizeByPopularity(data);
            }
            me.fire("photosAvailable", data);
            me.clearLayers();
            me.addData(data);
        });
        me._calls.push(request);
    }
});

L.panoramioLayer = function(options) {
    return new L.PanoramioLayer(options);
};

L.GeohashDataLayer = L.DataLayer.extend({
    initialize: function(data, options) {
        L.DataLayer.prototype.initialize.call(this, data, options);
    },
    options: {
        recordsField: "features",
        locationMode: L.LocationModes.GEOHASH,
        geohashField: "geohash",
        displayField: null,
        displayOptions: null,
        layerOptions: {
            weight: 1,
            color: "#000"
        },
        getIndexKey: function(location, record) {
            return location.text;
        }
    },
    _getLayer: function(geohash, layerOptions, record) {
        return new L.Rectangle(geohash.location, layerOptions);
    }
});

L.geohashDataLayer = function(data, options) {
    return new L.GeohashDataLayer(data, options);
};

L.ChoroplethDataLayer = L.DataLayer.extend({
    initialize: function(data, options) {
        L.DataLayer.prototype.initialize.call(this, data, options);
    },
    options: {
        recordsField: "features",
        locationMode: L.LocationModes.COUNTRY,
        codeField: "ISO",
        displayField: null,
        displayOptions: null,
        layerOptions: {
            weight: 1,
            color: "#000"
        },
        maxZoom: 16,
        backgroundLayer: true
    },
    _getLayer: function(location, layerOptions, record) {
        if (location.location instanceof L.LatLng) {
            location.location = this._markerFunction.call(this, location.location, layerOptions, record);
        }
        if (location.location.setStyle) {
            layerOptions.gradient = location.location instanceof L.Polyline ? false : layerOptions.gradient;
            location.location.setStyle(layerOptions);
        }
        return location.location;
    }
});

L.choroplethDataLayer = function(data, options) {
    return new L.ChoroplethDataLayer(data, options);
};

L.ChartDataLayer = L.DataLayer.extend({
    options: {
        showLegendTooltips: false
    },
    initialize: function(data, options) {
        L.DataLayer.prototype.initialize.call(this, data, options);
    },
    _getLayer: function(latLng, layerOptions, record) {
        var boundaryLayer = this._addBoundary(latLng, layerOptions, record);
        latLng = this._processLocation(latLng);
        var chartOptions = this.options.chartOptions;
        var tooltipOptions = this.options.tooltipOptions;
        var options = {};
        options = layerOptions;
        options.data = {};
        options.chartOptions = chartOptions;
        for (var key in this.options.chartOptions) {
            options.data[key] = this.options.getFieldValue ? this.options.getFieldValue.call(this, record, key) : L.Util.getFieldValue(record, key);
        }
        for (var key in tooltipOptions) {
            options[key] = tooltipOptions[key];
        }
        var marker;
        if (latLng) {
            marker = this._getMarker(latLng, options);
            marker.boundaryLayer = boundaryLayer;
        }
        return marker;
    },
    _getMarker: function(latLng, options) {},
    _getLegend: function(legendOptions) {
        var dataLayerLegend = L.DataLayer.prototype._getLegend.call(this, legendOptions);
        var legend = new L.CategoryLegend(this.options.chartOptions);
        legendOptions = legendOptions || this.options.legendOptions;
        return legend.generate(legendOptions);
    }
});

L.BarChartDataLayer = L.ChartDataLayer.extend({
    initialize: function(data, options) {
        L.ChartDataLayer.prototype.initialize.call(this, data, options);
    },
    _getMarker: function(latLng, options) {
        return new L.BarChartMarker(latLng, options);
    }
});

L.barChartDataLayer = function(data, options) {
    return new L.BarChartDataLayer(data, options);
};

L.RadialBarChartDataLayer = L.ChartDataLayer.extend({
    initialize: function(data, options) {
        L.ChartDataLayer.prototype.initialize.call(this, data, options);
    },
    _getMarker: function(latLng, options) {
        return new L.RadialBarChartMarker(latLng, options);
    }
});

L.radialBarChartDataLayer = function(data, options) {
    return new L.RadialBarChartDataLayer(data, options);
};

L.PieChartDataLayer = L.ChartDataLayer.extend({
    initialize: function(data, options) {
        L.ChartDataLayer.prototype.initialize.call(this, data, options);
    },
    _getMarker: function(latLng, options) {
        return new L.PieChartMarker(latLng, options);
    }
});

L.pieChartDataLayer = function(data, options) {
    return new L.PieChartDataLayer(data, options);
};

L.CoxcombChartDataLayer = L.ChartDataLayer.extend({
    initialize: function(data, options) {
        L.ChartDataLayer.prototype.initialize.call(this, data, options);
    },
    _getMarker: function(latLng, options) {
        return new L.CoxcombChartMarker(latLng, options);
    }
});

L.coxcombChartDataLayer = function(data, options) {
    return new L.CoxcombChartDataLayer(data, options);
};

L.StackedRegularPolygonDataLayer = L.ChartDataLayer.extend({
    initialize: function(data, options) {
        L.ChartDataLayer.prototype.initialize.call(this, data, options);
    },
    _getMarker: function(latLng, options) {
        return new L.StackedRegularPolygonMarker(latLng, options);
    }
});

L.stackedRegularPolygonDataLayer = function(data, options) {
    return new L.StackedRegularPolygonDataLayer(data, options);
};

L.StackedPieChartDataLayer = L.ChartDataLayer.extend({
    initialize: function(data, options) {
        L.ChartDataLayer.prototype.initialize.call(this, data, options);
    },
    _getMarker: function(latLng, options) {
        return new L.StackedPieChartMarker(latLng, options);
    }
});

L.stackedPieChartDataLayer = function(data, options) {
    return new L.StackedPieChartDataLayer(data, options);
};

L.RadialMeterMarkerDataLayer = L.DataLayer.extend({
    options: {
        showLegendTooltips: false
    },
    initialize: function(data, options) {
        L.DataLayer.prototype.initialize.call(this, data, options);
    },
    _getLayer: function(latLng, layerOptions, record) {
        this._addBoundary(latLng, layerOptions);
        latLng = this._processLocation(latLng);
        var chartOptions = this.options.chartOptions;
        var tooltipOptions = this.options.tooltipOptions;
        var displayOptions = this.options.displayOptions;
        var options = {};
        options = layerOptions;
        options.data = {};
        options.chartOptions = chartOptions;
        options.displayOptions = displayOptions;
        for (var key in this.options.chartOptions) {
            options.data[key] = L.Util.getFieldValue(record, key);
        }
        for (var key in tooltipOptions) {
            options[key] = tooltipOptions[key];
        }
        var marker;
        if (latLng) {
            marker = this._getMarker(latLng, options);
        }
        return marker;
    },
    _getMarker: function(latLng, options) {
        return new L.RadialMeterMarker(latLng, options);
    }
});

L.radialMeterMarkerDataLayer = function(data, options) {
    return new L.RadialMeterMarkerDataLayer(data, options);
};

L.CalloutLine = L.Path.extend({
    statics: {
        LINESTYLE: {
            ARC: "arc",
            ANGLE: "angle",
            STRAIGHT: "straight"
        },
        DIRECTION: {
            NE: "ne",
            NW: "nw",
            SE: "se",
            SW: "sw"
        }
    }
});

L.CalloutLine = L.CalloutLine.extend({
    initialize: function(latlng, options) {
        L.Util.setOptions(this, options);
        L.Path.prototype.initialize.call(this, options);
        this._latlng = latlng;
    },
    options: {
        size: new L.Point(60, 30),
        position: new L.Point(0, 0),
        color: "#FFFFFF",
        opacity: 1,
        weight: 2,
        fillColor: "#000000",
        fill: false,
        gradient: false,
        dropShadow: false,
        direction: L.CalloutLine.DIRECTION.NE,
        lineStyle: L.CalloutLine.LINESTYLE.ANGLE,
        lineCap: "butt",
        lineJoin: "miter",
        arrow: false
    },
    projectLatlngs: function() {
        this._point = this._map.latLngToLayerPoint(this._latlng);
        this._points = this._getPoints();
    },
    getEndPoint: function() {
        this.projectLatlngs();
        return this._points[this._points.length - 1];
    },
    _getPathAngle: function() {
        return new L.SVGPathBuilder(this._points, [], {
            closePath: false
        }).build(6);
    },
    _getPathArc: function() {
        var direction = (this.options.direction || L.CalloutLine.DIRECTION.NE).toLowerCase();
        var yDirection = direction[0];
        var yMultiplier = yDirection === "n" ? -1 : 1;
        var point1 = this._points[0];
        var point2 = this._points[this._points.length - 1];
        var parts = [ "M", point1.x, ",", point1.y, " Q", point1.x, ",", point1.y + yMultiplier * this.options.size.y, " ", point2.x, ",", point2.y ];
        return parts.join(" ");
    },
    _getPoints: function() {
        var x = this._point.x + this.options.position.x;
        var y = this._point.y + this.options.position.y;
        var width = this.options.size.x;
        var height = this.options.size.y;
        var direction = (this.options.direction || L.CalloutLine.DIRECTION.NE).toLowerCase();
        var points = [];
        var xDirection = direction[1];
        var yDirection = direction[0];
        var xMultiplier = xDirection === "w" ? -1 : 1;
        var yMultiplier = yDirection === "n" ? -1 : 1;
        points.push(new L.Point(x, y));
        var yEnd = y + yMultiplier * height;
        var halfWidth = width / 2;
        var angle = Math.atan(height / halfWidth);
        if (this.options.lineStyle === L.CalloutLine.LINESTYLE.ARC) {
            angle = Math.atan(Math.pow(height, 2) / halfWidth);
        } else if (this.options.lineStyle === L.CalloutLine.LINESTYLE.STRAIGHT) {
            angle = Math.atan(height / width);
        }
        this._angle = angle;
        if (this.options.lineStyle !== L.CalloutLine.LINESTYLE.STRAIGHT) {
            var elbowPoint = new L.Point(x + xMultiplier * halfWidth, yEnd);
            points.push(elbowPoint);
        }
        var endPoint = new L.Point(x + xMultiplier * width, yEnd);
        points.push(endPoint);
        return points;
    },
    getBounds: function() {
        var map = this._map, point = map.project(this._latlng), swPoint = new L.Point(point.x + this.options.position.x, point.y + this.options.position.y), nePoint = new L.Point(swPoint.x + this.options.size.x, swPoint.y - this.options.size.y), sw = map.unproject(swPoint), ne = map.unproject(nePoint);
        return new L.LatLngBounds(sw, ne);
    },
    setLatLng: function(latlng) {
        this._latlng = latlng;
        this.redraw();
    },
    getLatLng: function() {
        return this._latlng;
    },
    getPathString: function() {
        this._path.setAttribute("shape-rendering", "geometricPrecision");
        var lineStyle = this.options.lineStyle || L.CalloutLine.LINESTYLE.ANGLE;
        var path = "";
        if (lineStyle === L.CalloutLine.LINESTYLE.ANGLE || lineStyle === L.CalloutLine.LINESTYLE.STRAIGHT) {
            path += this._getPathAngle();
        } else {
            path += this._getPathArc();
        }
        return path;
    }
});

L.calloutLine = function(latlng, options) {
    return new L.CalloutLine(latlng, options);
};

L.Callout = L.LayerGroup.extend({
    options: {
        color: "#FFFFFF",
        fillColor: "#FFFFFF"
    },
    initialize: function(latlng, options) {
        L.Util.setOptions(this, options);
        L.LayerGroup.prototype.initialize.call(this, options);
        this._latlng = latlng;
    },
    onAdd: function(map) {
        L.LayerGroup.prototype.onAdd.call(this, map);
        this.addLayers();
    },
    onRemove: function(map) {
        L.LayerGroup.prototype.onRemove.call(this, map);
        this.clearLayers();
    },
    addArrow: function(angle, direction, position) {
        if (this.options.arrow) {
            var angle = L.LatLng.RAD_TO_DEG * angle;
            var numberOfSides = this.options.numberOfSides || 3;
            var radius = this.options.radius || 6;
            var startRotation = 180 / numberOfSides;
            var offsets = {
                se: startRotation + angle,
                sw: 180 + startRotation - angle,
                nw: 180 + startRotation + angle,
                ne: startRotation - angle
            };
            var rotation = offsets[direction];
            var arrow = new L.RegularPolygonMarker(this._latlng, {
                position: position,
                numberOfSides: numberOfSides,
                rotation: rotation,
                fillColor: this.options.fillColor,
                color: this.options.color,
                gradient: this.options.gradient,
                weight: this.options.weight,
                opacity: this.options.opacity,
                fillOpacity: this.options.fillOpacity,
                radius: radius,
                lineCap: "butt",
                lineJoin: "miter"
            });
            this.addLayer(arrow);
        }
    },
    addLine: function() {
        var lineOptions = {};
        for (var key in this.options) {
            if (key !== "icon") {
                lineOptions[key] = this.options[key];
            }
        }
        var calloutLine = new L.CalloutLine(this._latlng, lineOptions);
        this.addLayer(calloutLine);
        return calloutLine;
    },
    addIcon: function(direction, position) {
        var size = this.options.size;
        var icon = this.options.icon;
        var iconSize = icon.options.iconSize;
        var yDirection = direction[0];
        var xDirection = direction[1];
        var xAnchor = xDirection === "w" ? iconSize.x + size.x - position.x : -1 * (size.x + position.x);
        var yAnchor = yDirection === "n" ? iconSize.y / 2 + size.y - position.y : -1 * (-iconSize.y / 2 + size.y + position.y);
        icon.options.iconAnchor = new L.Point(xAnchor, yAnchor);
        var iconMarker = new L.Marker(this._latlng, {
            icon: icon
        });
        this.addLayer(iconMarker);
    },
    addLayers: function() {
        var direction = (this.options.direction || "ne").toLowerCase();
        var position = this.options.position || new L.Point(0, 0);
        var calloutLine;
        calloutLine = this.addLine();
        this.addIcon(direction, position);
        this.addArrow(calloutLine._angle, direction, position);
    }
});

L.callout = function(latlng, options) {
    return new L.Callout(latlng, options);
};

L.FlowLine = L.DataLayer.extend({
    statics: {
        LINE_FUNCTION: function(latlng1, latlng2, options) {
            return new L.Polyline([ latlng1, latlng2 ], options);
        },
        LINE_FUNCTION_INTERPOLATED: function(latlng1, latlng2, options) {
            var point1 = this._map.latlngToLayerPoint(latlng1);
            var point2 = this._map.latlngToLayerPoint(latlng2);
            var lineFunction = new L.LinearFunction(point1, point2);
            var numPoints = Math.ceil(point1.distanceTo(point2) / options.interpolationOptions.segmentLength);
            var points = lineFunction.samplePoints(numPoints);
        }
    }
});

L.FlowLine = L.FlowLine.extend({
    initialize: function(data, options) {
        L.Util.setOptions(this, options);
        L.DataLayer.prototype.initialize.call(this, data, options);
    },
    options: {
        getLine: L.FlowLine.LINE_FUNCTION
    },
    onEachSegment: function(record1, record2, line) {
        var deltas = {};
        if (this.options.timeField) {
            var timeValue1 = L.Util.getFieldValue(record1, this.options.timeField);
            var timeValue2 = L.Util.getFieldValue(record2, this.options.timeField);
            var format = this.options.timeFormat;
            var moment1 = format ? moment(timeValue1, format) : moment(timeValue1);
            var moment2 = format ? moment(timeValue2, format) : moment(timeValue2);
            var deltaTime = moment2.valueOf() - moment1.valueOf();
            deltas.time = deltaTime;
        }
        for (var key in this.options.displayOptions) {
            var value1 = L.Util.getFieldValue(record1, key);
            var value2 = L.Util.getFieldValue(record2, key);
            var change = value2 - value1;
            var percentChange = change / value1 * 100;
            deltas[key] = {
                from: value1,
                to: value2,
                change: change,
                percentChange: percentChange
            };
            if (deltas.time) {
                deltas[key].changeOverTime = change / deltas.time;
            }
        }
        var latlngs = line.getLatLngs();
        var distance = latlngs[0].distanceTo(latlngs[1]);
        var velocity;
        if (deltas.time) {
            velocity = distance / (deltas.time * 1e3);
        }
        if (this.options.onEachSegment) {
            this.options.onEachSegment.call(this, record1, record2, line, deltas, distance, velocity);
        }
    },
    _loadRecords: function(records) {
        var markers = [];
        this._lastRecord = null;
        for (var recordIndex in records) {
            if (records.hasOwnProperty(recordIndex)) {
                var record = records[recordIndex];
                markers = this._addRecord(record, recordIndex, markers);
            }
        }
        while (markers.length > 0) {
            this.addLayer(markers.pop());
        }
    },
    addRecord: function(record) {
        this._addRecord(record);
        return this;
    },
    _addRecord: function(record, recordIndex, markers) {
        var location = this._getLocation(record, recordIndex);
        var options = this.options.layerOptions;
        if (location) {
            var marker = this._getLayer(location, options, record);
            var line;
            var includeLayer = true;
            if (this.options.includeLayer) {
                includeLayer = this.options.includeLayer(record);
            }
            if (this._lastRecord && includeLayer) {
                var options = this._getDynamicOptions(this._lastRecord);
                line = this.options.getLine.call(this, this._lastMarker.getLatLng(), marker.getLatLng(), options.layerOptions);
                this.addLayer(line);
                this.onEachSegment(this._lastRecord, record, line);
            }
            if (includeLayer) {
                this._lastRecord = record;
                this._lastMarker = marker;
            }
        }
        return markers;
    }
});

L.flowLine = function(data, options) {
    return new L.FlowLine(data, options);
};

L.ArcedFlowLine = L.FlowLine.extend({
    options: {
        getLine: function(latlng1, latlng2, options) {
            return new L.ArcedPolyline([ latlng1, latlng2 ], options);
        }
    },
    initialize: function(data, options) {
        L.FlowLine.prototype.initialize.call(this, data, options);
    }
});

L.arcedFlowLine = function(data, options) {
    return new L.ArcedFlowLine(data, options);
};

L.ArcedPolyline = L.Path.extend({
    includes: TextFunctions,
    initialize: function(latlngs, options) {
        L.Path.prototype.initialize.call(this, options);
        this._latlngs = latlngs;
    },
    options: {
        distanceToHeight: new L.LinearFunction([ 0, 5 ], [ 1e3, 200 ]),
        color: "#FFFFFF",
        opacity: 1,
        weight: 1,
        fillColor: "#000000",
        fill: false,
        gradient: false,
        dropShadow: false,
        optimizeSpeed: false
    },
    projectLatlngs: function() {
        this._points = [];
        for (var i = 0; i < this._latlngs.length; ++i) {
            this._points.push(this._map.latLngToLayerPoint(this._latlngs[i]));
        }
    },
    getBounds: function() {
        var bounds = new L.LatLngBounds();
        for (var i = 0; i < this._latlngs.length; ++i) {
            bounds.extend(this._latlngs[i]);
        }
        return bounds;
    },
    setLatLngs: function(latlngs) {
        this._latlngs = latlngs;
        this.redraw();
    },
    getLatLngs: function() {
        return this._latlngs;
    },
    drawSegment: function(point1, point2) {
        var distance = Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
        var heightOffset = this.options.distanceToHeight.evaluate(distance);
        var parts = [ "M", point1.x, ",", point1.y, " C", point1.x, ",", point1.y - heightOffset, " ", point2.x, ",", point2.y - heightOffset, " ", point2.x, ",", point2.y ];
        return parts.join(" ");
    },
    getPathString: function() {
        if (this.options.optimizeSpeed) {
            this._path.setAttribute("shape-rendering", "optimizeSpeed");
        }
        var parts = [];
        for (var i = 0; i < this._points.length - 1; ++i) {
            parts.push(this.drawSegment(this._points[i], this._points[i + 1]));
        }
        return parts.join("");
    }
});

L.arcedPolyline = function(latlngs, options) {
    return new L.ArcedPolyline(latlngs, options);
};

L.Control.Legend = L.Control.extend({
    options: {
        position: "bottomright",
        autoAdd: true
    },
    onAdd: function(map) {
        var className = "leaflet-control-legend", container = L.DomUtil.create("div", className);
        var self = this;
        if (this.options.autoAdd) {
            map.on("layeradd", function(e) {
                var layer = e.layer;
                self.addLayer(layer);
            });
            map.on("layerremove", function(e) {
                var layer = e.layer;
                self.removeLayer(layer);
            });
        }
        this.toggleSize = L.bind(this.toggleSize, this);
        L.DomEvent.addListener(container, "mouseover", this.toggleSize).addListener(container, "mouseout", this.toggleSize).addListener(container, "touchstart", this.toggleSize).addListener(container, "touchend", this.toggleSize).addListener(container, "click", L.DomEvent.stopPropagation).addListener(container, "click", L.DomEvent.preventDefault);
        return container;
    },
    clear: function() {
        this._container.innerHTML = "";
    },
    toggleSize: function() {
        if (L.DomUtil.hasClass(this._container, "larger")) {
            L.DomUtil.removeClass(this._container, "larger");
        } else {
            L.DomUtil.addClass(this._container, "larger");
        }
    },
    redrawLayer: function(layer) {
        this.removeLayer(layer);
        this.addLayer(layer);
    },
    addLayer: function(layer) {
        var id = L.Util.stamp(layer);
        var me = this;
        if (layer.getLegend) {
            this.addLegend(id, layer.getLegend());
            layer.on("legendChanged", function() {
                me.redrawLayer(layer);
            });
        }
    },
    removeLayer: function(layer) {
        var id = L.Util.stamp(layer);
        if (layer.getLegend) {
            var element = document.getElementById(id);
            element.parentNode.removeChild(element);
            layer.off("legendChanged");
        }
    },
    addLegend: function(id, html) {
        var container = this._container, legend = document.getElementById(id);
        if (!legend) {
            legend = L.DomUtil.create("div", "", container);
            legend.id = id;
        }
        legend.innerHTML = html;
    }
});

L.control.legend = function(options) {
    return new L.Control.Legend(options);
};;/*
RainbowVis-JS 
Released under Eclipse Public License - v 1.0
*/

function Rainbow()
{
	"use strict";
	var gradients = null;
	var minNum = 0;
	var maxNum = 100;
	var colours = ['ff0000', 'ffff00', '00ff00', '0000ff']; 
	setColours(colours);
	
	function setColours (spectrum) 
	{
		if (spectrum.length < 2) {
			throw new Error('Rainbow must have two or more colours.');
		} else {
			var increment = (maxNum - minNum)/(spectrum.length - 1);
			var firstGradient = new ColourGradient();
			firstGradient.setGradient(spectrum[0], spectrum[1]);
			firstGradient.setNumberRange(minNum, minNum + increment);
			gradients = [ firstGradient ];
			
			for (var i = 1; i < spectrum.length - 1; i++) {
				var colourGradient = new ColourGradient();
				colourGradient.setGradient(spectrum[i], spectrum[i + 1]);
				colourGradient.setNumberRange(minNum + increment * i, minNum + increment * (i + 1)); 
				gradients[i] = colourGradient; 
			}

			colours = spectrum;
		}
	}

	this.setSpectrum = function () 
	{
		setColours(arguments);
		return this;
	}

	this.setSpectrumByArray = function (array)
	{
		setColours(array);
		return this;
	}

	this.colourAt = function (number)
	{
		if (isNaN(number)) {
			throw new TypeError(number + ' is not a number');
		} else if (gradients.length === 1) {
			return gradients[0].colourAt(number);
		} else {
			var segment = (maxNum - minNum)/(gradients.length);
			var index = Math.min(Math.floor((Math.max(number, minNum) - minNum)/segment), gradients.length - 1);
			return gradients[index].colourAt(number);
		}
	}

	this.colorAt = this.colourAt;

	this.setNumberRange = function (minNumber, maxNumber)
	{
		if (maxNumber > minNumber) {
			minNum = minNumber;
			maxNum = maxNumber;
			setColours(colours);
		} else {
			throw new RangeError('maxNumber (' + maxNumber + ') is not greater than minNumber (' + minNumber + ')');
		}
		return this;
	}
}

function ColourGradient() 
{
	"use strict";
	var startColour = 'ff0000';
	var endColour = '0000ff';
	var minNum = 0;
	var maxNum = 100;

	this.setGradient = function (colourStart, colourEnd)
	{
		startColour = getHexColour(colourStart);
		endColour = getHexColour(colourEnd);
	}

	this.setNumberRange = function (minNumber, maxNumber)
	{
		if (maxNumber > minNumber) {
			minNum = minNumber;
			maxNum = maxNumber;
		} else {
			throw new RangeError('maxNumber (' + maxNumber + ') is not greater than minNumber (' + minNumber + ')');
		}
	}

	this.colourAt = function (number)
	{
		return calcHex(number, startColour.substring(0,2), endColour.substring(0,2)) 
			+ calcHex(number, startColour.substring(2,4), endColour.substring(2,4)) 
			+ calcHex(number, startColour.substring(4,6), endColour.substring(4,6));
	}
	
	function calcHex(number, channelStart_Base16, channelEnd_Base16)
	{
		var num = number;
		if (num < minNum) {
			num = minNum;
		}
		if (num > maxNum) {
			num = maxNum;
		} 
		var numRange = maxNum - minNum;
		var cStart_Base10 = parseInt(channelStart_Base16, 16);
		var cEnd_Base10 = parseInt(channelEnd_Base16, 16); 
		var cPerUnit = (cEnd_Base10 - cStart_Base10)/numRange;
		var c_Base10 = Math.round(cPerUnit * (num - minNum) + cStart_Base10);
		return formatHex(c_Base10.toString(16));
	}

	function formatHex(hex) 
	{
		if (hex.length === 1) {
			return '0' + hex;
		} else {
			return hex;
		}
	} 
	
	function isHexColour(string)
	{
		var regex = /^#?[0-9a-fA-F]{6}$/i;
		return regex.test(string);
	}

	function getHexColour(string)
	{
		if (isHexColour(string)) {
			return string.substring(string.length - 6, string.length);
		} else {
			var name = string.toLowerCase();
			if (colourNames.hasOwnProperty(name)) {
				return colourNames[name];
			}
			throw new Error(string + ' is not a valid colour.');
		}
	}
	
	// Extended list of CSS colornames s taken from
	// http://www.w3.org/TR/css3-color/#svg-color
	var colourNames = {
		aliceblue: "F0F8FF",
		antiquewhite: "FAEBD7",
		aqua: "00FFFF",
		aquamarine: "7FFFD4",
		azure: "F0FFFF",
		beige: "F5F5DC",
		bisque: "FFE4C4",
		black: "000000",
		blanchedalmond: "FFEBCD",
		blue: "0000FF",
		blueviolet: "8A2BE2",
		brown: "A52A2A",
		burlywood: "DEB887",
		cadetblue: "5F9EA0",
		chartreuse: "7FFF00",
		chocolate: "D2691E",
		coral: "FF7F50",
		cornflowerblue: "6495ED",
		cornsilk: "FFF8DC",
		crimson: "DC143C",
		cyan: "00FFFF",
		darkblue: "00008B",
		darkcyan: "008B8B",
		darkgoldenrod: "B8860B",
		darkgray: "A9A9A9",
		darkgreen: "006400",
		darkgrey: "A9A9A9",
		darkkhaki: "BDB76B",
		darkmagenta: "8B008B",
		darkolivegreen: "556B2F",
		darkorange: "FF8C00",
		darkorchid: "9932CC",
		darkred: "8B0000",
		darksalmon: "E9967A",
		darkseagreen: "8FBC8F",
		darkslateblue: "483D8B",
		darkslategray: "2F4F4F",
		darkslategrey: "2F4F4F",
		darkturquoise: "00CED1",
		darkviolet: "9400D3",
		deeppink: "FF1493",
		deepskyblue: "00BFFF",
		dimgray: "696969",
		dimgrey: "696969",
		dodgerblue: "1E90FF",
		firebrick: "B22222",
		floralwhite: "FFFAF0",
		forestgreen: "228B22",
		fuchsia: "FF00FF",
		gainsboro: "DCDCDC",
		ghostwhite: "F8F8FF",
		gold: "FFD700",
		goldenrod: "DAA520",
		gray: "808080",
		green: "008000",
		greenyellow: "ADFF2F",
		grey: "808080",
		honeydew: "F0FFF0",
		hotpink: "FF69B4",
		indianred: "CD5C5C",
		indigo: "4B0082",
		ivory: "FFFFF0",
		khaki: "F0E68C",
		lavender: "E6E6FA",
		lavenderblush: "FFF0F5",
		lawngreen: "7CFC00",
		lemonchiffon: "FFFACD",
		lightblue: "ADD8E6",
		lightcoral: "F08080",
		lightcyan: "E0FFFF",
		lightgoldenrodyellow: "FAFAD2",
		lightgray: "D3D3D3",
		lightgreen: "90EE90",
		lightgrey: "D3D3D3",
		lightpink: "FFB6C1",
		lightsalmon: "FFA07A",
		lightseagreen: "20B2AA",
		lightskyblue: "87CEFA",
		lightslategray: "778899",
		lightslategrey: "778899",
		lightsteelblue: "B0C4DE",
		lightyellow: "FFFFE0",
		lime: "00FF00",
		limegreen: "32CD32",
		linen: "FAF0E6",
		magenta: "FF00FF",
		maroon: "800000",
		mediumaquamarine: "66CDAA",
		mediumblue: "0000CD",
		mediumorchid: "BA55D3",
		mediumpurple: "9370DB",
		mediumseagreen: "3CB371",
		mediumslateblue: "7B68EE",
		mediumspringgreen: "00FA9A",
		mediumturquoise: "48D1CC",
		mediumvioletred: "C71585",
		midnightblue: "191970",
		mintcream: "F5FFFA",
		mistyrose: "FFE4E1",
		moccasin: "FFE4B5",
		navajowhite: "FFDEAD",
		navy: "000080",
		oldlace: "FDF5E6",
		olive: "808000",
		olivedrab: "6B8E23",
		orange: "FFA500",
		orangered: "FF4500",
		orchid: "DA70D6",
		palegoldenrod: "EEE8AA",
		palegreen: "98FB98",
		paleturquoise: "AFEEEE",
		palevioletred: "DB7093",
		papayawhip: "FFEFD5",
		peachpuff: "FFDAB9",
		peru: "CD853F",
		pink: "FFC0CB",
		plum: "DDA0DD",
		powderblue: "B0E0E6",
		purple: "800080",
		red: "FF0000",
		rosybrown: "BC8F8F",
		royalblue: "4169E1",
		saddlebrown: "8B4513",
		salmon: "FA8072",
		sandybrown: "F4A460",
		seagreen: "2E8B57",
		seashell: "FFF5EE",
		sienna: "A0522D",
		silver: "C0C0C0",
		skyblue: "87CEEB",
		slateblue: "6A5ACD",
		slategray: "708090",
		slategrey: "708090",
		snow: "FFFAFA",
		springgreen: "00FF7F",
		steelblue: "4682B4",
		tan: "D2B48C",
		teal: "008080",
		thistle: "D8BFD8",
		tomato: "FF6347",
		turquoise: "40E0D0",
		violet: "EE82EE",
		wheat: "F5DEB3",
		white: "FFFFFF",
		whitesmoke: "F5F5F5",
		yellow: "FFFF00",
		yellowgreen: "9ACD32"
	}
}

;//fgnass.github.com/spin.js#v2.0.1
!function(a,b){"object"==typeof exports?module.exports=b():"function"==typeof define&&define.amd?define(b):a.Spinner=b()}(this,function(){"use strict";function a(a,b){var c,d=document.createElement(a||"div");for(c in b)d[c]=b[c];return d}function b(a){for(var b=1,c=arguments.length;c>b;b++)a.appendChild(arguments[b]);return a}function c(a,b,c,d){var e=["opacity",b,~~(100*a),c,d].join("-"),f=.01+c/d*100,g=Math.max(1-(1-a)/b*(100-f),a),h=j.substring(0,j.indexOf("Animation")).toLowerCase(),i=h&&"-"+h+"-"||"";return l[e]||(m.insertRule("@"+i+"keyframes "+e+"{0%{opacity:"+g+"}"+f+"%{opacity:"+a+"}"+(f+.01)+"%{opacity:1}"+(f+b)%100+"%{opacity:"+a+"}100%{opacity:"+g+"}}",m.cssRules.length),l[e]=1),e}function d(a,b){var c,d,e=a.style;for(b=b.charAt(0).toUpperCase()+b.slice(1),d=0;d<k.length;d++)if(c=k[d]+b,void 0!==e[c])return c;return void 0!==e[b]?b:void 0}function e(a,b){for(var c in b)a.style[d(a,c)||c]=b[c];return a}function f(a){for(var b=1;b<arguments.length;b++){var c=arguments[b];for(var d in c)void 0===a[d]&&(a[d]=c[d])}return a}function g(a,b){return"string"==typeof a?a:a[b%a.length]}function h(a){this.opts=f(a||{},h.defaults,n)}function i(){function c(b,c){return a("<"+b+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',c)}m.addRule(".spin-vml","behavior:url(#default#VML)"),h.prototype.lines=function(a,d){function f(){return e(c("group",{coordsize:k+" "+k,coordorigin:-j+" "+-j}),{width:k,height:k})}function h(a,h,i){b(m,b(e(f(),{rotation:360/d.lines*a+"deg",left:~~h}),b(e(c("roundrect",{arcsize:d.corners}),{width:j,height:d.width,left:d.radius,top:-d.width>>1,filter:i}),c("fill",{color:g(d.color,a),opacity:d.opacity}),c("stroke",{opacity:0}))))}var i,j=d.length+d.width,k=2*j,l=2*-(d.width+d.length)+"px",m=e(f(),{position:"absolute",top:l,left:l});if(d.shadow)for(i=1;i<=d.lines;i++)h(i,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(i=1;i<=d.lines;i++)h(i);return b(a,m)},h.prototype.opacity=function(a,b,c,d){var e=a.firstChild;d=d.shadow&&d.lines||0,e&&b+d<e.childNodes.length&&(e=e.childNodes[b+d],e=e&&e.firstChild,e=e&&e.firstChild,e&&(e.opacity=c))}}var j,k=["webkit","Moz","ms","O"],l={},m=function(){var c=a("style",{type:"text/css"});return b(document.getElementsByTagName("head")[0],c),c.sheet||c.styleSheet}(),n={lines:12,length:7,width:5,radius:10,rotate:0,corners:1,color:"#000",direction:1,speed:1,trail:100,opacity:.25,fps:20,zIndex:2e9,className:"spinner",top:"50%",left:"50%",position:"absolute"};h.defaults={},f(h.prototype,{spin:function(b){this.stop();{var c=this,d=c.opts,f=c.el=e(a(0,{className:d.className}),{position:d.position,width:0,zIndex:d.zIndex});d.radius+d.length+d.width}if(e(f,{left:d.left,top:d.top}),b&&b.insertBefore(f,b.firstChild||null),f.setAttribute("role","progressbar"),c.lines(f,c.opts),!j){var g,h=0,i=(d.lines-1)*(1-d.direction)/2,k=d.fps,l=k/d.speed,m=(1-d.opacity)/(l*d.trail/100),n=l/d.lines;!function o(){h++;for(var a=0;a<d.lines;a++)g=Math.max(1-(h+(d.lines-a)*n)%l*m,d.opacity),c.opacity(f,a*d.direction+i,g,d);c.timeout=c.el&&setTimeout(o,~~(1e3/k))}()}return c},stop:function(){var a=this.el;return a&&(clearTimeout(this.timeout),a.parentNode&&a.parentNode.removeChild(a),this.el=void 0),this},lines:function(d,f){function h(b,c){return e(a(),{position:"absolute",width:f.length+f.width+"px",height:f.width+"px",background:b,boxShadow:c,transformOrigin:"left",transform:"rotate("+~~(360/f.lines*k+f.rotate)+"deg) translate("+f.radius+"px,0)",borderRadius:(f.corners*f.width>>1)+"px"})}for(var i,k=0,l=(f.lines-1)*(1-f.direction)/2;k<f.lines;k++)i=e(a(),{position:"absolute",top:1+~(f.width/2)+"px",transform:f.hwaccel?"translate3d(0,0,0)":"",opacity:f.opacity,animation:j&&c(f.opacity,f.trail,l+k*f.direction,f.lines)+" "+1/f.speed+"s linear infinite"}),f.shadow&&b(i,e(h("#000","0 0 4px #000"),{top:"2px"})),b(d,b(i,h(g(f.color,k),"0 0 1px rgba(0,0,0,.1)")));return d},opacity:function(a,b,c){b<a.childNodes.length&&(a.childNodes[b].style.opacity=c)}});var o=e(a("group"),{behavior:"url(#default#VML)"});return!d(o,"transform")&&o.adj?i():j=d(o,"animation"),h});