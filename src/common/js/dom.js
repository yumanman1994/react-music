export function addClass(el, className) {
  console.log(hasClass(el, className))
  if (hasClass(el, className)) {
    return false
  } else {
    console.log(el.className.split(' '))
    let newClass = el.className.split(' ')
    newClass.push(className)
    // console.log(newClass)
    el.className = newClass.join(' ')
  }
}

export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function getData(el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}

// 利用浏览器能力监测能力解决css前缀问题
let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (const key in transformNames) {
    if (transformNames.hasOwnProperty(key)) {
      const val = transformNames[key]
      if (elementStyle[val] !== undefined) {
        return key
      }
    }
  }

  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
