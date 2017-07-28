import React from 'react'

export default class JoinParameters extends React.Component{
    constructor(props) {
        super(props);
        // bindings
        this.showEdit  = this.showEdit.bind(this);
    }

    showEdit(){
        this.props.showEdit(this.props.index);
    }

    render() {
        const {
            selectedPath,
            joinKeys
        } = this.props.joinParameters;
        let start= null;
        let end = null;
        if(selectedPath.length > 1){
            start = selectedPath[0];
            end = selectedPath[selectedPath.length-1];
        }
        let keys;
        for(let column of joinKeys){
            console.log(column);
        }
        console.log('offset', this.props.offset);
        return (
            <div style={{marginLeft: this.props.offset}}>
                {start} -> {end} <button onClick={this.showEdit}>Edit</button>
            </div>
        );
    }
}
JoinParameters.propTypes = {
    showEdit:  React.PropTypes.func.isRequired,
    index: React.PropTypes.number.isRequired,
    joinParameters: React.PropTypes.shape({
        selectedPath: React.PropTypes.array.isRequired,
        joinKeys: React.PropTypes.array.isRequired
    }).isRequired,
    offset: React.PropTypes.number.isRequired
};