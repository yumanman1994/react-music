/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-25 22:28:03 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-06-29 01:43:03
 */


import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import './style.less'

class Swiches extends Component {
    static defaultProps = {
        switches: [],
        currentIndex: 0,
        setSwitchesIndex:() => {

        }

    }
    static propTypes = {
        switches: PropTypes.array.isRequired,
        currentIndex: PropTypes.number.isRequired,
        setSwitchesIndex:PropTypes.func.isRequired
    }

    render() {
        let { switches, currentIndex } = this.props
        // console.log(searches,'SearchList')
        return (
            <ul className="switches">
                {
                    switches.map((item, index) =>
                        <li
                            className={`switch-item ${index === currentIndex ? 'active' : ''}`}
                            key={index} 
                            onClick={() => {this.handleClick(index)}}
                            
                            >
                            {item.name}
                        </li>
                    )
                }
            </ul>
        )
    }


    @autobind
    handleClick(index){
        // console.log();
        
        this.props.setSwitchesIndex(index)
    }



}

export default Swiches
