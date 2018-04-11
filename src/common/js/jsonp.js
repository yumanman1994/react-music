import originJSONP from 'jsonp'

export default function jsonp (url, data, options) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    originJSONP(url, options, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    }
    )
  })
}

function param (data) {
  let url = ''
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      let value = data[key] !== undefined ? data[key] : ' '
      url += `&${key}=${encodeURIComponent(value)}`
    }
  }

  return url ? url.substring(1) : ''
}
