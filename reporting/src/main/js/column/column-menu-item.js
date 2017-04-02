import React from 'react'
export default class ColumnMenuItem extends React.Component{
    constructor(props) {
        super(props);
        // bindings
        this.handleOnClick = this.handleOnClick.bind(this);
    }
    handleOnClick() {
        console.log('select item', this.props.menuItem.itemValue);
        this.props.onSelectItem(this.props.menuItem.itemValue);
    }
    render() {
        return (
            <li onClick={this.handleOnClick} >
                {this.props.menuItem.label}
            </li>
        );
    }
}
ColumnMenuItem.propTypes = {
    menuItem: React.PropTypes.shape({
        itemValue: React.PropTypes.string.isRequired,
        label: React.PropTypes.string.isRequired,
    }).isRequired,
    onSelectItem: React.PropTypes.func.isRequired
};