/**
 * Created by shy on 2018-01-04.
 */

import React from 'react';
import { render } from 'react-dom';
import Rooms from './components/rooms';
import Chat from './components/chat';
import Users from './components/users';
import Input from './components/input';
import LoginForm from './components/loginForm';

//https://medium.com/@nihon_rafy/create-a-websocket-server-with-symfony-and-ratchet-973a59e2df94
//https://www.sitepoint.com/how-to-quickly-build-a-chat-app-with-ratchet/
//https://github.com/jskz/react-websocket-chat/blob/master/components/app.js
//http://www.psynapticmedia.com/wp-content/uploads/2017/01/2017-01-13_15-36-10.png

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            pending: false,
            loggedIn: false,
            desiredNameValid: false,
            lastNameDetail: '',
            desiredName: '',
            currentRoom: {},
            roomList: [],
            userList: []
        };

        this.socket = new WebSocket('ws://localhost:8888');
        this.socket.onopen = () => this.onSocketOpen();
        this.socket.onmessage = (message) => this.onSocketData(message);
        this.socket.onclose = () => this.onSocketClose();
    }

    componentDidMount() {
        /*this.socket = new WebSocket('ws://localhost:8080');
        this.socket.onopen = () => this.onSocketOpen()
        this.socket.onmessage = (message) => this.onSocketData(message)
        this.socket.onclose = () => this.onSocketClose()*/
    }

    send(type, data) {
        this.socket.send(JSON.stringify({
            type: type,
            data: data
        }));
    }

    onSocketOpen() {
        console.log('Connected!');
    }

    onSocketData(message) {
        let decoded = JSON.parse(message.data);
        let decodedType = decoded.type;
        let decodedData = decoded.data;

        if(decodedType === 'ROOM_LIST') {
            this.state.roomList = [];
            decoded.data.map(room => this.state.roomList.push(room));

            this.forceUpdate();
            return;
        }

        if(decodedType === 'USER_CONNECTED') {
            /*console.log(decoded);
            let currentRoom = this.state.roomList.filter(room => room.id == decodedData.room_id);
            console.log(currentRoom);

            if(currentRoom.length > 0) {
                this.state.currentRoom = currentRoom[0];
            }*/

            //this.state.userList.push(decoded.data);
            this.forceUpdate();
            return;
        }

        if(decodedType === 'USER_DISCONNECTED') {
            //this.state.userList.push(decoded.data);
            //this.forceUpdate();
            return;
        }

        if(decodedType === 'USER_LIST') {
            this.state.userList = [];
            decoded.data.map(user => this.state.userList.push(user));
            this.forceUpdate();
            return;
        }

        if(decodedType === 'USERNAME_TOO_SHORT') {
            this.state.lastNameDetail = 'Username too short.';
            this.state.desiredNameValid = false;
            this.forceUpdate();
            return;
        }

        if(decodedType === 'USERNAME_TOO_LONG') {
            this.state.lastNameDetail = 'Username too long.';
            this.state.desiredNameValid = false;
            this.forceUpdate();
            return;
        }

        if(decodedType === 'USERNAME_IN_USE') {
            this.state.lastNameDetail = 'Username already in use.';
            this.state.desiredNameValid = false;
            this.forceUpdate();
            return;
        }

        if(decodedType === 'MESSAGE_USERNAME_VALID') {
            this.state.lastNameDetail = '';
            this.state.desiredNameValid = true;
            this.forceUpdate();
            return;
        }

        if(decodedType === 'MESSAGE_USERNAME_GRANTED') {
            this.state.desiredNameValid = true;
            this.state.loggedIn = true;
            this.forceUpdate();
            return;
        }

        if(decodedType === 'USER_STATE_CHANGE') {
            let currentRoom = this.state.roomList.filter(room => room.id == decodedData.room_id);

            if(currentRoom.length > 0) {
                currentRoom = currentRoom[0];

                currentRoom.users
                    .filter(user => user.id == decodedData.user_id)
                    .map(user => {
                        if('username' in decodedData) {
                            user.username = decodedData.username;

                            currentRoom.messages.push({
                                id: currentRoom.messages.length + 1,
                                type: 'user_state',
                                userId: user.id,
                                from: user.username,
                                message: 'connected',
                                timestamp: decodedData.timestamp
                            });
                        }
                    });

                this.state.currentRoom = currentRoom;
            }

            this.forceUpdate();
            return;
        }

        if(decodedType === 'USER_MESSAGE') {
            this.state.currentRoom.messages.push({
                id: this.state.currentRoom.messages.length + 1,
                type: 'user_message',
                userId: decodedData.id,
                from: decodedData.username,
                message: decodedData.message,
                timestamp: decodedData.timestamp
            });

            this.forceUpdate();
            return;
        }

        return;
    }

    onSocketClose() {
        console.log('Disconnected!');
    }

    onChange(value) {
        this.state.desiredName = value;
        this.send('CHECK_USERNAME', { username: this.state.desiredName });
    }

    onSubmit(e) {
        e.preventDefault();
        this.onLoginClick();
    }

    onLoginClick() {
        if(this.state.desiredNameValid && !this.state.pending) {
            this.send('MESSAGE_REQUEST_USERNAME', {
                username: this.state.desiredName
            });

            this.state.pending = true;
        }
    }

    render() {

        /*let loginForm = null;
        const showLoginForm = this.state.showLoginForm;

        if(showLoginForm) {
            loginForm = <LoginForm />
        }*/

        return (
            <div className="content">
                <div className="container">
                    <header>React Chat</header>

                    <div id="left-column">
                        {<Rooms rooms={ this.state.loggedIn ? this.state.roomList : []}/>}
                    </div>

                    <div id="center-column">
                        <Chat ref="chat" messages={this.state.currentRoom.messages}/>

                        <div id="message-input">
                            { !this.state.loggedIn ? (
                                <LoginForm
                                    state={this.state}
                                    onSubmit={this.onSubmit}
                                    onLoginClick={this.onLoginClick}
                                    onChange={this.onChange}
                                    socket={this.socket}
                                    send={this.send}
                                />
                            ) : (
                                <Input socket={this.socket} room={this.state.currentRoom}/>
                            ) }
                        </div>
                    </div>

                    <div id="right-column">
                        <Users users={ this.state.loggedIn ? this.state.currentRoom.users : [] }/>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;