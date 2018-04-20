/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-16 20:00:46 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-20 15:31:50
 */

import React, { Component } from 'react'
import ProgressBar from 'components/ProgressBar'
import ProgressCircle from 'components/ProgressCircle'
import { CSSTransition } from 'react-transition-group'
import animations from 'create-keyframe-animation'
import { autobind } from 'core-decorators'
import { observer, inject } from 'mobx-react'
import { prefixStyle } from 'common/js/dom'

import './style.less'
const transform = prefixStyle('transform')

@inject(stores => ({
    fullScreen: stores.player.fullScreen,
    playList: stores.player.playList,
    currentSong: stores.player.currentSong,
    setFullScreen: stores.player.setFullScreen,
    playing: stores.player.playing,
    setPlaying: stores.player.setPlaying,
    currentIndex: stores.player.currentIndex,
    setCurrentIndex: stores.player.setCurrentIndex
}))
@observer
class Player extends Component {

    constructor(props) {
        super(props)

        this.state = {
            // 判断是够够点击切换
            songReady: false,
            currentTime: 0,
            percent: 0
        }
    }

    render() {
        let { fullScreen, playList, currentSong, playing } = this.props
        let { songReady, currentTime, percent } = this.state
        let normalShow = playList.length > 0 && fullScreen
        let miniShow = playList.length > 0 && !fullScreen
        return (
            <div className="player" >
                <CSSTransition
                    in={normalShow}
                    classNames="normal"
                    timeout={{ enter: 400, exit: 400 }}
                    key="normal"
                    unmountOnExit
                    // unmountOnExit
                    onEnter={this.onEnter}
                    // onEntering={this.onEntering}
                    onEntered={this.onEntered}
                    onExit={this.onExit}
                    // onExiting={this.onExiting}
                    onExited={this.onExited}
                >
                    <div className="normal-player">
                        <div className="background" >
                            <img src={currentSong.image} width="100%" height="100%" />
                        </div>
                        <div className="top">
                            <div className="back" onClick={this.back}  >
                                <i className="icon-back"></i>
                            </div>
                            <h1 className="title" >
                                {currentSong.name}
                            </h1>
                            <h2 className="subtitle" >
                                {currentSong.singer}
                            </h2>
                        </div>
                        <div className="middle">
                            <div className="middle-l">
                                <div className="cd-wrapper " ref={cdWrapper => { this.cdWrapper = cdWrapper }} >
                                    <div className={`cd ${playing ? 'play' : 'play pause'}`} >
                                        <img src={currentSong.image} className="image" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bottom">
                            <div className="progress-wrapper">
                                <span className="time time-l" >{this.format(currentTime)}</span>
                                <div className="progress-bar-wrapper" >
                                    <ProgressBar percent={percent} percentChange={this.percentChange} />
                                </div>
                                <span className="time time-r" >{this.format(currentSong.duration)}</span>
                            </div>

                            <div className="operators">
                                <div className="icon i-left">
                                    <i className="icon-sequence"></i>
                                </div>
                                <div className={`icon i-left ${songReady ? '' : 'disable'}`}>
                                    <i className={`icon-prev`} onClick={this.handlePrev} ></i>
                                </div>
                                <div className={`icon i-center ${songReady ? '' : 'disable'}`}>
                                    <i className={playing ? 'icon-pause' : 'icon-play'} onClick={this.togglePlaying} ></i>
                                </div>
                                <div className={`icon i-right  ${songReady ? '' : 'disable'}`}>
                                    <i className="icon-next" onClick={this.handleNext} ></i>
                                </div>
                                <div className="icon i-right">
                                    <i className="icon icon-not-favorite"></i>
                                </div>

                            </div>
                        </div>
                    </div>
                </CSSTransition>
                <CSSTransition
                    in={miniShow}
                    classNames="mini"
                    timeout={{ enter: 400, exit: 400 }}
                    key="mini"
                    unmountOnExit
                // unmountOnExit
                >
                    <div className="mini-player" onClick={this.open} >
                        <div className="icon">
                            <img className={playing ? 'play' : 'play pause'} src={currentSong.image} width="40" height="40" />
                        </div>
                        <div className="text">
                            <h2 className="name"  > {currentSong.name}</h2>
                            <p className="desc"   > {currentSong.singer}</p>
                        </div>
                        <div className="control">
                            <ProgressCircle radius={32} percent={percent} >
                                <i
                                    onClick={(e) => { this.miniTogglePlaying(e) }}
                                    className={`icon-mini ${playing ? 'icon-pause-mini' : 'icon-play-mini'}`} ></i>

                            </ProgressCircle>


                        </div>
                        <div className="control">
                            <i className="icon-playlist"></i>

                        </div>

                    </div>
                </CSSTransition>
                <audio
                    ref={audio => { this.audio = audio }}
                    src={currentSong.url}
                    onError={this.audioError}
                    onCanPlay={this.audioReady}
                    onTimeUpdate={this.onTimeUpdate}
                ></audio>
            </div>


        )
    }

