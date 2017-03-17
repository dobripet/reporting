/**
 * Created by Petr on 3/15/2017.
 */
import { connect } from 'react-redux';
import EntitySection from './entity-section';
import { fetchEntityList } from './entity-actions'

const mapStateToProps = (state) =>{
    return {
        entities: state.entity.entities,
        loaded:  state.entity.loaded,
        loading:  state.entity.loading,
        error:  state.entity.error
    }
};
const mapDispatchToProps = (dispatch) =>{
    return {
        fetchEntityList: () => {
            dispatch(fetchEntityList())
        }
    }
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EntitySection);