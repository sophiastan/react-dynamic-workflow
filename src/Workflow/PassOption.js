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
            confirm_pass_option: ""
        };
    }

    // Checks if password is required and is valid.
    isPasswordValid = () => {
        let passwordValid = true;
        if (this.state.hasPasswordChecked) {
            passwordValid = this.state.getParentState().pass_option === this.state.confirm_pass_option &&
            this.state.getParentState().pass_option.length > 0;
        }

        return passwordValid;
    }

    // Event handler when checkbox changed
    onCheckboxChanged = (event) => {
        this.setState({ [event.target.name]: event.target.checked });
    }


    // Event handler when an input text changed
    onTextChanged = (event) => {
        const name = event.target.name;
        const val = event.target.value;

        this.setState({ [name]: val });
    }

    // // Event handler when password changed
    // onPassChanged = (event) => {
    //     const name = event.target.name;
    //     const val = event.target.value;

    //     this.setState({ [name]: val });

    //     if (this.state.pass_option !== "" && this.isPasswordValid) {
    //         val = this.state.pass_option;

    //         const passData = {
    //             "openPassword": val,
    //             "protectOpen": this.isPasswordValid
    //         }

    //         this.setState({ pass_option: passData });
    //         console.log(this.state.pass_option);
    //     }
    // }

    render() {
        const passwordType = this.state.showPasswordChecked ? "text" : "password";
        return (
            <div className="add_border_bottom" id="pass_div">
                <input type="checkbox" name="hasPasswordChecked" id="pass_checkbox" onClick={this.onCheckboxChanged}></input>
                <label className="checkbox_input" id="pass_checkbox">Password Required</label>
                {
                    this.state.hasPasswordChecked &&
                    <div id="sub_pass_div" className="add_border_bottom">
                        <h3 className="recipient_label">Password must contain 1 to 32 characters.</h3>
                        <input
                            type={passwordType}
                            name="pass_option"
                            id="password"
                            className="recipient_form_input"
                            maxLength="32"
                            placeholder="Password"
                            onChange={this.onTextChanged}>
                        </input>
                        <input
                            type={passwordType}
                            name="confirm_pass_option"
                            id="confirm_password"
                            className="recipient_form_input"
                            maxLength="32"
                            placeholder="Confirm Password"
                            onChange={this.onTextChanged}>
                        </input>
                        <input type="checkbox" name="showPasswordChecked" id="input_checkbox" onClick={this.onCheckboxChanged}></input>
                        <label className="checkbox_input" htmlFor="input_checkbox">Show Password</label>
                        {
                            !this.isPasswordValid() &&
                            <h3 className="recipient_label error_msg">Password Requirement Not Met</h3>
                        }
                    </div>
                }
            </div>
        );
    }
}

export default PassOption;