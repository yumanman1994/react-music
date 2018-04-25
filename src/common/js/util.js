/*
 * @Author: 余小蛮-1029686739@qq.com 
 * @Date: 2018-04-20 16:02:01 
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-25 12:03:59
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
export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i);
    [_arr[i], _arr[j]] = [_arr[j], _arr[i]]
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


export function disInserSong(playList, sequenceList, currentIndex,song) {
  playList = playList.slice();
  sequenceList = sequenceList.slice();
  currentIndex = currentIndex;

  let currentSong = playList[currentIndex]

  // 查询播放列表中是够有你要插入的歌曲
  let fpIndex = findIndex(playList, song)

  // 在当前播放的索引后加载歌曲
  currentIndex++
  playList.splice(currentIndex, 0, song)

  // 如果播放列表中本来就有这个歌曲 删除之前存在的歌曲
  if (fpIndex > -1) {
    // 如果这哥 存在 并且在 当前播放索引之前 
    if (currentIndex > fpIndex) {
      playList.splice(fpIndex, 1)
    } else {
      playList.splice(fpIndex + 1, 1)
    }
  }


  let currentSIndex = findIndex(sequenceList, currentSong) + 1

  let sfIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSIndex, 0, song)

  //如果已经包含这首歌
  if (sfIndex > -1) {
    if (currentSIndex > sfIndex) {
      sequenceList.splice(sfIndex, 1)
    } else {
      sequenceList.splice(sfIndex + 1, 1)
    }
  }

  return {playList, sequenceList, currentIndex}

}

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
