# bookshelf-upsert-issue

Note: For this test, an older postgres server is used.


## Reproducing the issue
docker and docker-compose (for the postgres server) and a recent nodejs have to be installed.

Port 8432 of postgres server is exposed on docker host, so the test script and oneself can connect to it.

````
docker-compose up -d # (usually needs some seconds to come up)
npm install

node test.js
````

## Cleanup after testing:
````
docker-compose down
````
