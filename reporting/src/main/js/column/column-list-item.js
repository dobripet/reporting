import React from 'react'
import {FormControl} from 'react-bootstrap'
import ColumnMenuItem from './column-menu-item'
import OutsideClickWrapper from '../utils/outside-click-wrapper'
export default class ColumnListItem extends React.Component{
    constructor(props) {
        super(props);
        //initial state
        this.state = {
            edit: false,
            showMenu: false
        };
        // bindings
        this.handleRemove = this.handleRemove.bind(this);
        this.handleOpenAggregateMenu = this.handleOpenAggregateMenu.bind(this);
        this.handleCloseAggregateMenu = this.handleCloseAggregateMenu.bind(this);
        this.handleSelectAggregateMenu = this.handleSelectAggregateMenu.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
    }
    handleRemove () {
        console.log('click event Remove');
        this.props.onRemove(this.props.index);
    }
    handleOpenAggregateMenu () {
        console.log('click event show');
        this.setState({showMenu: true});
    }
    handleCloseAggregateMenu () {
        console.log('click event hide');
        this.setState({showMenu: false});
    }
    handleSelectAggregateMenu (itemValue) {
        console.log('select event show', itemValue);
        this.props.onSetAggregateFunction(this.props.index, itemValue);
        this.setState({showMenu: false});
    }
    handleBlur () {
        console.log('click event blur', this.titleInput.value);
        this.props.onEditTitle(this.props.index, this.titleInput.value);
        this.setState({edit: !this.state.edit});
    }
    toggleEdit () {
        console.log('click event edit');
        this.setState({edit: !this.state.edit});
    }
    render() {
        let title = <span onClick={this.toggleEdit}>{this.props.column.title}</span>;
        if(this.state.edit){
            title = <FormControl
                id={`column-${this.props.index}`}
                inputRef={input => { this.titleInput = input }}
                onChange={this.handleSearch}
                onBlur={this.handleBlur}
                defaultValue={this.props.column.title}
                autoFocus={true}
            />
        }
        let menu = null;
        if(this.state.showMenu){
            //default
            let items  = [{label: 'Count', itemValue: 'count'}];
            if(this.props.column.dataType === 'date' || this.props.column.dataType === 'number'){
                items = [...items,
                    {label: 'Minimum', itemValue: 'min'},
                    {label: 'Maximum', itemValue: 'max'}];
                if(this.props.column.dataType === 'number'){
                    items = [...items,
                        {label: 'Average', itemValue: 'avg'},
                        {label: 'Sum', itemValue: 'sum'}];
                }
            }
            console.log(items);
            let menuItems = items.map(item => (<ColumnMenuItem key={item.itemValue} menuItem={item} onSelectItem={this.handleSelectAggregateMenu}/>));
            menu = (<OutsideClickWrapper onClickOutside={this.handleCloseAggregateMenu}>
                    <ul>
                        {menuItems}
                    </ul>
                </OutsideClickWrapper>
            );
        }
        return (
            <tr>
                <td>
                    {this.props.column.aggregateFunction}{this.props.column.name}
                </td>
                <td>
                    {title}
                </td>
                <td>
                    {menu}<button onClick={this.handleRemove} className="custom-item btn btn-primary btn-add-xxs" style={{verticalAlign:"text-bottom"}}>
                    <span className="glyphicon glyphicon-minus-sign cursor-pointer"></span></button>
                </td>
            </tr>
        );
    }
}
ColumnListItem.propTypes = {
    index: React.PropTypes.number.isRequired,
    column: React.PropTypes.shape({
        entityName: React.PropTypes.string.isRequired,
        propertyName: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        aggregateFunction: React.PropTypes.string
    }).isRequired,
    onEditTitle: React.PropTypes.func.isRequired,
    onSetAggregateFunction: React.PropTypes.func.isRequired,
    onRemove: React.PropTypes.func.isRequired
};