FROM node:18-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install --frozen-lockfile

COPY . .

ARG REACT_APP_API_URL
ARG REACT_APP_VIDEOSOURCE_API_URL
ARG REACT_APP_OTP_LENGTH

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_VIDEOSOURCE_API_URL=$REACT_APP_VIDEOSOURCE_API_URL
ENV REACT_APP_OTP_LENGTH=$REACT_APP_OTP_LENGTH

ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false

RUN yarn build


FROM nginx:1.25-alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
