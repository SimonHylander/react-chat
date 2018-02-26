/**
 * Created by shy on 2018-01-07.
 */

import React from 'react';

class Input extends React.Component {

    constructor(props) {
        super(props);
    }

    onSubmit(e) {
        e.preventDefault();

        this.props.socket.send(JSON.stringify({
            type: 'CHAT_MESSAGE',
            data: {
                roomId: this.props.room.id,
                message: this.refs.input.value
            }
        }));

        this.refs.input.value = '';
        this.forceUpdate();
    }

    render() {
        return (
            <form className="input" onSubmit={(e) => this.onSubmit(e)}>
                <input autoComplete={'off'} ref="input" type="text" name="message" id="message" placeholder="Send a message"></input>
            </form>
        );
    }
}

export default Input;