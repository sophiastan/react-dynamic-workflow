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
    async getWorkflows() {
        const url = `${this.baseUrl}/workflows`;
        const data = await this.get(url);
        return data['userWorkflowList'];
    }

    // Gets a workflow detail
    async getWorkflowById(workflow_id) {
        if (workflow_id) {
            const url = `${this.baseUrl}/workflows/${workflow_id}`;
            return await this.get(url);        
        }
        return null;
    }
    
    // Gets library documents -> /libraryDocuments
    async getLibraryDocuments() {
        const url = `${this.baseUrl}/libraryDocuments`;
        return await this.get(url);
    }

    // Get details of library document -> /libraryDocuments/{libraryDocumentId}
    async getLibraryDocumentIds(libraryDocumentId) {
        if (libraryDocumentId) {
            const url = `${this.baseUrl}/libraryDocuments/${libraryDocumentId}`;
            return await this.get(url);
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
