/**
 * Created by shy on 2018-01-04.
 */

import React from 'react';
import { render } from 'react-dom';

class LoginForm extends React.Component {

    constructor(props) {
        super(props);

        this.onSubmit = props.onSubmit;
        this.onLoginClick = props.onLoginClick;
        this.onChange = props.onChange;
        this.socket = props.socket;
        this.send = props.send;
        this.state = props.state;
    }

    render() {

        return(
            <div className="login-form-container">

                <form onSubmit={(e) => this.onSubmit(e)} action="#">
                    <input autoComplete={'off'}
                           onChange={v => this.onChange(v.target.value)}
                           type="text"
                           name="username"
                           id="username"
                           placeholder="Enter username">
                    </input>
                </form>

                <div className="last-details">
                    {this.state.lastNameDetail}
                </div>

                {
                    (this.state.desiredNameValid) ? (
                        <div className="login-button">
                            <button onClick={() => this.onLoginClick()} className="login-btn">
                                Login
                            </button>
                        </div>
                    ) : []
                }
            </div>
        );
    }
}

export default LoginForm;