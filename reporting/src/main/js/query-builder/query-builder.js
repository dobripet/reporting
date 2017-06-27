/**
 * Created by Petr on 3/4/2017.
 */
import React from 'react'
import EntityContainer from '../entity/entity-container'
import ColumnContainer from '../column/column-container'
import PreviewContainer from '../preview/preview-container'
import QueryContainer from '../query/query-container'
import JoinContainer from '../join/join-container'
import MenuContainer from '../menu/menu-container'
import Modal from '../modal/modal'
export default class QueryBuilder extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        let modal = null;
        console.log("modal closed", this.props);
        if(this.props.modalOpened){
            modal = <Modal modal={this.props.modal} dispatch={this.props.dispatch}/>;
            console.log("modal otevrit");
        }
        return (
            <div className="vertical-app-container">
                {modal}
                <MenuContainer />
                <div className="horizontal-cjqpe-container">
                    <EntityContainer />
                    <div className="vertical-cjqp-container">
                        <div className="horizontal-cjq-container">
                            <div className="vertical-cj-container">
                                <ColumnContainer />
                                <JoinContainer />
                            </div>
                            <QueryContainer />
                        </div>
                        <PreviewContainer />
                    </div>
                </div>
            </div>
        );
    }
}

QueryBuilder.propTypes = {
    modal: React.PropTypes.shape({
        confirm: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        decline: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        message: React.PropTypes.string,
        type: React.PropTypes.string
    }),
    modalOpened: React.PropTypes.bool.isRequired,
    dispatch: React.PropTypes.func.isRequired
};