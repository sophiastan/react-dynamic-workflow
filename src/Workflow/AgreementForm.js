import React, { Component } from 'react';

import SignService from '../Services/SignService';
import WorkflowService from '../Services/WorkflowService';

import RecipientsList from './RecipientsList';
import CarbonCopy from './CarbonCopy';
import FileList from './FileList';
import MergeField from './MergeField';
import Deadline from './Deadline';
import Reminder from './Reminder';
import PassOption from './PassOption';

class AgreementForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            workflow: null,
            signService: new SignService(),
            workflowService: new WorkflowService(),

            isPasswordValid: true,

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

    // Event handler when an input text changed
    onTextChanged = (event) => {
        const name = event.target.name;
        const val = event.target.value;

        this.setState({ [name]: val });
    }

    // onClick event handler for submitting data
    onSubmit = async () => {
        const agreementData = this.state.workflowService.createAgreementData(this.state);
        // console.log("State:");
        // console.log(this.state);
        console.log('Agreement data to be submitted: ');
        console.log(agreementData);

        // TODO: Uncomment to submit agreement to API server
        const response = await this.state.signService.postWorkflowAgreement(
            this.state.workflow_id, agreementData);

        if ('url' in response) {
            alert('Agreement sent');
        }
        else {
            alert(response.message);
        }
    }

    render() {
        const isSubmitEnabled = this.state.isPasswordValid;
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
                                <RecipientsList setParentState={this.setParentState} getParentState={this.getParentState} 
                                    recipientsListInfo={this.state.workflow.recipientsListInfo} />
                                <CarbonCopy setParentState={this.setParentState} getParentState={this.getParentState}
                                    ccsListInfo={this.state.workflow.ccsListInfo} />
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
                                        <FileList setParentState={this.setParentState} getParentState={this.getParentState}
                                            fileInfos={this.state.workflow.fileInfos} />
                                        <MergeField setParentState={this.setParentState} getParentState={this.getParentState} />
                                    </div>
                                    <div className="col-lg-5">
                                        <div className="option_wrapper">
                                            <div id="options" className="col-lg-12">
                                                <PassOption setParentState={this.setParentState} getParentState={this.getParentState} />
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