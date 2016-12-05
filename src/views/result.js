import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {Redirect} from 'react-router'

import SearchBox from '../components/SearchBox';
import ResultBox from '../components/ResultBox';

function sanitizeUrl(url) {
    if (url.match(/https?:\/\//) === null) {
        return 'http://' + url;
    }
    return url;
}

export default class Result extends Component {
    state = {
        url: null,
        topSites: [],
        result: {},
        error: null,
    };

    getUrl = () => {
        const location = this.props.location;
        return location.query ? location.query.url : '';
    };

    loadTopSites = () => {
        return new Promise((resolve) => {
            const topsitesRef = this.props.firebase.database().ref("topsites").orderByChild("desktop");
            topsitesRef.once('value', (snapshot) => {
                const topSites = snapshot.val().sort(function (a, b) {
                    const keyA = a.mobile;
                    const keyB = b.mobile;

                    if (keyA < keyB) return 1;
                    if (keyA > keyB) return -1;
                    return 0;
                });
                resolve(topSites)
            });
        });
    };

    fetchPageSpeed = (url) => {
        return fetch(`https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url=${url}&strategy=mobile`)
            .then(r => r.json())
            .then((json) => {
                if (json.error) {
                    throw new Error(json.error.message)
                }
                const score = json.ruleGroups.SPEED.score;

                return Promise.resolve(score);
            });
    };

    executePageSpeed = () => {
        const sanitizedUrl = sanitizeUrl(this.getUrl());
        const url = encodeURI(sanitizedUrl);

        ga('send', 'event', 'search', 'start', url); // eslint-disable-line no-undef

        this.setState({
            loading: true,
            error: null,
            url: url,
            value: sanitizedUrl,
        });

        Promise.all([this.loadTopSites(), this.fetchPageSpeed(url)]).then(([topSites, score]) => {
            const slowerPages = topSites.filter((site) => site.mobile <= score);

            this.setState({
                loading: false,
                topSites,
                result: {
                    speed: score,
                    slowerPages,
                }
            });
        }).catch((error) => {
            this.setState({
                loading: false,
                error: error.message,
            });
        });
    };

    goto = (where) => {
        return () => {
            window.location.href = where;
        }
    };

    componentWillMount() {
        this.setState({url: this.getUrl()}, () => {
            this.executePageSpeed();
        });
    }

    renderBody() {

        if (!this.state.url) {
            return (<Redirect to="/"/>);
        }

        if (typeof this.state.result.speed === 'undefined') {
            return (
                <SearchBox
                    searchValue={this.state.url}
                    loading={true}
                    error={this.state.error}
                    isFormFocussed={true}
                />
            )
        } else {
            return (
                <ResultBox
                    key="result"
                    topSites={this.state.topSites}
                    slowerPages={this.state.result.slowerPages}
                    speed={this.state.result.speed}
                    url={this.state.url}
                    checkOtherWebsite={this.goto('/')}
                />
            )
        }
    }

    render() {
        return (
            <ReactCSSTransitionGroup
                transitionName="score"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}
            >
                {this.renderBody()}
            </ReactCSSTransitionGroup>
        );
    }
}