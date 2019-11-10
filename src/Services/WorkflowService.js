import AgreementData from "../Workflow/AgreementData";

class WorkflowService {

    // Gets workflow Id for a workflow name.
    getWorkflowId(workflows, workflowName) {
        // eslint-disable-next-line
        const workflow = workflows.find(w => w.displayName == workflowName);
        return workflow ? workflow.workflowId : null;
    }

    createAgreementData(source) {
        const agreement = new AgreementData();
        agreement.workflow_id = source.workflow_id;
        agreement.agreement_name = source.agreement_name;
        agreement.file_infos = source.file_infos;
        agreement.recipients_list = source.recipients_list;
        agreement.recipient_group = source.recipient_group;
        agreement.carbon_copy_group = source.carbon_copy_group;
        agreement.merge_field_group = source.merge_field_group;
        agreement.pass_option = source.pass_option;
        agreement.deadline = source.deadline;
        agreement.reminders = source.reminders;
        agreement.message = source.message;
    
        return agreement;
    }
}

export default WorkflowService;