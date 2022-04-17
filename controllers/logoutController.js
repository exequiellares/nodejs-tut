const User = require('../model/User')

const handleLogout = async (req, res) => {
  // On client, also delete the access token
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204) // No content
  const refreshToken = cookies.jwt

  console.log('search for', refreshToken)

  // Is refresh token in DB?
  const foundUser = await User.findOne({ refreshToken }).exec()
  if (!foundUser) {
    console.log('NOT FOUND USER')
    res.clearCookie(
      'jwt',
      {
        httpOnly: true,
        sameSite: 'None',
        // secure: true, // Commented for testing using thunder client
      }
    )
    return res.sendStatus(204)
  }

  // Delete refreshToken in DB
  foundUser.refreshToken = ''
  try {
    const result = await foundUser.save()
    console.log(result)
  } catch (err) {
    console.error(err)
    return res.sendStatus(500)
  }

  res.clearCookie(
    'jwt',
    {
      httpOnly: true,
      sameSite: 'None',
      // secure: true, // Commented for testing using thunder client
    }
  )
  res.sendStatus(204)
}

module.exports = { handleLogout };