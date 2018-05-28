import {connect} from 'react-redux';
import PreviewSection from './preview-section';
/**
 * Data preview section container
 *
 * Created by Petr on 3/4/2017.
 */
const mapStateToProps = (state) => {
    return {
        data: state.preview.data,
        columnNames: state.preview.columnNames,
        loaded: state.preview.loaded,
        loading: state.preview.loading,
        error: state.preview.error
    }
};
const mapDispatchToProps = (dispatch) => {
    return {}
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PreviewSection);