container_commands:
    01-migration:
        command: "sudo docker exec $(sudo docker ps -qf name={{ $app_image }}) php /var/www/html/artisan migrate"
        leader_only: true