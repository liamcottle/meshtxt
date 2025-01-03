FROM debian:latest

RUN apt-get update && \
  apt-get -y install npm && \
  apt-get clean

RUN (cd /root && git clone https://github.com/liamcottle/meshtxt && cd /root/meshtxt && npm install && npm run build)

WORKDIR /root/meshtxt

CMD ["node", "server.js", "--port", "8080"]

EXPOSE 8080



