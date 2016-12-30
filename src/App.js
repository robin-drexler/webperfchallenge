import React, {Component, PropTypes} from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import {Match, Miss} from 'react-router'

import Router from './components/Router';
import Index from './views/index';
import Result from './views/result';

injectTapEventPlugin();

class App extends Component {
    state = {
        menuOpened: false,
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

    render() {
        return (
            <MuiThemeProvider>
                <div className="App">
                    <Drawer open={this.state.menuOpened}>
                        <MenuItem onClick={this.goto('/')}>Home</MenuItem>
                        <MenuItem onClick={this.goto('/about.html')}>Imprint and privacy policy</MenuItem>
                    </Drawer>
                    <AppBar onLeftIconButtonTouchTap={this.toggleMenu} title="Mobile web performance challenge"/>
                    <div className="App-intro">

                        <Router>
                            <div>
                                <Match exactly pattern="/" component={Index} />
                                <Match pattern="/result" component={(props) => <Result  firebase={this.props.firebase}  {...props} />} />
                                <Miss component={Index} />
                            </div>
                        </Router>

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
