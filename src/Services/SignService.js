// Service for commmunicating with Sign API
class SignService {
    constructor() {
        this.baseUrl = "http://localhost:3200";
    }

    // Gets a list of workflows
    getWorkflows = async () => {
        const url = this.baseUrl + "/api/getWorkflows";
        const resp = await fetch(url);
        const body = await resp.json();
        return body;
    }

    // Gets workflow detail
    getWorkflowById = async (workflow_id) => {
        if (workflow_id) {
            const url = this.baseUrl + `/api/getWorkflowById/${workflow_id}`;
            const resp = await fetch(url);
            const body = await resp.json();
            return body;
        }
        return null;
    }

    // Posts an agreement for a workflow
    postWorkflowAgreement = async (workflowId, body) => {
        const url = this.baseUrl + `/api/postAgreement/${workflowId}`;
        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        return await resp.json();
    }

    // Post transient to server
    postTransient = async (file) => {
        const url = this.baseUrl + `/api/postTransient`;

        const formData = new FormData();
        formData.append('myfile', file);

        const resp = await fetch(url, {
            method: 'POST',
            body: formData
        });

        return await resp.json();
    }
}

export default SignService;
