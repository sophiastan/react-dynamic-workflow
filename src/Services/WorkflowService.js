// import AgreementData from "../Workflow/AgreementData";

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
                "fileInfos": source.file_infos,
                "name": source.agreement_name,
                "recipientsListInfo": source.recipients_list,
                "ccs": source.carbon_copy_group,
                "securityOptions": source.pass_option,
                "mergeFieldInfo": source.merge_field_group,
                "reminderFrequency": source.reminders, 
                "message": source.message
            }
        };
        
        if (source.deadline !== "") {
            agreement.documenCreationInfo.daysUntilSigningDeadline = source.deadline;
        }

        return agreement;
    }
}

export default WorkflowService;