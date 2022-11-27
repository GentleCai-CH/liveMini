module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1646204226403, function(require, module, exports) {
(function(caller, bus) {
  if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = bus();
    module.exports.default = module.exports;
  } else if (typeof exports === 'object') {
    exports.EventBus = bus();
  } else {
    caller.EventBus = bus();
  }
})(this, function() {
  var EventBus = function() {
    this.listeners = {};

    this.registerListener = function(event, callback, number) {
      var type = event.constructor.name;
      number = this.validateNumber(number || 'any');

      if (type !== 'Array') {
        event = [event];
      }

      event.forEach(function(e) {
        if (e.constructor.name !== 'String') {
          throw new Error(
            'Only `String` and array of `String` are accepted for the event names!'
          );
        }

        that.listeners[e] = that.listeners[e] || [];
        that.listeners[e].push({
          callback: callback,
          number: number,
        });
      });
    };

    // valiodate that the number is a vild number for the number of executions
    this.validateNumber = function(n) {
      var type = n.constructor.name;

      if (type === 'Number') {
        return n;
      } else if (type === 'String' && n.toLowerCase() === 'any') {
        return 'any';
      }

      throw new Error(
        'Only `Number` and `any` are accepted in the number of possible executions!'
      );
    };

    // return wether or not this event needs to be removed
    this.toBeRemoved = function(info) {
      var number = info.number;
      info.execution = info.execution || 0;
      info.execution++;

      if (number === 'any' || info.execution < number) {
        return false;
      }

      return true;
    };

    var that = this;
    return {
      /**
       * Attach a callback to an event
       * @param {string} eventName - name of the event.
       * @param {function} callback - callback executed when this event is triggered
       */
      on: function(eventName, callback) {
        that.registerListener.bind(that)(eventName, callback, 'any');
      },

      /**
       * Attach a callback to an event. This callback will not be executed more than once if the event is trigger mutiple times
       * @param {string} eventName - name of the event.
       * @param {function} callback - callback executed when this event is triggered
       */
      once: function(eventName, callback) {
        that.registerListener.bind(that)(eventName, callback, 1);
      },

      /**
       * Attach a callback to an event. This callback will be executed will not be executed more than the number if the event is trigger mutiple times
       * @param {number} number - max number of executions
       * @param {string} eventName - name of the event.
       * @param {function} callback - callback executed when this event is triggered
       */
      exactly: function(number, eventName, callback) {
        that.registerListener.bind(that)(eventName, callback, number);
      },

      /**
       * Kill an event with all it's callbacks
       * @param {string} eventName - name of the event.
       */
      die: function(eventName) {
        delete that.listeners[eventName];
      },

      /**
       * Kill an event with all it's callbacks
       * @param {string} eventName - name of the event.
       */
      off: function(eventName) {
        this.die(eventName);
      },

      /**
       * Remove the callback for the given event
       * @param {string} eventName - name of the event.
       * @param {callback} callback - the callback to remove (undefined to remove all of them).
       */
      detach: function(eventName, callback) {
        if (callback === undefined) {
          that.listeners[eventName] = [];
          return true;
        }

        for (var k in that.listeners[eventName]) {
          if (
            that.listeners[eventName].hasOwnProperty(k) &&
            that.listeners[eventName][k].callback === callback
          ) {
            that.listeners[eventName].splice(k, 1);
            return this.detach(eventName, callback);
          }
        }

        return true;
      },

      /**
       * Remove all the events
       */
      detachAll: function() {
        for (var eventName in that.listeners) {
          if (that.listeners.hasOwnProperty(eventName)) {
            this.detach(eventName);
          }
        }
      },

      /**
       * Emit the event
       * @param {string} eventName - name of the event.
       */
      emit: function(eventName, context) {
        var listeners = [];
        for (var name in that.listeners) {
          if (that.listeners.hasOwnProperty(name)) {
            if (name === eventName) {
              //TODO: this lib should definitely use > ES5
              Array.prototype.push.apply(listeners, that.listeners[name]);
            }

            if (name.indexOf('*') >= 0) {
              var newName = name.replace(/\*\*/, '([^.]+.?)+');
              newName = newName.replace(/\*/g, '[^.]+');

              var match = eventName.match(newName);
              if (match && eventName === match[0]) {
                Array.prototype.push.apply(listeners, that.listeners[name]);
              }
            }
          }
        }

        var parentArgs = arguments;

        context = context || this;
        listeners.forEach(function(info, index) {
          var callback = info.callback;
          var number = info.number;

          if (context) {
            callback = callback.bind(context);
          }

          var args = [];
          Object.keys(parentArgs).map(function(i) {
            if (i > 1) {
              args.push(parentArgs[i]);
            }
          });

          // this event cannot be fired again, remove from the stack
          if (that.toBeRemoved(info)) {
            that.listeners[eventName].splice(index, 1);
          }

          callback.apply(null, args);
        });
      },
    };
  };

  return EventBus;
});

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1646204226403);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map