[![Server Tests](https://github.com/contract-testing-framework/broker/actions/workflows/test_server.yml/badge.svg)](https://github.com/contract-testing-framework/broker/actions/workflows/test_server.yml)
[![CodeQL](https://github.com/contract-testing-framework/broker/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/contract-testing-framework/broker/actions/workflows/github-code-scanning/codeql)

`signet-broker` is the backend and web interface for the Signet contract testing framework. A description of Signet's core use case, features, and documentation for the Signet broker lives here. The [signet-cli README](https://github.com/signet-framework/signet-cli) explains the fuctionality and documentation of the Signet command line interface.
&nbsp;  

# Core Use Case
Signet provides an open-source, low-configuration solution for schema-based contract testing of microservices. Signet is designed for small to medium sized organizations that currently have a small number of microservices and are anticipanting significant growth. Signet is an easy, low-configuration way to add contract testing into a CI/CD workflow without writing additional tests. It uses popular open-source specifications to enable a smooth transition to a SaaS solution if the needs of the organization change in the future.

Example use case:
An organization with existing service tests (with can implement contract testing without writing any additional tests. If an organization does not have service test



## Server Setup

1. `cd` into `./server`
2. `npm install`
3. Create a `.env` file (*see* below for contents)
4. Ensure postgres is running
5. Setup or reset the database to the latest schema. **WARNING: This will delete any existing database named `broker` and its associated data.** => `npm run resetdb`
6. `npm run dev` to start express server

### Server `.env` File contents

```yaml
PORT=3001
NODE_ENV=development

DEV_DB_USER=
DEV_DB_PASSWORD=
DEV_DB_HOST=
DEV_DB_PORT=

TEST_DB_USER=
TEST_DB_PASSWORD=
TEST_DB_HOST=
TEST_DB_PORT=
```

## Client Setup

1. `cd` into `./client`
2. `npm install`
3. Create `.env` file (*see* below for contents)
4. `npm run dev` to start the client dev server

### Client `.env` File contents

```yaml
PROXY_PORT=3001 # Should match the PORT variable in the server .env file
```
