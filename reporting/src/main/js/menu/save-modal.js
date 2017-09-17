import React from 'react'
import Loader from '../utils/custom-loader'
import {FormControl} from 'react-bootstrap'

export default class SaveModal extends React.Component {
    constructor(props) {
        super(props);
        //initial state
        this.state = {
            value: ''
        };
        // bindings
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.searchInput.focus();
        if(this.props.defaultValue){
            this.setState({value:this.props.defaultValue});
        }
    }
    handleChange(event){
        this.setState({value: event.target.value})
    }
    handleClose(){
        this.props.onClose();
    }
    handleSave(){
        if(this.state.value.length === 0){
            this.setState({error: "Name has to have at least one character."})
            this.searchInput.focus();
        } else{
            this.props.onSave(this.state.value);
        }
    }
    render(){
        let error = null;
        if(this.state.error){
            error = <div className="alert alert-danger">{this.state.error}</div>
        }
        let queries = "No saved queries found.";
        return (
            <div className="custom-modal-container">
                <div className="custom-modal">
                    <Loader show={false} hideContentOnLoad={false} >
                        <h3>Save current query as:</h3>
                        {error}
                        <FormControl
                            id={this.props.id}
                            placeholder={"Query name"}
                            inputRef={input => { this.searchInput = input }}
                            onChange={this.handleChange}
                        />
                        <button onClick={this.handleSave} className="btn btn-success" style={{margin:"10px 10px 0px 0px"}}>Save</button>
                        <button onClick={this.handleClose} className="btn btn-info" style={{marginTop:"10px"}}>Close</button>
                    </Loader>
                </div>
            </div>
        )
    }
}

SaveModal.propTypes = {
    defaultValue: React.PropTypes.string,
    onSave: React.PropTypes.func.isRequired,
    onClose: React.PropTypes.func.isRequired
};