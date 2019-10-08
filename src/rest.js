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
