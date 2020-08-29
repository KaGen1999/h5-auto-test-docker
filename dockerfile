FROM cypress/browsers:node13.6.0-chrome80-ff72

WORKDIR /home/node/app
EXPOSE 8000
COPY package.json package-lock.json ./
RUN npm install --registry=http://mirrors.cloud.tencent.com/npm/
COPY cypress.json ./
COPY cypress ./cypress
COPY reporter.json ./reporter.json
COPY newRunCypress.js ./newRunCypress.js
RUN mkdir logs
CMD ["node","newRunCypress.js"]
