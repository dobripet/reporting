import React from 'react'
/**
 * Foreign keys component in modal join
 *
 * Created by Petr on 4/5/2017.
 */
export default class JoinModalKeys extends React.Component {
    constructor(props) {
        super(props);
        //initial state
        this.state = {
            keys: this.props.keys
        };
        // bindings
        this.onChange = this.onChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({keys: nextProps.keys})
    }

    onChange(event) {
        let index = event.target.value;
        let key = this.state.keys[index];
        let keys = this.state.keys;
        if (key.selected) {
            //check if can unselect, need always at least one selected item
            if (keys.filter(k => k.selected).length <= 1) {
                return;
            }
            keys[index].selected = false;
        } else {
            keys[index].selected = true;
        }
        this.setState({keys});
        this.props.onChange(this.props.index, keys);
    }

    render() {
        let keys = this.state.keys.map((key, i) => <div className="checkbox" key={i}>
            <label><input type="checkbox" value={i} checked={key.selected}
                          onChange={this.onChange}/>{key.localColumnName} = {key.foreignColumnName}</label>
        </div>);
        return (
            <div>
                {keys}
            </div>
        )
    }
}
JoinModalKeys.propTypes = {
    keys: React.PropTypes.arrayOf(React.PropTypes.shape({
        selected: React.PropTypes.bool.isRequired,
        localColumnName: React.PropTypes.string.isRequired,
        foreignColumnName: React.PropTypes.string.isRequired

    })).isRequired,
    index: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired,
};