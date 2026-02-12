export function requireAdmin(req){const t=req.headers.get('x-admin-token')||'';return !!(t&&process.env.ADMIN_TOKEN&&t===process.env.ADMIN_TOKEN)}
