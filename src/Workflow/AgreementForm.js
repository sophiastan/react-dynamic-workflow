import React, { Component } from 'react';

import SignService from '../Services/SignService';
import WorkflowService from '../Services/WorkflowService';

import RecipientsList from '../Workflow/RecipientsList';

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

    // Sets reminders
    onReminderChanged = (event) => {
        this.setState({ reminders: event.target.value });
        console.log(this.state.reminders);
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

    getDateFormat = (date) => {
        /***
         * This function will formate the date for input
         * @param {Date} date The date object we wish to formate
         */

        // Create the day, month, and year variables
        var dd = date.getDate();
        var mm = date.getMonth() + 1;
        var y = date.getFullYear();

        // Month under 10 add leading 0
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }

        // Format
        var date_format = y + '-' + mm + '-' + dd;

        return date_format;
    }

    // Event handler when an input text changed
    onTextChanged = (event) => {
        const name = event.target.name;
        const val = event.target.value;

        this.setState({ [name]: val });
    }

    // Event handler when deadline changed
    onDeadlineChanged = (event) => {
        const date_input = event.target.value;

        const today_date = new Date();
        const selected_date = new Date(date_input);

        const diffTime = Math.abs(selected_date - today_date);
        const daysUntilSigningDeadline = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        console.log("daysUntilSigningDeadline: " + daysUntilSigningDeadline);

        this.setState({ deadline: daysUntilSigningDeadline });
        console.log("deadline: " + this.state.deadline);
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

    // Event handler when an item in the list changed
    onCcChanged = (event, index) => {
        const val = event.target.value;

        const ccData = {
            "email": val
        }

        this.setParentState(state => {
            const list = this.getParentState().carbon_copy_group.map((item, i) => {
                if (i === index) {
                    const cc = {
                        "name": item.name,
                        "emails": [ccData]
                    }
                    return cc;
                }
                else {
                    return item;
                }
            });

            return {
                carbon_copy_group: list
            }
        });

        console.log(this.getParentState().carbon_copy_group);
    }

    // Event handler when an item in the list changed
    onFieldChanged = (event, index) => {
        const val = event.target.value;

        this.setState(state => {
            const list = state.merge_field_group.map((item, i) => {
                if (i === index) {
                    const fieldData = {
                        "defaultValue": val,
                        "fieldName": item.fieldName
                    }
                    return fieldData;
                }
                else {
                    return item;
                }
            });

            return {
                merge_field_group: list
            }
        });
    }

    onFileUpload = async (event, index) => {
        const file = event.target.files[0];
        const transientDocument = await this.state.signService.postTransient(file);
        const transientDocumentId = transientDocument.transientDocumentId;

        this.setState(state => {
            const list = state.file_infos.map((item, i) => {
                // console.log("workflowLibDoc: ");
                // console.log(item.workflowLibraryDocumentSelectorList[i].workflowLibDoc);
                if (i === index) {
                    const transientData = {
                        "name": item.name,
                        "transientDocumentId": transientDocumentId
                    }
                    return transientData;
                }
                else {
                    return item;
                }

                // if (i === index) {
                //     if (item.workflowLibraryDocumentSelectorList !== "") {
                //         const fileData = {
                //             "name": item.name,
                //             "workflowLibraryDocumentId": item.workflowLibraryDocumentSelectorList[i].workflowLibDoc
                //         }
                //         return fileData;
                //     }
                //     else {
                //         const fileData = {
                //             "name": item.name,
                //             "transientDocumentId": transientDocumentId
                //         } 
                //         return fileData;
                //     }
                // }
                // else {
                //     return item;
                // }
            });

            return {
                file_infos: list

            }
        });
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
                                <div>
                                    {
                                        this.state.carbon_copy_group &&
                                        this.state.carbon_copy_group.map((cc, index) => {
                                            const items = [];
                                            for (let i = 0; i < cc.maxListCount; i++) {
                                                const defaultValue = i === 0 ? cc.defaultValue : "";
                                                items.push(
                                                    <div className="add_border_bottom" id={`cc_div_${i}`} key={i}>
                                                        <h3 className="recipient_label">{cc.label}</h3>
                                                        <input type="text" id={`cc_${i}`} name={`cc_${i}`}
                                                            className="recipient_form_input" placeholder="Enter Cc's Email"
                                                            value={defaultValue}
                                                            onChange={(event) => this.onCcChanged(event, i)}>
                                                        </input>
                                                    </div>
                                                );
                                            }
                                            return items;
                                        }
                                        )
                                    }
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
                                                    this.state.file_infos.map((item, index) =>
                                                        <div className="file_info_div row" id={`file_info_${item.name}`} key={index}>
                                                            <div className="col-lg-4">
                                                                <h3>{item.label}</h3>
                                                            </div>
                                                            <div className="col-lg-8">
                                                                <div className="custom-file" id={`upload_${item.name}`}>
                                                                    {item.workflowLibraryDocumentSelectorList ?
                                                                        <div>
                                                                            <h4>
                                                                                {item.workflowLibraryDocumentSelectorList[0].label}
                                                                            </h4>
                                                                        </div> :
                                                                        <div>
                                                                            <input type="file" className="custom-file-input"
                                                                                id={`logo_${item.name}`} onChange={(event) => this.onFileUpload(event, index)}></input>
                                                                            <h4 className="custom-file-label text-truncate">
                                                                                {item.file ? item.file.name : "Please Upload A File"}</h4>
                                                                        </div>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div>
                                            {this.state.merge_field_group &&
                                                <div>
                                                    <div id="merge_header">
                                                        <h3 id="merge_header_label" className="recipient_label">Fields</h3>
                                                    </div>
                                                    <div id="merge_body">
                                                        {
                                                            this.state.merge_field_group.map((item, index) =>
                                                                <div className="merge_div row" id={`merge_${item.fieldName}`} key={index}>
                                                                    <div className="col-lg-4">
                                                                        <h3>{item.displayName}</h3>
                                                                    </div>
                                                                    <div className="col-lg-8">
                                                                        <input type="text" className="merge_input" value={item.defaultValue}
                                                                            id={`merge_input_${item.fieldName}`} onChange={(event) => this.onFieldChanged(event, index)}></input>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            }
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
                                                                className="recipient_form_input" onChange={this.onDeadlineChanged}></input>
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