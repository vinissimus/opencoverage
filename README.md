# Open Coverage

Free and open alternative providing coverage reporting and diff coverage reporting.

The project can be a simple replacement for codecov or coveralls for teams working
on private repos.

(some of the enterprise option pricing seemed a little unreasonable)

Features:

- coverage reporting
- diff coverage reporting
- github integration: PRs, comments
- codecov cli compatible

Requirements:

- sqlalchemy compatible backend(pg, sqlite, mysql, et)
- opencoverage backend
- opencoverage frontend

SCM integrations:

- [x] github
- [ ] bitbucket

## Backend development

Develop:

```
make install-dev
```

Tests:

Run docker compose first:

```
docker-compose up
```

```
make test
```

Run:

```
make run
```

## Configuration

To run the server yourself, you need to create a github application and install
it for your organization.

All configuration is done with env variables.

- host
- port
- public_url
- dsn: connection string for backend database
- cors: hosts frontend runs on
- scm: enum(`github`)
- github_app_id: id of app
- github_app_pem_file: pem file for application you created
- github_default_installation_id: id of org this app is installed on

## Send report from CI

The backend is compatible with the codecov CLI.

You need to provide the installation id of your org as the `--token` value
or `dummy` if you are using the `github_default_installation_id` setting
and only using the server for a single org.

```
codecov --url="http://<installed-host>:8000/api" --token=<github installation id> --slug=vangheem/guillotina
```
