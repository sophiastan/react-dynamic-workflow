// Service for commmunicating with Sign API
class SignService {
    constructor() {
        this.integration = "3AAABLblqZhDW_2g8E7Mn0ENMEOOSPx1m-264qAe5ppbNaoUOjkcXeASUPCIDHjIuIIeP3BBcY6u9bXKzNMJ6SEbunNmjRFBR";
        this.host = "https://api.na2.echosign.com:443";
        this.endpoint = "/api/rest/v5";
        this.baseUrl = `${this.host}${this.endpoint}`;
        this.headers = {
            'Access-Token': this.integration
        }
    }

    // Gets a list of workflows
    getWorkflows = async () => {
        const url = "http://localhost:3200/api/getWorkflows";
        const resp = await fetch(url);
        const body = await resp.json();
        console.log("getWorkflows returns:");
        console.log(body);
        return body;
    }

    // Gets workflow detail
    getWorkflowById = async (workflow_id) => {
        if (workflow_id) {
            const url = `http://localhost:3200/api/getWorkflowById/${workflow_id}`;
            const resp = await fetch(url);
            const body = await resp.json();
            console.log("getWorkflowById returns:");
            console.log(body);
            return body;
        }
        return null;
    }

    // Posts an agreement for a workflow
    postWorkflowAgreement = async (workflowId, body) => {
        const url = `http://localhost:3200/api/postAgreement/${workflowId}`;
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

    // post transient to server
    postTransient = async (file) => {
        const url = `http://localhost:3200/api/postTransient`;

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
