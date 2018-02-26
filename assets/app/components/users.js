/**
 * Created by shy on 2018-01-07.
 */

import React from 'react';

class Users extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let users = [];

        if(this.props.users !== undefined) {
            users = this.props.users.filter(user => user.username !== null).map(user => (
                <li className="username" key={user.id}>{user.username}</li>
            ));
        }

        return (
            <div id="users">
                <h4>Users</h4>
                <ul>
                    {users || 'No users connected'}
                </ul>
            </div>
        );
    }
}

export default Users;