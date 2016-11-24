import React, {Component} from 'react';
import SearchBox from '../components/SearchBox';
import {Redirect} from 'react-router'

export default class Index extends Component {
    state = {
        value: '',
        redirect: null,
        error: null,
    };


    handleSearchInputChange = (e) => {
        this.setState({value: e.target.value});
    };

    handleSearch = (e) => {

        if (this.state.value) {
            const redirect = {
                pathname: '/result',
                query: {url: this.state.value},
            };

            this.setState({
                redirect,
                error: null,
            });
        } else {
            this.setState({
                error: 'Please provide an URL (like google.com)',
            });
        }

    };

    render() {
        if (this.state.redirect) {
            return (
                <Redirect to={this.state.redirect}/>
            );
        }

        return (
            <SearchBox
                searchValue={this.state.value}
                loading={false}
                onSearch={this.handleSearch}
                onSearchInputChange={this.handleSearchInputChange}
                error={this.state.error}
            />

        );
    }
}