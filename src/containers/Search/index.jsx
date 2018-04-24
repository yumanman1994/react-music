import React, { Component } from 'react'
import {Route} from 'react-router-dom'
import SingerDetail from 'containers/SingerDetail'

import SearchBox from 'components/SearchBox'
import Suggest from 'containers/Suggest'
import { autobind } from 'core-decorators'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'

import './style.less'

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
    return <div className="search" >
      <div className="search-box-wrapper" >
        <SearchBox query={query}  setStateQuery={this.setStateQuery} />
      </div>
      <div className="shortcut-wrapper" style={{ display: query ? 'none' : '' }} >
        <div className="shortcut" >
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
        </div>
      </div>
      <div className="search-result" style={{ display: query ? '' : 'none' }} >
        <Suggest query={query} />
      </div>
      <Route path="/search/:id" component={SingerDetail} />

    </div>
  }

  componentDidMount() {
    this._getHotKey()
  }


  @autobind
  setStateQuery(query) {
    console.log(query)
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
