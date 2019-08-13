FROM httpd:2.4

COPY ./httpd-dev.conf /usr/local/apache2/conf/httpd.conf
COPY ./httpd-vhosts-dev.conf /usr/local/apache2/conf/extra/httpd-vhosts.conf

COPY ./ /usr/local/apache2/htdocs/ 