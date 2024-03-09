import React from 'react';
import './changepassword.css';
import { callApi, errorResponse, getSession } from './main';

const tableStyle = { width: "100%" };

class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPassword: '',
            newPassword: '',
            retypePassword: ''
        };
        this.sid = getSession("sid");
        if (this.sid === "") {
            window.location.replace("/");
        }
    }

    handleInputChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    updatePwd = () => {
        const { currentPassword, newPassword, retypePassword } = this.state;

        if (newPassword !== retypePassword) {
            alert("New password and Re-Type password do not match");
            return;
        }

        const url = "http://localhost:5000/cp/updatepwd";
        const data = JSON.stringify({
            emailid: this.sid,
            pwd: newPassword
        });

        callApi("POST", url, data, this.updatePwdSuccess, errorResponse);
    }

    updatePwdSuccess = (res) => {
        const data = JSON.parse(res);
        alert(data);
    }

    render() {
        return (
            <div className='full-height'>
                <div className='cpcontent'>
                    <h3>Change Your Password</h3>
                    <table style={tableStyle}>
                        <tbody>
                            <tr>
                                <td>Current Password* <input type='password' id='currentPassword' className='txtbox' onChange={this.handleInputChange} /></td>
                            </tr>
                            <tr>
                                <td>New Password* <input type='password' id='newPassword' className='txtbox' onChange={this.handleInputChange} /></td>
                            </tr>
                            <tr>
                                <td>Re-type New Password* <input type='password' id='retypePassword' className='txtbox' onChange={this.handleInputChange} /></td>
                            </tr>
                            <tr>
                                <td><button className='button' onClick={this.updatePwd}>Update</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default ChangePassword;
