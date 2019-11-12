import React, {Component} from 'react';

import SignService from '../Services/SignService';
import WorkflowService from '../Services/WorkflowService';

class AgreementForm extends Component {
    constructor(props) {
        super();

        // Get workflow name from url params
        let workflowName = props.match ? props.match.params.name : null;
        if (!workflowName) {
            // Get workflow name from props
            workflowName =  props.workflowName;
        }

        this.state = {
            workflowName: workflowName,
            workflows: [],
            workflow: '',
            signService: new SignService(),
            workflowService: new WorkflowService(),

            // Agreement data
            workflow_id: "",
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
        const workflows = await this.state.signService.getWorkflows();

        if (this.state.workflowName) {
            const workflowId = this.state.workflowService.getWorkflowId(workflows, 
                this.state.workflowName);
    
            if (workflowId) {
                const workflow = await this.state.signService.getWorkflowById(workflowId);
                this.setState({
                    workflows: workflows,
                    workflow: workflow,
                    workflow_id: workflowId,
    
                    agreement_name: workflow.agreementNameInfo.defaultValue,
                    message: workflow.messageInfo.defaultValue
                });
    
                console.log(this.state);
            }    
        }
    }

    // componentDidUpdate(prevProps, prevState) {
    //     console.log('componentDidUpdate');
    //     console.log(prevProps);
    //     console.log(prevState);
    //     // Updates workflowName if changed
    //     if (prevProps.workflowName !== this.state.workflowName) {
    //         this.setState({
    //             workflowName: this.state.workflowName
    //         });
    //     }
    // }

    // Event handler when an input text changed
    onInputChanged = (event) => {
        const name = event.target.name;
        const val = event.target.value;

        this.setState({[name]: val});
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
                            <div className="add_border_bottom" id="recipient_group_id">
                                <h3 className="recipient_label">INNERHTML</h3>
                                <input type="text" id="recipient_id" name="recipient_id" className="recipient_form_input" placeholder="Enter Recipient's Email"></input>
                            </div>
                            <div id="cc_div_id" className="add_border_bottom">
                                <h3 className="recipient_label">CC</h3>
                                <input type="text" id="cc_id" className="recipient_form_input" 
                                    placeholder="Enter Cc's Email"
                                    onChange={this.onInputChanged}>
                                </input>
                            </div>
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
                                            onChange={this.onInputChanged}>
                                        </input>
                                    </div>
                                    <div>
                                        <h3 className="recipient_label">Messages</h3>
                                        <textarea id="messages_input" name="message" rows="3"
                                            placeholder="Message" className="recipient_form_input"
                                            value={this.state.message}
                                            onChange={this.onInputChanged}>
                                        </textarea>
                                    </div>
                                    <div>
                                        <div id="upload_header">
                                            <h3 id="upload_header_label" className="recipient_label">Files</h3>
                                        </div>
                                        <div id="upload_body">
                                            <div id="file_info_filename" className="file_info_div row">
                                                <div className="col-lg-4">
                                                    <div className="custom-file" id="upload_filename">Upload Document</div>
                                                </div>
                                                <div className="col-lg-8">
                                                    <input className="custom-file-input" id="logo_filename" type="file"></input>
                                                    <h4 className="custom-file-label text-truncate">Please Upload A File</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div id="merge_header">
                                            <h3 id="merge_header_label" className="recipient_label">Fields</h3>                                     
                                        </div>
                                        <div id="merge_body"></div>
                                    </div>
                                </div>
                                <div className="col-lg-5">
                                    <div className="option_wrapper">
                                        <div id="options" className="col-lg-12">
                                            <div className="add_border_bottom" id="pass_div">
                                                <input type="checkbox" name="pass_checkbox" id="pass_checkbox"></input>
                                                <label className="checkbox_input" id="pass_checkbox">Password Required</label>
                                                <div id="sub_pass_div" className="add_border_bottom">
                                                    <h3 className="recipient_label">Password must contain 1 to 32 characters.</h3>
                                                    <input type="password" className="recipient_form_input" maxLength="32" placeholder="Password"></input>
                                                    <input type="password" className="recipient_form_input" maxLength="32" placeholder="Confirm Password"></input>
                                                    <input type="checkbox" name="input_checkbox" value="true" id="input_checkbox"></input>
                                                    <label className="checkbox_input" id="input_checkbox">Show Password</label>
                                                    <h3 className="recipient_label error_msg">Password Requirement Not Met</h3>
                                                </div>
                                            </div>
                                            <div id="deadline_div" className="add_border_bottom">
                                                <input type="checkbox" name="deadline_checkbox" id="deadline_checkbox"></input>
                                                <label className="checkbox_input" id="deadline_checkbox">Completion Deadline</label>
                                                <div id="sub_deadline_div" className="add_border_bottom">
                                                    <input type="date" name="deadline_input" id="deadline_input" className="recipient_form_input"></input>
                                                </div>
                                            </div>
                                            <div className="add_border_bottom" id="reminder_div">
                                                <input type="checkbox" name="reminder_checkbox" id="reminder_checkbox"></input>
                                                <label className="checkbox_input" id="reminder_checkbox">Set Reminder</label>
                                                <div id="sub_reminder_div" className="add_border_bottom">
                                                    <select id="reminder_dropdown">
                                                        <option value="DAILY_UNTIL_SIGNED">Every day</option>
                                                        <option value="WEEKLY_UNTIL_SIGNED">Every week</option>
                                                        <option value="WEEKDAILY_UNTIL_SIGNED">Every business day</option>
                                                        <option value="EVERY_OTHER_DAY_UNTIL_SIGNED">Every other day</option>
                                                        <option value="EVERY_THIRD_DAY_UNTIL_SIGNED">Every third day</option>
                                                        <option value="EVERY_FIFTH_DAY_UNTIL_SIGNED">Every fifth day</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7" id="form_submit">
                            <button type="button" className="btn btn-primary btn-custom" 
                                id="recipient_submit_button" onClick={this.onSubmit}>
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