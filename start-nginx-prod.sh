#!/bin/sh
set -xe

certbot --debug --non-interactive --agree-tos --debug --nginx --email sheldonreiff@gmail.com --domains test.pluginhound.com,www.test.pluginhound.com --keep-until-expiring && \
certbot renew --dry-run

nginx -g 'daemon off;'