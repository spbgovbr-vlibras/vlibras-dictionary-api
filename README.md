<div align="center">
  <a href="http://www.vlibras.gov.br/">
    <img
      alt="VLibras"
      src="http://www.vlibras.gov.br/assets/imgs/IcaroGrande.png"
    />
  </a>
</div>

# VLibras Dictionary (API)

VLibras Dictionary Service API.

![Version](https://img.shields.io/badge/version-v1.1.0-blue.svg)
![License](https://img.shields.io/badge/license-LGPLv3-blue.svg)
![VLibras](https://img.shields.io/badge/vlibras%20suite-2019-green.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAUCAYAAAC9BQwsAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4wIHCiw3NwjjIgAAAQ9JREFUOMuNkjErhWEYhq/nOBmkDNLJaFGyyyYsZzIZKJwfcH6AhcFqtCvFDzD5CQaTFINSlJJBZHI6J5flU5/P937fube357m63+d+nqBEagNYA9pAExgABxHxktU3882hjqtd9d7/+lCPsvpDZNA+MAXsABNU6xHYQ912ON2qC2qQ/X+J4XQXEVe/jwawCzwNAZp/NCLiDVgHejXgKIkVdGpm/FKXU/BJDfytbpWBLfWzAjxVx1Kuxwno5k84Jex0IpyzdN46qfYSjq18bzMHzQHXudifgQtgBuhHxGvKbaPg0Klaan7GdqE2W39LOq8OCo6X6kgdeJ4IZKUKWq1Y+GHVjF3gveTIe8BiCvwBEZmRAXuH6mYAAAAASUVORK5CYII=)

## Table of Contents

- **[Getting Started](#getting-started)**
  - [System Requirements](#system-requirements)
  - [Prerequisites](#prerequisites)
  - [Installing](#installing)
- **[Documentation](#documentation)**
- **[Deployment](#deployment)**
  - [Deploy Tools](#deploy-tools)
  - [Deploying](#deploying)
- **[Contributors](#contributors)**
- **[License](#license)**

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### System Requirements

* OS: Ubuntu 18.04.2 LTS (Bionic Beaver)

### Prerequisites

Before starting the installation, you need to install some prerequisites:

[Node.js](https://nodejs.org/en/)

```sh
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
```

```sh
sudo apt install -y nodejs
```

[MongoDB](https://www.mongodb.com/)

```sh
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
```

```sh
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
```

```sh
sudo apt update
```

```sh
sudo apt install -y mongodb-org
```

### Installing

After installing all the prerequisites, install the project by running the command:

```sh
cd api/
```

```sh
npm install
```

To test the installation, simply start the dictionary API with the following command:

```sh
cd api/
```

```sh
npm run dev
```

## Documentation

To access the documentation and usage examples of the VLibras Dictionary API, start the dictionary server in your localhost and open a browser with the following link:

```
http://localhost:3030/docs
```

## Deployment

These instructions will get you a copy of the project up and running on a live System.

### Deploy Tools

To fully deployment of this project its necessary to have installed and configured the Docker Engine and Kubernetes Container Orchestration.

[Docker](https://www.docker.com/)

Update the apt package index:

```sh
sudo apt update
```

Install packages to allow apt to use a repository over HTTPS:

```sh
sudo apt install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common
```

Add Docker’s official GPG key:

```sh
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

Use the following command to set up the stable repository:

```sh
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```

Update the apt package index:

```sh
sudo apt update
```

Install the latest version of Docker and containerd:

```sh
sudo apt install -y docker-ce docker-ce-cli containerd.io
```

<br/>

[Kubernetes](https://kubernetes.io/)

Update the apt package index:

```sh
sudo apt update
```

Install packages to allow apt to use a repository over HTTPS:

```sh
sudo apt install -y apt-transport-https
```

Add Kubernetes’s official GPG key:

```sh
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
```

Use the following command to set up the main repository:

```sh
echo "deb https://apt.kubernetes.io/ kubernetes-bionic main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
```

Update the apt package index:

```sh
sudo apt update
```

Install the kubectl:

```sh
sudo apt install -y kubectl
```

### Deploying

> Note: if you already MongoDB running on your cluster, skip the next step.

Once kubectl is installed and set, run the following commands:

```sh
kubectl apply -f kubernetes/mongo.yaml 
kubectl expose rc mongo-controller --type=ClusterIP
```
These commands will start the MongoDB pods. You must configure a persistent volume claim (PVC) to be used by it. As example, the dictionary-server.yaml has a volume claim attachment to a local persistent volume.

Then , open the file dictionary-server-template.yaml and edit these enviroment variables to match yours.

```sh
- name: DB_HOST
  value: "MONGODB-IP"
- name: DB_PORT
  value: "MONGODB-PORT"
```

Finally, starting the service is made by :

```sh
kubectl apply -f kubernetes/dictionary-server-template.yaml.yaml
kubectl expose deployment dictionaryapi --port=80 --type=LoadBalancer
```
Note that as happened to MongoDB, You must configure a PVC to be used by it.


## Contributors

* Jonathan Brilhante - <jonathan.brilhante@lavid.ufpb.br>
* Wesnydy Ribeiro - <wesnydy@lavid.ufpb.br>

## License

This project is licensed under the LGPLv3 License - see the [LICENSE](LICENSE) file for details.
