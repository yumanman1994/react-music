/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-21 20:29:58 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-21 21:16:12
 * @Desc 获取歌曲的歌词
 */


import { commonParams } from 'api/config'
import axios from 'axios'

/**
 * 
 * @param {*} mid 
 */
export function getLyric(mid) {
    let url = '/api/getLyric'
    const data = Object.assign({}, commonParams, {
        songmid: mid,
        pcachetime: +new Date(),
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0,
        g_tk: 1928093487,
        format: 'json'
    })

    return axios.get(url, {
        params: data
    }).then(res => Promise.resolve(res.data))

}
