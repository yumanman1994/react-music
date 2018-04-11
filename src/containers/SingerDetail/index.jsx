import React, { Component } from 'react'
import MusicList from 'containers/MusicList'
import { autobind } from 'core-decorators'
import { observer, inject } from 'mobx-react'
import { getSingerDetail } from 'api/singer'
import { createSong } from 'common/js/song'
import { ERR_OK } from 'api/config'

import './style.less'

@inject(stores => ({
  singer: stores.singer.singer
}))
@observer
class SingerDetail extends Component {
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
      title={this.props.singer.name} 
      bgImage={this.props.singer.avatar}
       />
    </div>
  }

  componentDidMount() {
    this._getSingerDetail()
  }

  /**
   * @description 获取歌手详情数据
   *
   * @memberof SingerDetail
   */
  @autobind
  _getSingerDetail() {
    let singer = this.props.singer
    if (!singer.id) {
      this.props.history.push('/singer')
      return
    }

    getSingerDetail(singer.id).then(res => {
      if (res.code === ERR_OK) {
        let songs = this._notmalizeSongs(res.data.list)
        this.setState(
          {
            songs
          }
        )
      }
    })
  }

  _notmalizeSongs(list) {
    let ret = []
    list.forEach(item => {
      let { musicData } = item
      // 两个必须存在值 保证这个歌曲数据的实例能完美显示的
      if (musicData.songid && musicData.albummid) {
        ret.push(createSong(musicData))
      }
    })
   
    return ret
  }
}

export default SingerDetail
