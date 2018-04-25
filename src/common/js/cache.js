/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-25 21:54:51 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-25 23:41:22
 * @desc 缓存相关方法逻辑
 */


import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15


/**
 * @description 存储到 storage中
 * @param {*} query 
 */
export function saveSearch(query) {
    let searches = storage.get(SEARCH_KEY, [])
    insertArray(searches, query, (item) => {
        return item === query
    }, SEARCH_MAX_LENGTH)

    storage.set(SEARCH_KEY, searches)

    return searches





}

/**
 * @description 数组中插入一个元素 并把数组中符合条件的数组删除
 * @param {Array} arr 原数组
 * @param {*} val 要插入的数组元素
 * @param {*} compare 要删除的元素比较方法 
 * @param {*} maxLen 长度限制
 * @returns 
 */
function insertArray(arr, val, compare, maxLen) {
    // 数组中查询是否有相同的元素
    const index = arr.findIndex(compare)

    if (index === 0) {
        return
    }


    if (index > 0) {
        arr.splice(index, 1)
    }

    arr.unshift(val)

    // 如果有长度限制 从后面删除数组元素
    if (maxLen && arr.length > maxLen) {
        arr.pop()
    }



}


/**
 * @description 删除数组中条件的数组元素
 * @param {*} arr 
 * @param {*} compare 
 */
function deleteFromArray(arr,compare){
    const index = arr.findIndex(compare)
    if(index > -1){
        arr.splice(index,1)
    } 

}

/**
 * @description 获取storage中搜索的存储
 * @returns 
 */
export function loadSearch(){
    return storage.get(SEARCH_KEY,[])
}


/**
 * @description 删除一个搜索存储 
 * @export
 * @param {any} query 
 * @returns 
 */
export function deleteSearch(query){
    let searches = loadSearch()
    deleteFromArray(searches,(item) => {
        return item = query
    })
    storage.set(SEARCH_KEY, searches)
    return searches
    
}


/**
 * @description 清空搜索存储
 * @export
 * @returns 
 */
export function clearSearch(){
    storage.remove(SEARCH_KEY)
    return []
}


