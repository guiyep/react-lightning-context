import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React from 'react';
import T from 'prop-types';
import addons from '@storybook/addons';
import JsonView from 'react-json-view';
import { ADDON_ID, ADDON_PANEL_ID, ADDON_EVENT_CHANGE, ADDON_EVENT_RESET } from './constants';
var styles = {
  panel: {
    margin: 10,
    fontFamily: 'Arial',
    fontSize: 14,
    color: '#444',
    width: '100%',
    overflow: 'auto'
  },
  currentState: {
    whiteSpace: 'pre'
  },
  resetButton: {
    position: 'absolute',
    bottom: 11,
    right: 10,
    border: 'none',
    borderTop: 'solid 1px rgba(0, 0, 0, 0.2)',
    borderLeft: 'solid 1px rgba(0, 0, 0, 0.2)',
    background: 'rgba(255, 255, 255, 0.5)',
    padding: '5px 10px',
    borderRadius: '4px 0 0 0',
    color: 'rgba(0, 0, 0, 0.5)',
    outline: 'none'
  }
};

var StatePanel =
/*#__PURE__*/
function (_React$Component) {
  _inherits(StatePanel, _React$Component);

  function StatePanel() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, StatePanel);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(StatePanel)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      storyState: null
    });

    _defineProperty(_assertThisInitialized(_this), "handleChangeEvent", function (_ref) {
      var storyState = _ref.state;

      _this.setState({
        storyState: storyState
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleResetClick", function () {
      var channel = _this.props.channel;
      channel.emit(ADDON_EVENT_RESET);
    });

    return _this;
  }

  _createClass(StatePanel, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var channel = this.props.channel;
      channel.on(ADDON_EVENT_CHANGE, this.handleChangeEvent);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var channel = this.props.channel;
      channel.removeListener(ADDON_EVENT_CHANGE, this.handleChangeEvent);
    }
  }, {
    key: "render",
    value: function render() {
      var storyState = this.state.storyState;
      var active = this.props.active;

      if (active === false || storyState === null) {
        return null;
      }

      return React.createElement("div", {
        style: styles.panel
      }, React.createElement(JsonView, {
        src: storyState,
        name: null,
        enableClipboard: false
      }), React.createElement("button", {
        style: styles.resetButton,
        type: "button",
        onClick: this.handleResetClick
      }, "Reset"));
    }
  }]);

  return StatePanel;
}(React.Component);

_defineProperty(StatePanel, "propTypes", {
  channel: T.object,
  api: T.object,
  active: T.bool.isRequired
});

export function register() {
  addons.register(ADDON_ID, function (api) {
    var channel = addons.getChannel();
    addons.addPanel(ADDON_PANEL_ID, {
      title: 'State',
      render: function render(_ref2) {
        var active = _ref2.active,
            key = _ref2.key;
        return React.createElement(StatePanel, {
          channel: channel,
          api: api,
          key: key,
          active: active
        });
      }
    });
  });
}