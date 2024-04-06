import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory from 'react-router-dom'
import axios from 'axios';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const history = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSignIn = async () => {



        const response = await axios.post('https://hiring-test-task.vercel.app/api/login', {
            username,
            password
        });

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            // Redirect to the appointments page upon successful login
            history('/appointments');
        } else {
            setErrorMessage('Username or password is incorrect.');
        }

    };

    return (


        <div className="login-container">
            <div className="logo">CCript</div>
            <div className="login-form">
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <div className="input-container">
                    <label className="label-text">Username</label>
                    <div className="sub-container">
                        <input
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={handleUsernameChange}
                            className="input-field"
                        />
                    </div>
                </div>
                <div className="input-container">
                    <label className="label-text">Password</label>
                    <div className="sub-container">
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="input-field"
                        />
                    </div>
                </div>
                <button onClick={handleSignIn} className="sign-in-button">
                    Sign In
                </button>
            </div>
        </div>

    );
}

export default LoginPage;