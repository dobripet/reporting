import React from 'react'
import {TYPE_CONFIRM, TYPE_ERROR} from './modal-actions'
/**
 * Modal window component
 *
 * Created by Petr on 3/8/2017.
 */
export default class Modal extends React.Component {
    constructor(props) {
        super(props);
        // bindings
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleDecline = this.handleDecline.bind(this);
    }

    handleConfirm() {
        this.props.dispatch(this.props.modal.confirm);
    }

    handleDecline() {
        this.props.dispatch(this.props.modal.decline);
    }

    render() {
        const {
            message,
            type
        } = this.props.modal;
        let buttons = {};
        let className = null;
        switch (type) {
            case TYPE_CONFIRM: {
                className = "alert alert-info";
                buttons = <div>
                    <button onClick={this.handleConfirm} className="btn btn-success" style={{marginRight: "10px"}}>Ok
                    </button>
                    <button onClick={this.handleDecline} className="btn btn-info">Cancel</button>
                </div>
            }
                break;
            case TYPE_ERROR: {
                className = "alert alert-danger";
                buttons = <div>
                    <button onClick={this.handleConfirm} className="btn btn-primary">Ok</button>
                </div>
            }
                break;
            default : {
                className = "alert alert-success";
                buttons = <div>
                    <button onClick={this.handleConfirm} className="btn btn-primary">Ok</button>
                </div>
            }
                break;
        }
        return (
            <div className="top-modal-container">
                <div className="custom-modal">
                    <div className={className}>{message}</div>
                    {buttons}
                </div>
            </div>
        )
    }
}

Modal.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    modal: React.PropTypes.shape({
        confirm: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]).isRequired,
        decline: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        message: React.PropTypes.string.isRequired,
        type: React.PropTypes.string.isRequired
    }),
};