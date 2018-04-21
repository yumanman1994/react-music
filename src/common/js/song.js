/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-11 22:14:47 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-21 21:08:50
 * @desc 序列化一个歌曲的详情 得到我们想要的数据类型
 */

import { ERR_OK } from 'api/config'
import { getLyric } from 'api/getLyric'
import { Base64 } from 'js-base64'



/**
 * @description 一个歌曲对象 
 * @class Song
 */
class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
    this.name = name
  }


  /**
   * @description 歌曲获取歌词的请求 当我们在播放的时候去 实现它 返回一个Promise 实例 取得歌曲数据再操作
   * 
   * @returns 返回一个Promise实例
   * @memberof Song
   */
  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.id).then(res => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        }else{
          reject('no lyric')
        }
      })
    })

  }


}

export function createSong(musicData) {
  return new Song({
    id: musicData.songmid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${
      musicData.albummid
      }.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
  })
}

/**
 * 处理一首歌是两个歌手的边界值操作
 * 
 * @param {any} singer 
 * @returns 
 */
function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }

  singer.forEach(s => {
    ret.push(s.name)
  })

  return ret.join('/')
}
