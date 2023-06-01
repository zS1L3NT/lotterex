# Lotterex

![License](https://img.shields.io/github/license/zS1L3NT/lotterex?style=for-the-badge) ![Languages](https://img.shields.io/github/languages/count/zS1L3NT/lotterex?style=for-the-badge) ![Top Language](https://img.shields.io/github/languages/top/zS1L3NT/lotterex?style=for-the-badge) ![Commit Activity](https://img.shields.io/github/commit-activity/y/zS1L3NT/lotterex?style=for-the-badge) ![Last commit](https://img.shields.io/github/last-commit/zS1L3NT/lotterex?style=for-the-badge)

Lotterex is a simple smart contract that allows anyone to deploy a Lottery smart contract, and allow others to join the lottery. Once there are at least 3 people in the Lottery, the deployer of the smart contract can randomly pick the winner and send them the prize.

## Motivation

I needed to submit a project strictly following the requirements for my BADV (Introduction to Blockchain Application Development) submission.

## Subrepositories

### [`sol-truffle-lotterex`](sol-truffle-lotterex)

The Truffle project which contains the smart contract and tests

### [`web-next-lotterex`](web-next-lotterex)

The NextJS project containing the UI to interact with the smart contract

## Features

-   Create Lottery
    -   Lottery Name
    -   Lottery Price
-   Enter Lottery
-   Leave Lottery
-   Lottery Manager Controls
    -   Pick random winner for Lottery
    -   Close Lottery
-   Developer page to call smart contract functions directly

## Usage

In the Truffle project, setup the `truffle-config.js` file, then build it with the command

```bash
$ pnpm build
```

Make sure the folder `contracts` is generated in `web-next-lotterex/src`

Then you can run the following command in the NextJS project

```bash
$ pnpm dev
```

## Credits

[This](https://trufflesuite.com/boxes/react/) example project using React from Truffle helped me out the most.

## Tests

The Lotterex smart contract is tested with Truffle Suite. To run the tests, run the following command in the Truffle project

```bash
$ pnpm test
```

## Built with

-   Web3
    -   Truffle Suite
    -   Ganache Network
-   NodeJS
    -   TypeScript
        -   [![@types/bn.js](https://img.shields.io/badge/%40types%2Fbn.js-%5E5.1.1-red?style=flat-square)](https://npmjs.com/package/@types/bn.js/v/5.1.1)
        -   [![@types/mocha](https://img.shields.io/badge/%40types%2Fmocha-%5E10.0.1-red?style=flat-square)](https://npmjs.com/package/@types/mocha/v/10.0.1)
        -   [![@types/node](https://img.shields.io/badge/%40types%2Fnode-latest-red?style=flat-square)](https://npmjs.com/package/@types/node/v/latest)
        -   [![@types/react](https://img.shields.io/badge/%40types%2Freact-18.2.7-red?style=flat-square)](https://npmjs.com/package/@types/react/v/18.2.7)
        -   [![@types/react-dom](https://img.shields.io/badge/%40types%2Freact--dom-18.2.4-red?style=flat-square)](https://npmjs.com/package/@types/react-dom/v/18.2.4)
        -   [![@typescript-eslint/eslint-plugin](https://img.shields.io/badge/%40typescript--eslint%2Feslint--plugin-%5E5.59.7-red?style=flat-square)](https://npmjs.com/package/@typescript-eslint/eslint-plugin/v/5.59.7)
        -   [![@typescript-eslint/parser](https://img.shields.io/badge/%40typescript--eslint%2Fparser-%5E5.59.7-red?style=flat-square)](https://npmjs.com/package/@typescript-eslint/parser/v/5.59.7)
        -   [![typescript](https://img.shields.io/badge/typescript-5.0.4-red?style=flat-square)](https://npmjs.com/package/typescript/v/5.0.4)
        -   [![ts-node](https://img.shields.io/badge/ts--node-%5E10.9.1-red?style=flat-square)](https://npmjs.com/package/ts-node/v/10.9.1)
    -   ESLint
        -   [![eslint](https://img.shields.io/badge/eslint-8.41.0-red?style=flat-square)](https://npmjs.com/package/eslint/v/8.41.0)
        -   [![eslint-config-next](https://img.shields.io/badge/eslint--config--next-%5E13.4.4-red?style=flat-square)](https://npmjs.com/package/eslint-config-next/v/13.4.4)
        -   [![eslint-config-prettier](https://img.shields.io/badge/eslint--config--prettier-%5E8.8.0-red?style=flat-square)](https://npmjs.com/package/eslint-config-prettier/v/8.8.0)
        -   [![eslint-plugin-react](https://img.shields.io/badge/eslint--plugin--react-%5E7.32.2-red?style=flat-square)](https://npmjs.com/package/eslint-plugin-react/v/7.32.2)
    -   Next
        -   [![next](https://img.shields.io/badge/next-13.4.4-red?style=flat-square)](https://npmjs.com/package/next/v/13.4.4)
        -   [![react](https://img.shields.io/badge/react-18.2.0-red?style=flat-square)](https://npmjs.com/package/react/v/18.2.0)
        -   [![react-dom](https://img.shields.io/badge/react--dom-18.2.0-red?style=flat-square)](https://npmjs.com/package/react-dom/v/18.2.0)
    -   Mantine
        -   [![@mantine/core](https://img.shields.io/badge/%40mantine%2Fcore-%5E6.0.13-red?style=flat-square)](https://npmjs.com/package/@mantine/core/v/6.0.13)
        -   [![@mantine/hooks](https://img.shields.io/badge/%40mantine%2Fhooks-%5E6.0.13-red?style=flat-square)](https://npmjs.com/package/@mantine/hooks/v/6.0.13)
        -   [![@mantine/notifications](https://img.shields.io/badge/%40mantine%2Fnotifications-%5E6.0.13-red?style=flat-square)](https://npmjs.com/package/@mantine/notifications/v/6.0.13)
        -   [![@tabler/icons-react](https://img.shields.io/badge/%40tabler%2Ficons--react-%5E2.20.0-red?style=flat-square)](https://npmjs.com/package/@tabler/icons-react/v/2.20.0)
    -   Truffle
        -   [![@typechain/truffle-v5](https://img.shields.io/badge/%40typechain%2Ftruffle--v5-%5E8.0.3-red?style=flat-square)](https://npmjs.com/package/@typechain/truffle-v5/v/8.0.3)
        -   [![truffle](https://img.shields.io/badge/truffle-%5E5.9.2-red?style=flat-square)](https://npmjs.com/package/truffle/v/5.9.2)
        -   [![typechain](https://img.shields.io/badge/typechain-%5E8.2.0-red?style=flat-square)](https://npmjs.com/package/typechain/v/8.2.0)
    -   Web3
        -   [![@metamask/providers](https://img.shields.io/badge/%40metamask%2Fproviders-%5E11.0.0-red?style=flat-square)](https://npmjs.com/package/@metamask/providers/v/11.0.0)
        -   [![web3](https://img.shields.io/badge/web3-%5E1.10.0-red?style=flat-square)](https://npmjs.com/package/web3/v/1.10.0)
        -   [![web3-core](https://img.shields.io/badge/web3--core-%5E1.10.0-red?style=flat-square)](https://npmjs.com/package/web3-core/v/1.10.0)
        -   [![web3-eth-contract](https://img.shields.io/badge/web3--eth--contract-%5E1.10.0-red?style=flat-square)](https://npmjs.com/package/web3-eth-contract/v/1.10.0)
        -   [![web3-utils](https://img.shields.io/badge/web3--utils-%5E1.10.0-red?style=flat-square)](https://npmjs.com/package/web3-utils/v/1.10.0)