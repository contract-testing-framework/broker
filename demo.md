# demo.md

## 0. Before Coding

1. Consumer and provider teams agree on the API spec.

2. Provider or consumer team uploads the spec to the broker.

    ```bash
      signet publish
    ```

## Consumer Contract Generation

  ```bash
    signet proxy
  ```

## 1. First Release

1. Provider team implements provider, they test against the spec, and tells the broker to associate the provider version with the spec.

    ```bash
    signet test
    ```

2. Consumer team implements their service, they test and generate the consumer contract, and publish it.

    ```bash
    signet publish
    ```

3. Can i deploy gui

5. Provider deploys their version and records the deployment in the broker

    ```bash
    signet update-deployment --environment=production
    ```

4.  can i deploy cli

    ```bash
      signet deploy-guard --environment=production
    ```

6. Consumer deploys

    ```bash
    signet update-deployment --environment=production
    ```


7. Consumer team adds webhook in GUI.

## 2. Second Release

1. Customer wants a new feature, consumer and provider teams meet to create new spec. [Maybe: Provider or consumer team uploads new spec without version]

2. Consumer updates consumer, they test and generate new consumer contract and publish it

    ```bash
    signet publish --path=sieveService-sieveProvider_2.json --type=consumer --version=2 --branch=main
    ```

3. Provider team updates provider, they test against new provider spec, and republish spec with the provider version info

    ```bash
    signet publish --path=sieve-server-spec_v3_2.json --type=provider --version=B -n=sieveProvider --branch=main
    ```





export PATH=$PATH:$(pwd)

signet publish --path=sieveService-sieveProvider.json --type=consumer --version=1 --branch=main && signet publish --path=sieve-server-spec_v3.json --type=provider --version=A -n=sieveProvider --branch=main && signet publish --path=sieveService-sieveProvider_2.json --type=consumer --version=2 --branch=main && signet publish --path=sieve-server-spec_v3_2.json --type=provider --version=B -n=sieveProvider --branch=main
