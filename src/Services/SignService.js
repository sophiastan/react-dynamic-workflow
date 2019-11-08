class SignService {
    constructor() {
        this.integration = "";
        this.baseUrl = "";
        this.headers = {
            'Access-Token': this.integration
        }
    }

    async getWorkflows() {
        const url = this.baseUrl + '/workflows';
        const data = await this.get(url);
        return data['userWorkflowList'];
    }

    async getWorkflowById(id) {
        const url = this.baseUrl + '/workflows/' + id;
        return await this.get(url);
    }

    async get(url) {
        const resp = await fetch(url, {
            method: 'GET',
            headers: this.headers
        });

        return await resp.json();
    }

    async post(url, body) {
        const resp = await fetch(url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(body)
        });

        return await resp.json();
    }
}

export default SignService;