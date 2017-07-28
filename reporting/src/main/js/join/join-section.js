import React from 'react'
import Loader from 'react-loader'
import JoinParameters from './join-parameters'
import JoinModal from './join-modal'
import {getParametersEnd ,getParametersStart} from '../utils/utils'


export default class JoinSection extends React.Component{
    constructor(props) {
        super(props);
        // bindings
        this.handleShowEdit = this.handleShowEdit.bind(this);
        this.handleCloseEdit = this.handleCloseEdit.bind(this);
        this.handleSaveEdit = this.handleSaveEdit.bind(this);
        /* this.handleEditTitle = this.handleEditTitle.bind(this);
        this.handleSetAggregateFunction = this.handleSetAggregateFunction.bind(this);*/
        this.browseChildren = this.browseChildren.bind(this);
    }
    /*
    componentWillReceiveProps(nextProps){
        console.log("section next props", nextProps);
        this.setState({editParameters: nextProps.editParameters})
    }*/

    handleShowEdit (index){
        this.props.openJoinEdit(index);
    }
    handleCloseEdit (){
        this.props.closeJoinEdit();
    }
    handleSaveEdit (index, parameters){
        //TODO application call for change props
        console.log(index, parameters);
        this.props.saveJoinEdit(index, parameters);
        //this.setState({editParameters: null});
    }
    /*handleEditTitle (columnIndex, title){
        console.log("edit ", title);
        this.props.editColumnTitle(columnIndex, title);
        //this.props.removeColumnFromColumnList(title);
    }
    handleSetAggregateFunction(columnIndex, aggregateFunction){
        this.props.setAggregateFunction(columnIndex, aggregateFunction);
    }*/

    browseChildren (parameters, index, offset, params) {
        //pixel offset for visualization
        params.push(<JoinParameters key={index} index={index} offset={offset} joinParameters={parameters[index]} showEdit={this.handleShowEdit}/>);
        offset +=30;
        parameters.forEach((p,i) => {
            if(getParametersEnd(parameters[index]) === getParametersStart(p)){
                this.browseChildren(parameters, i, offset, params);
            }
        });
    }

    render() {
        console.log("props", this.props);
        const{
            parameters,
            loading,
            confirmOnly,
            editIndex,
            editParameters
        } = this.props;
        console.log('join', parameters, editParameters, loading);
        let params = null;
        //create tree from parameters
        if(parameters) {
            params = [];
            console.log('params', parameters);
            parameters.forEach((p,i) => {
                let parent = null;
                for(let y = 0; y < parameters.length ; y++){
                    if(getParametersStart(p) === getParametersEnd(parameters[y])){
                        parent = y;
                    }
                }
                //root, browse recursively
                if(parent === null){
                    //params.push(<JoinParameters key={i} index={i} offset={0} joinParameters={p} showEdit={this.handleShowEdit}/>);
                    let offset = 0;
                    this.browseChildren(parameters, i, offset, params);
                }
            })
        }
        let editModal = null;
        //check if state wants edit
        if(editParameters){
            editModal = <JoinModal
                joinParameters={editParameters}
                index={editIndex}
                confirmOnly={confirmOnly}
                onClose={this.handleCloseEdit}
                onSave={this.handleSaveEdit}
                onSelectPath={this.props.selectJoinPath}
                onSelectJoinStart={this.props.selectJoinStart}
            />;
        }
        return (
            <div className="join-section">
                <Loader loaded={!loading}>
                    {params}
                    {editModal}
                </Loader>
            </div>

        );
    }
}
JoinSection.PropTypes={
    parameters: React.PropTypes.array.isRequired,
    editParameters : React.PropTypes.object,
    editIndex: React.PropTypes.number,
    confirmOnly: React.PropTypes.bool
};