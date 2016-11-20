import React, {Component, PropTypes} from 'react';
import './App.css';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import SearchBox from './components/SearchBox';
import ResultBox from './components/ResultBox';

injectTapEventPlugin();

function sanitizeUrl(url) {
    if (url.match(/https?:\/\//) === null) {
        return 'http://' + url;
    }
    return url;
}

function getUrlQueryParam() {
    if (typeof window === 'undefined') { // when rendered on server
        return;
    }
    const matches = window.location.search.match(/\?url=(.*?)(&|$)/);

    if (matches) {
        return matches[1];
    } else {
        return null;
    }
}

class App extends Component {
    state = {
        topSites: [],
        loading: false,
        result: {},
        error: null,
        menuOpened: false,
        value: ''
    };

    componentWillMount() {
        const urlByQuery = getUrlQueryParam();

        if (urlByQuery) {
            this.setState({value: urlByQuery}, () => {
                this.executePageSpeed();
            })

        }
    }

    componentDidMount() {
        const topsitesRef = this.props.firebase.database().ref("topsites").orderByChild("desktop");

        topsitesRef.on('value', (snapshot) => {
            const topSites = snapshot.val().sort(function (a, b) {
                const keyA = a.mobile;
                const keyB = b.mobile;

                if (keyA < keyB) return 1;
                if (keyA > keyB) return -1;
                return 0;
            });
            this.setState({
                topSites: topSites,
            });
        });
    }

    executePageSpeed = () => {
        // e.preventDefault();
        const sanitizedUrl = sanitizeUrl(this.state.value);
        const url = encodeURI(sanitizedUrl);

        ga('send', 'event', 'search', 'start', url); // eslint-disable-line no-undef

        this.setState({
            loading: true,
            error: null,
            url: url,
            value: sanitizedUrl,
        });

        fetch(`https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url=${url}&strategy=mobile`)
            .then(r => r.json())
            .then((json) => {
                if (json.error) {
                    throw new Error(json.error.message)
                }
                const score = json.ruleGroups.SPEED.score;
                const betterPerformingPages = this.state.topSites.filter((site) => site.mobile > score);

                this.setState({
                    loading: false,
                    result: {
                        speed: score,
                        betterPages: betterPerformingPages,
                    }
                });
            }).catch((err) => {
            this.setState({
                loading: false,
                error: err.message,
            });
        });
    };

    handleSearchInputChange = (e) => {
        this.setState({value: e.target.value});
    };

    getHelp = () => {
        ga('send', 'event', 'result-page', 'get-help', '', { // eslint-disable-line no-undef
            'hitCallback': () => {
                window.location.href = 'https://developers.google.com/speed/docs/insights/rules'
            }
        });
    };

    toggleMenu = (e) => {
        this.setState({
            menuOpened: !this.state.menuOpened
        });
    };

    goto = (where) => {
        return () => {
            window.location.href = where;
        }
    };

    renderBody() {

        if (typeof this.state.result.speed === 'undefined') {
            return (
                <SearchBox
                    key="form"
                    loading={this.state.loading}
                    error={this.state.error}
                    searchValue={this.state.value}
                    onSearch={this.executePageSpeed}
                    onSearchInputChange={this.handleSearchInputChange}
                />
                )
        } else {
            return (
                <ResultBox
                    key="result"
                    topSites={this.state.topSites}
                    betterPages={this.state.result.betterPages}
                    speed={this.state.result.speed}
                    getHelp={this.getHelp}
                />
            )
        }
    }

    render() {
        return (
            <MuiThemeProvider>
                <div className="App">
                    <Drawer open={this.state.menuOpened}>
                        <MenuItem onClick={this.goto('/')}>Home</MenuItem>
                        <MenuItem onClick={this.goto('/about.html')}>Imprint and privacy policy</MenuItem>
                    </Drawer>
                    <AppBar onLeftIconButtonTouchTap={this.toggleMenu} title="How is your website performing?"/>
                    <div className="App-intro">
                        <ReactCSSTransitionGroup
                            transitionName="score"
                            transitionEnterTimeout={500}
                            transitionLeaveTimeout={500}
                        >
                            {this.renderBody()}
                        </ReactCSSTransitionGroup>

                    </div>
                    <div style={{textAlign: 'center', paddingTop: '10px', fontSize: '0.8em'}}>
                        Made with 💖, 🍕and 🍻 by <a href="https://twitter.com/tobiasbales">@TobiasBales</a> and <a
                        href="https://twitter.com/robindrexler">@RobinDrexler</a>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

App.propTypes = {
    firebase: PropTypes.object.isRequired
};

export default App;
