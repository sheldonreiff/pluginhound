FROM nginx:stable

WORKDIR /var/www

COPY ./start-nginx.sh /bin/

RUN ["chmod", "+x", "/bin/start-nginx.sh"]

CMD ["/bin/start-nginx.sh"]