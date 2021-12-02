import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _objectSpread from "@babel/runtime/helpers/objectSpread";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import React from 'react';
import T from 'prop-types';
import addons from '@storybook/addons';
import { ADDON_EVENT_CHANGE, ADDON_EVENT_RESET } from './constants';
export var Store =
/*#__PURE__*/
function () {
  function Store(initialState) {
    _classCallCheck(this, Store);

    this.initialState = Object.freeze(_objectSpread({}, initialState));
    this.state = this.initialState;
    this.handlers = [];
  }

  _createClass(Store, [{
    key: "set",
    value: function set(state) {
      this.state = Object.freeze(_objectSpread({}, this.state, state));
      this.fireStateChange();
    }
  }, {
    key: "reset",
    value: function reset() {
      if (this.initialState !== this.state) {
        this.state = this.initialState;
        this.fireStateChange();
      }
    }
  }, {
    key: "subscribe",
    value: function subscribe(handler) {
      if (this.handlers.indexOf(handler) < 0) {
        this.handlers.push(handler);
      }
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(handler) {
      var handlerIndex = this.handlers.indexOf(handler);

      if (handlerIndex >= 0) {
        this.handlers.splice(handlerIndex, 1);
      }
    }
  }, {
    key: "fireStateChange",
    value: function fireStateChange() {
      var state = this.state;
      this.handlers.forEach(function (handler) {
        return handler(state);
      });
    }
  }]);

  return Store;
}();
export var StoryState =
/*#__PURE__*/
function (_React$Component) {
  _inherits(StoryState, _React$Component);

  function StoryState() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, StoryState);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(StoryState)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      storyState: _this.props.store.state
    });

    _defineProperty(_assertThisInitialized(_this), "handleResetEvent", function () {
      var store = _this.props.store;
      store.reset();
    });

    _defineProperty(_assertThisInitialized(_this), "handleStateChange", function (storyState) {
      var channel = _this.props.channel;

      _this.setState({
        storyState: storyState
      });

      channel.emit(ADDON_EVENT_CHANGE, {
        state: storyState
      });
    });

    return _this;
  }

  _createClass(StoryState, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
          store = _this$props.store,
          channel = _this$props.channel;
      store.subscribe(this.handleStateChange);
      channel.on(ADDON_EVENT_RESET, this.handleResetEvent);
      channel.emit(ADDON_EVENT_CHANGE, {
        state: store.state
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this$props2 = this.props,
          store = _this$props2.store,
          channel = _this$props2.channel;
      store.unsubscribe(this.handleStateChange);
      channel.removeListener(ADDON_EVENT_RESET, this.handleResetEvent);
      channel.emit(ADDON_EVENT_CHANGE, {
        state: null
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          store = _this$props3.store,
          storyFn = _this$props3.storyFn,
          context = _this$props3.context;
      var child = context ? storyFn(context) : storyFn(store);
      return React.isValidElement(child) ? child : child();
    }
  }]);

  return StoryState;
}(React.Component);

_defineProperty(StoryState, "propTypes", {
  channel: T.object.isRequired,
  store: T.object.isRequired,
  storyFn: T.func.isRequired,
  context: T.object
});

export function withState(initialState) {
  var storyFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var store = new Store(initialState || {});
  var channel = addons.getChannel();

  if (storyFn) {
    // Support legacy withState signature
    return function () {
      return React.createElement(StoryState, {
        store: store,
        storyFn: storyFn,
        channel: channel
      });
    };
  } else {
    return function (storyFn) {
      return function (context) {
        return React.createElement(StoryState, {
          store: store,
          storyFn: storyFn,
          channel: channel,
          context: _objectSpread({}, context, {
            store: store
          })
        });
      };
    };
  }
}