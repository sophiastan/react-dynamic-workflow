import React, { Component } from 'react';

import SignService from '../Services/SignService';
import WorkflowService from '../Services/WorkflowService';

import RecipientsList from './RecipientsList';
import CarbonCopy from './CarbonCopy';
import FileList from './FileList';
import MergeField from './MergeField';
import Deadline from './Deadline';
import Reminder from './Reminder';

class AgreementForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            workflow: null,
            signService: new SignService(),
            workflowService: new WorkflowService(),

            hasPasswordChecked: false,
            showPasswordChecked: false,

            // Agreement data
            workflow_id: props.workflowId,
            transient_id: props.transientDocumentId,
            agreement_name: "",
            file_infos: [],
            recipients_list: [],
            recipient_group: [],
            carbon_copy_group: [],
            merge_field_group: [],
            pass_option: "",
            deadline: "",
            reminders: "",
            message: ""
        };
    }

    // Set data to parent state
    setParentState = (state) => {
        this.setState(state);
    }

    // Get parent state
    getParentState = () => {
        return this.state;
    }

    async componentDidMount() {
        const workflow = await this.state.signService.getWorkflowById(this.state.workflow_id);
        this.setWorkflow(workflow);
    }

    // Sets workflow data
    setWorkflow(workflow) {
        if (workflow) {
            const agreementName = workflow.agreementNameInfo ? workflow.agreementNameInfo.defaultValue : '';
            const message = workflow.messageInfo ? workflow.messageInfo.defaultValue : '';
            this.setState({
                workflow: workflow,
                agreement_name: agreementName,
                message: message,
                file_infos: workflow.fileInfos ? workflow.fileInfos : [],
                recipients_list: workflow.recipientsListInfo ? workflow.recipientsListInfo : [],
                carbon_copy_group: workflow.ccsListInfo ? workflow.ccsListInfo : [],
                merge_field_group: workflow.mergeFieldsInfo ? workflow.mergeFieldsInfo : []
            });
        }
        else {
            if (workflow !== this.state.workflow) {
                this.setState({
                    workflow: workflow
                });
            }
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.workflow_id !== this.state.workflow_id) {
            const workflow = await this.state.signService.getWorkflowById(this.state.workflow_id);
            this.setWorkflow(workflow);
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (state.workflow_id !== props.workflow_id) {
            return {
                workflow_id: props.workflow_id
            };
        }
        return null;
    }

    // Checks if password is required and is valid.
    isPasswordValid = () => {
        let passwordValid = true;
        if (this.state.hasPasswordChecked) {
            passwordValid = this.state.pass_option === this.state.confirm_pass_option &&
                this.state.pass_option.length > 0;
        }

        return passwordValid;
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

    // Event handler when checkbox changed
    onCheckboxChanged = (event) => {
        this.setState({ [event.target.name]: event.target.checked });
    }

    // onClick event handler for submitting data
    onSubmit = async () => {
        const agreementData = this.state.workflowService.createAgreementData(this.state);
        // console.log("State:");
        // console.log(this.state);
        console.log('Agreement data to be submitted: ');
        console.log(agreementData);

        // // TODO: Uncomment to submit agreement to API server
        // const response = await this.state.signService.postWorkflowAgreement(
        //     this.state.workflow_id, agreementData);

        // if ('url' in response) {
        //     alert('Agreement sent');
        // }
        // else {
        //     alert(response.message);
        // }
    }

    render() {
        const isSubmitEnabled = this.isPasswordValid();
        const passwordType = this.state.showPasswordChecked ? "text" : "password";
        if (!this.state.workflow) {
            return (<div></div>);
        }
        // console.log(this.state);
        return (
            <div id="dynamic_form">
                <div className="row">
                    <div className="col-lg-12">
                        <form id="recipient_form" encType="multipart/form-data">
                            <div className="col-lg-12" id="bottom_form_top">
                                <div>
                                    <h3>{this.state.workflow.description}</h3>
                                </div>
                                <RecipientsList setParentState={this.setParentState} getParentState={this.getParentState} />
                                <CarbonCopy setParentState={this.setParentState} getParentState={this.getParentState} />
                            </div>
                            <div className="col-lg-12" id="bottom_form_bottom">
                                <div className="row">
                                    <div className="col-lg-7">
                                        <div>
                                            <h3 className="recipient_label">Document Name</h3>
                                            <input type="text" id="agreement_name" name="agreement_name"
                                                placeholder="Enter Agreement Name" className="recipient_form_input"
                                                required
                                                value={this.state.agreement_name}
                                                onChange={this.onTextChanged}>
                                            </input>
                                        </div>
                                        <div>
                                            <h3 className="recipient_label">Messages</h3>
                                            <textarea id="messages_input" name="message" rows="3"
                                                placeholder="Message" className="recipient_form_input"
                                                value={this.state.message}
                                                onChange={this.onTextChanged}>
                                            </textarea>
                                        </div>
                                        <FileList setParentState={this.setParentState} getParentState={this.getParentState} />
                                        <MergeField setParentState={this.setParentState} getParentState={this.getParentState} />
                                    </div>
                                    <div className="col-lg-5">
                                        <div className="option_wrapper">
                                            <div id="options" className="col-lg-12">
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
                                                <Deadline setParentState={this.setParentState} getParentState={this.getParentState} />
                                                <Reminder setParentState={this.setParentState} getParentState={this.getParentState} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12" id="form_submit">
                                <button type="button" className="btn btn-primary btn-custom"
                                    id="recipient_submit_button" onClick={this.onSubmit}
                                    disabled={!isSubmitEnabled}>
                                    Submit
                            </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default AgreementForm;