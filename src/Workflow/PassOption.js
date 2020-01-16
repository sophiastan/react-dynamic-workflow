import React, { Component } from 'react';

// Component for managing a list of carbon copy groups
class PassOption extends Component {
    constructor(props) {
        super(props);

        this.state = {
            setParentState: props.setParentState,
            getParentState: props.getParentState,
            hasPasswordChecked: false,
            showPasswordChecked: false,
            visible: props.passwordVisible,
            passOption: "",
            confirmPassOption: "",
            workflowId: props.workflowId
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.workflowId !== state.workflowId) {
            return {
                hasPasswordChecked: false,
                showPasswordChecked: false,
                visible: props.passwordVisible,
                passOption: "",
                confirmPassOption: "",
                workflowId: props.workflowId
            };
        }
        return null;
    }

    // Checks if password is required and is valid.
    isPasswordValid = (password, confirmPassword) => {
        let passwordValid = true;
        if (this.state.hasPasswordChecked) {
            passwordValid = password === confirmPassword &&
                password.length > 0;
        }

        return passwordValid;
    }

    // Event handler when checkbox changed
    onCheckboxChanged = (event) => {
        const isChecked = event.target.checked;
        this.setState({ [event.target.name]: isChecked });
        this.state.setParentState({ isPasswordValid: !isChecked });
    }


    // Event handler when password changed
    onPassChanged = (event) => {
        // Update state
        const name = event.target.name;
        const val = event.target.value;

        const passObject = {};
        passObject.passOption = this.state.passOption;
        passObject.confirmPassOption = this.state.confirmPassOption;
        passObject[name] = val;

        this.setState({ [name]: val });

        // Update password state
        const isPassValid = this.isPasswordValid(passObject.passOption, passObject.confirmPassOption);
        this.state.setParentState({
            isPasswordValid: isPassValid
        });

        if (isPassValid) {
            const passData = {
                "openPassword": val,
                "protectOpen": isPassValid
            };

            this.state.setParentState({
                passOption: passData
            });
        }
    }

    render() {
        const passwordType = this.state.showPasswordChecked ? "text" : "password";
        // console.log("password visible " + this.state.visible);
        return (
            this.state.visible ?
                <div className="add_border_bottom" id="pass_div">
                    <input type="checkbox" name="hasPasswordChecked" id="pass_checkbox"
                        checked={this.state.hasPasswordChecked} onChange={this.onCheckboxChanged}></input>
                    <label className="checkbox_input" id="pass_checkbox">Password Required</label>
                    {
                        this.state.hasPasswordChecked &&
                        <div id="sub_pass_div" className="add_border_bottom">
                            <h3 className="recipient_label">Password must contain 1 to 32 characters.</h3>
                            <input
                                type={passwordType}
                                name="passOption"
                                id="password"
                                className="recipient_form_input"
                                maxLength="32"
                                placeholder="Password"
                                onChange={this.onPassChanged}>
                            </input>
                            <input
                                type={passwordType}
                                name="confirmPassOption"
                                id="confirm_password"
                                className="recipient_form_input"
                                maxLength="32"
                                placeholder="Confirm Password"
                                onChange={this.onPassChanged}>
                            </input>
                            <input type="checkbox" name="showPasswordChecked" id="input_checkbox"
                                checked={this.state.showPasswordChecked} onChange={this.onCheckboxChanged}></input>
                            <label className="checkbox_input" htmlFor="input_checkbox">Show Password</label>
                            {
                                !this.state.getParentState().isPasswordValid &&
                                <h3 className="recipient_label error_msg">Password Requirement Not Met</h3>
                            }
                        </div>
                    }
                </div> : (<div></div>)
        );
    }
}

export default PassOption;