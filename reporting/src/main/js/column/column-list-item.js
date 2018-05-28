import React from 'react'
import {FormControl} from 'react-bootstrap'
/**
 * Property component, represent given entity property
 *
 * Created by Petr on 3/21/2017.
 */
export default class ColumnListItem extends React.Component {
    constructor(props) {
        super(props);
        //initial state
        this.state = {
            edit: false,
            showMenu: false
        };
        // bindings
        this.handleRemove = this.handleRemove.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
    }

    handleRemove() {
        this.props.onRemove(this.props.index);
    }

    handleBlur() {
        this.props.onEditTitle(this.props.index, this.titleInput.value);
        this.setState({edit: !this.state.edit});
    }

    toggleEdit() {
        this.setState({edit: !this.state.edit});
    }

    render() {
        let title = <span onClick={this.toggleEdit}>{this.props.column.title}</span>;
        if (this.state.edit) {
            title = <FormControl
                id={`column-${this.props.index}`}
                inputRef={input => {
                    this.titleInput = input
                }}
                onChange={this.handleSearch}
                onBlur={this.handleBlur}
                defaultValue={this.props.column.title}
                autoFocus={true}
            />
        }
        return (
            <tr>
                <td>
                    {this.props.column.name}
                </td>
                <td>
                    {title}
                </td>
                <td>
                    <button onClick={this.handleRemove} className="custom-item btn btn-primary btn-add-xxs"
                            style={{verticalAlign: "text-bottom"}}>
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
        name: React.PropTypes.string.isRequired
    }).isRequired,
    onEditTitle: React.PropTypes.func.isRequired,
    onRemove: React.PropTypes.func.isRequired
};