#!/bin/sh
set -xe

if [ ! -d /etc/letsencrypt/live ];
then
	certbot --debug --non-interactive --agree-tos --debug --nginx --email sheldonreiff@gmail.com --domains test1.pluginhound.com --keep-until-expiring
fi

certbot renew --dry-run

nginx -g 'daemon off;'