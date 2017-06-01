import React from 'react'
export default class JoinModal extends React.Component {
    constructor(props) {
        super(props);
        //initial state
        // bindings
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        //this.searchInput.focus();
        console.log("fetch dobrty");
        //this.props.getEntityPropertyStats(this.props.property.name);
    }
    handleClose(){
        this.props.onClose();
    }
    render(){
        const {
            joinParameters
        } = this.props;
        console.log("show join ", joinParameters);
        return (
            <div className="custom-modal-container">
                <div className="custom-modal">
                    <button onClick={this.handleClose}>Close</button>
                </div>
            </div>
        )
    }
}

JoinModal.propTypes = {
    joinParameters: React.PropTypes.shape({
        selectedPath: React.PropTypes.array.isRequired,
        paths: React.PropTypes.array.isRequired,
        joinColumns: React.PropTypes.array.isRequired,
        selectedJoinColumns: React.PropTypes.shape({
            localColumnNames: React.PropTypes.array.isRequired,
            foreignColumnNames:React.PropTypes.array.isRequired
        }).isRequired,
    }).isRequired
    /*property: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        dataType: React.PropTypes.string.isRequired,
        enumConstraints: React.PropTypes.array
    }).isRequired,
    getEntityPropertyStats: React.PropTypes.func.isRequired*/
};