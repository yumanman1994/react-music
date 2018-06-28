/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-27 22:01:45 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-06-28 20:58:13
 */



import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Scroll from 'components/Scroll'
import { playMode } from 'common/js/config'
import { autobind } from 'core-decorators'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import PlayMode from 'containers/PlayMode'
import Confirm from 'components/Confirm'

import './style.less'

@inject(stores => ({
    sequenceList: stores.player.sequenceList,
    playList: stores.player.playList,
    currentSong: stores.player.currentSong,
    deleteSong: stores.player.deleteSong,
    deleteSongList: stores.player.deleteSongList,
    mode: stores.player.mode,
    setCurrentIndex: stores.player.setCurrentIndex,
    setPlaying: stores.player.setPlaying


}))
@observer
class Playlist extends Component {
    static defaultProps = {
        showFlag: false,
        playlistHide: () => {

        }

    }

    static propsTypes = {
        showFlag: PropTypes.bool.isRequired,
        playlistHide: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props)

    }
    render() {
        let { showFlag, playlistHide, sequenceList, currentSong, mode } = this.props

        return (
            // <div className="playlist-wrap" >
            <CSSTransition
                in={showFlag}
                key="listfade"
                classNames="listfade"
                timeout={{ enter: 300, exit: 300 }}
                unmountOnExit
            >
                <div className="playlist" onClick={this.playlistHide} >
                    <div className="list-wrapper" onClick={this.handleStopPt} >
                        <div className="list-header">
                            <h1 className="title"  >
                                <PlayMode style={2}
                                />
                                    <span className="clear" onClick={this.confirmShow} >
                                    <i className="icon-clear" ></i>
                                </span>

                            </h1>
                        </div>

                        <Scroll ref={listContent => { this.listContent = listContent }} className="list-content" refreshData={sequenceList} >
                            <TransitionGroup component="ul" >
                                {
                                    sequenceList.map((item, index) =>
                                        <CSSTransition
                                            key={item.id}
                                            timeout={300}
                                            classNames="item-fade"
                                        >
                                            <li className="item"
                                                key={item.id}
                                                onClick={() => { this.selectItem(item, index) }}
                                            >
                                                <i className={`current ${item.id === currentSong.id ? 'icon-play' : ''}`}  ></i>
                                                <span className="text">{item.name}</span>
                                                <span className="like">
                                                    <i className="icon-not-favorite"></i>
                                                </span>
                                                <span className="delete" onClick={(e) => { this.deleteSong(e, item) }} >
                                                    <i className="icon-delete"></i>
                                                </span>
                                            </li>
                                        </CSSTransition>
                                    )
                                }

                            </TransitionGroup>
                        </Scroll>
                        <div className="list-operate">
                            <div className="add">
                                <i className="icon-add"></i>
                                <span className="text">添加歌曲到队列</span>
                            </div>
                        </div>
                        <div className="list-close" onClick={this.playlistHide} >
                            <span>关闭</span>
                        </div>


                    </div>
                    <Confirm ref={confirm => { this.confirm = confirm }} confirm={this.deleteSongList} text="是否清空播放列表" />

                </div>
            </CSSTransition>


            // </div>

        )
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {
        // console.log('cpmponentsDidUpdata')
        if (this.props.playList.length <= 0) {
            this.props.playlistHide()
        }
        this._watchCurrentSong(this.props, prevProps)
        this._watchShowFlag(this.props, prevProps)
    }


    /**
     * @description 唤起删除全部歌曲确认框
     *
     * @memberof Playlist
     */
    @autobind
    confirmShow() {
        this.confirm.show()
    }


    /**
     * @description 删除播放列表的全部歌曲
     *
     * @memberof Playlist
     */
    @autobind
    deleteSongList() {
        this.props.deleteSongList()
        this.props.playlistHide()
    }


    /**
     * @description 关闭删除列表
     *
     * @param {*} e
     * @memberof Playlist
     */
    @autobind
    playlistHide(e) {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
        this.props.playlistHide(e)

    }

    /**
     * @description 删除播放列表的一首歌曲
     * @param {*} e 
     * @param {*} song 
     */
    @autobind
    deleteSong(e, song) {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
        this.props.deleteSong(song)
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


    @autobind
    selectItem(item, index) {
        let playList = this.props.playList.slice()
        let { mode } = this.props

        // console.log(mode,index,item);


        if (mode === playMode.random) {
            // console.log('random');
            console.log(playList);


            index = playList.findIndex(song => {
                return song.id === item.id
            })
        }

        // console.log(index);

        this.props.setCurrentIndex(index)
        this.props.setPlaying(true)


    }

    /**
     * 播放列表的歌曲发生变化的时候 滚动播放列表到高亮的位置
     * @param {*} current 
     */
    @autobind
    scrollToCurrent(current) {

        const index = this.props.sequenceList.findIndex(song => {
            return song.id === current.id
        })

        console.log(this.listContent);

        // this.listContent.scrollToElement(this.songItems[index], 300)
        this.listContent.scrollTo(0, index * -40, 300)
    }


    @autobind
    _watchCurrentSong(newProps, prevProps) {
        // console.log('_watchCurrentSong被触发');

        let newSong = newProps.currentSong
        let oldSong = prevProps.currentSong
        if (!this.props.showFlag || newSong.id === oldSong.id) {
            return
        }

        this.scrollToCurrent(newSong)

    }



    @autobind
    _watchShowFlag(newProps, prevProps) {
        // console.log('_watchShowFlag 被触发');

        let newFlag = newProps.showFlag
        if (newFlag) {
            setTimeout(() => {
                console.log(this.props.currentSong, 'watchShowFlag');

                this.scrollToCurrent(this.props.currentSong)
            }, 200);

        }
    }


}

export default Playlist
