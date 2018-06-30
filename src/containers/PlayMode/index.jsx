import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

import { autobind } from 'core-decorators'
import PropTypes from 'prop-types'


// 播放按钮的风格
const PLAY_MODE_STYLES = {
    highlight: 1,
    darkly: 2
}

@inject(stores => ({
    mode: stores.player.mode,
    sequenceList:stores.player.sequenceList,
    setPlayMode: stores.player.setPlayMode,
    setPlayList: stores.player.setPlayList,
    setCurrentIndex: stores.player.setCurrentIndex,
    currentSong: stores.player.currentSong

}))
@observer
class PlayMode extends Component {
    static defaultProps = {
        style: PLAY_MODE_STYLES.highlight
    }
    static propsTypes = {
        style: PropTypes.number.isRequired
    }
    constructor(props) {
        super(props)


    }

    render() {
        let { style, mode } = this.props
        let modeText = mode === playMode.sequence ? '顺序播放' : mode === playMode.random ? '随机播放' : '单曲循环'
        let iconMode = mode === playMode.sequence ? 'icon-sequence' : mode === playMode.loop ? 'icon-loop' : 'icon-random'
        if (style === PLAY_MODE_STYLES.highlight) {
            return <i className={`icon ${iconMode}`} onClick={this.changeMode}   ></i>
        }

        return [<i className={`icon ${iconMode}`} onClick={this.changeMode} key="icon"  ></i>,
        <span className="text" key="text">{modeText}</span>]


        // [<i className={`icon`}  ></i>,
        // <span className="text">ddd</span>]

    }


    /**
     * @description 切换歌曲播放的模式
     */
    @autobind
    changeMode() {
        let mode = (this.props.mode + 1) % 3

        this.props.setPlayMode(mode)
        let list = null
        if(mode === playMode.random){
            list = shuffle(this.props.sequenceList)
        }else{
            list = this.props.sequenceList.slice()
        }

        this._resetCurrentIndex(list)
        this.props.setPlayList(list)


    }

    @autobind
    _resetCurrentIndex(list) {
        let index = list.findIndex(item => {
            return item.id === this.props.currentSong.id
        })

        this.props.setCurrentIndex(index)

    }
}

export default PlayMode