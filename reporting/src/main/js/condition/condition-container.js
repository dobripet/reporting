import { connect } from 'react-redux';
import ConditionSection from './condition-section';
import { addCondition } from './condition-actions'

const mapStateToProps = (state) =>{
    return {
        conditions: state.condition.conditions,
        loaded:  state.condition.loaded,
        loading:  state.condition.loading,
        error:  state.condition.error
    }
};
const mapDispatchToProps = (dispatch) =>{
    return {
        addCondition: () =>{
            dispatch(addCondition())
        }
    }
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConditionSection);