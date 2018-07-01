/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-07-01 17:58:55 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-07-01 23:00:19
 */


import React, { Component } from 'react'
import Swiches from 'components/Swiches'
import NoResult from 'components/NoResult'
import Scroll from 'components/Scroll'
import SongList from 'components/SongList'
import { inject, observer } from 'mobx-react'
import { autobind } from 'core-decorators'
import './style.less'
import { disInserSong } from 'common/js/util'
import Song from 'common/js/song'


@inject(stores => ({
    favoriteList: stores.storage.favoriteList,
    playHistory: stores.storage.playHistory,
    playList: stores.player.playList,
    sequenceList: stores.player.sequenceList,
    currentIndex: stores.player.currentIndex,
    inserSong: stores.player.inserSong,
    playList: stores.player.playList,
    randomPlay: stores.player.randomPlay

}))
@observer
class UserCenter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            switches: [{ name: '我喜欢的' }, { name: '最近播放' }],
            currentIndex: 0,
        }
    }

    render() {
        let { switches, currentIndex } = this.state
        // let { favoriteList,playHistory } = this.props
        let favoriteList = this.props.favoriteList.slice()
        let playHistory = this.props.playHistory.slice()


        return (
            <div className="user-center" >
                <div className="back" onClick={this.handleBackClick} >
                    <i className="icon-back"></i>
                </div>
                <div className="switches-wrapper" >
                    <Swiches currentIndex={currentIndex} setSwitchesIndex={this.setSwitchesIndex} switches={switches} />
                </div>
                <div className="play-btn" onClick={this.random} >
                    <i className="icon-play"></i>
                    <span className="text" >随机播放全部</span>
                </div>
                <div className="list-wrapper" style={{bottom:this.props.playList.length>0 ? '60px' :0}}  >
                    {
                        currentIndex === 0 ? <Scroll ref={favoriteList => { this.favoriteList = favoriteList }} className="list-scroll" >
                            <div className="list-inner" >
                                <SongList selectItem={this.selectSong} songs={favoriteList} />
                            </div>
                        </Scroll> : null

                    }

                    {
                        currentIndex === 1 ? <Scroll className="list-scroll" ref={(playHistory) => { this.playHistory = playHistory }} >
                            <div className="list-inner" >
                                <SongList selectItem={this.selectSong} songs={playHistory} />
                            </div>

                        </Scroll> : null
                    }
                </div>
                {
                    ((currentIndex === 0 && !favoriteList.length) || (currentIndex === 1 && !playHistory.length)) ? <div className="no-result-wrapper" >
                        <NoResult title={`${(currentIndex === 0 && !favoriteList.length) ? '暂无收藏歌曲' : ''}${(currentIndex === 1 && !playHistory.length) ? '你还没有听过歌曲' : ''}`} ></NoResult>
                    </div> : null
                }

            </div>

        )
    }


    @autobind
    random(){
        let list = this.state.currentIndex === 0 ? this.props.favoriteList.slice() : this.props.playHistory.slice()
        if(list.length === 0) {
            return
        }

        list = list.map(song => {
            return new Song(song)
        })

        this.props.randomPlay({list})

        

    }



    @autobind
    setSwitchesIndex(currentIndex) {
        this.setState({
            currentIndex
        })
    }




    @autobind
    handleBackClick() {
        this.props.history.goBack()
    }

    @autobind
    selectSong(item, index) {
        //  考虑历史记录第一首歌是否播放的情况
        // let swithesCurrentIndex = this.state.currentIndex
        // if(swithesCurrentIndex === 1 && index ===0){
        //     // return
        // }

        let { playList, sequenceList, currentIndex } = this.props
        let song = new Song(item)
        this.props.inserSong(disInserSong(playList, sequenceList, currentIndex, song))

    }
}

export default UserCenter


