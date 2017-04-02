import React from 'react'
export default class OutsideClickWrapper extends React.Component{
    constructor(props) {
        super(props);
        // bindings
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    componentWillMount() {
        document.body.addEventListener('click', this.handleClick);
    }

    componentWillUnmount() {
        document.body.removeEventListener('click', this.handleClick);
        console.log('destroy');
    }
    handleClick(event){
        if(event.target !== this.container && !this.container.contains(event.target)){
            this.props.onClickOutside();
        }
    }
    handleOutsideClick() {
        this.props.onClickOutside();
    }
    render() {
        return (
            <div ref={div => this.container = div } >
                {this.props.children}
            </div>
        );
    }
}
OutsideClickWrapper.propTypes = {
    onClickOutside: React.PropTypes.func.isRequired
};