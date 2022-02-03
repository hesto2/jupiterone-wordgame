export const authenticate = (req: any, res: any, next: any) => {
  console.log(req.headers, process.env.ADMIN_PASSWORD)
  if(req.headers?.['authorization'] === process.env.ADMIN_PASSWORD){
    return next()
  }
  else {
    return res.status(401).send()
  }
}