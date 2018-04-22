/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-23 00:56:30 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-23 00:58:07
 */

import { observable ,action} from 'mobx'

class TopList {
    @observable topList = {}

    @action.bound
    setTopList(topList){
        this.topList = topList
    }

}

const topList = new TopList()

export default topList
