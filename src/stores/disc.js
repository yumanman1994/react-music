/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-23 00:09:02 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-23 00:16:32
 * @Desc 
 */
import { observable ,action} from 'mobx'

class Disc {
    @observable disc = {}

    @action.bound
    setDisc(disc){
        this.disc = disc
    }

}

const disc = new Disc()

export default disc
