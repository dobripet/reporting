import { connect } from 'react-redux';
import QuerySection from './query-section';

const mapStateToProps = (state) =>{
    return {
        query: state.query.query,
        loaded:  state.query.loaded,
        loading:  state.query.loading,
        error:  state.query.error
    }
};
const mapDispatchToProps = (dispatch) =>{
    return {
    }
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(QuerySection);