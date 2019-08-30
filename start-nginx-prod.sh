#!/bin/sh
set -xe

nginx

if [ ! -d /etc/letsencrypt/live/www.$DOMAIN ];
then
	certbot --debug --non-interactive --agree-tos --debug --nginx --email $SSL_ACCOUNT_EMAIL --domains $DOMAIN,www.$DOMAIN --keep-until-expiring
fi

certbot renew --dry-run

tail -f /dev/null
