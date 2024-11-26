<h1 align="center">Ecoteka</h1>

## Requirements

All work environments need at least the following requirements:

- Docker: [how to install it][docker]
- Docker Compose: [how to install it][docker-compose]

## Structure

- We use [Traefik][traefik] as proxy
- The project uses as database [PostgreSQL 12][postgresql],
  [SQLAlchemy][sql-alchemy] as toolkit and Object Relational Mapper and
  [Alembic][alembic] as database migration tool.
- The [backend] uses the [FastAPI][fastapi] framework.
- The [frontend] uses [next.js][next.js] as framework and
  [Material-UI][material-ui] as components library.
- [Mapbox GL JS][mapbox-gl-js] as library to render interactive maps.
- [Tippecanoe][tippecanoe] to build vector tilesets.

## Install environment for development

```shell
npm install # Install husky and commitlint
npm run prepare # Install pre-commit hooks with husky
./scripts/start_dev.sh
```

## Quick Start With Docker Compose

To start with docker-compose we just need to copy `.env.example` to `.env`. You
can use the following command:

```bash
$ cp .env.example .env
```

`.env` contains all the environment variables that we can modify in out project.

Once the variables are set, you can start with the following command:

```bash
$ docker-compose up -d

Starting ecoteka_proxy_1    ... done
Starting ecoteka_db_1       ... done
Starting ecoteka_backend_1  ... done
Starting ecoteka_frontend_1 ... done
```

With our container running, we should be able to see the main page of the
project on the following link:

- http://localhost:8000

## Access To API Documentation

The project's API documentation is found once the local instance of the
backend is started on the next path:

- http://localhost:8000/api/v1/docs

## How to deploy in production

First create an .env file and modify the necessary variables:

```bash
cp .env.example .env
```

and you can execute the following command to deploy in production:

```bash
./script/deploy.sh
```

## Environment variables

These are the environment variables that you can set in docker-compose to
configure it and their default values:

### GLOBAL

| Key                    | Description                             | Default value |
| :--------------------- | :-------------------------------------- | ------------: |
| NS_ECOTEKA_DOMAIN_NAME | The domain name associated to the stack |     localhost |

### PROXY

| Key                                                  | Description                               |     Default value |
| :--------------------------------------------------- | :---------------------------------------- | ----------------: |
| NS_ECOTEKA_PROXY_API_PORT                            | The external [Traefik][traefik] API port. |              8080 |
| NS_ECOTEKA_PROXY_CERTIFICATESRESOLVERS_LE_ACME_EMAIL |                                           | noreply@localhost |
| NS_ECOTEKA_PROXY_HTTP_PORT                           | The external [Traefik][traefik] port.     |              8000 |
| NS_ECOTEKA_PROXY_IMAGE                               | The name of the traefik docker image.     |      traefik:v2.2 |

### DB

| Key                    | Description                                  |   Default value |
| :--------------------- | :------------------------------------------- | --------------: |
| NS_ECOTEKA_DB_IMAGE    | The name of the postgres docker image.       | postgis/postgis |
| NS_ECOTEKA_DB_NAME     | The [PostgresSQL][postgresql] database name. |         ecoteka |
| NS_ECOTEKA_DB_PASSWORD | The [PostgresSQL][postgresql] user password. |        password |
| NS_ECOTEKA_DB_PORT     | The [PostgreSQL][postgresql] database port.  |            5432 |
| NS_ECOTEKA_DB_SERVER   | The [PostgreSQL][postgresql] server host.    |              db |
| NS_ECOTEKA_DB_USER     | The [PostgresSQL][postgresql] user.          |        postgres |

### FRONTEND

| Key                               | Description                                        |                                        Default value |
| :-------------------------------- | :------------------------------------------------- | ---------------------------------------------------: |
| NS_ECOTEKA_FRONTEND_IMAGE         | The path of the frontend docker image.             | registry.gitlab.com/natural-solutions/ecoteka:latest |
| NS_ECOTEKA_FRONTEND_TOKEN_STORAGE | localStorage key to get access to the stored token |                                 ecoteka_access_token |

### BACKEND

