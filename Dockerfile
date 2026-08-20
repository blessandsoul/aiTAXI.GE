# syntax=docker/dockerfile:1.7
#
# The production Next runtime is built from a locally verified standalone output
# and pushed under this immutable release tag. Coolify only pulls this final
# layer: it must never invoke `next build` on the VPS, where Google Fonts are
# unavailable to BuildKit.
FROM localhost:5000/aitaxi-app:05285c3-r1

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health',(r)=>{process.exit(r.statusCode===200?0:1)})"
