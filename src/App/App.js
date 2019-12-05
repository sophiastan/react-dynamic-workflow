import React from 'react';
import {Switch, Route} from 'react-router-dom';

import Home from './Home';
import WorkflowSelector from '../Workflow/WorkflowSelector';
import SpecificWorkflow from '../Workflow/SpecificWorkflow';
import Selector_SpecificWorkflow from '../Workflow/Selector_SpecificWorkflow';
import ConfigService from '../Services/ConfigService';

function App() {
  require('dotenv').config();
  const configService = new ConfigService();

  if (configService.hideSelector) {

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

export default App;
