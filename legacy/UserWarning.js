"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserWarning = void 0;
var react_1 = require("react");
var UserWarning = function () { return (<section className="section">
    <p className="box is-size-3">
      Please get your <b> userId </b>{' '}
      <a href="https://mate-academy.github.io/react_student-registration">
        here
      </a>{' '}
      and save it in the app <pre>const USER_ID = ...</pre>
      All requests to the API must be sent with this
      <b> userId.</b>
    </p>
  </section>); };
exports.UserWarning = UserWarning;
