FROM node:current-alpine3.13 AS base

WORKDIR /base
COPY package-lock.json ./
COPY package.json ./
RUN npm install

FROM base AS build
ENV NODE_ENV=production
WORKDIR /build
COPY --from=base /base ./
COPY . .
RUN npm run build

FROM node:current-alpine3.13 AS production
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /build/package*.json ./
COPY --from=build /build/.next ./.next
COPY --from=build /build/public ./public

RUN npm install next

EXPOSE 3000
CMD npm run start
