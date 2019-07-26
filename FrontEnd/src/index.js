import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Router from './router'
import * as serviceWorker from './serviceWorker';

class ReplayUIApp extends Component {
    render() {
        return (
            <Router />
            )
    }
}

ReactDOM.render(<ReplayUIApp />, document.getElementById('root'));
serviceWorker.unregister();
