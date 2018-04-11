/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-04 00:38:53 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-11 23:47:33
 * @desc 一个歌手数据的对象
 */

export default class Singer {
    constructor({ id, name }) {
      this.id = id
      this.name = name
      this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
    }
  }
  