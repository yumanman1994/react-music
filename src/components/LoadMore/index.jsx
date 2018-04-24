/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-24 21:24:46 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-25 00:24:03
 * @desc 加载更多组件
 */


import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Loading from 'components/Loading'
import { moreState } from 'common/js/config'

import './style.less'

class LoadMore extends PureComponent {
    static defaultProps = {
        loadingTitle: '加载中...',
        noMoreTitle: '暂无更多',
        hasMoreTitle: '下拉加载更多',
        state: moreState.hasMore,
    }

    static propTypes = {
        loadingTitle: PropTypes.string.isRequired,
        noMoreTitle: PropTypes.string.isRequired,
        hasMoreTitle: PropTypes.string.isRequired,
        state: PropTypes.number.isRequired
    }
    render() {
        return (
            <div className="load-more">
                {
                    this.renderState()
                }
            </div>
        )
    }



    renderState() {
        let { state, noMoreTitle, loadingTitle, hasMoreTitle } = this.props

        if (state === moreState.loading) {
            return (
                <Loading title={loadingTitle} ></Loading>
            )
        }

        if (state === moreState.noMore) {
            return (
                <p className="text" >
                    {noMoreTitle}
                </p>
            )
        }
        if (state === moreState.hasMore) {
            return (
            <p className="text"  >
                {hasMoreTitle}
            </p>)
        }



    }
}

export default LoadMore



