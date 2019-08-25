FROM nginx:stable

RUN apt-get update && \
    apt-get install -y certbot python-certbot-nginx

RUN ["chmod", "+x", "./nginx-start.sh"]

CMD start-nginx.sh