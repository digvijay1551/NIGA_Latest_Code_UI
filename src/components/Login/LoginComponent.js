import React, { Component } from 'react';
import { Row, Col, Button, FormGroup, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Redirect, Router } from 'react-router-dom';
import { login } from '../../store/actions/auth';
import CommonServices from '../../Services/CommonServices';
import { isValidElement } from 'react';
import { connect } from 'react-redux';
import { UserRoles } from '../../Constants/UserRoles'
import {
    enqueueSnackbar as enqueueSnackbarAction,
    closeSnackbar
} from '../../store/actions/notification';
/**
 * Created Date     :       20 Dec 2019
 * Purpose          :       To validate  username and password.
 * Author           :       Chandrashekhar Salagar.
 */
class LoginComponent extends Component {
    /**
     * set state for user name and password.
     * @param {} props 
     */
    constructor(props) {
        super(props)
        this.state = {
            UserName: '',
            Password: '',
            isAuthenticateUser: false,
            colors: ['orange', 'red', 'blue', 'purple']
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
        debugger
        console.log('window======',window.location.search)
       
      
            let search = window.location.search;
            let userId = search.substring(8,);
            this.IsValidAccount(userId);
     
       
      
    }
    setRedirect = () => {
        this.setState({
            redirect: true
        })
    }
    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/AddUser' />
        }
    }
    /**
     * Render form.
     */
    render() {
        return (
            <div className="Signup">
                <Col>
                    <Form onSubmit={this.handleClick} className="mres wid50">
                   <center> <img src="/static/media/logo.fe659025.png" width="240" height="60" alt="Homeo Centrum Logo" /></center>
             
                        <h4 className="text-center pt-2 pb-0 clrcode">LOGIN</h4>
                        <Form.Group as={Row} controlId="fromUserName">
                            <Form.Label column sm="12">
                                User Name<br />
                            </Form.Label>
                            <Col sm="12">
                                <Form.Control type="text" className="brdrds" placeholder="Enter User Name"
                                    name="UserName"
                                    onChange={this.handleChange}
                                    value={this.state.UserName === null ? '' : this.state.UserName} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formPassword">
                            <Form.Label column sm="12">
                                Password
                            </Form.Label>
                            <Col sm="12">
                                <Form.Control type="password" className="brdrds" placeholder="Enter Password"
                                    name="Password"
                                    onChange={this.handleChange}
                                    value={this.state.Password === null ? '' : this.state.Password}
                                />
                            </Col>
                        </Form.Group>
                        <Row>
                            <Col sm="12" className="text-center pb-2 pt-3">
                                <Button color="primary" style={{ backgroundColor: "#20a8d8", textTransform: "uppercase" }} type="submit" className="paddg">&nbsp; <i className="fa fa-sign-in"></i>  &nbsp; Login &nbsp;</Button>
                            </Col>
                            <Col sm="12" className="text-center pb-2 pt-1">
                            <Link to={"/ForgotpasswordComponent"}>Forgot Password ?</Link>
                        
                            </Col>
                        </Row>
                        <hr></hr>
                        <Row>
                            <Col sm="12" className="text-center pb-2">
                                New User Registration ?
                            </Col>
                            <Col>
                                <div>
                                    <Col sm="12" className="text-center ">
                                        {this.renderRedirect()}
                                        <Button variant="success" style={{ textTransform: "uppercase" }} className="paddg" type="submit" onClick={this.setRedirect}>&nbsp; <i className="fa fa-pencil"></i>  &nbsp; Click To New Registration &nbsp;</Button>
                                    </Col>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </div>
        )
    }

    /**
     * Method to handle change in input fields.
     * @param {*} event 
     */
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    /**
     * Method to submit form.
     * @param {*} event 
     */
    async handleClick(event) {
        event.preventDefault();
        if (this.state.UserName == "" && this.state.Password == "") {
            alert("Please check user name or password")
        }
        else if(this.state.UserName == "" )
        {   alert("Please enter user name ")}
        else if(this.state.UserName == "" )
        {   alert("Please enter password ")}
        else {
            const response = await this.props.login(this.state)
            if (response.status == "200") {
                if (localStorage.getItem("RoleName") == UserRoles.Admin) {
                    this.props.history.push("/dashboard")
                } else if (localStorage.getItem("RoleName") == UserRoles.Management) {
                    this.props.history.push("/DoctorDashboard");
                } else if (localStorage.getItem("RoleName") == UserRoles.Doctor) {
                    this.props.history.push("/DoctorDashboard");
                }
            }
            else {
                this.props.enqueueSnackbarAction("Please check user name or password", "error");
            }
        }
    }

    /**
     * Check Query string parameter against user record and verify users account.
     */
    IsValidAccount = (UserId) => {
        debugger
        const model = {
            EncryptedUserId: UserId,
            UserId: 0,
            UserPassword: 'blank',
            UserName: 'blank'
        };
        CommonServices.postData(model, `/users/ActivateUser`).then((result) => {
            debugger;
            console.log(result.data);
        });

    }
}

const mapStateToProps = (state) => ({});
const mapDispatchToprops = {
    login, enqueueSnackbarAction, closeSnackbar
}
export default connect(mapStateToProps, mapDispatchToprops)(LoginComponent)