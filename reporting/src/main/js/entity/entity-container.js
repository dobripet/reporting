/**
 * Created by Petr on 3/15/2017.
 */
import { connect } from 'react-redux';
import EntitySection from './entity-section';
import { fetchEntityList, searchEntityList, getEntityRowCount, getEntityPropertyStats } from './entity-actions'
import { addPropertiesToColumnList } from '../column/column-actions'

const mapStateToProps = (state) =>{
    console.log("mapuju entities na ", state.entity);
    return {
        entities: state.entity.entities,
        loading:  state.entity.loading,
        error:  state.entity.error,
        search: state.entity.search,
        statsLoading: state.entity.statsLoading,
        statsError: state.entity.statsError
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
            dispatch(addPropertiesToColumnList(entity, properties));
        },
        getEntityRowCount: (name) =>{
            dispatch(getEntityRowCount(name))
        },
        getEntityPropertyStats: (entityName, propertyName) =>{
            dispatch(getEntityPropertyStats(entityName, propertyName))
        }
    }
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EntitySection);