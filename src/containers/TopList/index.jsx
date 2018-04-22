import React, { Component } from 'react'

import MusicList from 'containers/MusicList'
import { autobind } from 'core-decorators'
import { observer, inject } from 'mobx-react'
import { getMusicList } from 'api/rank'
import { processSongsUrl } from 'api/handlesongurl'
import { createSong } from 'common/js/song'
import { ERR_OK } from 'api/config'

import './style.less'

@inject(stores => ({
    topList: stores.topList.topList
}))
@observer
class TopList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            songs: [],
            rank:true
        }
    }
    render() {
        return <div >
            <MusicList
                songs={this.state.songs}
                title={this.props.topList.topTitle}
                bgImage={this.state.songs.length ? this.state.songs[0].image : ''}
                rank={this.state.rank}
            />
        </div>
    }

    componentDidMount() {
        if (!this.props.topList.id) {
            this.props.history.push('/rank')
        }
        this._getSingerDetail()

    }

    /**
     * @description 获取歌手详情数据
     *
     * @memberof SingerDetail
     */
    @autobind
    _getSingerDetail() {


        let topList = this.props.topList

        getMusicList(topList.id).then(res => {
            if (res.code === ERR_OK) {
                processSongsUrl(this._notmalizeSongs(res.songlist)).then(songs => {
                    this.setState(
                        {
                            songs
                        }
                    )
                })
            }
        })
    }

    _notmalizeSongs(list) {
        let ret = []
        list.forEach(item => {
            // let { musicData } = item
            let musicData = item.data
            if (musicData.songid && musicData.albummid) {
                ret.push(createSong(musicData))
            }
        })

        return ret
    }
}

export default TopList
