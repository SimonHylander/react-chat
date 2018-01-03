import React from 'react';
import { render } from 'react-dom';
import AwesomeComponent from './AwesomeComponent';
import ChatBox from './chat';

class App extends React.Component {
    render () {
        return (
            <div>
                <p>Hello React Project</p>
                <ChatBox />
            </div>
        );
    }
}

render(<App/>, document.getElementById('app'));