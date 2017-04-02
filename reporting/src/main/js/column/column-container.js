import { connect } from 'react-redux';
import ColumnSection from './column-section';
import { removeColumnFromColumnList, editColumnTitle, setAggregateFunction } from './column-actions'

const mapStateToProps = (state) =>{
    return {
        columns: state.column.columns,
        loaded:  state.column.loaded,
        loading:  state.column.loading,
        error:  state.column.error
    }
};
const mapDispatchToProps = (dispatch) =>{
    return {
        removeColumnFromColumnList: (columnIndex) =>{
            dispatch(removeColumnFromColumnList(columnIndex))
        },
        editColumnTitle: (columnIndex, title) =>{
            dispatch(editColumnTitle(columnIndex, title))
        },
        setAggregateFunction: (columnIndex, aggregateFunction) =>{
            dispatch(setAggregateFunction(columnIndex, aggregateFunction))
        }
    }
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ColumnSection);