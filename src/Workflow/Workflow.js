import React, {Component} from 'react';

import SignService from '../Services/SignService';

class Workflow extends Component {
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
        this.setState({
            workflows: workflows,
            workflow: workflow
        });
    }

    render() {
        return (
            <div>
                <p>Workflow Page</p>
                <p>Workflow name = {this.state.workflowName}</p>

                <div>Id</div>
                {this.state.workflows.map(workflow => <div>{workflow.id}</div>)}

                <p></p>
                <p>workflow Id = {this.state.workflow.id}</p>
            </div>
        );
    }
}

export default Workflow;