    componentDidMount() {
        this.audio.volume = 0.5
        // this.songReady = false

    }

    componentDidUpdate(prevProps, prevState) {
        let props = this.props
        this._watchPlayingChange(props.playing, prevProps.playing)
        this._watchCurrentSong(props.currentSong, prevProps.currentSong)



    }



    @autobind
    onTimeUpdate(e) {
        // console.log(e.target)
        this.setState({
            currentTime: e.target.currentTime,
            percent: e.target.currentTime / this.props.currentSong.duration
        })

    }

    @autobind
    percentChange(newPercent) {
        console.log(newPercent)
        this.audio.currentTime = this.props.currentSong.duration * newPercent
        if (!this.props.playing) {
            this.togglePlaying()
        }

    }

    @autobind
    format(interval) {
        interval = Math.floor(interval)
        const minte = Math.floor(interval / 60)
        const second = this._pad(interval % 60)
        return `${minte}:${second}`
    }

    @autobind
    _pad(num, n = 2) {
        let len = num.toString().length
        while (len < n) {
            num = '0' + num
            len++
        }

        return num
    }

    @autobind
    audioError() {
        // alert('error')
        this.setState({
            songReady: true
        })
        // this.songReady = true

    }

    @autobind
    audioReady() {
        this.setState({
            songReady: true
        })

    }


    @autobind
    handlePrev() {
        if (!this.state.songReady) {
            return
        }
        let index = this.props.currentIndex - 1
        if (index === -1) {
            index = this.props.playList.length - 1
        }

        this.props.setCurrentIndex(index)

        this.setState({
            songReady: true
        })

    }

    @autobind
    handleNext() {
        console.log('n1')
        if (!this.state.songReady) {
            return
        }
        console.log('n2')
        let index = this.props.currentIndex + 1
        if (index === this.props.playList.length) {
            index = 0
        }

        this.props.setCurrentIndex(index)
        if (!this.props.playing) {
            this.togglePlaying()
        }
        this.setState({
            songReady: false
        })
    }
    @autobind
    miniTogglePlaying(e) {
        // console.log(e)
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation();
        this.togglePlaying()
    }

    @autobind
    togglePlaying() {
        this.props.setPlaying(!this.props.playing)
    }

    @autobind
    back() {
        this.props.setFullScreen(false)
    }
    @autobind
    open() {
        this.props.setFullScreen(true)
    }

    @autobind
    onEnter(el) {
        const { x, y, scale } = this._getPosAndScale()
        // console.log(this.cdWrapper)
        let animation = {
            0: {
                transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
            },
            60: {
                transform: `translate3d(0,0,0) scale(1.1)`
            },
            100: {
                transform: `translate3d(0,0,0) scale(1)`
            }
        }

        animations.registerAnimation({
            name: 'move',
            animation,
            presets: {
                duration: 400,
                easing: 'linear'
            }
        })

        animations.runAnimation(this.cdWrapper, 'move')
    }

    @autobind
    onEntered(el) {
        animations.unregisterAnimation('move')
        // console.log(this.$refs.cdWrapper)
        this.cdWrapper.style.animation = ''
    }

    @autobind
    onExit(el) {
        const { x, y, scale } = this._getPosAndScale()
        this.cdWrapper.style.transition = 'all 0.4s'
        this.cdWrapper.style[
            transform
        ] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        // this.cdWrapper.addEventListener('transitionend',)
    }

    @autobind
    onExited(el) {
        this.cdWrapper.style.transition = ''
        this.cdWrapper.style[transform] = ''
    }

    // @autobind
    // _watchCurrentIndex(newCurrentIndex, oldCurrentIndex) {
    //     if(oldCurrentIndex === newCurrentIndex){
    //         return
    //     }
    //     console.log(oldCurrentIndex, newCurrentIndex)
    //     this.audio.play()
    // }

    @autobind
    _watchCurrentSong(newSong, oldSong) {
        if (newSong.id === oldSong.id) {
            return
        }
        console.log('_watchCurrentSong')

        this.audio.play()

    }

    @autobind
    _watchPlayingChange(currentPlaying, oldPlaying) {
        if (oldPlaying !== currentPlaying) {
            currentPlaying ? this.audio.play() : this.audio.pause()
        }
    }

    /**
     * 计算动画的一些数据
     * 
     * @memberof Player
     */
    @autobind
    _getPosAndScale() {
        const targetWidth = 40
        const paddingLeft = 40
        const paddingBottom = 30
        const cdPaddingTop = 80
        const cdWidth = window.innerWidth * 0.8
        const scale = targetWidth / cdWidth
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = window.innerHeight - cdPaddingTop - cdWidth / 2 - paddingBottom
        return {
            x, y, scale
        }
    }



}

export default Player
