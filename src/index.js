import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './components/Dashboard/Dashboard'
import Overview from './pages/Overview'
import DailyEntry from './pages/DailyEntry'
import WaterIntake from './pages/WaterIntake'
import DoctorVisits from './pages/DoctorVisits'
import Error from './pages/Error'

import 'normalize.css'
import './index.css'

ReactDOM.render(
  <Router>
    <div>
      <Switch>
        <Route
          exact
          path='/(|daily-entry|water-intake|doctor-visits)'
          render={() => (
            <Dashboard>
              <Route exact path='/' component={() => <Overview />} />
              <Route path='/daily-entry' component={() => <DailyEntry />} />
              <Route path='/water-intake' component={() => <WaterIntake />} />
              <Route path='/doctor-visits' component={() => <DoctorVisits />} />
            </Dashboard>
          )}
        />
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
        <Route render={function () {
          return <Error />
        }}
        />
      </Switch>
    </div>
  </Router>,
  document.getElementById('root')
)

registerServiceWorker()
