import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import WorkflowSelector from '../Workflow/WorkflowSelector';
import SpecificWorkflow from '../Workflow/SpecificWorkflow';
import Selector_SpecificWorkflow from '../Workflow/Selector_SpecificWorkflow';
import ConfigService from '../Services/ConfigService';
// TODO: make app into class, put const into componentDidMount and create state, put conditional to render
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

    // return (
    //   <Switch>
    //     <Route exact path="/" component={Home} />
    //     <Route path="/workflow/:name" component={WorkflowSelector} />
    //   </Switch>
    // );

    if (this.state.features.hideSelector) { 

      // Create routes that show specific workflow via a route url
      return (
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/workflow/:name" component={SpecificWorkflow} />
        </Switch>
      );
    }
    else {

      // Create routes that show a list of workflows in default url
      return (
        <Switch>
          <Route exact path="/" component={WorkflowSelector} />
          <Route path="/workflow/:name" component={Selector_SpecificWorkflow} />
        </Switch>
      );
    }
  }

}

export default App;
