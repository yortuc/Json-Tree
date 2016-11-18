"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

/*
 *  default rules for rendering basic types
 */
var rules = [
/* null */
function (name, value) {
  return value === null ? _react2["default"].createElement(EditorString, { name: name, value: "null" }) : null;
},

/* function */
function (name, value) {
  return typeof value === "function" ? _react2["default"].createElement(EditorFunc, { name: name, value: value }) : null;
},

/* iso date-time */
function (name, value) {
  return typeof value === "string" && !isNaN(Date.parse(value)) ? _react2["default"].createElement(EditorDate, { name: name, value: value }) : null;
}, //

/* url */
function (name, value) {
  return typeof value === "string" && (value.indexOf("http://") === 0 || value.indexOf("https://") === 0 || value.indexOf("www.") === 0) ? _react2["default"].createElement(EditorLink, { name: name, value: value }) : null;
},

/* string */
function (name, value) {
  return typeof value === "string" ? _react2["default"].createElement(EditorString, { name: name, value: value }) : null;
},

/* number */
function (name, value) {
  return typeof value === "number" ? _react2["default"].createElement(EditorNumeric, { name: name, value: value }) : null;
},

/* boolean */
function (name, value) {
  return typeof value === "boolean" ? _react2["default"].createElement(EditorBoolean, { name: name, value: value }) : null;
},

/* iterator */
function (name, value) {
  return typeof value === "object" && !Array.isArray(value) && typeof value[Symbol.iterator] === 'function' ? _react2["default"].createElement(EditorArray, { value: Array.from(value), name: name + "[iterable]" }) : null;
},

/* array */
function (name, value) {
  return typeof value === "object" && Array.isArray(value) ? _react2["default"].createElement(EditorArray, { value: value, name: name + " [" + value.length + "]" }) : null;
},

/* object */
function (name, value) {
  return typeof value === "object" ? _react2["default"].createElement(EditorObject, { value: value, name: name + " {" + Object.keys(value).length + "}" }) : null;
}];

/*
*   main tree
*/

var JsonTree = (function (_Component) {
  _inherits(JsonTree, _Component);

  function JsonTree(props) {
    _classCallCheck(this, JsonTree);

    _get(Object.getPrototypeOf(JsonTree.prototype), "constructor", this).call(this, props);

    this.state = {};

    // merge rules with customs
    rules = Array.prototype.concat(this.props.rules || [], rules);

    // check the parameter, if its json string or js object
    if (typeof this.props.data === "string") {
      try {
        var obj = JSON.parse(this.props.data);
        this._dataObject = obj;
      } catch (err) {
        throw "iso-json-tree data parse error. json string cannot be converted to object. " + err;
        this._dataObject = {};
      }
    } else if (typeof this.props.data === "object") {
      this._dataObject = this.props.data;
    } else {
      throw "iso-json-tree data is not in the expected format.";
    }
  }

  _createClass(JsonTree, [{
    key: "render",
    value: function render() {
      return _react2["default"].createElement(
        "div",
        { className: "JsonTree-Tree" },
        _react2["default"].createElement(KeyValue, { name: this.props.title || "", value: this._dataObject })
      );
    }
  }]);

  return JsonTree;
})(_react.Component);

JsonTree.propTypes = {
  title: _react2["default"].PropTypes.string,
  rules: _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.func),
  data: [_react2["default"].PropTypes.object, _react2["default"].PropTypes.string]
};

/*
*   key-value pairs
*/

var KeyValue = (function (_Component2) {
  _inherits(KeyValue, _Component2);

  function KeyValue() {
    _classCallCheck(this, KeyValue);

    _get(Object.getPrototypeOf(KeyValue.prototype), "constructor", this).apply(this, arguments);
  }

  /*
   *  Collapsable panel component
   */

  _createClass(KeyValue, [{
    key: "render",
    value: function render() {
      var ret;

      for (var i = 0; i < rules.length; i++) {
        var processed = rules[i](this.props.name, this.props.value);
        if (processed) {
          ret = processed;
          break;
        }
      }

      return ret;
    }
  }]);

  return KeyValue;
})(_react.Component);

var Collapsable = (function (_Component3) {
  _inherits(Collapsable, _Component3);

  function Collapsable(props) {
    _classCallCheck(this, Collapsable);

    _get(Object.getPrototypeOf(Collapsable.prototype), "constructor", this).call(this, props);
    this.state = { collapsed: false };
  }

  _createClass(Collapsable, [{
    key: "toggle",
    value: function toggle(e) {
      e.preventDefault();
      this.setState({ collapsed: !this.state.collapsed });
    }
  }, {
    key: "render",
    value: function render() {
      return _react2["default"].createElement(
        "div",
        { className: "JsonTree-Node-Item" },
        _react2["default"].createElement(
          "div",
          { className: "JsonTree-Node-Key" },
          _react2["default"].createElement(
            "a",
            { href: "#", onClick: this.toggle.bind(this), className: "Collapsable-Arrow" + (this.state.collapsed ? "" : " Open") },
            "▼"
          ),
          _react2["default"].createElement(
            "a",
            { href: "#", onClick: this.toggle.bind(this) },
            this.props.title
          )
        ),
        _react2["default"].createElement(
          "div",
          { className: "Collapsable-Content JsonTree-Node-Value child-element" + (this.state.collapsed ? " hidden" : "") },
          this.props.children
        )
      );
    }
  }]);

  return Collapsable;
})(_react.Component);

