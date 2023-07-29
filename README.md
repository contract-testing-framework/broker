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
   - Deploy the Signet broker to AWS with the `signet deploy` cLI command.
   - Download Signet's [docker-compose.yml](https://github.com/signet-framework/signet-broker/blob/main/server/docker-compose.yml) and run `docker-compose up`.

&nbsp;

# The Signet workflow

Signet broker provides a web interface for inspecting contracts, viewing test results, managing webhooks, and visualizing deployments. This section walks through an example of contract testing with Signet when two services want to update the way they integrate.

1. Suppose the organization has the following microservices:
![Alt text](image.png)
Signet's service graph makes it easy to see that advertising_service depends on shopping_cart_service, and shopping_cart_service depends on inventory_service and payments_service.

2. What happens if shopping_cart_service needs a new feature that requires a new API endpoint from inventory_service? The shopping_cart_service team and the inventory_service team first agree on the new API endpoint--`GET /api/gadgets/:gadgetId`. Then they publish an updated API spec for inventory_service using the `signet publish` CLI command, and both teams get to work updating their respective services.

3. The shopping_cart_service team finishes their implementation first. After updating their test double of inventory_service, they use service tests to validate the new functionality of shopping_cart_service. They use the `signet proxy` CLI command to record the API calls that shopping_cart_service makes to the inventory_service test double.
![Alt text](image-1.png)

4. `signet proxy` generates a consumer contract. The shopping_cart_service team publishes the new consumer contract to the broker with `signet publish`, and the broker confirms that the new version of the shopping_cart_service service conforms to the API spec.
![Alt text](<shopping cart publishes new version edited.png>)

5. Before deploying the new version of shopping_cart_service, the team uses Signet's Deploy Guard feature to make sure the new shopping_cart_service service is compatible with all of the other services in production.
![Alt text](<shopping_cart deploy guard fail.png>)

6. Since the inventory_service team has not finished adding the new API endpoint to their service, Deploy Guard reports that the new shopping_cart_service service will break if it is deployed to production. The shopping_cart_service team postpones the deployment until the new inventory_service service is finished. In the meantime, they subscribe their CI/CD pipeline to receive a webhook from the Signet broker when the new inventory_service service is completed.
![Alt text](<new inventory webhook .png>)

7. Eventually, the inventory_service team finishes adding the new endpoint to their service. Unlike the shopping_cart_service team, the inventory_service team has fully integrated Signet into their CI/CD pipeline, so contract testing is completely automated for them. When the new build of inventory_service service is complete, the CI/CD pipeline uses the `signet test` CLI command to verify that it correctly implements the API spec. Since it does, the CLI reports back to the broker that inventory_service service has been successfully tested.
![Alt text](<inventory test passed.png>)
![Alt text](<new intventory version tested markedup.png>)

8. After successful provider verification, inventory_service's CI/CD pipeline invokes `signet deploy-guard` to check whether it is safe to deploy the new version of inventory_service service. Since the new service has no external dependencies, and it is still compatible with the old version of shopping_cart_service (which is currently deployed in production), `signet deploy-guard` reports that all is well. The CI/CD pipeline proceeds to deploy the new version of inventory_service Service.
![Alt text](<new intentory version deploy guard pass.png>)

9. When the updated inventory_service Service was successfully tested against the API spec, the shopping_cart_service team received a webhook from the Signet broker to report the news. Now the team checks Deploy Guard again to see if they can deploy the new version of shopping_cart_service. Because all of shopping_cart_service's external dependencies in production are compatible, and shopping_cart_service is compatible with the Advertising service that depends on it, Deploy Guard says it is safe to deploy. The shopping_cart_service team can now deploy the new version with confidence that no breaking changes will be introduced into production.
![Alt text](<shopping cart safe to deploy.png>)

10. At any time, either team can use the matrix view to explore the state of each pair of consumer and provider service versions:
![Alt text](Matrix.png)

11. The timeline view records the history of events:
![Alt text](timeline.png)

12. Teams can view the requirements listed in the consumer contract:
![Alt text](<consumer interactions expanded.png>)

13. They can also check the provider API spec:
![Alt text](<provider spec expanded.png>)

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
