import React, {Component} from 'react';

import SignService from '../Services/SignService';
import WorkflowService from '../Services/WorkflowService';

class WorkflowForm extends Component {
    constructor(props) {
        super();
        this.state = {
            workflowName: props.match.params.name,
            workflows: [],
            workflow: '',
            signService: new SignService(),
            workflowService: new WorkflowService()
        };
    }

    async componentDidMount() {
        const workflows = await this.state.signService.getWorkflows();
        const workflowId = this.state.workflowService.getWorkflowId(workflows, 
            this.state.workflowName);
        const workflow = await this.state.signService.getWorkflowById(workflowId);
        
        console.log('workflows: ');
        console.log(workflows);
        console.log('workflow name = ' + this.state.workflowName);
        console.log('workflow Id = ' + workflowId);
        console.log(workflow);

        this.setState({
            workflows: workflows,
            workflow: workflow
        });
    }

    // Event handler when agreement name changed
    onAgreementNameChanged = (event) => {
    }

    // Event handler when messages changed
    onMessageChanged = (event) => {
    }

    render() {
        return (
        <div className="row">
            <div className="col-lg-12">
                <form id="recipient_form" encType="multipart/form-data">
                    <div className="col-lg-12" id="bottom_form_top">
                        <div>
                            <h3>{this.state.workflow ? this.state.workflow.description : ''}</h3>
                        </div>
                        <div className="form_hidden" id="recipient_section"></div>
                        <div className="form_hidden" id="cc_section"></div>
                    </div>
                    <div className="col-lg-12" id="bottom_form_bottom">
                        <div className="row">
                            <div className="col-lg-7">
                                <div>
                                    <h3 className="recipient_label">Document Name</h3>
                                    <input id="agreement_name" name="agreement_name" 
                                        placeholder="Enter Agreement Name" className="recipient_form_input" 
                                        required 
                                        value={this.state.workflow ? this.state.workflow.agreementNameInfo.defaultValue : ''}
                                        onChange={this.onAgreementNameChanged}>
                                    </input>
                                </div>
                                <div>
                                    <h3 className="recipient_label">Messages</h3>
                                    <textarea id="messages_input" name="messages_input" rows="3"
                                        placeholder="Message" className="recipient_form_input"
                                        value={this.state.workflow ? this.state.workflow.messageInfo.defaultValue : ''}
                                        onChange={this.onMessageChanged}>
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
                    <div className="col-lg-12" id="form_submit">
                        <div className="form_hidden" id="button_section"></div>
                    </div>
                </form>
            </div>
        </div>
        );
    }
}

export default WorkflowForm;