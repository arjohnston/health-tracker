import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Link, NavLink } from 'react-router-dom'
import './style.css'

// should re-render when a notification is marked as read

export class Header extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mobileMenuIsOpen: false
    }

    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogout () {
    window.localStorage.removeItem('jwtToken')
    window.location.reload()
  }

  toggleMobileMenuOpen () {
    this.setState({
      mobileMenuIsOpen: !this.state.mobileMenuIsOpen
    })
  }

  render () {
    return (
      <div>
        <header>
          <Link className='mobile-logo' to='/'>
            <svg viewBox='0 0 449.61 410.14'>
              <path d='M330.86,0a49.93,49.93,0,1,1-49.93,49.93A49.93,49.93,0,0,1,330.86,0Zm45.65,410.14a36.11,36.11,0,0,1-24.63-9.74l0,0-123-119.64-33.69,32.93A103.9,103.9,0,0,1,71.89,332.11,104.25,104.25,0,0,1,50.27,316.5l.88-.93-.9.91L9.48,276.66l0,0L9,276.19,8.77,276h0c-.7-.81-1.37-1.66-2-2.52a36.1,36.1,0,0,1,54.55-46.89h0l.14.15c.38.37.74.74,1.1,1.13l38.93,40.25a26.93,26.93,0,0,0,37.06-.06L221,187.54h0a11.75,11.75,0,0,1,16.74.11l0,0,164.45,161h0a36.1,36.1,0,0,1-25.65,61.49ZM438.7,154.86l-.06-.07-54.77,53.28,0,0a65.26,65.26,0,0,1-47.46,20.58,64.43,64.43,0,0,1-47-20.11l.86-.82-.9.85-45.2-47.89a21.45,21.45,0,0,0-28.43-.52l0,0L154,219l.07.07c-.49.45-1,.88-1.51,1.29l-.35.34,0,0a36.1,36.1,0,0,1-48.69-53l.08.07,58.82-59,0,0,.67-.6.14-.14h0a98.73,98.73,0,0,1,131.49.31l0,0,.75.75.06.07h0l42.64,43.18L388.53,103h0l.47-.45.57-.55,0,0a36.09,36.09,0,0,1,49.12,52.87Z' />
            </svg>
          </Link>

          <NavLink
            className='notification-bell'
            to='/notifications'
            activeClassName='active'
            style={{ position: 'relative' }}
          >
            <svg viewBox='0 0 24 24'>
              <path d='M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21' />
            </svg>
            {this.props.unreadNotificationCount > 0 && (
              <div className='notification-count'>
                {this.props.unreadNotificationCount > 9
                  ? '9+'
                  : this.props.unreadNotificationCount}
              </div>
            )}
          </NavLink>
          <div className='profile-menu-wrapper'>
            <svg className='profile-menu-icon' viewBox='0 0 24 24'>
              <path d='M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z' />
            </svg>
            <svg className='profile-menu-down-icon' viewBox='0 0 24 24'>
              <path d='M7,10L12,15L17,10H7Z' />
            </svg>

            <div className='profile-menu'>
              <div className='profile-user-account'>
                <svg className='profile-menu-icon' viewBox='0 0 24 24'>
                  <path d='M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z' />
                </svg>
                <div className='profile-user-account-details'>
                  <span style={{ fontSize: '0.8em', color: '#777' }}>
                    User Account
                  </span>
                  <span>{this.props.username}</span>
                </div>
              </div>
              <Link to='/profile'>
                <svg viewBox='0 0 24 24'>
                  <path d='M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z' />
                </svg>
                <span>Profile</span>
              </Link>
              <div onClick={this.handleLogout}>
                <svg viewBox='0 0 24 24'>
                  <path d='M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z' />
                </svg>
                Logout
              </div>
            </div>
          </div>

          <div
            className={`mobile-menu-icon${
              this.state.mobileMenuIsOpen ? ' is-open' : ''
            }`}
            onClick={this.toggleMobileMenuOpen.bind(this)}
          >
            <svg
              viewBox='0 0 24 24'
              style={{
                strokeWidth: '2'
              }}
            >
              <line x1='0' y1='5' x2='24' y2='5' />
              <line x1='0' y1='12' x2='24' y2='12' />
              <line x1='0' y1='19' x2='24' y2='19' />
            </svg>
          </div>
        </header>

        <div
          className={`mobile-menu${
            this.state.mobileMenuIsOpen ? ' is-open' : ''
          }`}
          onClick={this.toggleMobileMenuOpen.bind(this)}
        >
          <Link to='/'>
            <svg viewBox='0 0 24 24'>
              <path d='M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z' />
            </svg>
            <span>Overview</span>
          </Link>

          <Link to='/daily-entry'>
            <svg viewBox='0 0 24 24'>
              <path d='M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7Z' />
            </svg>
            <span>Daily Entry</span>
          </Link>

          <Link to='/doctor-visits'>
            <svg viewBox='0 0 24 24'>
              <path d='M19,8C19.56,8 20,8.43 20,9A1,1 0 0,1 19,10C18.43,10 18,9.55 18,9C18,8.43 18.43,8 19,8M2,2V11C2,13.96 4.19,16.5 7.14,16.91C7.76,19.92 10.42,22 13.5,22A6.5,6.5 0 0,0 20,15.5V11.81C21.16,11.39 22,10.29 22,9A3,3 0 0,0 19,6A3,3 0 0,0 16,9C16,10.29 16.84,11.4 18,11.81V15.41C18,17.91 16,19.91 13.5,19.91C11.5,19.91 9.82,18.7 9.22,16.9C12,16.3 14,13.8 14,11V2H10V5H12V11A4,4 0 0,1 8,15A4,4 0 0,1 4,11V5H6V2H2Z' />
            </svg>
            <span>Doctor Visits</span>
          </Link>

          <Link to='/water-intake'>
            <svg viewBox='0 0 24 24'>
              <path d='M12,3.77L11.25,4.61C11.25,4.61 9.97,6.06 8.68,7.94C7.39,9.82 6,12.07 6,14.23A6,6 0 0,0 12,20.23A6,6 0 0,0 18,14.23C18,12.07 16.61,9.82 15.32,7.94C14.03,6.06 12.75,4.61 12.75,4.61L12,3.77M12,6.9C12.44,7.42 12.84,7.85 13.68,9.07C14.89,10.83 16,13.07 16,14.23C16,16.45 14.22,18.23 12,18.23C9.78,18.23 8,16.45 8,14.23C8,13.07 9.11,10.83 10.32,9.07C11.16,7.85 11.56,7.42 12,6.9Z' />
            </svg>
            <span>Water Intake</span>
          </Link>

          <Link to='/profile'>
            <svg viewBox='0 0 24 24'>
              <path d='M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z' />
            </svg>
            <span>Profile</span>
          </Link>

          <div onClick={this.handleLogout} className='mobile-menu-link'>
            <svg viewBox='0 0 24 24'>
              <path d='M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z' />
            </svg>
            <span>Logout</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
