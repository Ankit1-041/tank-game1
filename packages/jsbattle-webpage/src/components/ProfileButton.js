import React from "react";
import PropTypes from 'prop-types';
import Avatar from './Avatar.js';

export default class ProfileButton extends React.Component {

  render() {
    if(!this.props.role || this.props.role == 'guest') {
      return <a className="btn btn-primary btn-small signin-button" href="#/signin">
          <i className="fas fa-sign-in-alt"></i> Sign in
        </a>;
    }

    let adminLink = null;
    if(this.props.role == 'admin') {
      adminLink = <a href="/admin" style={{textDecoration: 'none'}} className="dropdown-item admin-button">
        <span className="clickable dropdown-item">
          <i className="fas fa-cogs"></i> Admin
        </span>
      </a>;
    }
    let logoutLink = null;
    if(this.props.logoutUrl) {
      logoutLink = <a href={this.props.logoutUrl} style={{textDecoration: 'none'}} className="dropdown-item logout-button">
        <span className="clickable dropdown-item">
          <i className="fas fa-power-off"></i> Logout
        </span>
      </a>;
    }

    return <li className="nav-item dropdown">
      <span className="clickable profile-button nav-link active" data-bs-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
        <Avatar
          img={this.props.role}
        /> <span className="user-profile-name">{this.props.username}</span>
      </span>
      <div className="dropdown-menu dropdown-menu-right profile-dropdown">
        {adminLink}
        {logoutLink}
      </div>
    </li>;
  }
}

ProfileButton.defaultProps = {
  role: 'user',
  username: 'user',
  logoutUrl: '/auth/logout'
};

ProfileButton.propTypes = {
  role: PropTypes.string,
  username: PropTypes.string,
  logoutUrl: PropTypes.string
};
