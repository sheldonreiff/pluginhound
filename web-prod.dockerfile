FROM nginx:stable

WORKDIR /var/www

COPY ./ ./

COPY ./.nginx/conf-prod.d/ /etc/nginx/conf.d/

RUN apt-get update && \
    apt-get install -y certbot python-certbot-nginx

RUN ["chmod", "+x", "./start-nginx-prod.sh"]

CMD ["./start-nginx-prod.sh"]