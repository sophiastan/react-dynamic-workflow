import React, { Component } from 'react';

// Component for managing a list of carbon copy groups
class CarbonCopy extends Component {
    constructor(props) {
        super(props);

        const items = CarbonCopy.createCCGroup(props.ccsListInfo);
        this.state = {
            setParentState: props.setParentState,
            getParentState: props.getParentState,
            workflowId: props.workflowId,
            ccsListInfo: props.ccsListInfo,
            carbonCopyGroup: items,
            hideCC: props.features.hideCC,
            hideCCWorkflowList: props.features.hideCCWorkflowList,
            workflowName: props.workflowName
        };

        props.setParentState(state => {
            return {
                carbonCopyGroup: this.createCcList(items)
            }
        });
    }

    static getDerivedStateFromProps(props, state) {
        // console.log(state.hideCC);
        // console.log(state.hideCCWorkflowList);
        if (props.workflowId !== state.workflowId) {
            return {
                workflowId: props.workflowId,
                ccsListInfo: props.ccsListInfo,
                carbonCopyGroup: CarbonCopy.createCCGroup(props.ccsListInfo)
            };
        }
        return null;
    }

     // Create a list of ccs for editing
    static createCCGroup(ccsListInfo) {
       const items = [];
       if (ccsListInfo) {
           ccsListInfo.map((cc, index) => {
               for (let i = 0; i < cc.maxListCount; i++) {
                   const defaultValue = i === 0 ? cc.defaultValue : "";
                   const item = {
                       "label": cc.label,
                       "name": cc.name,
                       "defaultValue": defaultValue
                   }
                   items.push(item);
               }
               return items;
           });    
       }

       return items;
    }

    // Creates cc data for submit and group emails by name field
    createCcList(localCCList) {
        const list = [];
        localCCList.map((item, i) => {
            let ccItem = list.find(x => x.name === item.name);
            if (item.defaultValue) {
                if (ccItem) {
                    // ccItem for item already exist in list
                    // We need to add a new email to ccItem.emails
                    ccItem.emails.push(item.defaultValue);
                }
                else {
                    // Create new ccItem that contains name and emails
                    const ccData = [item.defaultValue];
                    const ccItem = {
                        "name": item.name,
                        "emails": ccData
                    }
                    list.push(ccItem);    
                }
            }
            return ccItem;
        });

        return list;
    }

    hideWorkflowList = () => {
        console.log(this.state.workflowName);
        const hideWorkflowList = this.state.hideWorkflowList;
        const workflowName = this.state.workflowName;

        if (hideWorkflowList.includes(workflowName)) {
            console.log('true');
            return true;
        }
        else {
            console.log('false');
            return false;
        }
    }

    // Event handler when an item in the list changed
    onCcChanged = (event, index) => {
        const val = event.target.value;

        const localCCList = this.state.carbonCopyGroup.map((item, i) => {
            if (i === index) {
                item.defaultValue = val;
                return item;
            }
            else {
                return item;
            }
        });

        // Update cc for local edit
        this.setState(state => {
            return {
                carbonCopyGroup: localCCList
            }
        });
        
        const parentCCList = this.createCcList(localCCList);

        // Update cc list for submit
        this.state.setParentState(state => {
            return {
                carbonCopyGroup: parentCCList
            }
        });
     }

    render() {
        return (
            <div>
                {
                    this.state.carbonCopyGroup &&
                    this.state.carbonCopyGroup.map((cc, i) => 
                    this.state.hideCC && cc.defaultValue ? (<div key={i}></div>) : 
                        (
                            <div className="add_border_bottom" id={`cc_div_${i}`} key={i}>
                                <h3 className="recipient_label">{cc.label}</h3>
                                <input type="text" id={`cc_${i}`} name={`cc_${i}`}
                                    className={cc.defaultValue ? "recipient_form_input predefined_input" : "recipient_form_input"} 
                                    placeholder="Enter Cc's Email" value={cc.defaultValue}
                                    onChange={(event) => this.onCcChanged(event, i)}>
                                </input>
                            </div>
                        )
                    )
                }
            </div>
        );
    }
}

export default CarbonCopy;