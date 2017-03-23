/**
 * Created by Petr on 3/15/2017.
 */
import { connect } from 'react-redux';
import EntitySection from './entity-section';
import { fetchEntityList, searchEntityList } from './entity-actions'
import { addPropertiesToColumnList } from '../column/column-actions'

const mapStateToProps = (state) =>{
    return {
        entities: state.entity.filteredEntityList,
        loaded:  state.entity.loaded,
        loading:  state.entity.loading,
        error:  state.entity.error,
        search: state.entity.search
    }
};
const mapDispatchToProps = (dispatch) =>{
    return {
        fetchEntityList: () => {
            dispatch(fetchEntityList())
        },
        searchEntityList: (text) =>{
            dispatch(searchEntityList(text))
        },
        addPropertiesToColumnList: (entity, properties) =>{
            dispatch(addPropertiesToColumnList(entity, properties))
        }
    }
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EntitySection);