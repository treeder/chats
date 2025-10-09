# package

Template for building a JavaScript package in minutes. 

## Features

- Just fill in the blanks and people can start using it.
- Automatically bumps version every commit to main

## Getting started

- Create a new repository using this as a template.
- Fill in index.js with exports.

Then when ready, people can just:

```sh
npm install yourorg/yourrepo
```

Or from CDN:

```js
import { yourExport } from 'https://cdn.jsdelivr.net/gh/yourorg/yourrepo@9/'
```
 
## Testing

Add more tests to [test/test.js], super easy. Uses [TestKit](https://github.com/treeder/testkit).

## Repository required settings

You'll have to update one repository setting to allow the bump action to work. 

Allow actions to read and write:

<img width="520" height="401" alt="image" src="https://github.com/user-attachments/assets/64337242-dbe9-47dc-a5b1-d7cc7c935260" />
