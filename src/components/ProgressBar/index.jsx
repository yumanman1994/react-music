/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-20 10:19:35 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-20 14:48:10
 */


import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { autobind } from 'core-decorators'
import { prefixStyle } from 'common/js/dom'

import './style.less'
const progressBtnWidth = 16
const transform = prefixStyle('transform')

class ProgressBar extends Component {
    static defaultProps = {
        percent: 0
    }

    static propTypes = {
        percent: PropTypes.number.isRequired
    }
    render() {
        return (
            <div
                className="progress-bar"
                onClick={this.properssClick}
                ref={progressBar => { this.progressBar = progressBar }}

            >
                <div className="bar-inner"  >
                    <div className="progress" ref={progress => { this.progress = progress }} >
                        <div
                            onTouchStart={this.handleProgressTouchStart}
                            onTouchMove={this.handleProgressTouchMove}
                            onTouchEnd={this.handleProgressTouchEnd}
                            className="progress-btn-wrapper"
                            ref={progressBtn => { this.progressBtn = progressBtn }} >
                            <div className="progress-btn" ></div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }

    componentDidMount() {
        // 记录手指滑动播放进度的数据
        this.touch = {}

    }

    componentDidUpdate(prevProps, prevState) {
        let props = this.props
        // console.log(props.percent, prevProps.percent)
        this._watchPercent(props.percent, prevProps.percent)



    }

    
    /**
     * 点击进度条 跳到相应的进度
     * @param {*事件} e 
     */
    @autobind
    properssClick(e) {
        let rect = this.progressBar.getBoundingClientRect()
        const barWidth = this.progressBar.clientWidth - progressBtnWidth
        let offsetWidth = e.pageX - rect.left
        offsetWidth = Math.min(
            Math.max(0, offsetWidth),
            barWidth
        )
        this._offset(offsetWidth)

        this._triggerPercent()
        // console.log(e)
        // console.log(e.offsetX,e.offsetY)
        // console.log(e.pageX)
        // console.log(e.screenX)
        // console.log(e.clientX)


    }


    // 滑动进度条系列
    @autobind
    handleProgressTouchStart(e) {
        // console.log('start')
        e.preventDefault()
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX
        // 进度条的宽
        this.touch.left = this.progress.clientWidth
    }
    @autobind
    handleProgressTouchMove(e) {
        // console.log('move')
        e.preventDefault()
        if (!this.touch.initiated) {
            return
        }
        const barWidth = this.progressBar.clientWidth - progressBtnWidth
        const deltaX = e.touches[0].pageX - this.touch.startX
        const offsetWidth = Math.min(
            Math.max(0, this.touch.left + deltaX)
            , barWidth)


        this._offset(offsetWidth)

        // console.log(e.touches[0])

    }

    @autobind
    handleProgressTouchEnd(e) {
        console.log('end')
        e.preventDefault()
        this.touch.initiated = false
        this._triggerPercent()
    }

    /**
     * 监听播放进度百分比变化 触发进度条的变化
     * @param {*} newPercent 
     * @param {*} oldPercent 
     */
    @autobind
    _watchPercent(newPercent, oldPercent) {

        if ((newPercent !== oldPercent) && (newPercent >= 0) && !this.touch.initiated) {
            const barWidth = this.progressBar.clientWidth - progressBtnWidth
            const offsetWidth = newPercent * barWidth
            this._offset(offsetWidth)
        }

    }

    /**
     * 滑动 点击进度条 触发进度百分百变化
     */
    @autobind
    _triggerPercent() {
        const barWidth = this.progressBar.clientWidth - progressBtnWidth
        const percent = this.progress.clientWidth / barWidth
        this.props.percentChange(percent)
    }

    /**
     * 元素距离变卦
     * @param {*} offsetWidth 
     */
    @autobind
    _offset(offsetWidth) {
        this.progress.style.width = `${offsetWidth}px`
        this.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0 ,0)`
    }

}

export default ProgressBar
