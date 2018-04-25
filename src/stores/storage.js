/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-25 22:15:07 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-25 23:27:11
 * @desc storage 相关
 */


import { observable, action, computed } from 'mobx'
import {
    saveSearch,
    loadSearch,
    clearSearch,
    deleteSearch
} from 'common/js/cache'

class Storage {
    @observable searchHistory = loadSearch()

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
    

}


const storage = new Storage()

export default storage



