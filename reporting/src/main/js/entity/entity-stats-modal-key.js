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
        let glyphClass = "glyphicon glyphicon-menu-down cursor-pointer";
        if(this.state.expanded) {
            glyphClass = "glyphicon glyphicon-menu-up cursor-pointer";
            items = keys.map((fk, i) => <span key={i} className="padded-list-item">{fk.localColumnName} -> {fk.foreignColumnName}</span>);
        }
        return (
            <div key={name} className="padded-list-item">
                <span onClick={this.handleExpand} className={glyphClass}></span>
                <span onClick={this.handleExpand} className="cursor-pointer" style={{marginLeft:"5px"}}>{name}</span>
                {items}
            </div>
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