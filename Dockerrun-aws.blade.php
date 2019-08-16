{
  "AWSEBDockerrunVersion": 2,
  "containerDefinitions": [
    {
      "name": "waves-saver-app",
      "image": "873481467694.dkr.ecr.us-east-1.amazonaws.com/waves-saver/app:{{ $tag }}",
      "essential": true,
      "memory": 200,
      "cpu": 1
    },
    {
      "name": "waves-saver-web",
      "image": "873481467694.dkr.ecr.us-east-1.amazonaws.com/waves-saver/web:{{ $tag }}",
      "essential": true,
      "memory": 200,
      "cpu": 1,
      "portMappings": [
        {
          "hostPort": 80,
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "links": [
        "waves-saver-app"
      ]
    }
  ]
}