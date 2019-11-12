import React from 'react';
import {Switch, Route} from 'react-router-dom';

import Home from './Home';
import AgreementForm from '../Workflow/AgreementForm';
import DynamicWorkflow from '../Workflow/DynamicWorkflow';
import ConfigService from '../Services/ConfigService';

function App() {
  const configService = new ConfigService();

  if (configService.hideSelector) {

    // Create routes that show specific workflow via a route url
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/workflow/:name" component={AgreementForm} />
      </Switch>
    );  
  }
  else {

    // Create routes that show a list of workflows in default url
    return (
        <Switch>
          <Route exact path="/" component={DynamicWorkflow} />
        </Switch>
     );
  }
}

export default App;
