/**
 * Created by shy on 2018-01-02.
 */

import React from 'react';
import moment from 'moment';

class ChatBox extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            messages: []
        };

        //this.onMessageChange = this.onMessageChange.bind(this);
        //this.onSendMessage = this.onSendMessage.bind(this);
    }

    clear() {
        this.state.messages = [];
        this.forceUpdate();
    }

    onNewMessage(message) {
        this.state.messages.push(message)
    }

    onMessageChange(e) {
        this.setState({
            message: e.target.value
        });
    }

    onSendMessage() {
        this.setState({
            message: ''
        });
    }

    render() {

        let chat = '';

        if(this.props.messages !== undefined) {
            chat = this.props.messages.map(message => (
                <li key={message.id}>
                    {(() => {
                        switch (message.type) {

                            case 'user_state': return (
                                <div>
                                    <div className="from">
                                        { moment(message.timestamp).format('hh:mm') + ' ' + message.from }
                                    </div>

                                    <div className="message">{ message.message }</div>
                                </div>
                            );

                            case 'user_message': return (
                                <div>
                                    <div className="from">
                                        { moment(message.timestamp).format('hh:mm') + ' ' + message.from || 'Anonymous' }
                                        :
                                    </div>

                                    <div className="message">
                                        { message.message }
                                    </div>
                                </div>
                            );
                        }
                    })()}
                </li>
            ));
        }

        return (
            <div id="chat">
                <i className="fa fa-bars" aria-hidden="true"></i>
                <ul ref="list">{chat}</ul>
            </div>

            /*<div id="wrapper">
                <div id="user-container">
                    <label for="user">What's your name?</label>
                    <input type="text" id="user" name="user"/>
                    <button type="button" id="join-chat">Join Chat</button>
                </div>

                <div id="main-container" class="hidden">
                    <button type="button" id="leave-room">Leave</button>

                    <div id="messages"></div>

                    <div id="msg-container">
                        <input type="text" id="msg" name="msg"/>
                        <button type="button" id="send-msg">Send</button>
                    </div>
                </div>
            </div>*/
        );

        //<input type="text" value={this.state.message} onChange={this.onMessageChange}/>
        //<div><button onClick={this.onSendMessage}>Send</button></div>
    }
}

export default ChatBox;