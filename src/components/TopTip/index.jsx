import React ,{Component} from 'react'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import { autobind } from 'core-decorators'
import './style.less'


class TopTip extends Component{
    static defaultProps = {
        delay:2000

    }

    static propTyps = {
        delay:PropTypes.number.isRequired
    }

    constructor(props){
        super(props)
        this.state = {
            showFlag:false
        }
    }


    render(){
        return (
            <CSSTransition
            key="topTip"
            classNames="topTip-drop"
            in={this.state.showFlag}
            timeout={300}
            unmountOnExit
            >
                <div className="top-tip" onClick={this.handleClick} >
                    {this.props.children}
                </div>
            </CSSTransition>
            
        )
    }

    @autobind
    show(){
        this.setState({
            showFlag:true
        },() => {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.hide()
            },this.props.delay)
        })
    }

    @autobind
    hide(){
        this.setState({
            showFlag:false
        })
    }



    @autobind
    handleClick(e){
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
        this.hide()
        

    }





}


export default TopTip