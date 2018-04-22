/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-22 01:56:16 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-22 15:33:13
 */



import React, { Component } from 'react'
import Scroll from 'components/Scroll'
import { autobind } from 'core-decorators'
import PropTypes from 'prop-types'

import './Lyric.less'



class Lyric extends Component {
    static defaultProps = {
        currentLyricLineNum: 0,
        notLyric: false
    }
    static propTypes = {
        currentLyricLineNum: PropTypes.number.isRequired,
        notLyric: PropTypes.bool.isRequired
        // currentLyric:PropTypes.array.isRequired
    }
    constructor(props) {
        super()

        this.lyricLines = []
    }
    render() {
        let { currentLyricLineNum, currentLyric ,notLyric} = this.props
        return (
            <Scroll 
            refreshData={currentLyric && currentLyric.lines} 
            className="middle-r" 
            ref={lyricList => { this.lyricList = lyricList }} >
                <div className="lyric-wrapper"  >
                    {
                        currentLyric ? <div  >
                            {
                                notLyric ? <div className="text center" >{currentLyric.lrc | '暂无歌词'}</div> : ''
                                   
                            }
                            {
                                currentLyric.lines.length ?   '' :<div className="text current center" >{currentLyric.lrc }</div>  
                            }
                            {
                                currentLyric.lines.map((line, index) =>
                                    <p ref={lines => { lines && !this.lyricLines[index] && this.lyricLines.push(lines) }}
                                        className={`text ${currentLyricLineNum === index ? 'current' : ''}`}
                                        key={index} >
                                        {line.txt}
                                    </p>
                                )

                            }
                        </div> : null
                    }

                </div>
            </Scroll>
        )
    }

    componentDidMount() {
        console.log('componentDidMount', this.props)
        let { currentLyricLineNum } = this.props
        if (currentLyricLineNum > 5) {
            console.log(5)
            let lineEl = this.lyricLines[currentLyricLineNum - 5]
            // console.log(lineEl,curr)
            setTimeout(() => {
                this.lyricList.scrollToElement(lineEl, 0)
            }, 20);

        } else {
            setTimeout(() => {
                this.lyricList.scrollTo(0, 0, 0)
            }, 20);

            console.log(0)

        }


    }

    componentDidUpdate(prevProps, prevState) {
        console.log('componentDidUpdate')
        let props = this.props
        if (props.currentLyricLineNum !== prevProps.currentLyricLineNum) {
            let { currentLyricLineNum } = props
            if (currentLyricLineNum > 5) {

                let lineEl = this.lyricLines[currentLyricLineNum - 5]
                // console.log(lineEl, this.lyricList)
                this.lyricList.scrollToElement(lineEl, 1000)
            } else {
                this.lyricList.scrollTo(0, 0, 1000)
            }
        }


    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.currentLyric !== this.props.currentLyric) {
            this.lyricLines = []
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // if(nextProps.currentLyric === this.props.currentLyric){
        //     return false
        // }

        let oldNum = nextProps.currentLyricLineNum
        let newNum = this.props.currentLyricLineNum

        if (nextProps.currentLyric === null || nextProps.currentLyric !== this.props.currentLyric) {
            // console.log(nextProps.currentLyric)
            console.log('first')
            return true
        }

        if (oldNum === newNum) {
            return false
        }

        return true
    }




    // componentDidUpdate

}

export default Lyric
