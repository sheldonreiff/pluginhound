#!/bin/sh
set -xe

nginx

# if [ ! -d /etc/letsencrypt/live/test1.pluginhound.com  ];
# then
# 	certbot --debug --non-interactive --agree-tos --debug --nginx --email sheldonreiff@gmail.com --domains test1.pluginhound.com --keep-until-expiring
# fi

# certbot renew --dry-run

tail -f /dev/null