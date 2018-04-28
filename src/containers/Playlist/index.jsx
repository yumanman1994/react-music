/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-27 22:01:45 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-28 20:16:08
 */



import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Scroll from 'components/Scroll'
import { playMode } from 'common/js/config'
import { autobind } from 'core-decorators'
import { CSSTransition } from 'react-transition-group'
import { NavLink } from 'react-router-dom'
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
        let { showFlag, playlistHide, sequenceList, currentSong } = this.props
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
                                <i className="icon"  ></i>
                                <span className="text"></span>
                                <span className="clear" onClick={this.confirmShow()} >
                                    <i className="icon-clear" ></i>
                                </span>
                            </h1>
                        </div>

                        <Scroll className="list-content" refreshData={sequenceList} >
                            <ul>
                                {
                                    sequenceList.map((item, index) =>
                                        <li className="item" key={item.id} onClick={() => { this.selectItem(item, index) }} >
                                            <i className={`current ${item.id === currentSong.id ? 'icon-play' : ''}`}  ></i>
                                            <span className="text">{item.name}</span>
                                            <span className="like">
                                                <i className="icon-not-favorite"></i>
                                            </span>
                                            <span className="delete" onClick={(e) => { this.deleteSong(e, item) }} >
                                                <i className="icon-delete"></i>
                                            </span>
                                        </li>)
                                }

                            </ul>
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
                    <Confirm ref={confirm => {this.confirm = confirm}} confirm ={this.deleteSongList} text="是否清空播放列表" />

                </div>
            </CSSTransition>


            // </div>

        )
    }

    // componentDidUpdate(prevProps,prevState){
    //     console.log('cpmponentsDidUpdata')
    // }



    @autobind
    confirmShow(){
        // this.confirm.show()
        console.log(this.confirm)
    }

    @autobind
    deleteSongList(){
        this.props.deleteSongList()
    }

    @autobind
    playlistHide(e) {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
        this.props.playlistHide(e)

    }

    @autobind
    deleteSong(e, song) {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
        this.props.deleteSong(song)
    }

    @autobind
    handleStopPt(e) {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
    }

    @autobind
    selectItem(item, index) {

        // console.log(item,index)
        // return 
        let playList = this.props.playList.slice()
        let { mode } = this.props
        if (mode === playMode.random) {
            index = playList.findIndex(song => {
                return song.id = item.id
            })
        }

        // console.log(playList)

        this.props.setCurrentIndex(index)
        this.props.setPlaying(true)


    }

}




export default Playlist
