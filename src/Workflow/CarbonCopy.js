import React, { Component } from 'react';

// Component for managing a list of carbon copy groups
class CarbonCopy extends Component {
    constructor(props) {
        super(props);

        this.state = {
            setParentState: props.setParentState,
            getParentState: props.getParentState
        };
    }

    // Event handler when an item in the list changed
    onCcChanged = (event, index) => {
        const val = event.target.value;

        const ccData = {
            "email": val
        }

        this.setParentState(state => {
            const list = this.getParentState().carbon_copy_group.map((item, i) => {
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

        console.log(this.getParentState().carbon_copy_group);
    }

    render() {
        return (
            <div>
                {
                    this.state.getParentState().carbon_copy_group &&
                    this.state.getParentState().carbon_copy_group.map((cc, index) => {
                        const items = [];
                        for (let i = 0; i < cc.maxListCount; i++) {
                            const defaultValue = i === 0 ? cc.defaultValue : "";
                            items.push(
                                <div className="add_border_bottom" id={`cc_div_${i}`} key={i}>
                                    <h3 className="recipient_label">{cc.label}</h3>
                                    <input type="text" id={`cc_${i}`} name={`cc_${i}`}
                                        className="recipient_form_input" placeholder="Enter Cc's Email"
                                        value={defaultValue}
                                        onChange={(event) => this.onCcChanged(event, i)}>
                                    </input>
                                </div>
                            );
                        }
                        return items;
                    }
                    )
                }
            </div>
        );
    }
}

export default CarbonCopy;