import React from 'react'
import JoinModalKeys from './join-modal-keys'
import { getSelectedPathIndex } from '../utils/utils'
import {allTypes} from './join-types'
export default class JoinModal extends React.Component {
    constructor(props) {
        super(props);
        //initial state
        this.state = {
            joinParameters: this.props.joinParameters,
            selectedIndex: getSelectedPathIndex(this.props.joinParameters.paths, this.props.joinParameters.selectedPath),
            joinStart: this.props.joinParameters.selectedPath[0]
        };
        // bindings
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleKeysChange = this.handleKeysChange.bind(this);
        this.handlePathChange = this.handlePathChange.bind(this);
        this.handleJoinStartChange = this.handleJoinStartChange.bind(this);
        //this.handleJoinTypeChange = this.handleJoinTypeChange.bind(this);
    }
    componentWillReceiveProps(nextProps){
        console.log("modal next props", nextProps);
        this.setState({
            joinParameters: nextProps.joinParameters,
            selectedIndex: getSelectedPathIndex(nextProps.joinParameters.paths, nextProps.joinParameters.selectedPath),
            joinStart: nextProps.joinParameters.selectedPath[0]
        })
    }

    componentDidMount() {
        //this.searchInput.focus();
        console.log("fetch dobrty");
        //this.props.getEntityPropertyStats(this.props.property.name);
    }
    handleClose(){
        this.props.onClose();
    }
    handleSave(){
        this.props.onSave(this.props.index, this.state.joinParameters);
    }
    handleKeysChange(index, keys) {
        let joinParameters = this.state.joinParameters;
        joinParameters.joinKeys[index] = keys;
        this.setState(joinParameters);
    }

    handlePathChange(event) {
        let index = event.target.value;
        if(index === this.state.selectedIndex){
            console.log('mrdak krtak');
            return;
        }
        console.log('select', index);/*
        let params = this.state.joinParameters;
        params.selectedPath = this.state.joinParameters.paths[index];
        this.setState({joinParameters: params, selectedIndex: index});*/
        this.props.onSelectPath(this.props.joinParameters.paths[index]);
    }
    handleJoinTypeChange(index, event) {
        console.log('edit type', index, event.target.value);
        let joinParameters = this.state.joinParameters;
        joinParameters.joinTypes[index] = event.target.value;
        this.setState(joinParameters);
    }
    handleJoinStartChange(event){
        console.log('select entity', event.target.value);
        this.props.onSelectJoinStart(event.target.value);
    }
    render(){
        const {
            selectedPath,
            paths,
            joinKeys,
            joinTypes,
            joinedEntities
        } = this.state.joinParameters;
        console.log("show join ", this.props.joinParameters);
        let start= null;
        let end = null;
        let keys = [];
        let path = null;
        if(selectedPath.length > 1){
            start = selectedPath[0];
            end = selectedPath[selectedPath.length-1];
            for(let i = 0; i < selectedPath.length-1; i++) {
                let typeOptions = allTypes.map(type => <option key={type} value={type}>{type}</option>);
                keys.push(<div key={i} className="join-keys-pane">
                    <span style={{marginRight:"5px", fontWeight:"bold"}}>{selectedPath[i]}</span>
                    <select onChange={this.handleJoinTypeChange.bind(this, i)} value={joinTypes[i]}  className="input-sm">{typeOptions}</select>
                    <span style={{marginLeft:"5px", fontWeight:"bold"}}>{selectedPath[i + 1]}</span>
                    <JoinModalKeys key={i} index={i} keys={joinKeys[i]} onChange={this.handleKeysChange}/>
                </div>);
            }
            //paths select
            if(paths.length > 1){
                let options = paths.map((p,i) => <option key={i} value={i}>{p.join(' => ')}</option>);
                path = <select onChange={this.handlePathChange}
                               value={this.state.selectedIndex}
                               className="form-control input-sm"
                               style={{marginTop:"5px"}}>{options}</select>
            } else{
                path = <span style={{marginTop:"5px", fontWeight:"bold", fontSize:"16px"}}>{selectedPath.join(' => ')}</span>
            }
        }
        let buttons = <div>
                <button onClick={this.handleSave} className="btn btn-success" style={{marginRight:"10px"}}>Save</button>
                <button onClick={this.handleClose} className="btn btn-info">Close</button>
            </div>;
        if(this.props.confirmOnly){
            buttons = <div>
                <button onClick={this.handleSave}  className="btn btn-primary">Ok</button>
            </div>;
        }
        let entities = null;
        if(joinedEntities.length > 1){
            let options = joinedEntities.map((p,i) => <option key={i} value={p}>{p}</option>);
            entities = <select onChange={this.handleJoinStartChange} value={this.state.joinStart} className="form-control input-sm">{options}</select>
        }
        return (
            <div className="custom-modal-container">
                <div className="custom-modal">
                    {entities}
                    {path}
                    {keys}
                    {buttons}
                </div>
            </div>
        )
    }
}

JoinModal.propTypes = {
    joinParameters: React.PropTypes.shape({
        selectedPath: React.PropTypes.array.isRequired,
        paths: React.PropTypes.array.isRequired,
        joinKeys: React.PropTypes.array.isRequired,
        joinedEntities: React.PropTypes.array.isRequired
    }).isRequired,
    onClose: React.PropTypes.func.isRequired,
    onSave: React.PropTypes.func.isRequired,
    confirmOnly: React.PropTypes.bool,
    index: React.PropTypes.number.isRequired,
    onSelectPath: React.PropTypes.func.isRequired,
    onSelectJoinStart: React.PropTypes.func.isRequired
};