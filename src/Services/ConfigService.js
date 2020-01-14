// This class handles reading config data from a config file.
// TODO: Read data from a config file. Currently the config are hard code.

class ConfigService {
    constructor() {
        this.baseUrl = "http://localhost:3200";
    }

    hideSelector = false;

     // Get application features
     getFeatures = async () => {
        const url = this.baseUrl + "/features";
        const resp = await fetch(url);
        const body = await resp.json();
        return body;
    }

    getHideSelector = async () => {
        const features = await this.getFeatures();
        const hideSelector = features.hideSelector;
        return hideSelector;
    }
}

export default ConfigService;
