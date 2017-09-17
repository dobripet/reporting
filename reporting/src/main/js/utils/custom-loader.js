import React from 'react'
import Loader from 'react-loader-advanced'
export default class CustomLoader extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        let spinner = <div className="sk-circle">
                <div className="sk-circle1 sk-child"></div>
                <div className="sk-circle2 sk-child"></div>
                <div className="sk-circle3 sk-child"></div>
                <div className="sk-circle4 sk-child"></div>
                <div className="sk-circle5 sk-child"></div>
                <div className="sk-circle6 sk-child"></div>
                <div className="sk-circle7 sk-child"></div>
                <div className="sk-circle8 sk-child"></div>
                <div className="sk-circle9 sk-child"></div>
                <div className="sk-circle10 sk-child"></div>
                <div className="sk-circle11 sk-child"></div>
                <div className="sk-circle12 sk-child"></div>
            </div>;
        let hide = this.props.hideContentOnLoad;
        //default hide is true
        if(hide === null ||  hide === 'undefined'){
            hide = true;
        }
        return (
            <Loader show={this.props.show} hideContentOnLoad={hide}  backgroundStyle={{backgroundColor: '#e6f5ff'}} message={spinner}
                    contentStyle={{minHeight:"60px", minWidth:"60px"}}>
                {this.props.children}
            </Loader>
        );
    }
}
CustomLoader.PropTypes={
    show: React.PropTypes.bool.isRequired,
    hideContentOnLoad: React.PropTypes.bool
};