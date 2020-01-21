import React, { Component } from 'react';

// Component for managing recipients list
class RecipientsList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            setParentState: props.setParentState,
            getParentState: props.getParentState,
            recipientsList: props.recipientsListInfo ? props.recipientsListInfo : [],
            workflowId: props.workflowId,
            hideRecipient: props.features.hideRecipient,
            hideWorkflowList: props.features.hideWorkflowList,
            workflowName: props.workflowName
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.workflowId !== state.workflowId) {
            return {
                workflowId: props.workflowId,
                recipientsList: props.recipientsListInfo,
                hidePredefined: props.features.hidePredefined,
                hideWorkflowList: props.features.hideWorkflowList,
                workflowName: props.workflowName
            };
        }
        return null;
    }

    // Event handler when an item in the list changed
    onEmailChanged = (event, index) => {
        const val = event.target.value;
        const emailData = {
            "email": val
        }

        // Update email text for recipient
        this.setState(state => {
            const list = this.state.recipientsList.map((item, i) => {
                if (i === index) {
                    item.defaultValue = val;
                    item.modified = true;
                    return item;
                }
                else {
                    return item;
                }
            });

            return {
                recipientsList: list
            }
        });

        // Update recipient for submission
        this.state.setParentState(state => {
            const list = this.state.getParentState().recipientsList.map((item, i) => {
                if (i === index) {
                    const recipient = {
                        "name": item.name,
                        "recipients": [emailData]
                    }
                    return recipient;
                }
                else {
                    return item;
                }
            });

            return {
                recipientsList: list
            }
        });
    }


    render() {
        const hideRecipient = this.state.hideRecipient;
        const hideWorkflows = this.state.hideWorkflowList.includes(this.state.workflowName) ? true : false;
        const hideAll = this.state.hideWorkflowList === "" ? true : false;
        // console.log("hideWorkflows " + hideWorkflows);
        // console.log("hideWorkflowList " + this.state.hideWorkflowList);

        return (
            <div>
                {
                    this.state.recipientsList &&
                    this.state.recipientsList.map((recipient, index) =>
                        <div className="add_border_bottom"
                            // className={(hideRecipient && hideWorkflows) ? "recipient_hidden" :
                            // (hideRecipient && hideAll) ? "recipient_hidden" : "add_border_bottom"}
                            id={`recipient_group_${index}`} key={index}>
                            <h3 className="recipient_label">{recipient.label}</h3>
                            <input type="text" id={`recipient_${index}`} name={`recipient_${index}`}
                                // className={recipient.defaultValue ? "recipient_form_input predefined_input" : "recipient_form_input"}
                                className={(recipient.defaultValue && hideRecipient && hideWorkflows) ? "recipient_hidden" :
                                    (recipient.defaultValue && hideRecipient && hideAll) ? "recipient_hidden" :
                                        !recipient.modified ? "recipient_form_input predefined_input" :
                                            "recipient_form_input"}
                                placeholder="Enter Recipient's Email" value={recipient.defaultValue}
                                readOnly={recipient.editable ? false : true}
                                onChange={(event) => this.onEmailChanged(event, index)}>
                            </input>
                        </div>
                    )
                }
            </div>
        );
    }
}

export default RecipientsList;