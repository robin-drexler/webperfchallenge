import React, {Component} from 'react';
import SearchBox from '../components/SearchBox';
import {Redirect} from 'react-router-dom'

export default class Index extends Component {
    state = {
        value: '',
        redirect: null,
        error: null,
        isFormFocussed: false
    };


    handleSearchInputChange = (e) => {
        this.setState({value: e.target.value});
    };

    handleSearchInputFocus = (e) => {
        this.setState({isFormFocussed: true});
    };

    handleSearch = (e) => {
        if (this.state.value) {
            const redirect = {
                pathname: '/result',
                search: `?url=${this.state.value}`,
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
        console.log('INDEX')
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
                onSearchInputFocus={this.handleSearchInputFocus}
                error={this.state.error}
                isFormFocussed={this.state.isFormFocussed}
            />

        );
    }
}