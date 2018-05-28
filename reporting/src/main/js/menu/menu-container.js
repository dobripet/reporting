import {connect} from 'react-redux';
import MenuSection from './menu-section';
import {clear, loadAllQueries, save, loadQuery, newQuery} from './menu-actions'
/**
 * Menu container
 *
 * Created by Petr on 4/5/2017.
 */
const mapStateToProps = (state) => {
    return {
        error: state.menu.error,
        queries: state.menu.queries,
        name: state.menu.name,
        id: state.menu.id,
        showSavedOK: state.menu.showSavedOK,
        loading: state.menu.loading
    }
};
const mapDispatchToProps = (dispatch) => {
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