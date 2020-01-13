import React, { Component } from 'react';

// Component for managing a list of carbon copy groups
class CarbonCopy extends Component {
    constructor(props) {
        super(props);

        // Create a list of ccs for editing
        const items = [];
        if (props.ccsListInfo) {
            props.ccsListInfo.map((cc, index) => {
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

        this.state = {
            setParentState: props.setParentState,
            getParentState: props.getParentState,
            carbon_copy_group: items
        };

        props.setParentState(state => {
            return {
                carbon_copy_group: this.createCcList(items)
            }
        });
    }

    componentDidMount() {
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

    // Event handler when an item in the list changed
    onCcChanged = (event, index) => {
        const val = event.target.value;

        const localCCList = this.state.carbon_copy_group.map((item, i) => {
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
                carbon_copy_group: localCCList
            }
        });
        
        const parentCCList = this.createCcList(localCCList);

        // Update cc list for submit
        this.state.setParentState(state => {
            return {
                carbon_copy_group: parentCCList
            }
        });
     }

    render() {
        return (
            <div>
                {
                    this.state.carbon_copy_group &&
                    this.state.carbon_copy_group.map((cc, i) => 
                        <div className="add_border_bottom" id={`cc_div_${i}`} key={i}>
                            <h3 className="recipient_label">{cc.label}</h3>
                            <input type="text" id={`cc_${i}`} name={`cc_${i}`}
                                className="recipient_form_input" placeholder="Enter Cc's Email"
                                value={cc.defaultValue}
                                onChange={(event) => this.onCcChanged(event, i)}>
                            </input>
                        </div>
                    )
                }
            </div>
        );
    }
}

export default CarbonCopy;