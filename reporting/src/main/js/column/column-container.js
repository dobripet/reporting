import {connect} from 'react-redux';
import ColumnSection from './column-section';
import {removeColumnFromColumnList, editColumnTitle} from './column-actions'
/**
 * Column container
 *
 * Created by Petr on 3/21/2017.
 */
const mapStateToProps = (state) => {
    return {
        columns: state.column.columns,
        loaded: state.column.loaded,
        loading: state.column.loading,
        error: state.column.error
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        removeColumnFromColumnList: (columnIndex) => {
            dispatch(removeColumnFromColumnList(columnIndex))
        },
        editColumnTitle: (columnIndex, title) => {
            dispatch(editColumnTitle(columnIndex, title))
        }
    }
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ColumnSection);