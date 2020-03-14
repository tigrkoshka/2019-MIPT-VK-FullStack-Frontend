import { baseServer } from '../settings'

export function checkAuth(userId) {
  return fetch(`${baseServer}/users/check_auth/?id=${userId}`).then((res) =>
    res.json().then(({ auth }) => {
      return auth
    }),
  )
}
