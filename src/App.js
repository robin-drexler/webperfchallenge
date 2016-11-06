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


injectTapEventPlugin();


class App extends Component {
    state = {
        topsites: [],
        loading: false,
        result: {},
        error: null,
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

        this.setState({
            loading: true,
            error: false,
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

    renderBody() {
        if (typeof this.state.result.speed === 'undefined') {
            return (<form className="form" key="form" onSubmit={this.executePageSpeed}>
                <TextField
                    className="url-input"
                    id="search"
                    errorText={this.state.error}
                    floatingLabelText="Enter your website URL"
                    onChange={(_, value) => this.value =  value}
                    disabled={this.state.loading}
                />
                <RaisedButton disabled={this.state.loading} label="go!" onClick={this.executePageSpeed}/>
            </form>)
        } else {
            let betterPagesPercentage = 100 / this.state.topsites.length * this.state.result.betterPages.length;
            betterPagesPercentage = Math.ceil(betterPagesPercentage);
            return (
                <div className="result" key="result">
                    <div className="result-description">
                        <Card>
                            <CardHeader title="Result" />
                            <CardText>
                                {betterPagesPercentage}% of top 50 websites perform better than you!
                            </CardText>
                        </Card>
                    </div>
                    <div className="result-table">
                        <Card>
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
                    <AppBar iconElementLeft={<span/>} title="How slow is your site on mobile?" />
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
