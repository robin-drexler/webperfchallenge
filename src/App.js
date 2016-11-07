import React, {Component, PropTypes} from 'react';
import './App.css';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

injectTapEventPlugin();


class App extends Component {
    state = {
        topsites: [],
        loading: false,
        result: {},
        error: null,
        menuOpened: false
    };

    componentDidMount() {
        const topsitesRef = this.props.firebase.database().ref("topsites").orderByChild("desktop");

        topsitesRef.on('value', (snapshot) => {
            const topsites = snapshot.val().sort(function (a, b) {
                const keyA = a.mobile;
                const keyB = b.mobile;

                if (keyA < keyB) return 1;
                if (keyA > keyB) return -1;
                return 0;
            });
            this.setState({
                topsites: topsites,
            });
        });
    }

    executePageSpeed = (e) => {
        e.preventDefault();
        const url = encodeURI(this.value);

        ga('send', 'event', 'search', 'start', this.value); // eslint-disable-line no-undef

        this.setState({
            loading: true,
            error: false,
            url: url,
        });

        fetch(`https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url=${url}&strategy=mobile`)
            .then(r => r.json())
            .then((json) => {
                if (json.error) {
                    throw new Error(json.error.message)
                }
                const score = json.ruleGroups.SPEED.score;
                const betterPerformingPages = this.state.topsites.filter((site) => site.mobile > score);

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

    getHelp = () => {
        ga('send', 'event', 'result-page', 'get-help', '', { // eslint-disable-line no-undef
            'hitCallback': () => { window.location.href = 'https://developers.google.com/speed/docs/insights/rules'}
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
            const buttonText = this.state.loading ? 'loading...' : 'analyze';
            return (<form className="form" key="form" onSubmit={this.executePageSpeed}>
                <h2>
                    Compare your website's mobile performance with the top 50 most popular in the world.
                </h2>
                <div className="input-content">
                    <TextField
                        className="url-input"
                        id="search"
                        errorText={this.state.error}
                        floatingLabelText="Enter your website URL"
                        onChange={(_, value) => this.value =  value}
                        disabled={this.state.loading}
                    />
                    <div>
                        <RaisedButton primary disabled={this.state.loading} label={buttonText} onClick={this.executePageSpeed}/>
                    </div>
                </div>
            </form>)
        } else {
            let betterPagesPercentage = 100 / this.state.topsites.length * this.state.result.betterPages.length;
            betterPagesPercentage = Math.ceil(betterPagesPercentage);
            return (
                <div className="result" key="result">
                    <div className="result-description">
                        <Card>
                            <CardText>
                                <div className="result-content">
                                    <div className="result-content-text">
                                        Your Google Page Speed Score is: <a target="_blank" href={`https://developers.google.com/speed/pagespeed/insights/?url=${this.state.url}&tab=mobile`}>{this.state.result.speed}</a>
                                        <br/><br/>
                                        {betterPagesPercentage}% of top 50 most popular websites perform better than your site.
                                    </div>
                                    <div>
                                        <RaisedButton primary label="Get help" onClick={this.getHelp}/>
                                    </div>
                                </div>
                            </CardText>
                        </Card>
                    </div>
                    <div className="result-table">
                        <Card>
                            <CardHeader title="Top sites performing better than yours" />

                            <Table allRowsSelected={false} selectable={false} className="overview">
                                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                    <TableRow>
                                        <TableHeaderColumn>site</TableHeaderColumn>
                                        <TableHeaderColumn>mobile score</TableHeaderColumn>
                                    </TableRow>
                                </TableHeader>
                                <TableBody displayRowCheckbox={false}>
                                    {this.state.result.betterPages.map((entry, idx) => {
                                        return (
                                            <TableRow key={idx}>
                                                <TableRowColumn>{entry.site}</TableRowColumn>
                                                <TableRowColumn>{entry.mobile}</TableRowColumn>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </Card>
                    </div>
                </div>
            );
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
                        <AppBar onLeftIconButtonTouchTap={this.toggleMenu} title="How is your website performing?" />
                    <div className="App-intro">
                        <ReactCSSTransitionGroup
                            transitionName="score"
                            transitionEnterTimeout={500}
                            transitionLeaveTimeout={500}
                        >
                            {this.renderBody()}
                        </ReactCSSTransitionGroup>

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
