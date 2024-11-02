import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from './App';
import AlertPage from './assets/AlertPage'; // Import your alert page component

function MainRouter() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/alert" component={AlertPage} /> {/* Alert page route */}
      </Switch>
    </Router>
  );
}

export default MainRouter;