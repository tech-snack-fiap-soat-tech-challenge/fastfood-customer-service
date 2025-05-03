FROM node:20.18.0-alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

FROM node:20.18.0-alpine as runner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/.db-migraterc ./
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/database ./database
COPY --from=builder /usr/src/app/dist ./dist

ENV NODE_ENV production
RUN npm ci --ignore-scripts --only=production && npm cache clean --force

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
