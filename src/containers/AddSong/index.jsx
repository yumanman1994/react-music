/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-06-28 23:31:45 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-06-29 01:44:22
 */

import React, { Component } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import SearchBox from 'components/SearchBox'
import Swiches from 'components/Swiches'

import { autobind } from 'core-decorators'
import PropTypes from 'prop-types'


import './style.less'



class AddSong extends Component {
    static defaultProps = {
        showFlag: false,


    }

    static propsTypes = {
        showFlag: PropTypes.bool.isRequired,

    }


    constructor(props) {
        super(props)

        this.state = {
            query: '',
            switches: [{ name: '最近播放' }, { name: '搜索历史' }],
            currentIndex: 0,
        }


    }
    render() {
        let { query ,switches,currentIndex} = this.state
        let { showFlag } = this.props

        return (
            <CSSTransition
                in={showFlag}
                key="addSongFade"
                classNames="addSongFade"
                timeout={{ enter: 300, exit: 300 }}
                unmountOnExit
            >
                <div className="add-song" onClick={this.handleStopPt} >
                    <div className="header">
                        <h1 className="title">添加歌曲到列表</h1>
                        <div className="close" onClick={this.props.hideAddSong}>
                            <i className="icon-close" ></i>
                        </div>

                        <div className="search-box-wrapper" >
                            <SearchBox query={query} setStateQuery={this.setStateQuery} />
                        </div>

                        <div className="shortcut" >
                            <Swiches currentIndex={currentIndex} setSwitchesIndex={this.setSwitchesIndex} switches={switches}/>
                        </div>


                    </div>
                </div>
            </CSSTransition>

        )

    }

    @autobind
    setSwitchesIndex(currentIndex){
        this.setState({
            currentIndex
        })
    }


    @autobind
    setStateQuery(query) {
        this.setState({
            query
        }, () => {

        })
    }
    /**
      * 阻止事件冒泡
      * @param {*} e 
      */
    @autobind
    handleStopPt(e) {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
    }



}

export default AddSong
