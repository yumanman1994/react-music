import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import Scroll from 'components/Scroll'
import NoResult from 'components/NoResult'
import LoadMore from 'components/LoadMore'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import { moreState } from 'common/js/config'
import {disInserSong} from 'common/js/util'
import Singer from 'common/js/singer'
import { getSearchResult } from 'api/search'
import { processSongsUrl } from 'api/handlesongurl'
import { autobind } from 'core-decorators'

import './style.less'

const TYPE_SINGER = 'singer'
const perpage = 20

@withRouter
@inject(stores => ({
    setSinger: stores.singer.setSinger,
    inserSong: stores.player.inserSong,
    playList: stores.player.playList,
    sequenceList: stores.player.sequenceList,
    currentIndex: stores.player.currentIndex,
}))
@observer
class Suggest extends Component {
    static defaultProps = {
        query: '',
        showSinger: true
    }

    static propTypes = {
        query: PropTypes.string.isRequired,
        // // 是够能搜出歌手
        showSinger: PropTypes.bool.isRequired
    }
    constructor(props) {
        super(props)

        this.state = {
            moreState: moreState.hasMore,
            page: 1,
            result: [],
            pullUpLoad: {
                threshold: 40
            },
            hasMore: true,
            pullUpLoad: {
                threshold: 40
              },

        }

    }
    render() {
        let { query, hotKey, result ,pullUpLoad} = this.state
        return <Scroll pullUpLoad={pullUpLoad} pullUpLoadFunc={this.searchMore} ref={suggest => { this.suggest = suggest }} className="suggest" refreshData={result}  >
            <div className="suggest-list-wrap" >
                <ul className="suggest-list" >
                    {
                        result.map((item, index) => <li onClick={() => {this.selectItem(item)}} className="suggest-item" key={index} >
                            <div className="icon" >
                                <i className={this.getIconCls(item)} ></i>
                            </div>
                            <div className="name">
                                <p className="text"  >
                                    {this.getDisplayName(item)}
                                </p>
                            </div>
                        </li>)
                    }
                </ul>
                {this.renderNoResult()}
                <div className="load-more-wrap" style={{display:result.length ? '' : 'none'}} >
                <LoadMore state={this.state.moreState} />
            </div>

            </div>
        </Scroll>
    }

    componentDidMount() {


    }

    componentDidUpdate(prevProps, prevState) {
        console.log(prevProps)
        let prevQuery = prevProps.query
        let nowQuery = this.props.query
        if ((prevQuery !== nowQuery) && nowQuery) {
            this.firtSearch()
        }
    }

    @autobind
    selectItem(item) {
        
        if (item.type === TYPE_SINGER) {
            const singer = new Singer({
                id: item.singermid,
                name: item.singername
            })
            this.props.setSinger(singer)
            this.props.history.push(`/search/${singer.id}`)

        } else {

            // console.log(item)
            let {playList, sequenceList, currentIndex} = this.props  

            // return
            this.props.inserSong(disInserSong(playList, sequenceList, currentIndex,item))
        }
    }

    @autobind
    renderNoResult() {

        let { hasMore, result, moreState } = this.state
        if (!hasMore && !result.length && (moreState !== moreState.loading)) {
            return (<div className="no-result-wrapper"  >
                <NoResult />
            </div>)
        }



    }
    @autobind
    renderLoadMore() {
        let { result } = this.state
        if (result.length) {
            return (<div className="load-more-wrap" >
                <LoadMore state={this.state.moreState} />
            </div>)

        }

    }

    @autobind
    getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
            return item.singername
        } else {
           
            return `${item.name}-${item.singer}`
        }
    }
    @autobind
    getIconCls(item) {
        if (item.type === TYPE_SINGER) {
            return 'icon-mine'
        } else {
            return 'icon-music'
        }
    }

    @autobind
    searchMore() {
        console.log(this.state.hasMore,this.state.moreState)
        let { hasMore, page } = this.state
        if (!hasMore) {
            this.suggest.finishPullUp()
            return
        } else {
            this.setState({
                page: page + 1,
                moreState: moreState.loading
            }, () => {
                let { query, showSinger } = this.props
                let { page, result } = this.state
                console.log('more')
                getSearchResult(query, page, showSinger, perpage)
                    .then(res => {
                        if (res.code === ERR_OK) {
                            this.checkMore(res.data)
                            // this._getResult(res.data)
                            let moreResult = this._getResult(res.data)
                            this.setState({
                                result: result.concat(moreResult)
                            })

                        }
                    }).finally(() => {
                        this.suggest.finishPullUp()
                       
                    }).catch(() => {
                        this.suggest.finishPullUp()
                        this.setState({
                            page: this.state.page - 1,
                           
                        })
                    })
            })
        }


    }

    @autobind
    firtSearch() {
        this.suggest.scrollTo(0, 0)
        // console.log(this.suggest)
        this.setState({
            hasMore: true,
            page: 1,
            moreState: moreState.hasMore

        }, () => {
            let { query, showSinger } = this.props
            let { page, hasMore } = this.state
            getSearchResult(query, page, showSinger, perpage)
                .then(res => {
                    if (res.code === ERR_OK) {
                        this.checkMore(res.data)
                       
                        let result = this._getResult(res.data)
                        this.setState({
                            result
                        })

                    }
                })
        })




    }


    @autobind
    checkMore(data) {
        const song = data.song
        // console.log()
        if (
            !song.list.length ||
            song.curnum + song.curpage * perpage > song.totalnum
        ) {
            this.setState({
                hasMore: false,
                moreState:moreState.noMore
            })
        }else{
            this.setState({
               
                moreState:moreState.hasMore
            })
        }
    }

    @autobind
    _getResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
            ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
        }

        if (data.song) {
            let list = this._normalizeSongs(data.song.list)
            processSongsUrl(list).then(res => {
                list = res
            })

            ret = ret.concat(list)
        }

        return ret


    }


    @autobind
    _normalizeSongs(list) {
        // console.log(list)
        let ret = []
        list.forEach(musicData => {
            if (musicData.songid && musicData.albumid) {
                // console.log(musicData)
                ret.push(createSong(musicData))
            }
        })
        return ret
    }







}

export default Suggest
