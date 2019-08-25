FROM nginx:stable

RUN apt-get update && \
    apt-get install -y certbot python-certbot-nginx

RUN ["chmod", "+x", "/var/www/nginx-start.sh"]

CMD ["/var/www/start-nginx.sh"]