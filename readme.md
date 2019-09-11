# PluginHound
#### [pluginhound.com](https://pluginhound.com)
#### A website for tracking prices and saving on Waves Audio plugins and bundles!

Buying Waves plugins can be frustrating sometimes because you never know if this week's price is a good one. This solves that problem and lets you see price history and create custom price alerts.

## Development
### Configure environment
Copy `.env.sample` to `.env` and modify as needed
### Install dependencies & build
```
composer intall
yarn install
yarn run dev
php artisan key:generate
php artisan jwt:secret
```
### Build and start docker
```
docker-compose up -d
```
The application should now be available at [localhost:3002](http://localhost:3002)