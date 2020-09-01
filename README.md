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

![Version](https://img.shields.io/badge/version-v2.1.0-blue.svg)
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

To fully deployment of this project its necessary to have installed and configured the Docker Engine and Kubernetes Container Orchestration.

##### [Docker](https://www.docker.com/)

Update the apt package index.

```sh
sudo apt update
```

Install packages to allow apt to use a repository over HTTPS.

```sh
sudo apt install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common
```

Add Docker’s official GPG key.

```sh
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

Set up the stable repository.

```sh
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```

Update the apt package index.

```sh
sudo apt update
```

Install the latest version of Docker and containerd.

```sh
sudo apt install -y docker-ce docker-ce-cli containerd.io
```

##### [Kubernetes](https://kubernetes.io/)

Update the apt package index.

```sh
sudo apt update
```

Install packages to allow apt to use a repository over HTTPS.

```sh
sudo apt install -y apt-transport-https
```

Add Kubernetes’s official GPG key.

```sh
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
```

Set up the main repository.

```sh
echo "deb https://apt.kubernetes.io/ kubernetes-bionic main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
```

Update the apt package index.

```sh
sudo apt update
```

Install the kubectl.

```sh
sudo apt install -y kubectl
```

### Deploying

Before you deploy the project, you must have MongoDB up and running on your cluster. Execute the following commands to start MongoDB pods:

> Note: if you already have MongoDB on your cluster, skip this step.

```sh
kubectl apply -f kubernetes/mongo.yaml
```

```sh
kubectl expose rc mongo-controller --type=<cluster-IP>
```

After configuring MongoDB, open [dictionary-server-template.yaml](kubernetes/dictionary-server-template.yaml) and set the following environment variables:

```yaml
- name: DB_HOST
  value: "<value>"
- name: DB_PORT
  value: "<value>"
- name: DB_NAME
  value: "<value>"
- name: DICTIONARY_REPOSITORY_URL
  value: "<value>"
- name: DICTIONARY_SIGNS_URL_PATH
  value: "<value>"
- name: SIGNS_LIST_UPDATE_INTERVAL
  value: "<value>"
- name: LOCAL_DICTIONARY_REPOSITORY
  value: "<value>"
```

> Note: information about these environment variables can be found in [.env.dev](/src/config/environments/.env.dev) file.

Finally, deploy project by running:

```sh
kubectl apply -f kubernetes/dictionary-server-template.yaml
```

```sh
kubectl expose deployment dictionaryapi --port=80 --type=LoadBalancer
```

## Contributors

* Jonathan Brilhante - <jonathan.brilhante@lavid.ufpb.br>
* Wesnydy Ribeiro - <wesnydy@lavid.ufpb.br>

## License

This project is licensed under the LGPLv3 License - see the [LICENSE](LICENSE) file for details.
