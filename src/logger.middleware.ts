export function logger(req: any, res: any, next: () => void) {
  console.log('App logging');
  next();
}
