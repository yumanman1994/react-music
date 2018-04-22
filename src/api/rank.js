/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-23 00:33:42 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-23 00:35:30
 * @Desc 获取排行榜页面数据
 */


import jsonp from 'common/js/jsonp'
import { commonParams, options } from 'api/config'
/**
 * @description 获取排行榜列报表
 * @export
 * @returns
 */
export function getRankList() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';
  
    const data = Object.assign({}, commonParams, {
      uin: 0,
      needNewCode: 1,
      platform: 'h5'
    });
  
    return jsonp(url, data, options);
  };
  
  /**
   * @description获取排行榜歌曲
   * @export
   * @param {any} topid
   * @returns
   */
  export function getMusicList(topid) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';
    const data = Object.assign({}, commonParams, {
      topid,
      needNewCode: 1,
      uin: 0,
      tpl: 3,
      page: 'detail',
      type: 'top',
      platform: 'h5'
    });
  
    return jsonp(url, data, options);
  };
  