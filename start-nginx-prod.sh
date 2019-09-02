#!/bin/sh
set -xe

if [ "$APP_ENV" = "test" ];
then
	cp -r /opt/.nginx/conf-test.d/. /etc/nginx/conf.d/
else
	cp -r /opt/.nginx/conf-prod.d/. /etc/nginx/conf.d/
fi

nginx

if [ ! -d /etc/letsencrypt/live/www.$DOMAIN ];
then
	certbot --debug --non-interactive --agree-tos --debug --nginx --email $SSL_ACCOUNT_EMAIL --domains $DOMAIN,www.$DOMAIN --keep-until-expiring --redirect
fi

certbot renew --dry-run

nginx -s quit

nginx -g 'daemon off;'
