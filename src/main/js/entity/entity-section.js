/**
 * Created by Petr on 3/4/2017.
 */
import React from 'react'
import {FormControl} from 'react-bootstrap'
import Loader from 'react-loader'

export default class EntitySection extends React.Component{
    constructor(props) {
        super(props);
        //initial state
        this.state ={
            search : "",

        };
        // bindings
        this.handleSearch  = this.handleSearch.bind(this);
    }
    componentDidMount() {
        //this.searchInput.focus();
        console.log("testing fetch");
        this.props.fetchEntityList();
    }


    handleSearch(event) {
        console.log(event.target.value, this.state);
        this.setState({search: event.target.value});
        return;
    }

    render() {
        return (
            <div>
                <Loader loaded={!this.props.loading}>
                    <FormControl id="search-input" placeholder="Search tables and columns" inputRef={ref => {this.searchInput = ref}} onChange={this.handleSearch}/>
                </Loader>
            </div>

        );
    }
}
class EntityList extends React.Component{
    constructor(props){
        super(props);

    }
}