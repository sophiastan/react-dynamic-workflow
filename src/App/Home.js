import React, {Component} from 'react';

class Home extends Component {
    constructor(props) {
        super();

        this.state = {
            linkMessage: props.linkMessage
        };
    }

    render() {
        return (
            <div>
                <p>{this.state.linkMessage}</p>
            </div>
        );
    }
}

export default Home;