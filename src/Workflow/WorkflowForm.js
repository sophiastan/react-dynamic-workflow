import React, {Component} from 'react';

import SignService from '../Services/SignService';

class WorkflowForm extends Component {
    constructor(props) {
        super();
        this.state = {
            workflowName: props.match.params.name,
            workflows: [],
            workflow: '',
            signService: new SignService()
        };
    }

    async componentDidMount() {
        const workflows = await this.state.signService.getWorkflows();
        const workflow = await this.state.signService.getWorkflowById(this.state.workflowName);
        
        console.log('workflows: ');
        console.log(workflows);
        console.log('workflow for ' + this.state.workflowName);
        console.log(workflow);

        this.setState({
            workflows: workflows,
            workflow: workflow
        });
    }

    render() {
        return (
        <div className="row">
            <div className="col-lg-12">
                <h4 className="text-center">Workflow {this.state.workflowName}</h4>
                <form id="recipient_form" encType="multipart/form-data">
                    <div className="col-lg-12" id="bottom_form_top">
                        <div className="form_hidden" id="instruction_section"></div>
                        <div className="form_hidden" id="recipient_section"></div>
                        <div className="form_hidden" id="cc_section"></div>
                    </div>
                    <div className="col-lg-12" id="bottom_form_bottom">
                        <div className="row">
                            <div className="col-lg-7">
                                <div className="form_hidden" id="agreement_section"></div>
                                <div className="form_hidden" id="message_section"></div>
                                <div className="form_hidden" id="upload_section"></div>
                                <div className="form_hidden" id="merge_section"></div>
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