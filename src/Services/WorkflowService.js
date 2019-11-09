class WorkflowService {

    // Gets workflow Id for a workflow name.
    getWorkflowId(workflows, workflowName) {
        // eslint-disable-next-line
        const workflow = workflows.find(w => w.displayName == workflowName);
        return workflow ? workflow.workflowId : null;
    }
}

export default WorkflowService;