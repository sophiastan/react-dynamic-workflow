import React, { Component } from 'react';

import SignService from '../Services/SignService';
import WorkflowService from '../Services/WorkflowService';

class AgreementForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            workflow: null,
            signService: new SignService(),
            workflowService: new WorkflowService(),

            hasPasswordChecked: false,
            hasDeadlineChecked: false,
            hasReminderChecked: false,
            showPasswordChecked: false,

            date: new Date().toISOString().substr(0, 10),

            // Agreement data
            workflow_id: props.workflowId,
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
                recipients_list: workflow.recipientsListInfo,
                message: message
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

    // Sets reminders
    onReminderChanged = (event) => {
        this.setState({ reminders: event.target.value });
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

    // Event handler when checkbox changed
    onCheckboxChanged = (event) => {
        this.setState({ [event.target.name]: event.target.checked });
    }

    // Event handler when an item in the list changed
    onEmailChanged = (event, index) => {
        const val = event.target.value;
        this.setState(state => {
            const list = state.recipients_list.map((item, i) => {
                if (i === index) {
                    item.defaultValue = val;
                    return item;
                } else {
                    return item;
                }
            });

            return {
                recipients_list: list
            }
        });
    }


    // onClick event handler for submitting data
    onSubmit = async () => {
        const agreementData = this.state.workflowService.createAgreementData(this.state);
        console.log('Agreement data to be submitted: ');
        console.log(agreementData);

        // TODO: Uncomment to submit agreement to API server
        // const response = await this.state.signService.postAgreement(
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
        return (
            <div id="dynamic_form">
                <div className="row">
                    <div className="col-lg-12">
                        <form id="recipient_form" encType="multipart/form-data">
                            <div className="col-lg-12" id="bottom_form_top">
                                <div>
                                    <h3>{this.state.workflow.description}</h3>
                                </div>
                                {
                                    this.state.recipients_list.map((recipient, index) =>
                                        <div className="add_border_bottom" id="recipient_group_id" key={index}>
                                            <h3 className="recipient_label">{recipient.label}</h3>
                                            <input type="text" id="recipient_id" name="recipient_id"
                                                className="recipient_form_input" placeholder="Enter Recipient's Email"
                                                value={recipient.defaultValue} 
                                                onChange={(event) => this.onEmailChanged(event, index)}>
                                            </input>
                                        </div>
                                    )
                                }
                                {
                                    this.state.workflow.ccsListInfo.map((cc, index) =>
                                        <div className="add_border_bottom" id="cc_div_id" key={index}>
                                            <h3 className="recipient_label">{cc.label}</h3>
                                            <input type="text" id="cc_id" name="cc_id"
                                                className="recipient_form_input" placeholder="Enter Cc's Email"
                                                value={cc.defaultValue} onChange={this.onEmailChanged}></input>
                                        </div>
                                    )
                                }
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
                                        <div>
                                            <div id="upload_header">
                                                <h3 id="upload_header_label" className="recipient_label">Files</h3>
                                            </div>
                                            <div id="upload_body">
                                                {
                                                    this.state.workflow.fileInfos.map((file, index) => 
                                                        <div className="file_info_div row" id={`file_info_${file.name}`} key={index}>
                                                            <div className="col-lg-4">
                                                                <h3>{file.label}</h3>
                                                            </div>
                                                            <div className="col-lg-8">
                                                                <div className="custom-file" id={`upload_${file.name}`}>
                                                                    <input type="file" className="custom-file-input" 
                                                                        id={`logo_${file.name}`}></input>
                                                                    <h4 className="custom-file-label text-truncate">Please Upload A File</h4>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div>
                                            <div id="merge_header">
                                                <h3 id="merge_header_label" className="recipient_label">Fields</h3>
                                            </div>
                                            <div id="merge_body">
                                            {
                                                this.state.workflow.mergeFieldsInfo.map((merge, index) => 
                                                    <div className="merge_div row" id={`merge_${merge.fieldName}`} key={index}>
                                                        <div className="col-lg-4">
                                                            <h3>{merge.displayName}</h3>
                                                        </div>
                                                        <div className="col-lg-8">
                                                            <input type="text" className="merge_input" value={merge.defaultValue}
                                                                id={`merge_input_${merge.fieldName}`} onChange={this.onTextChanged}></input>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            </div>
                                        </div>
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
                                                <div className="add_border_bottom" id="deadline_div">
                                                    <input type="checkbox" name="hasDeadlineChecked" id="deadline_checkbox" onClick={this.onCheckboxChanged}></input>
                                                    <label className="checkbox_input" htmlFor="deadline_checkbox">Completion Deadline</label>
                                                    {
                                                        this.state.hasDeadlineChecked &&
                                                        <div id="sub_deadline_div" className="add_border_bottom">
                                                            <input type="date" name="deadline" id="deadline_input" value={this.state.date}
                                                                className="recipient_form_input" onChange={this.onTextChanged}></input>
                                                        </div>
                                                    }
                                                </div>
                                                <div className="add_border_bottom" id="reminder_div" onClick={this.onCheckboxChanged}>
                                                    <input type="checkbox" name="hasReminderChecked" id="reminder_checkbox"></input>
                                                    <label className="checkbox_input" htmlFor="reminder_checkbox">Set Reminder</label>
                                                    {
                                                        this.state.hasReminderChecked &&
                                                        <div id="sub_reminder_div" className="add_border_bottom">
                                                            <select id="reminder_dropdown" onChange={this.onReminderChanged}>
                                                                <option value="DAILY_UNTIL_SIGNED">Every day</option>
                                                                <option value="WEEKLY_UNTIL_SIGNED">Every week</option>
                                                                <option value="WEEKDAILY_UNTIL_SIGNED">Every business day</option>
                                                                <option value="EVERY_OTHER_DAY_UNTIL_SIGNED">Every other day</option>
                                                                <option value="EVERY_THIRD_DAY_UNTIL_SIGNED">Every third day</option>
                                                                <option value="EVERY_FIFTH_DAY_UNTIL_SIGNED">Every fifth day</option>
                                                            </select>
                                                        </div>
                                                    }
                                                </div>
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