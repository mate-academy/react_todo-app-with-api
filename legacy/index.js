"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("react-dom/client");
require("bulma/css/bulma.css");
require("@fortawesome/fontawesome-free/css/all.css");
require("./styles/index.scss");
var App_1 = require("./App");
(0, client_1.createRoot)(document.getElementById('root')).render(<App_1.App />);
