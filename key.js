// Holds env variables for .env file
// Converts "boolean" env variable strings into boolean 
// Env variables does not support boolean
module.exports = {
    integration: process.env.REACT_APP_SIGN_API_INTEGRATION,
    host: process.env.REACT_APP_SIGN_API_HOST,
    endpoint: process.env.REACT_APP_SIGN_API_ENDPOINT,
    port: process.env.REACT_APP_PORT,
    hideSelector: (process.env.REACT_APP_HIDE_SELECTOR === 'true'),
    hideRecipient: (process.env.REACT_APP_HIDE_RECIPIENT === 'true'),
    hideWorkflowList: process.env.REACT_APP_HIDE_WORKFLOW_LIST,
    hideCC: (process.env.REACT_APP_HIDE_CC === 'true'),
    hideCCWorkflowList: process.env.REACT_APP_HIDE_CC_WORKFLOW_LIST
}