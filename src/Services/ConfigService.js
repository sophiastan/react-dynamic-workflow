// This class handles reading config data from a config file.
// TODO: Read data from a config file. Currently the config are hard code.
class ConfigService {
    // hideSelector = false;

     // Get application features
     getFeatures = async () => {
        const url = this.baseUrl + "/features";
        const resp = await fetch(url);
        const body = await resp.json();
        return body;
    }
}

export default ConfigService;
