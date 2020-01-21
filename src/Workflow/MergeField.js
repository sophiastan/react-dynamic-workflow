import React, { Component } from 'react';

// Component for managing a list of carbon copy groups
class MergeField extends Component {
    constructor(props) {
        super(props);

        this.state = {
            setParentState: props.setParentState,
            getParentState: props.getParentState,
            workflowId: props.workflowId
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.workflowId !== state.workflowId) {
            return {
                workflowId: props.workflowId    
            };
        }
        return null;
    }

    // Event handler when an item in the list changed
    onFieldChanged = (event, index) => {
        const val = event.target.value;

        this.state.setParentState(state => {
            const list = this.state.getParentState().mergeFieldGroup.map((item, i) => {
                if (i === index) {
                    const fieldData = {
                        "displayName": item.displayName,
                        "defaultValue": val,
                        "fieldName": item.fieldName
                    }
                    return fieldData;
                }
                else {
                    return item;
                }
            });

            return {
                mergeFieldGroup: list
            }
        });
    }

    render() {
        const mergeFieldGroup = this.state.getParentState().mergeFieldGroup;
        const showMergeField = mergeFieldGroup && mergeFieldGroup.length >  0;
        return (
            <div>
                { showMergeField &&
                    <div>
                        <div id="merge_header">
                            <h3 id="merge_header_label" className="recipient_label">Fields</h3>
                        </div>
                        <div id="merge_body">
                            {
                                mergeFieldGroup.map((item, index) =>
                                    <div className="merge_div row" id={`merge_${item.fieldName}`} key={index}>
                                        <div className="col-lg-4">
                                            <h3>{item.displayName}</h3>
                                        </div>
                                        <div className="col-lg-8">
                                            <input type="text" className="merge_input" value={item.defaultValue}
                                                id={`merge_input_${item.fieldName}`} onChange={(event) => this.onFieldChanged(event, index)}></input>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default MergeField;