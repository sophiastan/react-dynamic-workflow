import React, { Component } from 'react';

// Component for managing recipients list
class RecipientsList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            setParentState: props.setParentState,
            getParentState: props.getParentState,
            recipientsListInfo: props.recipientsListInfo ? props.recipientsListInfo : []
        };
    }

    // Event handler when an item in the list changed
    onEmailChanged = (event, index) => {
        const val = event.target.value;
        const emailData = {
            "email": val
        }

        this.setState(state => {
            const list = this.state.getParentState().recipients_list.map((item, i) => {
                if (i === index) {
                    // item = emailData;
                    item = val;
                    return item;
                }
                else {
                    return item;
                }
            });

            return {
                recipients_list: list
            }
        });

        this.state.setParentState(state => {
            const list = this.state.getParentState().recipients_list.map((item, i) => {
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
                recipients_list: list
            }
        });

        console.log(this.state.recipientsListInfo);
    }


    render() {
        return (
            <div>
                {
                    this.state.recipientsListInfo &&
                    this.state.recipientsListInfo.map((recipient, index) =>
                        <div className="add_border_bottom" id={`recipient_group_${index}`} key={index}>
                            <h3 className="recipient_label">{recipient.label}</h3>
                            <input type="text" id={`recipient_${index}`} name={`recipient_${index}`}
                                className="recipient_form_input" placeholder="Enter Recipient's Email"
                                value={recipient.defaultValue}
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