import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import SingerDetail from 'containers/SingerDetail'
import SearchList from 'components/SearchList'
import Confirm from 'components/Confirm'
import SearchBox from 'components/SearchBox'
import Suggest from 'containers/Suggest'
import Scroll from 'components/Scroll'
import { autobind } from 'core-decorators'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'

import './style.less'

@inject(stores => ({
  searchHistory: stores.storage.searchHistory,
  deleteSearchHistory: stores.storage.deleteSearchHistory,
  clearSearchHistory: stores.storage.clearSearchHistory,
  saveSearchHistory: stores.storage.saveSearchHistory,
  playList:stores.player.playList

}))
@observer
class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: '',
      hotKey: [],

    }
  }
  render() {
    let { query, hotKey } = this.state
    let searchHistory = this.props.searchHistory.slice()
    let playList = this.props.playList.slice()
    return <div className="search" >
      <div className="search-box-wrapper" >
        <SearchBox query={query} setStateQuery={this.setStateQuery} />
      </div>
      <div className="shortcut-wrapper" style={{ display: query ? 'none' : '',bottom: playList.length ? '60px' :'' }} >
        <Scroll ref={shortcut => {this.shortcut = shortcut}} refreshData={hotKey.concat(searchHistory)} className="shortcut" >
          <div>
            {/* 热门搜索 */}
            <div className="hot-key" >
              <h1 className="title" >热门搜索</h1>
              <ul>
                {
                  hotKey.map((item, index) => <li className="item" key={index} onClick={() => { this.setStateQuery(item.k) }} >
                    <span  >{item.k}</span>

                  </li>)

                }
              </ul>
            </div>
            {/* 搜索历史 */}
            {
              searchHistory.length ?
                <div className="search-history" >
                  <h1 className="title" >
                    <span className="text" >搜索历史</span>
                    <span className="clear" onClick={this.showConfirm} >
                      <i className="icon-clear" ></i>
                    </span>
                  </h1>
                  <SearchList searches={searchHistory} deleteOne={this.deleteOne} select={this.setStateQuery} />

                </div>
                : null

            }
          </div>


        </Scroll>
      </div>
      <div className="search-result" style={{ display: query ? '' : 'none',bottom: playList.length ? '60px' :'' }} >
        <Suggest  saveSearch={this.saveSearch} query={query}  />
      </div>
      <Confirm confirm={this.clearSearch} ref={confirm => { this.confirm = confirm }} text="是否删除所有搜索历史" />
      <Route path="/search/:id" component={SingerDetail} />

    </div>
  }

  componentDidMount() {
    this._getHotKey()

  }
  componentDidUpdate(prevProps,prevState){
    if(!this.state.query){
      this.shortcut.refresh()
    
    }

    if(prevProps.playList.length !== this.props.playList.length){
      // if(this.toplist){
        // setTimeout
        this.shortcut.refresh()
        // this.suggest.refresh()
      
      // }
      
    }
  }


  @autobind
  showConfirm() {
    this.confirm.show()
  }

  @autobind
  deleteOne(item) {
    this.props.deleteSearchHistory(item)
  }
  @autobind
  saveSearch() {
    this.props.saveSearchHistory(this.state.query)
  }

  @autobind
  clearSearch() {
    this.props.clearSearchHistory()
  }


  @autobind
  setStateQuery(query) {
    this.setState({
      query
    }, () => {

    })
  }

  @autobind
  _getHotKey() {
    getHotKey().then(res => {
      if (res.code == ERR_OK) {
        this.setState({
          hotKey: res.data.hotkey.slice(0, 10)
        })
      }
    })
  }
}

export default Search
