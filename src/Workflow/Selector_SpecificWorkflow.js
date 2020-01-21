import React, { Component } from 'react';
import AgreementForm from './AgreementForm';
import SignService from '../Services/SignService';
import WorkflowService from '../Services/WorkflowService';

class Selector_SpecificWorkflow extends Component {
    constructor(props) {
        super(props);

        let workflowName = null;
        if (props.match && props.match.params) {
            workflowName = props.match.params.name;
        }

        this.state = {
            hideSelector: props.hideSelector,
            workflows: [],
            workflowName: workflowName,
            workflowId: null,
            signService: new SignService(),
            workflowService: new WorkflowService(),
        };
    }

    async componentDidMount() {
        const workflows = await this.state.signService.getWorkflows();
        const workflowId = this.state.workflowService.getWorkflowId(workflows, this.state.workflowName);
        if (workflows) {
            this.setState({
                workflows: workflows,
                workflowId: workflowId
            });
        }
    }

    onWorkflowChanged = (event) => {
        const workflowId = event.target.value;
        this.setState({
            workflowId: workflowId
        })
    }

    runWorkflow = (event) => {
    }

    render() {
        return (
            <div className="container h-100">
                <div className="row h-100 justify-content-center align-items-center">
                    <div id="workflow_form">
                        { !this.state.hideSelector &&
                            <div id="workflow_form_top">
                                <div id="workflow_form_top_wrapper">
                                    <div id="workflow_selector">
                                        <form>
                                            <div className="form-group">
                                                <label htmlFor="workflow_dropdown" id="workflow_dropdown_label">Workflow Selector</label>
                                                <select className="form-control" id="workflow_dropdown"
                                                    value={this.state.workflowName} onChange={this.onWorkflowChanged}>
                                                    <option value=""></option>
                                                    {
                                                        this.state.workflows ? this.state.workflows.map(
                                                            workflow =>
                                                                <option key={workflow.name} value={workflow.workflowId}>
                                                                    {workflow.displayName}
                                                                </option>
                                                        ) : null
                                                    }
                                                </select>
                                            </div>
                                            <button type="button" className="btn btn-primary btn-custom" id="option_submit_button"
                                                onClick={this.runWorkflow}>Select
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        }
                        <div id="workflow_form_bottom">
                            <div id="workflow_form_bot_wrapper">
                                <AgreementForm workflowId={this.state.workflowId}></AgreementForm>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Selector_SpecificWorkflow;