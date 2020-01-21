class WorkflowService {

    // Gets workflow Id for a workflow name.
    getWorkflowId(workflows, workflowName) {
        // eslint-disable-next-line
        const workflow = workflows.find(w => w.displayName == workflowName);
        return workflow ? workflow.workflowId : null;
    }

    createAgreementData(source) {
        const agreement =  {
            "documentCreationInfo": {
                "fileInfos": source.fileInfos,
                "name": source.agreementName,
                "recipientsListInfo": source.recipientsList,
                "ccs": source.carbonCopyGroup,
                "securityOptions": source.passOption,
                "mergeFieldInfo": source.mergeFieldGroup,
                "reminderFrequency": source.reminders, 
                "message": source.message
            }
        };
        
        if (source.deadline !== "") {
            agreement.documentCreationInfo.expirationInfo = source.deadline;
        }

        return agreement; 
    }
}

export default WorkflowService;