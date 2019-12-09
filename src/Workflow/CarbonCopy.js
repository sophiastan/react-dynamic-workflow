import React, {Component} from 'react';

// Component for managing a list of carbon copy groups
class CarbonCopy extends Component {
    constructor(props) {
        super(props);

        this.state = {
            setParentState: props.setParentState,
            getParentState: props.getParentState
        };
    }

    render() {
        return (
            <div></div>
        );
    }
}

export default CarbonCopy;