/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-20 16:02:01 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-24 22:44:27
 * @Desc 工具函数
 */

/**
 * 返回作用域内的一个数字
 * @param {Number} min
 * @param {Number} max
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}


/**
 * @description 洗牌函数 打乱一个数组
 * @param {*Array} arr 
 */
export function shuffle(arr){
    let _arr = arr.slice()
    for (let i = 0; i < _arr.length; i++) {
        let j = getRandomInt(0,i);
        [_arr[i],_arr[j]] =  [_arr[j],_arr[i]]
    }

    return _arr
}


/**
 * @description 事件流
 * @param {*} func 
 * @param {*} delay 
 */
export function debounce(func, delay) {
    let timer
    return function (...args) {
      if (timer) {
        clearTimeout(timer)
      }
  
      timer = setTimeout(() => {
        func.apply(this, args)
      }, delay);
  
    }
  }
  