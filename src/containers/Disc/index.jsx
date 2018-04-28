import React, { Component } from 'react'

import MusicList from 'containers/MusicList'
import { autobind } from 'core-decorators'
import { observer, inject } from 'mobx-react'
import { getSongList } from 'api/recommend'
import { processSongsUrl } from 'api/handlesongurl'
import { createSong } from 'common/js/song'
import { ERR_OK } from 'api/config'

import './style.less'

@inject(stores => ({
    disc: stores.disc.disc
}))
@observer
class Disc extends Component {
    constructor(props) {
        super(props)

        this.state = {
            songs: []
        }
    }
    render() {
        return <div >
            <MusicList
                songs={this.state.songs}
                title={this.props.disc.dissname}
                bgImage={this.props.disc.imgurl}
            />
        </div>
    }

    componentDidMount() {
        if (!this.props.disc.dissid) {
            this.props.history.push('/recommend')
        }
        this._getSingerDetail()

    }

    /**
     * @description 获取歌手详情数据
     * @memberof SingerDetail
     */
    @autobind
    _getSingerDetail() {
      

        let disc = this.props.disc

        getSongList(disc.dissid).then(res => {
            if (res.code === ERR_OK) {
                processSongsUrl(this._notmalizeSongs(res.cdlist[0].songlist)).then(songs => {
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
        list.forEach(musicData => {
            // let { musicData } = item
            if (musicData.songid && musicData.albummid) {
                ret.push(createSong(musicData))
            }
        })

        return ret
    }
}

export default Disc
