/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-11 22:14:47 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-11 22:27:40
 * @desc 序列化一个歌曲的详情 得到我们想要的数据类型
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

// 处理一首歌是两个歌手的边界值操作
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