| Key                                               | Description                                                                                                                                                                                                                                                       |                                                Default value |
| :------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -----------------------------------------------------------: |
| NS_ECOTEKA_BACKEND_BASE_PATH                      | To allow [FastAPI][fastapi] to run behind a proxy it is possible to set the --root-path parameter to [Uvicorn][uvicorn].<BR/>More information can be found on FastAPI's documentation page: https://fastapi.tiangolo.com/advanced/behind-a-proxy/#about-root_path |                                                      /api/v1 |
| NS_ECOTEKA_BACKEND_EMAIL_RESET_TOKEN_EXPIRE_HOURS |                                                                                                                                                                                                                                                                   |                                                           48 |
| NS_ECOTEKA_BACKEND_EMAILS_ENABLED                 | Enabled the feature for sending mail after user created                                                                                                                                                                                                           |                                                        False |
| NS_ECOTEKA_BACKEND_EMAILS_FROM_EMAIL              |                                                                                                                                                                                                                                                                   |                         contact@ecoteka.natural-solutions.eu |
| NS_ECOTEKA_BACKEND_EMAILS_TEMPLATES_DIR           | The relative path from /backend that will be used for storing templates generated.                                                                                                                                                                                |                                app/app/email-templates/build |
| NS_ECOTEKA_BACKEND_EXTERNAL_PATH                  | External URL for API access                                                                                                                                                                                                                                       |                                 http://localhost:8000/api/v1 |
| NS_ECOTEKA_BACKEND_FIRST_SUPERUSER_EMAIL          | The first time the project is started up, a super admin is created. `NS_ECOTEKA_BACKEND_FIRST_SUPERUSER_EMAIL` defines the email with which the user will be created.                                                                                             |                           admin@ecoteka.natural-solutions.eu |
| NS_ECOTEKA_BACKEND_FIRST_SUPERUSER_PASSWORD       | The password for the super admin user explained above.                                                                                                                                                                                                            |                                                     password |
| NS_ECOTEKA_BACKEND_IMAGE                          | The path of the backend docker image.                                                                                                                                                                                                                             | registry.gitlab.com/natural-solutions/ecoteka:backend-latest |
| NS_ECOTEKA_BACKEND_PROJECT_NAME                   | The project name for [FastAPI][fastapi].                                                                                                                                                                                                                          |                                                      ecoTeka |
| NS_ECOTEKA_BACKEND_SMTP_HOST                      | Host of smtp server                                                                                                                                                                                                                                               |                                                    localhost |
| NS_ECOTEKA_BACKEND_SMTP_PASSWORD                  | Password mail                                                                                                                                                                                                                                                     |                                                     password |
| NS_ECOTEKA_BACKEND_SMTP_PORT                      | Port of the smtp server                                                                                                                                                                                                                                           |                                                          438 |
| NS_ECOTEKA_BACKEND_SMTP_TLS                       | Rncryption connection with smtp server                                                                                                                                                                                                                            |                                                         True |
| NS_ECOTEKA_BACKEND_SMTP_USER                      | Login mail                                                                                                                                                                                                                                                        |                                                         user |
| NS_ECOTEKA_BACKEND_UPLOADED_FILES_FOLDER          | Uploaded files folder                                                                                                                                                                                                                                             |                                      /app/app/uploaded_files |
| NS_ECOTEKA_BACKEND_SECRET_KEY                     | Secret key to generate token                                                                                                                                                                                                                                      |                             AQ47ZOIH0nIDn1z013ua8_t_St0kQ9vI |
| NS_ECOTEKA_BACKEND_TILES_FOLDER                   | Tiles folder                                                                                                                                                                                                                                                      |                                                       /tiles |

### TILE SERVER

| Key                                   | Description                       |                                            Default value |
| :------------------------------------ | :-------------------------------- | -------------------------------------------------------: |
| NS_ECOTEKA_TILE_SERVER_IMAGE          | Vector Tile Server Docker Image   | registry.gitlab.com/natural-solutions/vector-tile-server |
| NS_ECOTEKA_TILE_SERVER_PUBLIC_FOLDER  | Public Vector Tiles Files Folder  |                                           ./tiles/public |
| NS_ECOTEKA_TILE_SERVER_PRIVATE_FOLDER | Private Vector Tiles Files Folder |                                          ./tiles/private |

## Testing with Cypress

Only interactive tests runner is available.

_CI integration is a work in progress._

In dev mode, in order to launch Cypress Interactive Tests Runner, here are the steps to follow:

1.  Launch project in dev mode: `./scripts/start_dev.sh`
2.  Go to frontend folder: `cd frontend`
3.  Open Test Runner: `npx cypress open`

---

[![logo-natural-solutions][logo-ns]][ns]

[logo-ns]: docs/logos/natural-solutions-logo-horizontal.png
[ns]: https://www.natural-solutions.eu/
[docker]: https://docs.docker.com/get-docker
[docker-compose]: https://docs.docker.com/compose/install
[traefik]: https://docs.traefik.io
[postgresql]: https://www.postgresql.org/docs/12/index.html
[sql-alchemy]: https://www.sqlalchemy.org
[alembic]: https://alembic.sqlalchemy.org/en/latest
[fastapi]: https://fastapi.tiangolo.com
[next.js]: https://nextjs.org
[material-ui]: https://material-ui.com
[mapbox-gl-js]: https://docs.mapbox.com/mapbox-gl-js/api
[tippecanoe]: https://github.com/mapbox/tippecanoe
[uvicorn]: https://www.uvicorn.org/settings
[cypress]: https://docs.cypress.io/
[backend]: https://gitlab.com/natural-solutions/ecoteka/-/tree/dev/backend
[frontend]: https://gitlab.com/natural-solutions/ecoteka/-/tree/dev/frontend


More info https://natural-solutions-world or https://www.natural-solutions.eu/
