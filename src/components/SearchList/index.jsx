/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-25 22:28:03 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-25 23:29:04
 */


import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import './style.less'

class SearchList extends Component {
    static defaultProps = {
        searches: [],

    }
    static propTypes = {
        searches: PropTypes.array.isRequired,
        deleteOne: PropTypes.func.isRequired,
        select: PropTypes.func.isRequired,
    }

    render() {
        let { searches } = this.props
        console.log(searches,'SearchList')
        return (
            <div className="search-list">
                <ul>
                    {
                        searches.map((item, index) => 
                            <li key={index} className="search-item" onClick={e => {this.selectItem(e,item)}} >
                                <span className="text" >{item}</span>
                                <span className="icon" onClick={(e) => {this.deleteOneClick(e,item)}} >
                                    <i className="icon-delete" ></i>
                                </span>
                            </li>
                        )
                    }

                </ul>
            </div>
        )
    }

    @autobind
    deleteOneClick(e,item){
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
        this.props.deleteOne(item)
    }

    @autobind
    selectItem(e,item){
        // e.stopPropagation()
        // e.nativeEvent.stopImmediatePropagation()
        this.props.select(item)

    }



}

export default SearchList
