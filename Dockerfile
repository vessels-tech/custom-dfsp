FROM node:10.15.3-alpine
WORKDIR /opt/sheet-fsp

COPY package.json package-lock.json* /opt/sheet-fsp/
RUN npm install

COPY tsconfig.json /opt/sheet-fsp/tsconfig.json
RUN mkdir -p /opt/sheet-fsp/config
COPY src /opt/sheet-fsp/src
COPY secrets /opt/sheet-fsp/secrets
COPY config /opt/sheet-fsp/config

RUN npm run build

CMD ["npm", "run", "start"]
ENTRYPOINT [ "sh", "-c" ]