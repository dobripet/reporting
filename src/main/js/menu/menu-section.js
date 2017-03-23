import React from 'react'

export default class ColumnSection extends React.Component{
    constructor(props) {
        super(props);
        // bindings
        //this.handleRemove  = this.handleRemove.bind(this);
    }
    handleRemove (item){
        console.log("remove ", item);
        //this.props.addPropertiesToColumnList(entity, properties);
    }
    render() {
        return (
            <div className="menu-section">
                <button >Load</button>
                <button >Save</button>
                <button >Clear</button>
            </div>
        );
    }
}
ColumnSection.PropTypes={
    columns: React.PropTypes.array.isRequired
};