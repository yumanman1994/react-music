/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-16 20:00:46 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-29 10:40:04
 */

import React, { Component } from 'react'
import Playlist from 'containers/Playlist'
import ProgressBar from 'components/ProgressBar'
import ProgressCircle from 'components/ProgressCircle'
import LyricParse from 'lyric-parser'
import { CSSTransition } from 'react-transition-group'
import animations from 'create-keyframe-animation'
import { autobind } from 'core-decorators'
import Scroll from 'components/Scroll'
import Lyric from './subPage/Lyric'
import { observer, inject } from 'mobx-react'
import { prefixStyle } from 'common/js/dom'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

import './style.less'
const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

@inject(stores => ({
    fullScreen: stores.player.fullScreen,
    playList: stores.player.playList,
    currentSong: stores.player.currentSong,
    setFullScreen: stores.player.setFullScreen,
    playing: stores.player.playing,
    setPlaying: stores.player.setPlaying,
    currentIndex: stores.player.currentIndex,
    setCurrentIndex: stores.player.setCurrentIndex,
    mode: stores.player.mode,
    setPlayMode: stores.player.setPlayMode,
    sequenceList: stores.player.sequenceList,
    setPlayList: stores.player.setPlayList
}))
@observer
class Player extends Component {

    constructor(props) {
        super(props)

        this.state = {
            // 判断是够够点击切换
            songReady: false,
            currentTime: 0,
            percent: 0,
            // 当前播放歌词的处理对象
            currentLyric: null,
            currentLyricLineNum: 0,
            playingLyric: '',
            currentShow: 'cd',
            notLyric: false,
            playlistShowFlag:false

        }

        this.touch = {}



    }

