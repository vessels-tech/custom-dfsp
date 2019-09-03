FROM node:10.15.3-alpine
WORKDIR /opt/sheet-fsp

# RUN apk add --no-cache -t build-dependencies git make gcc g++ python libtool autoconf automake \
#   && cd $(npm root -g)/npm \
#   && npm config set unsafe-perm true \
#   && npm install -g node-gyp

COPY package.json package-lock.json* /opt/sheet-fsp/
RUN npm install

COPY tsconfig.json /opt/sheet-fsp/tsconfig.json
RUN mkdir -p /opt/sheet-fsp/config
COPY src /opt/sheet-fsp/src
COPY secrets /opt/sheet-fsp/secrets

CMD ["npm", "run", "start"]
ENTRYPOINT [ "sh", "-c" ]