import React from 'react'
/**
 * SQL Query section component
 *
 * Created by Petr on 3/4/2017.
 */
export default class QuerySection extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.dirty && !nextProps.loading) {
            setTimeout(this.props.update(), 50);
        }
    }

    render() {
        const {
            query
        } = this.props;
        let text = 'None.';
        if (query && query.length > 1) {
            text = query;
        }
        return (
            <div className="query-section">
                <div style={{whiteSpace: "pre-wrap"}}>{text}</div>
            </div>

        );
    }
}
QuerySection.PropTypes = {
    query: React.PropTypes.string.isRequired
};