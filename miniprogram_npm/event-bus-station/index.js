module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1646204226400, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var EventBus_1 = require("./EventBus");
exports.EventBus = EventBus_1.default;
//# sourceMappingURL=index.js.map
}, function(modId) {var map = {"./EventBus":1646204226401}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1646204226401, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var EventBus = /** @class */ (function () {
    function EventBus() {
        this.events = {};
    }
    EventBus.prototype.on = function (name, callback) {
        this.events[name] = this.events[name] || new Map();
        this.events[name].set(callback, false);
        return this;
    };
    EventBus.prototype.once = function (name, callback) {
        this.events[name] = this.events[name] || new Map();
        this.events[name].set(callback, true);
        return this;
    };
    EventBus.prototype.off = function (name, callback) {
        var event = this.events[name];
        if (event) {
            if (callback) {
                event.delete(callback);
            }
            else {
                delete this.events[name];
            }
        }
        return this;
    };
    EventBus.prototype.emit = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var event = this.events[name];
        if (event) {
            event.forEach(function (once, callback) {
                callback.apply(void 0, args);
                if (once) {
                    event.delete(callback);
                }
            });
        }
        return this;
    };
    return EventBus;
}());
exports.default = EventBus;
//# sourceMappingURL=EventBus.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1646204226400);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map