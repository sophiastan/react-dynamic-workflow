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

    componentDidUpdate(prevProps, prevState) {
        console.log('componentDidUpdate');
        console.log(prevProps);
        console.log(prevState);
        // Updates workflowName if changed
        if (prevProps.workflowName !== this.state.workflowName) {
            this.setState({
                workflowName: this.state.workflowName
            });
        }
    }

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
                            <div className="form_hidden" id="recipient_section"></div>
                            <div className="form_hidden" id="cc_section"></div>
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
                                        <div id="upload_body"></div>
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
                                            <div className="form_hidden" id="send_options_section"></div>
                                            <div className="form_hidden" id="deadline_section"></div>
                                            <div className="form_hidden" id="reminder_section"></div>
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