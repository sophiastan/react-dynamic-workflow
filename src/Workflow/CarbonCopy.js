import React, { Component } from 'react';

// Component for managing a list of carbon copy groups
class CarbonCopy extends Component {
    constructor(props) {
        super(props);

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

        // Check ccList if there is diff name, add to item. 
        const nameList = [];
        if (props.ccsListInfo) {
            props.ccsListInfo.map((cc, index) => {
                for (let i = 0; i < cc.maxListCount; i++) {
                    if (x => x.name !== cc.name) {
                        nameList.push(cc.name);
                    }
                }
                return nameList;
            });
        }

        console.log(nameList);

        // if email has same name, add to that item
        const ccList = [];
        if (props.ccsListInfo) {
            props.ccsListInfo.map((cc, index) => {
                for (let i = 0; i < cc.maxListCount; i++) {
                    if (x => x.name !== cc.name) {
                        nameList.push(cc.name);
                    }
                }
                return ccList;
            });
        }

        this.state = {
            setParentState: props.setParentState,
            getParentState: props.getParentState,
            carbon_copy_group: items
        };
    }

    componentDidMount() {
    }

    // Event handler when an item in the list changed
    onCcChanged = (event, index) => {
        const val = event.target.value;
        const ccData = {
            "email": val
        }

        // Update cc data for submit (TODO: group emails by name)
        this.state.setParentState(state => {
            const list = this.state.carbon_copy_group.map((item, i) => {
                if (i === index) {
                    const cc = {
                        "name": item.name,
                        "emails": [ccData]
                    }
                    return cc;
                }
                else {
                    return item;
                }
            });

            return {
                carbon_copy_group: list
            }
        });

        // Update cc for local edit
        this.setState(state => {
            const list = this.state.carbon_copy_group.map((item, i) => {
                if (i === index) {
                    item.defaultValue = val;
                    return item;
                }
                else {
                    return item;
                }
            });

            return {
                carbon_copy_group: list
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