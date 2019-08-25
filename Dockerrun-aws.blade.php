{
  "AWSEBDockerrunVersion": 2,
  "containerDefinitions": [
    {
      "name": "pluginhound-app",
      "image": "873481467694.dkr.ecr.us-east-1.amazonaws.com/pluginhound/app:{{ $tag }}",
      "essential": true,
      "memoryReservation": 200,
      "cpu": 1
    },
    {
      "name": "pluginhound-web",
      "image": "873481467694.dkr.ecr.us-east-1.amazonaws.com/pluginhound/web:{{ $tag }}",
      "essential": true,
      "memoryReservation": 200,
      "cpu": 1,
      "portMappings": [
        {
          "hostPort": 80,
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "links": [
        "pluginhound-app"
      ]
    },
    {
      "name": "pluginhound-workers",
      "image": "873481467694.dkr.ecr.us-east-1.amazonaws.com/pluginhound/workers:{{ $tag }}",
      "essential": true,
      "memoryReservation": 200,
      "cpu": 1
    }
  ]
}