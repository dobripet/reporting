import React from 'react'
/**
 * Notification that automatically disappears
 *
 * Created by Petr on 3/28/2017.
 */
export default class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isActive: props.show};
        this.dismiss = this.dismiss.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.show != this.props.show) {
            this.setState({isActive: nextProps.show});
        }
    }

    dismiss() {
        this.props.onDismiss();
    }

    render() {
        let notification = null;
        if (this.state.isActive) {
            if (typeof this.props.onDismiss === 'function') {
                setTimeout(this.dismiss, 2000);
            }
            return <div className="notification alert alert-success">Saved</div>;
        } else {
            return null;
        }

    }
}