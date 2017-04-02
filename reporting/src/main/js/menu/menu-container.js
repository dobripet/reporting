import { connect } from 'react-redux';
import MenuSection from './menu-section';

const mapStateToProps = (state) =>{
    return {
       // error:  state.menu.error
    }
};
const mapDispatchToProps = (dispatch) =>{
    return {

    }
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuSection);