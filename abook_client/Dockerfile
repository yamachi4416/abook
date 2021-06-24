FROM node:lts-alpine as builder

WORKDIR /app

COPY ./package*.json ./

ENV NODE_ENV=development
RUN npm install

ARG APP_CONTEXT_ROOT
ENV NODE_ENV=production

COPY . ./
RUN npm run build && \
    npm prune --production


FROM node:lts-alpine

USER node
WORKDIR /home/node/app

COPY --from=builder --chown=node:node ./app/package.json ./
COPY --from=builder --chown=node:node ./app/nuxt.config.js ./
COPY --from=builder --chown=node:node ./app/.nuxt/ ./.nuxt/
COPY --from=builder --chown=node:node ./app/static/ ./static/
COPY --from=builder --chown=node:node ./app/node_modules/ ./node_modules/

ENV NODE_ENV=production
ARG APP_CONTEXT_ROOT

CMD ["npm", "start"]
