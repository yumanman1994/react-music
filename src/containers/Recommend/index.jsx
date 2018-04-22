import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { autobind } from 'core-decorators'
import Slider from 'components/Slider'
import Scroll from 'components/Scroll'
import Loading from 'components/Loading'
import LazyLoad, { forceCheck } from 'react-lazyload'
import { observer, inject } from 'mobx-react'
import Disc from 'containers/Disc'
import { getRecommend, getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'

import './style.less'
const defaultImg = require('common/image/default.png')

@inject(stores => ({
  playList: stores.player.playList,
  setDisc:stores.disc.setDisc
}))
@observer
class Recommend extends Component {
  constructor(props) {
    super(props)
    this.state = {
      recommends: [],
      discList: []
    }
  }
  render() {
    let { recommends, discList } = this.state
    return (
      <div 
      className="recommend"
      style={{bottom:this.props.playList.length>0 ? '60px' :0}}
      >
        <Scroll
          probeType={3}
          className="recommend-content"
          listenScroll={true}
          onScroll={() => {
            forceCheck()
          }}
        >
          <div>
            {recommends.length ? (
              <Slider>
                {recommends.map((item, index) => (
                  <a href={item.linkUrl} key={index}>
                    <img src={item.picUrl} alt="" />
                  </a>
                ))}
              </Slider>
            ) : null}
            <div className="recommend-list">
              <h1 className="list-title">热门歌单推荐</h1>
              <ul>
                {discList.map((item, index) => (
                  <li className="item" key={index} onClick={() => {this.selectItem(item)}} >
                    <div className="icon">
                      <LazyLoad
                        height={60}
                        offset={[50, 0]}
                        once={true}
                        key={index}
                        placeholder={
                          <img
                            width="60"
                            height="60"
                            src={defaultImg}
                            alt="default"
                          />
                        }
                      >
                        <img width="60" height="60" src={item.imgurl} alt="" />
                      </LazyLoad>
                    </div>
                    <div className="text">
                      <h2 className="name">{item.creator.name}</h2>
                      <p className="desc">{item.dissname}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {discList.length ? null : (
            <div className="loading-container">
              <Loading />
            </div>
          )}
        </Scroll>
        <Route path="/recommend/:id" component={Disc} />
      </div>
    )
  }

  componentDidMount() {
    // setTimeout(() => {
    this._getRecommend()
    this._getDiscList()
    // }, 10000)
    // window.addEventListener('scroll', () => {
    //   console.log('scroll')
    // })
  }


  @autobind
  selectItem(item){
    this.props.setDisc(item)
    this.props.history.push(`/recommend/${item.dissid}`)

  }

  @autobind
  _getRecommend() {
    getRecommend().then(res => {
      if (res.code === ERR_OK) {
        this.setState({
          recommends: res.data.slider
        })
      }
    })
  }
  @autobind
  _getDiscList() {
    getDiscList().then(res => {
      if (res.code === ERR_OK) {
        this.setState({
          discList: res.data.list
        })
      }
    })
  }
}

export default Recommend
