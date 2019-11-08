import React from 'react';
import {Switch, Route} from 'react-router-dom';

import Home from './Home';
import WorkflowForm from '../Workflow/WorkflowForm';

function App() {
  return (
    <div className="container">
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/workflows/:name" component={WorkflowForm} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
