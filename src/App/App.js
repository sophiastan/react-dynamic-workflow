import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import Selector_SpecificWorkflow from '../Workflow/Selector_SpecificWorkflow';
import ConfigService from '../Services/ConfigService';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      configService: new ConfigService(),
      features: null
    }
  }

  async componentDidMount() {
    const features = await this.state.configService.getFeatures();
    this.setState({
      features: features
    })
  }

  render() {
    if (!this.state.features) 
      return (<div></div>);
    
    const hideSelector = this.state.features.hideSelector;  
    if (hideSelector) { 

      // Create routes that show specific workflow via a route url
      return (
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/workflow/:name" 
              render={(props) => <Selector_SpecificWorkflow {...props} hideSelector={true} />}
          />
        </Switch>
      );
    }
    else {

      // Create routes that show a list of workflows in default url
      return (
        <Switch>
          <Route exact path="/" 
              render={(props) => <Selector_SpecificWorkflow {...props} hideSelector={false} />}
          />
          <Route path="/workflow/:name"
              render={(props) => <Selector_SpecificWorkflow {...props} hideSelector={false} />}
          />
        </Switch>
      );
    }
  }

}

export default App;
