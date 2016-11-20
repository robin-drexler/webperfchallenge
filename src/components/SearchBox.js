import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import {Card, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';


export default class SearchBox extends Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.onSearch();
    };

    render() {
        const buttonText = this.props.loading ? 'loading...' : 'analyze';

        return (
            <form className="form" key="form" onSubmit={this.handleSubmit}>

                <div className="card">
                    <Card>
                        <CardText>
                            <h2>
                                Compare your website's mobile performance with the top 50 most popular in the world.
                            </h2>
                            <div className="input-content">
                                <TextField
                                    className="url-input"
                                    id="search"
                                    errorText={this.props.error}
                                    floatingLabelText="Enter your website URL"
                                    disabled={this.props.loading}
                                    value={this.props.searchValue}
                                    onChange={this.props.onSearchInputChange}
                                />
                                <div>
                                    <RaisedButton primary disabled={this.props.loading} label={buttonText}
                                                  onClick={this.handleSubmit}/>
                                </div>
                            </div>
                        </CardText>
                    </Card>
                </div>
            </form>
        );
    }
}

SearchBox.propTypes = {
    searchValue: PropTypes.string.isRequired,
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    onSearch: PropTypes.func.isRequired,
    onSearchInputChange: PropTypes.func.isRequired
};

