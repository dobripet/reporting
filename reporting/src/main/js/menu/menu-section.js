import React from 'react'
import LoadModal from './load-modal'
import SaveModal from './save-modal'

export default class MenuSection extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            showLoadModal: false,
            showSaveModal: false,
            isSaveAs: false
        };
        // bindings
        this.handleClear  = this.handleClear.bind(this);
        this.handleSave  = this.handleSave.bind(this);
        this.handleLoad  = this.handleLoad.bind(this);
        this.handleOpenLoadModal  = this.handleOpenLoadModal.bind(this);
        this.handleCloseLoadModal  = this.handleCloseLoadModal.bind(this);
        this.handleOpenSaveModal  = this.handleOpenSaveModal.bind(this);
        this.handleOpenSaveAsModal  = this.handleOpenSaveAsModal.bind(this);
        this.handleCloseSaveModal  = this.handleCloseSaveModal.bind(this);
        this.handleNew  = this.handleNew.bind(this);
    }
    handleClear (){
        this.props.clear();
    }

    handleSave (value){
        console.log("save", value, this.state.isSaveAs);
        this.props.save(value, this.state.isSaveAs);
        this.handleCloseSaveModal();
    }

    handleLoad (){
        this.props.load();
    }

    handleOpenLoadModal (){
        console.log("openload");
        this.props.loadAllQueries();
        this.setState({showLoadModal: !this.state.showLoadModal});
    }
    handleCloseLoadModal (){
        this.setState({showLoadModal: !this.state.showLoadModal});
    }
    handleOpenSaveModal (){
        console.log("opensave");
        //save current loaded query
        if(this.props.id) {
            this.props.save(this.props.name);
            return;
        }
        this.setState({showSaveModal: !this.state.showSaveModal, isSaveAs: false});
    }
    handleOpenSaveAsModal (){
        console.log("opensaveas");
        this.setState({showSaveModal: !this.state.showSaveModal, isSaveAs: true});
    }
    handleCloseSaveModal (){
        this.setState({showSaveModal: !this.state.showSaveModal});
    }
    handleNew (){
        this.props.newQuery();
    }
    render() {
        const {
            showLoadModal,
            showSaveModal
        } = this.state;
        let loadModal = null;// loadAllQueries={this.props.loadAllQueries}
        if(showLoadModal){
            loadModal = <LoadModal onClose={this.handleCloseLoadModal} queries={this.props.queries} loadQuery={this.props.loadQuery}/>
        }

        let saveModal = null;
        if(showSaveModal){
            saveModal = <SaveModal onClose={this.handleCloseSaveModal} onSave={this.handleSave}/>
        }
        console.log('wtf name', this.props.name);
        return (
            <div className="menu-section">
                {loadModal}
                {saveModal}
                <button onClick={this.handleNew}>New</button>
                <button onClick={this.handleOpenLoadModal}>Load</button>
                <button onClick={this.handleOpenSaveModal}>Save</button>
                <button onClick={this.handleOpenSaveAsModal}>Save As</button>
                <button onClick={this.handleClear}>Clear</button>
                {this.props.name}
            </div>
        );
    }
}
MenuSection.PropTypes={
    clear: React.PropTypes.func.isRequired,
    save: React.PropTypes.func.isRequired,
    saveAs: React.PropTypes.func.isRequired,
    newQuery: React.PropTypes.func.isRequired,
    queries: React.PropTypes.array,
    name: React.PropTypes.string,
    //load: React.PropTypes.func.isRequired
    loadAllQueries: React.PropTypes.func.isRequired
};