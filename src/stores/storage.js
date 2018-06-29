/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-25 22:15:07 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-06-29 22:49:20
 * @desc storage 相关
 */


import { observable, action, computed } from 'mobx'
import {
    saveSearch,
    loadSearch,
    clearSearch,
    deleteSearch,
    loadPlay,
    savePlay
} from 'common/js/cache'

class Storage {
    @observable searchHistory = loadSearch()
    @observable playHistory = loadPlay()

    @action.bound
    saveSearchHistory(query){
        this.searchHistory = saveSearch(query)
    }

    @action.bound
    deleteSearchHistory(query){
        this.searchHistory = deleteSearch(query)
    }

    @action.bound
    clearSearchHistory(query){
        this.searchHistory = clearSearch(query)
    }

    @action.bound
    savePlayHistory(song){
        // console.log();
        // alert('savePlayHistory')
        
        this.playHistory = savePlay(song)

    }

    
    

}


const storage = new Storage()

export default storage



