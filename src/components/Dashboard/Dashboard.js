import React, { Component } from 'react'
import { withRouter } from 'react-router'
import axios from 'axios'

import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'

// This doesn't re-render and thus re-verify when a token is expired
// check error status code 401 for logging out

export class Dashboard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isAuthenticated: false,
      username: null,
      token: null,
      unreadNotificationCount: 0
    }
  }

  componentDidMount () {
    const token = window.localStorage
      ? window.localStorage.getItem('jwtToken')
      : ''

    // Immediately direct to /login if no jwtToken token present
    if (!token) {
      if (this.props.history) this.props.history.push('/login')
      return
    }

    // Verify if token is valid
    // As user persmissions are created, the verify auth should be more extensive
    // and return views as the permissions defines
    axios
      .post('/api/auth/verify', { token })
      .then(res => {
        this.setState({
          isAuthenticated: true,
          username: res.data.username,
          token: token
        })
      })
      .then(() => {
        this.props.renderNotificationBadge()
      })
      .catch(() => {
        // if err statusCode == 401, then remove token & push /login
        // otherwise log the token
        window.localStorage.removeItem('jwtToken')
        if (this.props.history) this.props.history.push('/login')
      })
  }

  render () {
    // this.props.renderNotificationBadge(this.state.token)

    return (
      this.state.isAuthenticated && (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <div style={{ width: '100%' }}>
            <Header
              username={this.state.username}
              unreadNotificationCount={this.props.unreadNotificationCount}
            />

            {this.props.children}
          </div>
        </div>
      )
    )
  }
}

export default withRouter(Dashboard)
