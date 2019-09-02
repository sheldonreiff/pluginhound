FROM nginx:stable

WORKDIR /var/www

COPY ./ ./

COPY ./.nginx /opt/.nginx

RUN apt-get update && \
    apt-get install -y certbot python-certbot-nginx

RUN chmod -fR 777 /var/www/storage

RUN ["chmod", "+x", "./start-nginx-prod.sh"]

EXPOSE 443

CMD ["./start-nginx-prod.sh"]