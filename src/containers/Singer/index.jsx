/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-04 01:01:50 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-12 02:23:26
 * @desc 歌手页面
 */
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { observer,inject } from 'mobx-react'
import { autobind } from 'core-decorators'
import { getSingerList } from 'api/singer'
import SingerDataObj from 'common/js/singer'
import ListView from 'components/ListView'
import SingerDetail from 'containers/SingerDetail'
import { ERR_OK } from 'api/config'

import './style.less'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

@inject(stores => ({
  setSinger:stores.singer.setSinger
}))
@observer
class Singer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      singers: []
    }
  }
  render() {
    return (
      <div className="singer">
        <ListView
          handleClick={this.handleClick}
          listData={this.state.singers}
        />
        <Route path="/singer/:id" component={SingerDetail} />
      </div>
    )
  }
  componentDidMount() {
    this._getSingerList()
  }

  /**
   * @description 获取歌手列表数据
   * @memberof Singer
   */
  @autobind
  _getSingerList() {
    getSingerList().then(res => {
      if (res.code === ERR_OK) {
        this.setState({
          singers: this._normalizeSingerList(res.data.list)
        })
      }
    })
  }

  @autobind
  handleClick(singer) {
    // console.log(singer.id)
    this.props.setSinger(singer)
    // console.log(this.props.orderLine.total)
    // console.log(this.props.total)
    this.props.history.push(`/singer/${singer.id}`)
  }

  /**
   * @description 处理获取到的歌手列表的数据 得到需要的结构
   * @param {array} list
   * @memberof Singer
   */
  @autobind
  _normalizeSingerList(list) {
    let map = {
      hot: {
        title: HOT_NAME,
        items: []
      }
    }

    list.forEach((item, index) => {
      if (index < HOT_SINGER_LEN) {
        map.hot.items.push(
          new SingerDataObj({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          })
        )
      }
      const key = item.Findex
      if (!map[key]) {
        map[key] = {
          title: key,
          items: []
        }
      }

      map[key].items.push(
        new SingerDataObj({
          name: item.Fsinger_name,
          id: item.Fsinger_mid
        })
      )
    })

    let ret = []
    let hot = []
    for (const key in map) {
      if (map.hasOwnProperty(key)) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
    }

    ret.sort((a, b) => {
      return a.title.charCodeAt(0) - b.title.charCodeAt(0)
    })

    return hot.concat(ret)
  }
}

export default Singer
