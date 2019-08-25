FROM nginx:stable

WORKDIR /var/www

RUN apt-get update && \
    apt-get install -y certbot python-certbot-nginx

RUN ["chmod", "+x", "/var/www/start-nginx.sh"]

CMD ["/var/www/start-nginx.sh"]