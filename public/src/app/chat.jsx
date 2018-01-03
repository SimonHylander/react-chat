/**
 * Created by shy on 2018-01-02.
 */

import React from 'react';
import Client from './client';

class ChatBox extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            message: ''
        };

        this.onMessageChange = this.onMessageChange.bind(this);
        this.onSendMessage = this.onSendMessage.bind(this);
    }

    onMessageChange(e) {
        this.setState({
            message: e.target.value
        });
    }

    onSendMessage() {
        console.log('send this message');
        console.log(this.state.message);
        this.setState({
            message: ''
        });
    }

    render() {
        return (
            <div>
                <div></div>

                <div>
                    <input type="text" value={this.state.message} onChange={this.onMessageChange}/>
                </div>
                <div><button onClick={this.onSendMessage}>Send</button></div>
            </div>
        );
    }

}

export default ChatBox;