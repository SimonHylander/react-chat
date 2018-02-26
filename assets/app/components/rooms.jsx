/**
 * Created by shy on 2018-01-14.
 */

import React from 'react';

class Rooms extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        let rooms = this.props.rooms.filter(room => room.name !== null).map(room => (
            <li className="room-name" key={room.id}>
                <a href="#">{room.name}</a>
            </li>
        ));

        return (
            <div id="rooms">
                <h4>Rooms</h4>
                <ul>
                    {rooms || 'No rooms available'}
                </ul>
            </div>
        );
    }
}

export default Rooms;