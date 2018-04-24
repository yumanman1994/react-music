import React, { Component } from 'react';
import Scroll from 'components/Scroll'
import { Route } from 'react-router-dom'
import TopList from 'containers/TopList'

import Loading from 'components/Loading'
import { autobind } from 'core-decorators'
import { observer, inject } from 'mobx-react'
import { ERR_OK } from 'api/config'

import { getRankList } from 'api/rank'

import './style.less'

@inject(stores => ({
  playList: stores.player.playList,
  setTopList: stores.topList.setTopList
}))
@observer
class Rank extends Component {
  constructor(props) {
    super(props)

    this.state = {
      topList: []
    }
  }
  render() {
    let { topList } = this.state
    return (
      <div className="rank" style={{bottom:this.props.playList.length>0 ? '60px' :0}} >
        <Scroll  className={`toplist `} ref={toplist => {this.toplist}} >
          <ul>
            {
              topList.map((item, i) => <li key={i} className="item" onClick={() => {this.selectItem(item)}} >
                <div className="icon" >
                  <img width="100" height="100" src={item.picUrl} />
                </div>
                <ul className="songlist" >
                  
                   {
                      item.songList.map((song, index) => <li key={index} className="song" >
                      <span>{index + 1}</span>
                      <span>{song.songname} - {song.sngername}</span>
                    </li>)
                   }
                  

                </ul>
              </li>)

            }
          </ul>
          {
            topList.length ? null : <div className="loading-container" >
              <Loading />
            </div>
          }

        </Scroll>
        <Route path="/rank/:id" component={TopList} />
      </div>
    );
  }


  componentDidMount() {
    this._getRankList()
  }

  componentDidUpdate(prevProps,prevState){
    if(prevProps.playList.length !== this.props.playList.length){
      if(this.toplist){
        this.toplist.refresh()
      }
      
    }
  }

  @autobind
  selectItem(item){
    this.props.setTopList(item)
    this.props.history.push(`/rank/${item.id}`)

  }


  @autobind
  _getRankList() {
    getRankList().then(res => {
      if (res.code === ERR_OK) {
        this.setState({
          topList: res.data.topList
        })
      }
    })
  }
}

export default Rank;
