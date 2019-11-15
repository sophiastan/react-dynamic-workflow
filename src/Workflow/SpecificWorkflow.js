import React, { Component } from 'react';
import AgreementForm from './AgreementForm';
import SignService from '../Services/SignService';
import WorkflowService from '../Services/WorkflowService';

class SpecificWorkflow extends Component {
    constructor(props) {
        super(props);

        let workflowName = null;
        if (props.match && props.match.params) {
            workflowName = props.match.params.name;
        }

        this.state = {
            workflows: [],
            workflowName: workflowName,
            workflow_id: null,
            signService: new SignService(),
            workflowService: new WorkflowService(),
        };
    }

    async componentDidMount() {
        const workflows = await this.state.signService.getWorkflows();
        const workflow_id = this.state.workflowService.getWorkflowId(workflows, this.state.workflowName);
        if (workflows) {
            this.setState({
                workflows: workflows,
                workflow_id: workflow_id
            });
        }
    }

    render() {
        return (
            <div className="container h-100">
                <div className="row h-100 justify-content-center align-items-center">
                    <div id="workflow_form">
                        <div id="workflow_form_bottom">
                            <div id="workflow_form_bot_wrapper">
                                <AgreementForm workflow_id={this.state.workflow_id}></AgreementForm>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SpecificWorkflow;