import React from 'react'

export default class EntityStatsModalKey extends React.Component{
    constructor(props) {
        super(props);
        //initial state
        this.state = {
            expanded: false
        };
        // bindings
        this.handleExpand  = this.handleExpand.bind(this);
    }
    handleExpand () {
        console.log('click event expand ');
        this.setState({expanded: !this.state.expanded});
    }
    render() {
        let keys = this.props.keys;
        let name = this.props.name;
        let items = null;
        if(this.state.expanded) {
            items = keys.map((fk, i) => <li key={i}>{fk.localColumnName} -> {fk.foreignColumnName}</li>);
            items = <ul>{items}</ul>;
        }
        return (
            <li key={name}>
                <span onClick={this.handleExpand} > + </span>
                <span onClick={this.handleExpand}>{name}</span>
                {items}
            </li>
            )

    }
}
EntityStatsModalKey.propTypes = {
    keys: React.PropTypes.arrayOf(React.PropTypes.shape({
        selected: React.PropTypes.bool.isRequired,
        localColumnName: React.PropTypes.string.isRequired,
        foreignColumnName: React.PropTypes.string.isRequired

    })).isRequired,
    name: React.PropTypes.string.isRequired
};