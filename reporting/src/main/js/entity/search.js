/**
 * Created by Petr on 3/19/2017.
 */
import React from 'react'
import {FormControl} from 'react-bootstrap'

export default class Search extends React.Component{
    constructor(props) {
        super(props);
        // bindings
        this.handleSearch  = this.handleSearch.bind(this);
    }
    componentDidMount() {
        if(this.props.focus) {
            this.searchInput.focus();
        }
    }

    handleSearch(event) {
        console.log('search event ', event.target.value);
        this.props.onChange(event.target.value);
    }
    render() {
        return (
            <FormControl
                id={this.props.id}
                placeholder={this.props.placeholder}
                inputRef={input => { this.searchInput = input }}
                onChange={this.handleSearch}
            />
        );
    }
}
Search.propTypes = {
    onChange:  React.PropTypes.func.isRequired,
    id: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    focus: React.PropTypes.bool
};