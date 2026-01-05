"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
var react_1 = require("react");
var UserWarning_1 = require("./UserWarning");
var USER_ID = 0;
var App = function () {
    if (!USER_ID) {
        return <UserWarning_1.UserWarning />;
    }
    return (<section className="section container">
      <p className="title is-4">
        Copy all you need from the prev task:
        <br />
        <a href="https://github.com/mate-academy/react_todo-app-add-and-delete#react-todo-app-add-and-delete">
          React Todo App - Add and Delete
        </a>
      </p>

      <p className="subtitle">Styles are already copied</p>
    </section>);
};
exports.App = App;
