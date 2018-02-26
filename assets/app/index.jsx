import React from 'react';
import ReactDom from 'react-dom';
import App from './app';

window.addEventListener('load', function load() {
    ReactDom.render(<App/>, document.getElementById('app'));
    window.removeEventListener('load', load, false);
}, false);