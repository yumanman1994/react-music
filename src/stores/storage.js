/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-25 22:15:07 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-07-01 18:41:56
 * @desc storage 相关
 */


import { observable, action, computed } from 'mobx'
import {
    saveSearch,
    loadSearch,
    clearSearch,
    deleteSearch,
    loadPlay,
    savePlay,
    loadFavoriteList,
    saveFavorite,
    deleteFavotite
} from 'common/js/cache'

class Storage {
    @observable searchHistory = loadSearch()
    @observable playHistory = loadPlay()
    @observable favoriteList = loadFavoriteList()

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

    @action.bound
    saveFavorite(song){
        this.favoriteList = saveFavorite(song)
    }

    @action.bound
    deleteFavotite(song){
        this.favoriteList = deleteFavotite(song)
    }

    
    

}


const storage = new Storage()

export default storage



