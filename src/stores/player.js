/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-16 19:29:58 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-25 13:28:38
 * @Desc 播放
 */


import { observable, action, computed } from 'mobx'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

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
    @computed get currentSong() {
        return this.playList[this.currentIndex] || {}
    }

    // 设置播放
    @action.bound
    setPlaying(flag) {
        this.playing = flag
    }

    // 设置是够全屏
    @action.bound
    setFullScreen(flag) {
        this.fullScreen = flag
    }

    // 设置当前播放歌曲列表
    @action.bound
    setPlayList(list) {
        this.playList = list
    }

    @action.bound
    setSequenceList(list) {
        this.sequenceList = list
    }

    // 设置播放的模式
    @action.bound
    setPlayMode(flag) {
        this.mode = flag
    }

    // 设置当前的播放的索引
    @action.bound
    setCurrentIndex(index) {
        this.currentIndex = index
    }

    @action.bound
    selectPlay({ list, index }) {
        // console.log(this.fullScreen)
        // this.fullScreen = true
        // let {list,index} = playLoad
        // 当随机播放的时候 选择一个歌曲播放
        if (this.mode === playMode.random) {
            let ramdomList = shuffle(list)
            this.playList = ramdomList
            index = findIndex(ramdomList, list[index])
        } else {
            this.playList = list
        }

        this.fullScreen = true
        this.playing = true
        this.currentIndex = index
        this.sequenceList = list
        // console.log( this.playList)
    }

    @action.bound
    randomPlay({ list }) {
        this.mode = playMode.random,
            this.sequenceList = list
        let randomList = shuffle(list)
        this.playList = randomList
        this.currentIndex = 0
        this.fullScreen = true
        this.playing = true
    }


    @action.bound
    inserSong({playList, sequenceList, currentIndex}) {
        // console.log(this.playList.slice())
        // return
        // let playList = this.playList.slice();
        // let sequenceList = this.sequenceList.slice();
        // let currentIndex = this.currentIndex;

        // let currentSong = playList[currentIndex]

        // // 查询播放列表中是够有你要插入的歌曲
        // let fpIndex = findIndex(playList, song)

        // // 在当前播放的索引后加载歌曲
        // currentIndex++
        // playList.splice(currentIndex, 0, song)

        // // 如果播放列表中本来就有这个歌曲 删除之前存在的歌曲
        // if (fpIndex > -1) {
        //     // 如果这哥 存在 并且在 当前播放索引之前 
        //     if (currentIndex > fpIndex) {
        //         playList.splice(fpIndex, 1)
        //     } else {
        //         playList.splice(fpIndex + 1, 1)
        //     }
        // }


        // let currentSIndex = findIndex(sequenceList, currentSong) + 1

        // let sfIndex = findIndex(sequenceList, song)

        // sequenceList.splice(currentSIndex, 0, song)

        // //如果已经包含这首歌
        // if (sfIndex > -1) {
        //     if (currentSIndex > sfIndex) {
        //         sequenceList.splice(sfIndex, 1)
        //     } else {
        //         sequenceList.splice(sfIndex + 1, 1)
        //     }
        // }

        this.playList = playList
        this.sequenceList = sequenceList

        this.currentIndex = currentIndex

        this.fullScreen = true
        this.playing = true
    }


}

// function 

function findIndex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id
    })
}


const player = new Player()

export default player