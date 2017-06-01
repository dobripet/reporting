import { connect } from 'react-redux';
import PreviewSection from './preview-section';

const mapStateToProps = (state) =>{
    return {
        rows: state.preview.rows,
        loaded:  state.preview.loaded,
        loading:  state.preview.loading,
        error:  state.preview.error
    }
};
const mapDispatchToProps = (dispatch) =>{
    return {
    }
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PreviewSection);