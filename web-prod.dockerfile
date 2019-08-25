FROM nginx:stable

WORKDIR /var/www

COPY ./ ./

COPY ./.nginx/conf-prod.d/ /etc/nginx/conf-prod.d/

RUN apt-get update && \
    apt-get install -y certbot python-certbot-nginx

RUN ["chmod", "+x", "/var/www/start-nginx.sh"]

CMD ["/var/www/start-nginx.sh"]