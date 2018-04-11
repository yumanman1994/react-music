/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-11 20:59:03 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-11 21:22:05
 */

import { observable ,action} from 'mobx'

class Singer {
    @observable singer = {}

    @action.bound
    setSinger(singer){
        this.singer = singer
    }

}

const singer = new Singer()

export default singer
