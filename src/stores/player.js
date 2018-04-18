/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-16 19:29:58 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-16 22:26:50
 * @Desc 播放
 */


import { observable, action ,computed} from 'mobx'
import { playMode } from 'common/js/config'

class Player {
    // 是够播放
    @observable playing = false
    // 播放器是否全屏
    @observable fullScreen = false
    // 播放列表
    @observable playList = []

    @observable sequenceList = []
    // 当前播放的索引
    @observable currentIndex = -1
    // 当前播放的模式
    @observable mode = playMode.sequence

    // 当前播放的歌曲
    @computed get currentSong (){
        return this.playList[this.currentIndex] || {}
    }

    // 设置播放
    @action.bound
    setPlaying(flag){
        this.playing = flag
    }

    // 设置是够全屏
    @action.bound
    setFullScreen(flag){
        this.fullScreen = flag
    }

    // 设置当前播放歌曲列表
    @action.bound
    setPlayList(list){
        this.playList = list
    }

    @action.bound
    setSequenceList(list){
        this.sequenceList = list
    }

    // 设置播放的模式
    @action.bound
    setPlayMode(flag){
        this.mode = flag
    }

    // 设置当前的播放的索引
    @action.bound
    setCurrentIndex(index){
        this.currentIndex = index
    }

    @action.bound
    selectPlay(playLoad){
        // console.log(this.fullScreen)
        // this.fullScreen = true
        let {list,index} = playLoad
        this.currentIndex = index
        this.fullScreen = true
        
        this.playing = true
        this.playList = list
        this.sequenceList = list
        // console.log( this.playList)
    }


}

const player = new Player()

export default player