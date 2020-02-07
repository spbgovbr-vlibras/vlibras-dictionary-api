<div align="center">
  <a href="https://www.vlibras.gov.br/">
    <img
      alt="VLibras"
      src="https://vlibras.gov.br/assets/imgs/IcaroGrande.png"
    />
  </a>
</div>

# VLibras Dictionary (API)

VLibras Dictionary Service API.

![Version](https://img.shields.io/badge/version-v2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-LGPLv3-blue.svg)
![VLibras](https://img.shields.io/badge/vlibras%20suite-2019-green.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAUCAYAAAC9BQwsAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4wIHCiw3NwjjIgAAAQ9JREFUOMuNkjErhWEYhq/nOBmkDNLJaFGyyyYsZzIZKJwfcH6AhcFqtCvFDzD5CQaTFINSlJJBZHI6J5flU5/P937fube357m63+d+nqBEagNYA9pAExgABxHxktU3882hjqtd9d7/+lCPsvpDZNA+MAXsABNU6xHYQ912ON2qC2qQ/X+J4XQXEVe/jwawCzwNAZp/NCLiDVgHejXgKIkVdGpm/FKXU/BJDfytbpWBLfWzAjxVx1Kuxwno5k84Jex0IpyzdN46qfYSjq18bzMHzQHXudifgQtgBuhHxGvKbaPg0Klaan7GdqE2W39LOq8OCo6X6kgdeJ4IZKUKWq1Y+GHVjF3gveTIe8BiCvwBEZmRAXuH6mYAAAAASUVORK5CYII=)

## Table of Contents

- **[Getting Started](#getting-started)**
  - [System Requirements](#system-requirements)
  - [Prerequisites](#prerequisites)
  - [Installing](#installing)
  - [API Documentation](#api-documentation)
- **[Deployment](#deployment)**
  - [Deployment Tools](#deployment-tools)
  - [Deploying](#deploying)
- **[Contributors](#contributors)**
- **[License](#license)**

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### System Requirements

* OS: Ubuntu 18.04.3 LTS (Bionic Beaver)

### Prerequisites

Before starting the installation, you need to install some prerequisites:

##### [Node.js](https://nodejs.org/en/)

Add NodeSource repository.

```sh
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
```

Install Node.js.

```sh
sudo apt install -y nodejs
```

##### [MongoDB](https://www.mongodb.com/)

Update local package database.

```sh
sudo apt update
```

Install required libraries.

```sh
sudo apt install -y wget gnupg
```

Import the public key used by the package management system.

```sh
wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
```

Create a list file for MongoDB.

```sh
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list
```

Reload local package database.

```sh
sudo apt update
```

Install the MongoDB packages.

```sh
sudo apt install -y mongodb-org
```

### Installing

After installing all the prerequisites, install the project by running the command:

```sh
npm install
```

To test the installation, simply start the dictionary API with the following command:

```sh
npm run dev
```

### API Documentation

To access the documentation and usage examples of the VLibras Dictionary API, start the dictionary server in your localhost and open a browser with the following link:

[http://localhost:3030/docs](http://localhost:3030/docs)

## Deployment

These instructions will get you a copy of the project up and running on a live System.

### Deployment Tools

To fully deployment of this project its necessary to have installed and configured the Docker Engine and Docker Compose.

##### [Docker](https://www.docker.com/)

Download get-docker script.

```sh
curl -fsSL https://get.docker.com -o get-docker.sh
```

Install the latest version of Docker.

```sh
sudo sh get-docker.sh
```

##### [Docker Compose](https://docs.docker.com/compose/)

Download the current stable release of Docker Compose.

```sh
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

Apply executable permissions to the binary.

```sh
sudo chmod +x /usr/local/bin/docker-compose
```

### Deploying

Before deploying the project, check the [docker-compose.yml](docker-compose.yml) file and review the following environment variables:

```yml
PORT: 3030
DB_HOST: mongo
DB_PORT: 27017
DB_NAME: "vlibras-db"
DICTIONARY_REPOSITORY_URL: "http://localhost:8000"
LOCAL_DICTIONARY_REPOSITORY: /tmp/bundles
SIGNS_LIST_REFRESH_INTERVAL: 3600000
```

> Note: information about these environment variables can be found in [.env.dev](/src/config/environments/.env.dev) file.

Finally, deploy the project by running:

```sh
sudo docker-compose up
```

## Contributors

* Jonathan Brilhante - <jonathan.brilhante@lavid.ufpb.br>
* Wesnydy Ribeiro - <wesnydy@lavid.ufpb.br>

## License

This project is licensed under the LGPLv3 License - see the [LICENSE](LICENSE) file for details.
