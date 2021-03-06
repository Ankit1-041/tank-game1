import FullRow from "../components/FullRow.js";
import Row from "../components/Row.js";
import Col from "../components/Col.js";
import Loading from "../components/Loading.js";
import LeagueJoin from "../components/LeagueJoin.js";
import LeagueHistory from "../components/LeagueHistory.js";
import React from "react";
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {
  getSandboxAiScriptList
} from '../actions/sandboxAction.js';
import {
  notifyLeagueOpen,
} from '../actions/statsAction.js';
import {
  getLeagueSummary,
  joinLeague,
  leaveLeague,
  getLeaguePreview
} from '../actions/leagueAction.js';
import {
  wsConnect,
  wsDisconnect
} from '../actions/wsAction.js';
import PropTypes from 'prop-types';

export class LeagueScreen extends React.Component {

  componentDidMount() {
    this.props.notifyLeagueOpen();
    if(this.props.isAuthorized) {
      this.props.getSandboxAiScriptList(true);
      this.props.getLeagueSummary();
      this.props.wsConnect();
    } else {
      this.props.getLeaguePreview();
    }
  }

  componentWillUnmount() {
    if(this.props.isAuthorized) {
      this.props.wsDisconnect();
    }
  }

  renderTableRow(item) {
    let actions = null;
    if(this.props.submission && this.props.submission.id != item.id) {
      let url = `/#/sandbox/${this.props.submission.scriptId}?opponentType=league&opponentId=${item.id}`;
      actions = <td className="text-right">
        <a href={url} className="btn btn-primary btn-sm fight-button">
          <i className="fas fa-crosshairs"></i> Fight
        </a>
      </td>;
    } else if(this.props.submission && this.props.submission.id === item.id) {
      actions = <td className="text-right">
        &nbsp;
      </td>;
    }
    let isActive = this.props.submission && item.scriptId === this.props.submission.scriptId;
    return <tr key={item.scriptId} className={isActive ? 'table-active' : ''}>
      <td className="text-right">#{item.rank}</td>
      <td className="text-left">{item.ownerName} / {item.scriptName}</td>
      <td className="text-right">{Number(item.fights_total).toLocaleString()}</td>
      <td className="text-right">{Number(item.fights_win).toLocaleString()}</td>
      <td className="text-right">{Number(item.fights_lose).toLocaleString()}</td>
      <td className="text-right"><span className="badge bg-danger"><i className="fas fa-star" style={{marginRight: '1em'}}></i> {Number(item.score).toLocaleString()}</span></td>
      {actions}
    </tr>;
  }

  renderBreadcrumb() {
    return <FullRow>
      <nav className="breadcrumb-container bg-light rounded-3">
        <ol className="breadcrumb">
          <li style={{marginRight: '0.5em'}}><i className="fas fa-angle-right"></i></li>
          <li className="breadcrumb-item"><Link to="/league">League</Link></li>
        </ol>
      </nav>
    </FullRow>;
  }

  renderUnregistered() {
    return <div>
      {this.renderBreadcrumb()}
      <div className="bg-light rounded-3" style={{padding: '2rem'}}>
        <Row>
          <Col lg={4} style={{paddingTop: '0.5em'}}>
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center">Join the League</h1>
              <div className="card-text text-center">
                <p>
                  <i className="fas fa-trophy fa-5x"></i>
                </p>
                <p className="text-left">
                  Sign up and compete against other coders in the league. Create supreme artificial intelligence, beat all the opponents and climb to the top of the leaderboard.
                </p>
                <a className="btn btn-primary btn-lg signin-button" href="#/signin">
                  <i className="fas fa-sign-in-alt"></i> Sign up
                </a>
              </div>
            </div>
          </div>
          </Col>
          <Col lg={8} style={{paddingTop: '0.5em'}}>
            <LeagueHistory
              data={this.props.leagueHistory}
            />
          </Col>
        </Row>
      </div>
    </div>;
  }

