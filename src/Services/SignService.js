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

    // // Gets a list of workflows
    // async getWorkflows() {
    //     const url = `${this.baseUrl}/workflows`;
    //     const data = await this.get(url);
    //     return data['userWorkflowList'];
    // }

    // Gets a list of workflows - server.js
    getWorkflows = async () => {
        const url = "http://localhost:3200/api/getWorkflows";
        const resp = await fetch(url);
        const body = await resp.json();
        console.log("getWorkflows returns:");
        console.log(body);
        return body;
    }

    // // Gets a workflow detail
    // async getWorkflowById(workflow_id) {
    //     if (workflow_id) {
    //         const url = `${this.baseUrl}/workflows/${workflow_id}`;
    //         return await this.get(url);        
    //     }
    //     return null;
    // }

    // Gets workflow detail - server.js
    getWorkflowById = async (workflow_id) => {
        if (workflow_id) {
            const url = `http://localhost:3200/getWorkflowById/${workflow_id}`;
            const resp = await fetch(url);
            const body = await resp.json();
            console.log("getWorkflowById returns:");
            console.log(body);
            return body;
        }
        return null;
    }

    // Posts an agreement for a workflow -> /workflows/{workflowId}/agreements
    async postWorkflowAgreement(workflowId, body) {
        const url = `${this.baseUrl}/workflows/${workflowId}/agreements`;

        const headers = {
            'Access-Token': this.integration,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const resp = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        return await resp.json();
    }

    // // talk to server
    // postWorkflowAgreement = async (workflowId, body) => {
    //     const resp = await fetch()
    // }

    async postTransient(file) {
        const url = `${this.baseUrl}/transientDocuments`;

        const formData = new FormData();
        formData.append('File-Name', file.name);
        formData.append('File', file);
        formData.append('Mime-Type', file.type);

        const resp = await fetch(url, {
            method: 'POST',
            headers: this.headers,
            body: formData
        });

        const data = await resp.json();

        console.log(data);

        return data;
    }
 
    // Gets content from Sign API
    async get(url) {
        const resp = await fetch(url, {
            method: 'GET',
            headers: this.headers
        });

        return await resp.json();
    }

    // Posts content to Sign API
    async post(url, body) {
        const resp = await fetch(url, {
            method: 'POST',
            headers: this.headers,
            body: body
        });

        return await resp.json();
    }
}

export default SignService;
