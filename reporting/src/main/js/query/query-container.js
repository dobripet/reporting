import {connect} from 'react-redux';
import QuerySection from './query-section';
import {updateSqlAndPreview} from './query-actions'
/**
 * SQL Query container
 *
 * Created by Petr on 3/4/2017.
 */

const mapStateToProps = (state) => {
    return {
        query: state.query.query,
        loaded: state.query.loaded,
        loading: state.query.loading,
        error: state.query.error,
        dirty: state.query.dirty
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        update: () => {
            dispatch(updateSqlAndPreview());
        }
    }
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(QuerySection);