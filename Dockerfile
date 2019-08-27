FROM node:10.15.3-alpine
WORKDIR /opt/custom-dfsp

RUN apk add --no-cache -t build-dependencies git make gcc g++ python libtool autoconf automake \
  && cd $(npm root -g)/npm \
  && npm config set unsafe-perm true \
  && npm install -g node-gyp

COPY package.json package-lock.json* /opt/custom-dfsp/
RUN npm install

COPY tsconfig.json /opt/custom-dfsp/tsconfig.json
RUN mkdir -p /opt/custom-dfsp/config
COPY src /opt/custom-dfsp/src
COPY secrets /opt/custom-dfsp/secrets

EXPOSE 4000
CMD ["npm", "run", "start"]
ENTRYPOINT [ "sh", "-c" ]