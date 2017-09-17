import { connect } from 'react-redux';
import MenuSection from './menu-section';
import {clear, loadAllQueries, save, loadQuery, newQuery} from './menu-actions'

const mapStateToProps = (state) =>{
    return {
       // error:  state.menu.error
        queries: state.menu.queries,
        name: state.menu.name,
        id: state.menu.id,
        showSavedOK: state.menu.showSavedOK
    }
};
const mapDispatchToProps = (dispatch) =>{
    return {
        clear: () => {
            dispatch(clear());
        },
        newQuery: () => {
            dispatch(newQuery());
        },
        loadAllQueries: () => {
            dispatch(loadAllQueries());
        },
        save: (name, isSaveAs) => {
            dispatch(save(name, isSaveAs));
        },
        loadQuery: (id) => {
            dispatch(loadQuery(id));
        }

    }
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuSection);