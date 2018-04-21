/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-11 22:47:19 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-22 00:45:43
 */

import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import Scroll from 'components/Scroll'
import Loading from 'components/Loading'
import SongList from 'components/SongList'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { observer, inject } from 'mobx-react'
import { prefixStyle } from 'common/js/dom'

import './style.less'

const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')

@withRouter
@inject(stores => ({
  selectPlay: stores.player.selectPlay,
  randomPlay:stores.player.randomPlay
}))
@observer
class MusicList extends Component {
  static defaultProps = {
    songs: [],
    bgImage: '',
    title: ''
  }
  static propTypes = {
    songs: PropTypes.array.isRequired,
    bgImage: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }
  constructor(props) {
    super(props)
    // this.probeType = 3
    // this.listenScroll = true
  }
  render() {
    let { bgImage, title, songs } = this.props
    console.log(songs)
    console.log(this.props)
    return (
      <div className="music-list">
        <div className="back" onClick={this.back} >
          <i className="icon-back" />
        </div>
        <h1 className="title">{title}</h1>
        <div
          className="bg-image"
          style={{ backgroundImage: `url(${bgImage})` }}
          ref={bgImage => {
            this.bgImage = bgImage
          }}
        >
          {songs.length > 0 ? (
            <div className="play-wrapper"  >
              <div
                className="play"
                onClick={this.randomPlay}
                ref={playBtn => {
                  this.playBtn = playBtn
                }}
              >
                <i className="icon-play" />
                <span className="text">随机播放</span>
              </div>
            </div>
          ) : null}
          <div
            className="filter"
            ref={filter => {
              this.filter = filter
            }}
          >
            {' '}
          </div>
        </div>
        <div
          className="bg-layer"
          ref={layer => {
            this.layer = layer
          }}
        />
        <Scroll
          className="list"
          probeType={3}
          listenScroll={true}
          onScroll={this.handleBScroll}
          ref={list => {
            this.list = list
          }}
        >
          <div className="song-list-wrapper">
            <SongList selectItem={this.selectItem} songs={songs} />
          </div>
          {songs.length ? null : (
            <div className="loading-container">
              <Loading />
            </div>
          )}
        </Scroll>
      </div>
    )
  }

  componentDidMount() {
    this.imageHeight = this.bgImage.clientHeight
    // 向上滚动时 底部遮羞层能向上变化的极限值
    this.minTranlateY = -this.imageHeight + RESERVED_HEIGHT
    this.list.wrapper.style.top = `${this.imageHeight}px`
  }

  componentWillUnmount() {
    this.list.disable()
    this.list.destroy()
  }



  @autobind
  handleBScroll(pos) {
    let newScrollY = pos.y
    let zIndex = 0
    let scale = 1
      let blur = 0
    console.log(newScrollY)
    let translateY = Math.max(this.minTranlateY, newScrollY)
    this.layer.style[transform] = `translate3d(0,${translateY}px,0)`
    const percent = Math.abs(newScrollY / this.imageHeight)
    if (newScrollY > 0) {
      scale = 1 + percent
      zIndex = 10
    } else {
      blur = Math.min(20, percent * 20)
    }

    
    this.filter.style[backdrop] = `blur(${blur}px)`

    if (newScrollY < this.minTranlateY) {
      zIndex = 10
      this.bgImage.style.paddingTop = 0
      this.bgImage.style.height = `${RESERVED_HEIGHT}px`
      this.playBtn.style.display = 'none'
    } else {
      this.bgImage.style.paddingTop = '70%'
      this.bgImage.style.height = 0
      this.playBtn.style.display = ''
    }

    this.bgImage.style.zIndex = zIndex
    this.bgImage.style[transform] = `scale(${scale})`
  }

  @autobind
  selectItem(song,index){
    this.props.selectPlay({list:this.props.songs,index})
    // console.log(this.props)
    // console.log(index)
  }

  @autobind
  randomPlay(){
    this.props.randomPlay({list:this.props.songs})
  }

  @autobind
  back(){
      this.props.history.goBack()
  }
}

export default MusicList