    render() {
        let { fullScreen, playList, currentSong, playing, mode } = this.props
        let { notLyric,playlistShowFlag, currentShow, songReady, currentTime, percent, currentLyric, currentLyricLineNum, playingLyric } = this.state
        let normalShow = playList.length > 0 && fullScreen
        let miniShow = playList.length > 0 && !fullScreen

        let playModeCls = (mode === playMode.sequence) ? 'icon-sequence' : (mode === playMode.loop) ? 'icon-loop' : 'icon-random'
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
                        <div
                            className="middle"
                            onTouchStart={this.middleTouchStart}
                            onTouchMove={this.middleTouchMove}
                            onTouchEnd={this.middleTouchEnd}
                        >
                            <div className="middle-l" ref={middleL => { this.middleL = middleL }} >
                                {/* 歌曲图片 */}
                                <div className="cd-wrapper " ref={cdWrapper => { this.cdWrapper = cdWrapper }} >
                                    <div className={`cd ${playing ? 'play' : 'play pause'}`} >
                                        <img src={currentSong.image} className="image" />
                                    </div>
                                </div>
                                {/* 当前歌词 */}
                                <div className="playing-lyric-wrapper" >
                                    <div className="playing-lyric" >
                                        {/* {notLyric ? currentLyric.lrc : playingLyric} */}
                                        {playingLyric}
                                    </div>

                                </div>

                            </div>
                            {/* 歌词播放列表 */}
                            <Lyric
                                ref={lyricListWrap => { this.lyricListWrap = lyricListWrap }}
                                notLyric={notLyric}
                                currentLyricLineNum={currentLyricLineNum}
                                currentLyric={currentLyric} />
                            {/* <Scroll className="middle-r" ref={lyricList => { this.lyricList = lyricList }} >
                                <div className="lyric-wrapper"  >
                                    {
                                        currentLyric ? <div  >
                                            {
                                                currentLyric.lines.map((line, index) =>
                                                    <p ref={lines => { lines && !this.lyricLines[index] && this.lyricLines.push(lines) }} className={`text ${currentLyricLineNum === index ? 'current' : ''}`} key={index} >
                                                        {line.txt}
                                                    </p>
                                                )

                                            }
                                        </div> : null
                                    }

                                </div>
                            </Scroll> */}
                        </div>
                        <div className="bottom">

                            <div className="dot-wrapper">
                                <span className={`dot ${currentShow === 'cd' ? 'active' : ''}`} ></span>
                                <span className={`dot ${currentShow === 'lyric' ? 'active' : ''}`}></span>
                            </div>


                            <div className="progress-wrapper">
                                <span className="time time-l" >{this.format(currentTime)}</span>
                                <div className="progress-bar-wrapper" >
                                    <ProgressBar percent={percent} percentChange={this.percentChange} />
                                </div>
                                <span className="time time-r" >{this.format(currentSong.duration)}</span>
                            </div>

                            <div className="operators">
                                <div className="icon i-left">
                                    <i className={playModeCls} onClick={this.changeMode} ></i>
                                </div>
                                <div className={`icon i-left ${(songReady && currentLyric) ? '' : 'disable'}`}>
                                    <i className={`icon-prev`} onClick={this.handlePrev} ></i>
                                </div>
                                <div className={`icon i-center ${(songReady && currentLyric) ? '' : 'disable'}`}>
                                    <i className={playing ? 'icon-pause' : 'icon-play'} onClick={this.togglePlaying} ></i>
                                </div>
                                <div className={`icon i-right  ${(songReady && currentLyric) ? '' : 'disable'}`}>
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
                        <div className="control" onClick={this.playlistShow} >
                            <i className="icon-playlist"></i>

                        </div>

                    </div>
                </CSSTransition>
                <Playlist showFlag={playlistShowFlag} playlistHide={this.playlistHide} />
                <audio
                    ref={audio => { this.audio = audio }}
                    src={currentSong.url}
                    onError={this.audioError}
                    onCanPlay={this.audioReady}
                    onTimeUpdate={this.onTimeUpdate}
                    onEnded={this.audioEnded}
                    onSeeked={this.onSeeked}
                ></audio>
            </div>


        )
    }



    componentDidMount() {
        // this.audio.volume = 0.5
        // this.songReady = false


    }


    

    componentDidUpdate(prevProps, prevState) {
        let props = this.props
        this._watchPlayingChange(props.playing, prevProps.playing)
        this._watchCurrentSong(props.currentSong, prevProps.currentSong)



    }

    @autobind
    playlistShow(e){
        // console.log(e)
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
        this.setState({
            playlistShowFlag:true
        })
    }

    @autobind
    playlistHide(e){
        if(e){
            e.stopPropagation()
            e.nativeEvent.stopImmediatePropagation()
        }
       
        this.setState({
            playlistShowFlag:false
        })
    
    }


    @autobind
    middleTouchStart(e) {
        e.preventDefault()
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
        this.touch.initiated = true

        // 用来判断是否是一次移动
        this.touch.moved = false




    }
    @autobind
    middleTouchMove(e) {
        e.preventDefault()
        if (!this.touch.initiated) {
            return
        }
        const touch = e.touches[0]
        //  这里要维护 x y轴的滚动偏差 当y轴的滚动偏差大于X轴的滚动偏差的时候不应该滚动
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY

        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            return
        }
        if (!this.touch.moved) {
            this.touch.moved = true
        }

        const left = this.state.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(
            0,
            Math.max(-window.innerWidth, left + deltaX)
        )
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)

        // console.log(this.lyricListWrap.lyricList.wrapper)
        this.lyricListWrap.lyricList.wrapper.style[
            transform
        ] = `translate3d(${offsetWidth}px,0,0)`
        this.lyricListWrap.lyricList.wrapper.style[transitionDuration] = 0
        this.middleL.style.opacity = 1 - this.touch.percent
        this.middleL.style[transitionDuration] = 0
        // this.l




    }
    @autobind
    middleTouchEnd(e) {
        e.preventDefault()
        if (!this.touch.moved) {
            return
        }
        console.log(this.touch.percent)
        this.touch.initiated = false
        let offsetWidth, opacity
        if (this.state.currentShow === 'cd') {
            if (this.touch.percent > 0.1) {
                console.log('ddd')
                offsetWidth = -window.innerWidth
                opacity = 0
                this.setState({
                    currentShow: 'lyric'
                })

            } else {

                offsetWidth = 0
                opacity = 1

            }

        } else {
            if (this.touch.percent < 0.9) {
                offsetWidth = 0
                opacity = 1
                this.setState({
                    currentShow: 'cd'
                })

            } else {
                offsetWidth = -window.innerWidth
                opacity = 0
            }

        }

        this.lyricListWrap.lyricList.wrapper.style[
            transform
        ] = `translate3d(${offsetWidth}px,0,0)`
        this.lyricListWrap.lyricList.wrapper.style[transitionDuration] = '300ms'
        this.middleL.style.opacity = opacity
        this.middleL.style[transitionDuration] = '300ms'
        // this.l



    }

    /**
     * @description 当前播放歌曲播放完毕 事件监听
     */
    @autobind
    audioEnded() {
        // 单曲循环
        if (this.props.mode === playMode.loop) {
            this.loop()
        } else {
            this.handleNext()
        }
    }

    /**
     * @description 单曲播放的时候 歌曲播放完毕 处理操作
     */
    @autobind
    loop() {
        this.audio.currentTime = 0
        this.audio.play()
        if (this.state.currentLyric) {
            this.state.currentLyric.seek()
        }
    }



    /**
     * 切换歌曲播放的模式
     */
    @autobind
    changeMode() {

        let mode = (this.props.mode + 1) % 3
        // console.log(mode)
        this.props.setPlayMode(mode)

        let list = null

        if (mode === playMode.random) {
            list = shuffle(this.props.sequenceList)
            // console.log(this.props.sequenceList)
        } else {
            // console.log(this.props.sequenceList.slice())
            list = this.props.sequenceList.slice()
        }

        this.resetCurrentIndex(list)
        this.props.setPlayList(list)


    }

    /**
     * @description 顺序切换为随机播放的时候 播放列表改变 获得正确的当前播放的索引
     * @param {*Array} list 
     */
    @autobind
    resetCurrentIndex(list) {

        let index = list.findIndex(item => {
            return item.id === this.props.currentSong.id
        })
        // console.log(index)
        this.props.setCurrentIndex(index)

    }

    /**
     * @description audio 播放时候的监听 取得当前播放的时间 和计算播放的比例
     * @param {*} e 
     */
    @autobind
    onTimeUpdate(e) {
        console.log('onTimeUpdate')
        this.setState({
            currentTime: e.target.currentTime,
            percent: e.target.currentTime / this.props.currentSong.duration
        })

    }

    /**
     * @description 滑动 播放进度bar 修改播放事件的回调 触发 播放的进度改变
     * @param {Number 0 -1 } newPercent 
     */
    @autobind
    percentChange(newPercent) {
        console.log(newPercent)
        this.audio.currentTime = this.props.currentSong.duration * newPercent
        if (!this.props.playing) {
            this.togglePlaying()
        }

        if (this.state.currentLyric) {
            console.log(this.props.currentSong.duration * newPercent * 1000)
            this.state.currentLyric.seek(this.props.currentSong.duration * newPercent * 1000)
        }

    }


    @autobind
    onSeeked() {
        if( this.state.currentLyric){
            this.state.currentLyric.seek(this.props.currentSong.duration * this.state.percent * 1000)
        }
        
    }

    /**
     * @description 生成一个时间格式字符串  3:25
     * @param {*秒数} interval 
     */
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

    /**
     * @description audio 错误事件
     */
    @autobind
    audioError() {
        // alert('error')
        this.setState({
            songReady: true
        })
        // this.songReady = true

    }

    /**
     * @description 监听audio ready 事件
     */
    @autobind
    audioReady() {
        this.setState({
            songReady: true
        })

    }

    /**
     * @description 播放上一曲
     */
    @autobind
    handlePrev() {
        if (!this.state.songReady) {
            return
        }
        if (this.props.playList.length === 1) {
            console.log('llp')
            this.loop()
        } else {
            if (this.state.currentLyric) {
                console.log('-------prevstop')
                this.state.currentLyric.stop()
            }
            let index = this.props.currentIndex - 1
            if (index === -1) {
                index = this.props.playList.length - 1
            }

            if (!this.props.playing) {
                this.togglePlaying()
            }

            this.props.setCurrentIndex(index)
            this.setState({
                songReady: false,
                currentLyricLineNum: 0,
                currentLyric: null,
                playingLyric: ''
            })
        }



    }

    /**
     * @description 播放下一曲
     */
    @autobind
    handleNext() {
        console.log('n1')
        if (!this.state.songReady) {
            return
        }
        //如果列表歌曲长度为1 执行loop
        if (this.props.playList.length === 1) {
            this.loop()
            console.log('loop')
        } else {
            if (this.state.currentLyric) {
                console.log('-------nextstop')
                this.state.currentLyric.stop()
            }
            let index = this.props.currentIndex + 1
            if (index === this.props.playList.length) {
                index = 0
            }

            this.props.setCurrentIndex(index)
            if (!this.props.playing) {
                this.togglePlaying()
            }
            // if (this.state.currentLyric) {
            //     this.state.currentLyric.stop()
            // }

            this.setState({
                songReady: false,
                currentLyricLineNum: 0,
                currentLyric: null,
                playingLyric: ''
            })
        }

    }

    /**
     * @description mini播放器 播放控制
     * @param {*} e 
     */
    @autobind
    miniTogglePlaying(e) {
        // console.log(e)
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation();
        this.togglePlaying()
    }


    /**
     * @description 点击播放控制按钮
     */
    @autobind
    togglePlaying() {
        if (!this.state.songReady) {
            return
        }
        this.props.setPlaying(!this.props.playing)
        if (this.state.currentLyric) {
            this.state.currentLyric.togglePlay()
        }
    }

    /**
     * @description 关闭全屏播放
     */
    @autobind
    back() {
        this.props.setFullScreen(false)
    }

    /**
     * @description 开启全屏播放
     */
    @autobind
    open() {
        this.props.setFullScreen(true)
    }


    /**
     * @description 动画钩子
     * @param {*} el 
     */
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

    @autobind
    getLyric() {
        this.props.currentSong.getLyric()
            .then(lyric => {
                this.setState({
                    currentLyric: new LyricParse(lyric, this.handleLyric),
                    playingLyric: '',
                    notLyric: false

                }, () => {
                    console.log(this.state.currentLyric)

                   
                })
                 // 如果歌曲在播放 播放歌词
                 if (this.props.playing) {
                    this.state.currentLyric.play()
                }
            }).catch(e => {
                this.setState({
                    currentLyric: null,
                    playingLyric: '暂无歌词',
                    currentLyricLineNum: 0,
                    notLyric: true
                })
            })

    }

    /**
     * @description 歌词播放的回调
     * @param {*} param0 
     */
    @autobind
    handleLyric({ lineNum, txt }) {
        this.setState({
            currentLyricLineNum: lineNum,
            playingLyric: txt
        })

    }




    /**
     * @description 监听当前播放歌曲的变化
     * @param {*} newSong 
     * @param {*} oldSong 
     */
    @autobind
    _watchCurrentSong(newSong, oldSong) {

        if(!newSong.id){
            return
        }
        if (newSong.id === oldSong.id) {
            return
        }
        console.log('_watchCurrentSong----------------',this.state.currentLyric)
        if (this.state.currentLyric) {
            console.log('-------stop')
            this.state.currentLyric.stop()
        }


        // 去获取当前播放歌词的数据
        this.getLyric()
        this.audio.play()

    }

    /**
     * @description 监听Playing的变化 作处理
     * @param {*} currentPlaying 
     * @param {*} oldPlaying 
     */
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
