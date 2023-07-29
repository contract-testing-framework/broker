[![Server Tests](https://github.com/contract-testing-framework/broker/actions/workflows/test_server.yml/badge.svg)](https://github.com/contract-testing-framework/broker/actions/workflows/test_server.yml)
[![CodeQL](https://github.com/contract-testing-framework/broker/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/contract-testing-framework/broker/actions/workflows/github-code-scanning/codeql)

`signet-broker` is the backend and web interface for the Signet contract testing framework. The documentation for the Signet broker lives here, along with a summary of its use case and features. The [signet-cli README](https://github.com/signet-framework/signet-cli) explains the functionality and documentation of the Signet command line interface.

&nbsp;  

# What is Signet?

Signet is an open-source contract testing framework for microservices. It promotes spec-first API design, and enables teams to build services in parallel with the confidence that they will be compatible when deployed. It is designed for rapidly-scaling applications that want to introduce contract testing with minimal cost and without having to write new unit tests. Signet deploys to AWS with a single command and integrates with CI/CD to automate the contract testing workflow.

**Read the [Case Study]()** for a deep dive into the problems with testing microservices and a breakdown of Signet's design and feature set.

&nbsp;

# Key concepts
- **provider spec** - (a.k.a. API spec) a provider's OpenAPI specification. This is the authoritative contract in the Signet ecosystem.
- **consumer contract** - a document describing the HTTP requests the consumer makes to the provider, and the responses the consumer is expecting. Signet uses the Pact specification for consumer contracts.
- **integration** - A pair of microservices (one consumer and one provider) which interact with each other.
- **comparison** - A test that determines if a consumer contract is compatible with a provider spec. This is how Signet tests whether a consumer service conforms to the API spec.
- **provider verification** - A test that determines if a provider's actual implementation conforms to the provider API spec.

&nbsp;

# Setting up Signet

An organization can get started with Signet by following these steps:
1. Install the [signet-cli](https://github.com/signet-framework/signet-cli)
2. Self host the Signet broker in one of the following ways:
   - Deploy the Signet broker to AWS with the `signet deploy` cli command.
   - Download Signet's [docker-compose.yml](https://github.com/signet-framework/signet-broker/blob/main/server/docker-compose.yml) and run `docker-compose up`.

&nbsp;

# The Signet workflow

Signet broker provides a web interface for inspecting contracts, viewing test results, managing webhooks, and visualizing deployments.







&nbsp;
## Setting up the broker in development mode

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