var EditorString = (function (_Component4) {
  _inherits(EditorString, _Component4);

  function EditorString() {
    _classCallCheck(this, EditorString);

    _get(Object.getPrototypeOf(EditorString.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(EditorString, [{
    key: "getLabel",
    value: function getLabel() {
      return _react2["default"].createElement(
        "span",
        { className: "JsonTree-Node-Value-String" },
        "\"" + this.props.value + "\""
      );
    }
  }, {
    key: "render",
    value: function render() {
      return _react2["default"].createElement(
        "div",
        { className: "JsonTree-Node-Item" },
        _react2["default"].createElement(
          "div",
          { className: "JsonTree-Node-Key" },
          this.props.name,
          " : "
        ),
        _react2["default"].createElement(
          "div",
          { className: "JsonTree-Node-Value" },
          this.getLabel()
        )
      );
    }
  }]);

  return EditorString;
})(_react.Component);

var EditorLink = (function (_EditorString) {
  _inherits(EditorLink, _EditorString);

  function EditorLink() {
    _classCallCheck(this, EditorLink);

    _get(Object.getPrototypeOf(EditorLink.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(EditorLink, [{
    key: "getLabel",
    value: function getLabel() {
      return _react2["default"].createElement(
        "span",
        { className: "JsonTree-Node-Value-String" },
        "\"",
        _react2["default"].createElement(
          "a",
          { href: this.props.value, target: "_blank" },
          this.props.value
        ),
        "\""
      );
    }
  }]);

  return EditorLink;
})(EditorString);

var EditorNumeric = (function (_EditorString2) {
  _inherits(EditorNumeric, _EditorString2);

  function EditorNumeric() {
    _classCallCheck(this, EditorNumeric);

    _get(Object.getPrototypeOf(EditorNumeric.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(EditorNumeric, [{
    key: "getLabel",
    value: function getLabel() {
      return _react2["default"].createElement(
        "span",
        { className: "JsonTree-Node-Value-Number" },
        this.props.value
      );
    }
  }]);

  return EditorNumeric;
})(EditorString);

var EditorBoolean = (function (_EditorString3) {
  _inherits(EditorBoolean, _EditorString3);

  function EditorBoolean() {
    _classCallCheck(this, EditorBoolean);

    _get(Object.getPrototypeOf(EditorBoolean.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(EditorBoolean, [{
    key: "getLabel",
    value: function getLabel() {
      return _react2["default"].createElement(
        "span",
        { className: "JsonTree-Node-Value-Number" },
        JSON.stringify(this.props.value)
      );
    }
  }]);

  return EditorBoolean;
})(EditorString);

var EditorDate = (function (_EditorString4) {
  _inherits(EditorDate, _EditorString4);

  function EditorDate() {
    _classCallCheck(this, EditorDate);

    _get(Object.getPrototypeOf(EditorDate.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(EditorDate, [{
    key: "formatDate",
    value: function formatDate(strDate) {
      var today = new Date(strDate);
      var dd = today.getDate();
      var mm = today.getMonth() + 1;
      var yyyy = today.getFullYear();

      if (dd < 10) dd = '0' + dd;
      if (mm < 10) mm = '0' + mm;

      return dd + '.' + mm + '.' + yyyy;
    }
  }, {
    key: "getLabel",
    value: function getLabel() {
      return _react2["default"].createElement(
        "span",
        { className: "JsonTree-Node-Value-Number" },
        this.formatDate(this.props.value)
      );
    }
  }]);

  return EditorDate;
})(EditorString);

var EditorArray = (function (_EditorString5) {
  _inherits(EditorArray, _EditorString5);

  function EditorArray() {
    _classCallCheck(this, EditorArray);

    _get(Object.getPrototypeOf(EditorArray.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(EditorArray, [{
    key: "render",
    value: function render() {
      return _react2["default"].createElement(
        Collapsable,
        { title: this.props.name },
        this.props.value.map(function (item, index) {
          return _react2["default"].createElement(KeyValue, { name: index, value: item });
        })
      );
    }
  }]);

  return EditorArray;
})(EditorString);

var EditorObject = (function (_EditorString6) {
  _inherits(EditorObject, _EditorString6);

  function EditorObject() {
    _classCallCheck(this, EditorObject);

    _get(Object.getPrototypeOf(EditorObject.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(EditorObject, [{
    key: "render",
    value: function render() {
      var _this = this;

      return _react2["default"].createElement(
        Collapsable,
        { title: this.props.name },
        Object.keys(this.props.value).map(function (item) {
          return _react2["default"].createElement(KeyValue, { name: item, value: _this.props.value[item] });
        })
      );
    }
  }]);

  return EditorObject;
})(EditorString);

var EditorFunc = (function (_EditorString7) {
  _inherits(EditorFunc, _EditorString7);

  function EditorFunc() {
    _classCallCheck(this, EditorFunc);

    _get(Object.getPrototypeOf(EditorFunc.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(EditorFunc, [{
    key: "getParamNames",
    value: function getParamNames() {
      /*
        http://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically-from-javascript
      */
      var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
      var ARGUMENT_NAMES = /([^\s,]+)/g;

      var fnStr = this.props.value.toString().replace(STRIP_COMMENTS, '');
      var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
      if (result === null) result = [];
      return result;
    }
  }, {
    key: "render",
    value: function render() {
      var sourceCode = this.props.value.toString().split('\n');

      return _react2["default"].createElement(
        Collapsable,
        { title: this.props.value.name + "(" + this.getParamNames() + ")" },
        _react2["default"].createElement(
          "div",
          { className: "JsonTree-Node-Item JsonTree-Node-Value-Func" },
          sourceCode.map(function (line) {
            return _react2["default"].createElement(
              "div",
              { className: "JsonTree-Node-Value-Func-Line" },
              line
            );
          })
        )
      );
    }
  }]);

  return EditorFunc;
})(EditorString);

exports["default"] = JsonTree;
module.exports = exports["default"];