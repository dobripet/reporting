/**
 * Created by Petr on 3/19/2017.
 */
import React from 'react'
import {FormControl} from 'react-bootstrap'

export default class Search extends React.Component{
    constructor(props) {
        super(props);
        this.state ={
            value: this.props.value
        };
        // bindings
        this.handleSearch  = this.handleSearch.bind(this);
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            value: nextProps.value
        });
    }
    componentDidMount() {
        if(this.props.focus) {
            this.searchInput.focus();
        }
    }

    handleSearch(event) {
        console.log('search event ', event.target.value);
        this.props.onChange(event.target.value);
        this.setState({value: event.target.value});
    }
    render() {
        console.log('defval', this.props.defaultValue);
        return (
            <FormControl
                id={this.props.id}
                placeholder={this.props.placeholder}
                inputRef={input => { this.searchInput = input }}
                onChange={this.handleSearch}
                value={this.state.value}
            />
        );
    }
}
Search.propTypes = {
    onChange:  React.PropTypes.func.isRequired,
    id: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    focus: React.PropTypes.bool,
    value: React.PropTypes.string,
};