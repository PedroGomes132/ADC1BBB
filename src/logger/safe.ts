export function mask(value: unknown, visible = 6) {
   if (value === undefined || value === null) {
      return value
   }

   const text = String(value)
   if (text.length <= visible * 2) {
      return `${text.slice(0, 2)}...`
   }

   return `${text.slice(0, visible)}...${text.slice(-visible)}`
}

export function requestInfo(req: { method?: string; originalUrl?: string; ip?: string }) {
   return {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
   }
}
