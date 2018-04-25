/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-26 00:47:40 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-26 01:08:11
 */

/*
* @Author: 余小蛮-1029686739@qq.com 
* @Date: 2018-04-25 22:28:03 
* @Last Modified by: 余小蛮-1029686739@qq.com
* @Last Modified time: 2018-04-25 23:29:04
*/


import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import { autobind } from 'core-decorators'
import './style.less'

class Confirm extends Component {
    static defaultProps = {
        text: '',
        confirmBtnText: '确定',
        cancelBtnText: '取消',
        cancel:() => {
            
        },
        confirm:() => {
            
        },

    }
    static propTypes = {
        text: PropTypes.string.isRequired,
        confirmBtnText: PropTypes.string.isRequired,
        cancelBtnText: PropTypes.string.isRequired,
        cancel: PropTypes.func.isRequired,
        confirm: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)

        this.state = {
            showFlag: false
        }
    }

    render() {
        let { text, cancelBtnText, confirmBtnText } = this.props
        return (
            <CSSTransition
                key="confirm"
                classNames="confirm-fade"
                in={this.state.showFlag}
                timeout={{ enter: 300, exit: 0 }}
                unmountOnExit

            >
                <div className="confirm">
                    <div className="confirm-wrapper" >
                        <div className="confirm-content">
                            <p className="text">{text}</p>
                            <div className="operate">
                                <div className="operate-btn left" onClick={this.cancel} >{cancelBtnText}</div>
                                <div className="operate-btn" onClick={this.confirm} >{confirmBtnText}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </CSSTransition>

        )
    }

    @autobind
    cancel() {
        this.hide()
        this.props.cancel()

    }

    @autobind
    confirm() {
        this.hide()
        this.props.confirm()
    }


    @autobind
    show() {
        this.setState({
            showFlag: true
        })
    }

    @autobind
    hide() {
        this.setState({
            showFlag: false
        })
    }





}

export default Confirm
