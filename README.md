# mongli

To manage your MongoDB migrations and seeders from your command line. Unopinionatedly.

## Installation

To install `mongli`, type from your terminal:

`~$ npm i -g mongli`

## Usage

The following are all the operations available:

### Initialize `mongli`

Convert your project in a `mongli` project with:

`~$ mongli generate project`

This will create the following files and folders in your current directory:

  - `.monglirc`
  - `db/migrations`
  - `db/seeders`
  - `db/mongli-config.js`
  - `db/mongli-status.js`

### Create a new migration

To create a new migration file, type:

`~$ mongli generate migration`

You will find a new migration file at `db/migrations/xxxx.xx.xx-xx.xx.xx.xxx.unnamed.js`. The `x`s represent the current date.

### Create a new seeder

To create a new seeder file, type:

`~$ mongli generate seeder`

You will find a new migration file at `db/migrations/xxxx.xx.xx-xx.xx.xx.xxx.unnamed.js`.

### Run migrations

To run only one migration, type:

`~$ mongli migrate one`

To run all the migrations, type:

`~$ mongli migrate all`

To undo only one migration, type:

`~$ mongli migrate undo one`

To undo all the migrations, type:

`~$ mongli migrate undo all`

### Run seeders

To run only one seeder, type:

`~$ mongli seed one`

To run all the seeders, type:

`~$ mongli seed all`

To undo only one seeder, type:

`~$ mongli seed undo one`

To undo all the seeders, type:

`~$ mongli seed undo all`

### See status

To check the current migrations status, type:

`~$ mongli migrate status`

To check the current seeders status, type:

`~$ mongli seed status`

### See help

To see the general help, type:

`~$ mongli`

All these commands will show additional help about each subcommand:

`~$ mongli generate`

`~$ mongli migrate`

`~$ mongli migrate undo`

`~$ mongli seed`

`~$ mongli seed undo`

## Commands and options reference

This is a list of all the commands available and their corresponding options:

`~$ mongli generate project`

  - `--basepath`: destination folder. By default, current working directory.

`~$ mongli generate migration`

  - `--name`: string with the name of the new migration. By default it is `unnamed`.

`~$ mongli generate seeder`
	
  - `--name`: string with the name of the new seeder. By default it is `unnamed`.
	
`~$ mongli migrate status`

`~$ mongli migrate one`

`~$ mongli migrate all`

`~$ mongli migrate undo one`

`~$ mongli migrate undo all`

`~$ mongli seed status`

`~$ mongli seed one`

`~$ mongli seed all`

`~$ mongli seed undo one`

`~$ mongli seed undo all`

All the commands accept the `--monglirc` option: string that specifies where to find the `.monglirc` file. By default it is the current working directory.

## Writing migrations and seeders

The migrations and seeders follow the same schema:

```js
module.exports = {
	up: async function(db) {
		
	},
	down: async function(db) {
		
	}
};
```

The `db` is a `MongoClient` instance with the connection already stablished.

When you `do` migrations or seeders, the `up` method is called.

When you `undo` migrations or seeders, the `down` method is called.

By default, with the `async`, the methods return a `Promise`, but it is optional.

## Changing default configurations

The tool will always:

- Look for the `.monglirc` file.

- From the `.monglirc`, it will know the `mongli-config.js` file.

- From the `.monglirc`, it will know the `mongli-status.json` file.

- From the `.monglirc`, it will know the `migrations` folder.

- From the `.monglirc`, it will know the `seeders` folder.

The 2 files that change the configurations are:

- `.monglirc`: this file tells the tool where the other important things are.

- `mongli-config.js`: this file tells the tool the arguments for the `MongoClient(...arguments)`.

By default, `.monglirc` will try to find things under a `db` folder. 

This is done in order to not interfere in your project.

The prefixes of `mongli-` in the config and status are also made for the same reason.

## Tests

To run tests, you need to start a mongo server through:

`~$ npm run test:server`

And then from another process:

`~$ npm run test`

# Read this file