  render() {
    if(!this.props.isAuthorized) {
      return this.renderUnregistered();
    }
    if(this.props.isLoading) {
      return <Loading />;
    }

    let rows = this.props.ranktable.map((item) => this.renderTableRow(item));
    if(rows.length == 0) {
      rows = <tr colSpan="6" >
        <td>The league is empty!</td>
      </tr>;
    }
    let leagueJoin;
    if(this.props.isJoining) {
      leagueJoin = <Loading />;
    } else {
      leagueJoin = <LeagueJoin
        selected={this.props.submission}
        tankList={this.props.tankList}
        onJoin={(scriptId, scriptName) => this.props.joinLeague(scriptId, scriptName)}
        onLeave={() => this.props.leaveLeague()}
      />;
    }

    let actionHeader = null;
    if(this.props.submission) {
      actionHeader = <th scope="col" className="text-right">&nbsp;</th>;
    }

    return <div>
      {this.renderBreadcrumb()}
      <div className="bg-light rounded-3" style={{padding: '2rem'}}>
        <Row>
          <Col lg={4} style={{paddingTop: '0.5em'}}>
            {leagueJoin}
          </Col>
          <Col lg={8} style={{paddingTop: '0.5em'}}>
            <LeagueHistory
              data={this.props.leagueHistory}
              selectedId={this.props.submission ? this.props.submission.id : ''}
            />
          </Col>
        </Row>
      </div>
      <FullRow>
        <h1 className="display-4">Leaderboard</h1>
        <table className="table leaderboard">
          <thead className="thead-dark">
            <tr>
              <th scope="col" className="text-right">Rank</th>
              <th scope="col" className="text-left">Name</th>
              <th scope="col" className="text-right">Fights</th>
              <th scope="col" className="text-right">Won</th>
              <th scope="col" className="text-right">Lost</th>
              <th scope="col" className="text-right">Score</th>
              {actionHeader}
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </FullRow>
    </div>;
  }
}

LeagueScreen.defaultProps = {
  isAuthorized: false,
  tankList: [],
  submission: null,
  ranktable: [],
  leagueHistory: [],
  isLoading: false,
  isJoining: false,
  getSandboxAiScriptList: () => {},
  getLeagueSummary: () => {},
  getLeaguePreview: () => {},
  joinLeague: () => {},
  leaveLeague: () => {},
  notifyLeagueOpen: () => {},
  wsConnect: () => {},
  wsDisconnect: () => {},
};

LeagueScreen.propTypes = {
  isAuthorized: PropTypes.bool,
  tankList: PropTypes.array,
  submission: PropTypes.object,
  ranktable: PropTypes.array,
  isLoading: PropTypes.bool,
  isJoining: PropTypes.bool,
  getSandboxAiScriptList: PropTypes.func,
  getLeagueSummary: PropTypes.func,
  getLeaguePreview: PropTypes.func,
  joinLeague: PropTypes.func,
  leaveLeague: PropTypes.func,
  notifyLeagueOpen: PropTypes.func,
  wsConnect: PropTypes.func,
  wsDisconnect: PropTypes.func,
  leagueHistory: PropTypes.array
};
const mapStateToProps = (state) => {
  const isAuthorized = state.auth.profile && (state.auth.profile.role  == 'admin' || state.auth.profile.role  == 'user');
  return {
    isAuthorized: isAuthorized,
    tankList: state.aiRepo.tankList,
    submission: state.league.submission,
    ranktable: state.league.ranktable,
    leagueHistory: state.league.history,
    isLoading: isAuthorized ? state.loading.LEAGUE_SUMMARY : state.loading.LEAGUE_PREVIEW,
    isJoining: state.loading.SANDBOX_AI_SCRIPT_LIST || state.loading.LEAGUE_NEW_SUBMISSION || state.loading.LEAGUE_CLEAR_SUBMISSION
  };
};

const mapDispatchToProps = (dispatch) => ({
  getSandboxAiScriptList: (useRemoteService) => {
    dispatch(getSandboxAiScriptList(useRemoteService));
  },
  getLeagueSummary: () => {
    dispatch(getLeagueSummary());
  },
  getLeaguePreview: () => {
    dispatch(getLeaguePreview());
  },
  joinLeague: (scriptId, scriptName) => {
    dispatch(joinLeague(scriptId, scriptName));
  },
  leaveLeague: () => {
    dispatch(leaveLeague());
  },
  notifyLeagueOpen: () => {
    dispatch(notifyLeagueOpen());
  },
  wsConnect: () => {
    dispatch(wsConnect());
  },
  wsDisconnect: () => {
    dispatch(wsDisconnect());
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeagueScreen);
