import jwt from 'jsonwebtoken';

export const jwtRefreshTokenValidate = (req:any, res:any, next:any) => {
    try {
      if (!req.headers["authorization"]) return res.sendStatus(401)
      const token = req.headers["authorization"].replace("Bearer ", "")
  
      jwt.verify(token, process.env.REFRESH_SECRET!, (err: any, decoded: any) => {
        if (err) throw new Error(err)
        req.user = decoded
        req.user.token = token
        delete req.user.exp
        delete req.user.iat
      })
      next()
    } catch (error) {
      return res.sendStatus(403)
    }
  
  }