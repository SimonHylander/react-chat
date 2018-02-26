/**
 * Created by shy on 2018-01-02.
 */

import React from 'react';

class Client extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.socket = new WebSocket('ws://localhost:8080');
        this.socket.onopen = () => this.onSocketOpen()
        this.socket.onmessage = (message) => this.onSocketData(message)
        this.socket.onclose = () => this.onSocketClose()
    }

    onSocketOpen() {
        console.log('Connected!');
    }

    onSocketData(message) {
        console.log(message);
    }

    onSocketClose() {
        console.log('Disconnected!');
    }
}

export default Client;