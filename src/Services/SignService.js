// Service for commmunicating with Sign API
class SignService {
    constructor() {
        this.integration = "3AAABLblqZhDW_2g8E7Mn0ENMEOOSPx1m-264qAe5ppbNaoUOjkcXeASUPCIDHjIuIIeP3BBcY6u9bXKzNMJ6SEbunNmjRFBR";
        this.host = "https://api.na2.echosign.com:443";
        this.endpoint = "/api/rest/v5";
        this.baseUrl = `${this.host}${this.endpoint}`;
        this.getHeaders = {
            'Access-Token': this.integration
        }
        this.postHeaders = {
            'Access-Token': this.integration,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }

    // Gets a list of workflows
    async getWorkflows() {
        const url = `${this.baseUrl}/workflows`;
        const data = await this.get(url);
        return data['userWorkflowList'];
    }

    // Gets a workflow detail
    async getWorkflowById(id) {
        const url = `${this.baseUrl}/workflows/${id}`;
        return await this.get(url);    
    }

    // Posts an agreement for a workflow
    async postAgreement(workflowId, body) {
        const url = `${this.baseUrl}/workflows/${workflowId}/agreements`;
        return await this.post(url, body);
    }
 
    // Gets content from Sign API
    async get(url) {
        const resp = await fetch(url, {
            method: 'GET',
            headers: this.getHeaders
        });

        return await resp.json();
    }

    // Posts content to Sign API
    async post(url, body) {
        const resp = await fetch(url, {
            method: 'POST',
            headers: this.postHeaders,
            body: JSON.stringify(body)
        });

        return await resp.json();
    }
}

export default SignService;
