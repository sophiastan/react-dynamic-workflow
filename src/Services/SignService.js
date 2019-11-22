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
    async getLibraryDocumentIds() {
        const url = `${this.baseUrl}/libraryDocuments/:id`;
        const libraryId = await this.getLibraryDocuments();
    }

    // Posts an agreement for a workflow -> /workflows/{workflowId}/agreements
    async postWorkflowAgreement(workflowId, body) {
        const url = `${this.baseUrl}/workflows/${workflowId}/agreements`;
        return await this.post(url, body);
    }

    async postTransient(file) {
        const url = `${this.baseUrl}/transientDocuments`;

        // const selectedFile;
        // const fileToLoad = selectedFile[0];

        // const formData = new FormData();
        // formData.append('File-Name', fileToLoad.name);
        // formData.append('File', fileToLoad);
        // formData.append('Mime-Type', fileToLoad.type);

        // return await this.post(url, formData, this.postHeaders);
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
