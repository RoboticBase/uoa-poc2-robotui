import axios from 'axios'
import urljoin from 'url-join'

function buildBaseUrl(endpoint, prefix, robotId) {
  return urljoin(endpoint, prefix, '/api/v1/robots/', robotId, '/')
}

export async function getRobotState (endpoint, prefix, token, robotId) {
  let url = buildBaseUrl(endpoint, prefix, robotId)

  try {
    let response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Authorization": "bearer " + token,
      }
    })
    return Object.assign({}, response, {result: 'success'})
  } catch (error) {
    // eslint-disable-next-line
    console.log('error:' + error)
    return Object.assign({}, error.response, {result: 'failure'})
  }
}

export async function patchMoveNext (endpoint, prefix, token, robotId) {
  let url = urljoin(buildBaseUrl(endpoint, prefix, robotId), '/nexts/')

  try {
    const res = await axios.patch(url, {}, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Authorization": "bearer " + token,
      }
    })
    return {
      result: 'success',
      message: '',
      response: res,
    }
  } catch (error) {
    if (error.response.status == 412) {
      return {
        result: 'warning',
        message: '次のルートは設定されていません',
        response: error.response
      }
    } else if (error.response.status == 423) {
      return {
        result: 'warning',
        message: 'ロボットが移動中です',
        response: error.response
      }
    } else {
      // eslint-disable-next-line
      console.log('error:' + error)
      return {
        result: 'failure',
        message: error,
        response: error.response
      }
    }
  }
}
