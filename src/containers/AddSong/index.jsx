/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-06-28 23:31:45 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-06-30 18:13:56
 */

import React, { Component } from 'react'
import { CSSTransition } from 'react-transition-group'
import SearchBox from 'components/SearchBox'
import Swiches from 'components/Swiches'
import Suggest from 'containers/Suggest'
import Scroll from 'components/Scroll'
import SearchList from 'components/SearchList'
import TopTip from 'components/TopTip'
import { observer, inject } from 'mobx-react'
import { autobind } from 'core-decorators'
import PropTypes from 'prop-types'
import SongList from 'components/SongList'
import { disInserSong } from 'common/js/util'

import Song from 'common/js/song'


import './style.less'


@inject((stores) => ({
    saveSearchHistory: stores.storage.saveSearchHistory,
    playHistory: stores.storage.playHistory,
    inserSong: stores.player.inserSong,
    playList: stores.player.playList,
    sequenceList: stores.player.sequenceList,
    currentIndex: stores.player.currentIndex,
    searchHistory: stores.storage.searchHistory,
    deleteSearchHistory: stores.storage.deleteSearchHistory,
}))
@observer
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
        let { query, switches, currentIndex } = this.state
        let { showFlag } = this.props
        let playHistory = this.props.playHistory.slice()
        let searchHistory = this.props.searchHistory.slice()


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


                    </div>
                    <div className="search-box-wrapper" >
                        <SearchBox query={query} setStateQuery={this.setStateQuery} />
                    </div>

                    <div className="shortcut" style={{ display: query ? 'none' : '' }} >
                        <Swiches currentIndex={currentIndex} setSwitchesIndex={this.setSwitchesIndex} switches={switches} />
                        <div className="add-song-list-wrapper" >

                            {
                                currentIndex === 0 ? <Scroll className="list-scroll" >
                                    <div className="list-inner" >
                                        <SongList selectItem={this.selectSong} songs={playHistory} />
                                    </div>
                                </Scroll> : null

                            }

                            {
                                currentIndex === 1 ? <Scroll className="list-scroll">
                                    <div className="list-inner" >
                                        <SearchList searches={searchHistory} deleteOne={this.deleteOne} select={this.setStateQuery} />
                                    </div>

                                </Scroll> : null
                            }

                        </div>
                    </div>


                    <div className="search-result" style={{ display: query ? '' : 'none' }} >
                        <Suggest showSinger={false} saveSearch={this.saveSearch} query={query} />

                    </div>
                    <TopTip ref={topTip => {this.topTip = topTip}} >
                        <div className="tip-title">
                            <i className="icon-ok"></i>
                            <span className="text">1首歌曲已经添加到播放列表</span>
                        </div>
                    </TopTip>
                </div>
            </CSSTransition>

        )

    }

    @autobind
    deleteOne(item) {
        this.props.deleteSearchHistory(item)
    }



    @autobind
    selectSong(item, index) {
        if (index !== 0) {
            let { playList, sequenceList, currentIndex } = this.props
            let song = new Song(item)

            console.log(item, 'selectHistotyPlay');


            this.props.inserSong(disInserSong(playList, sequenceList, currentIndex, song))
            this.topTip.show()
        }

    }

    @autobind
    setSwitchesIndex(currentIndex) {
        this.setState({
            currentIndex
        })
    }

    @autobind
    saveSearch() {
        this.props.saveSearchHistory(this.state.query)
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
