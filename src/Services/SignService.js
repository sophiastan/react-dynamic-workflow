class SignService {
    constructor() {
        this.integration = "3AAABLblqZhDW_2g8E7Mn0ENMEOOSPx1m-264qAe5ppbNaoUOjkcXeASUPCIDHjIuIIeP3BBcY6u9bXKzNMJ6SEbunNmjRFBR";
        this.baseUrl = "https://api.na2.echosign.com:443";
        this.endpoint = "/api/rest/v5";
        this.headers = {
            'Access-Token': this.integration
        }
    }

    async getWorkflows() {
        // return await this.get('http://localhost:5000/api/vehicles');
        const url = this.baseUrl + '/workflows';
        const data = await this.get(url);
        return data['userWorkflowList'];
    }

    async getWorkflowById(id) {
        // return await this.get('http://localhost:5000/api/vehicles/' + id);
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
