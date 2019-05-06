const fs = require("fs-extra");
const path = require("path");
const Timer = require("just-a-timer");
const Logger = require("colorized-logger").ColorizedLogger.create("(mongli)", ["bold", "whiteBright"]);
const Mongo = require("mongodb");

class Mongli {
	static get DEFAULT_OPTIONS() {
		return {
			monglirc: "./.monglirc",
			migrations: "db/migrations",
			seeders: "db/seeders",
			config: "db/mongli-config.js",
			status: "db/mongli-status.json"
		};
	}

	static get DEFAULT_MONGLIRC_CONTENTS() {
		return fs.readFileSync(__dirname + "/defaults/.monglirc").toString();
	}

	static get DEFAULT_CONFIG_JS() {
		return fs.readFileSync(__dirname + "/defaults/mongli-config.js").toString();
	}

	static get DEFAULT_STATUS_JSON() {
		return JSON.stringify({
			migrationsExecuted: [],
			seedersExecuted: []
		});
	}

	static get DEFAULT_MIGRATION_JS() {
		return fs.readFileSync(__dirname + "/defaults/mongli-migration.js").toString();
	}

	static get DEFAULT_SEEDER_JS() {
		return fs.readFileSync(__dirname + "/defaults/mongli-seeder.js").toString();
	}

	static padLeft(nr, n, str) {
		return Array(n - String(nr).length + 1).join(str || "0") + nr;
	}

	constructor(options = {}) {
		this.options = Object.assign({}, this.constructor.DEFAULT_OPTIONS, options);
		this.log = Logger.log.bind(Logger);
	}

	static create(...args) {
		return new this(...args);
	}

	setup() {
		this.command = this.options._;
		if (this.command.length >= 2) {
			// > mongli generate ...
			if (this.command[0] === "generate") {
				if (this.command[1] === "project") {
					this._command = "generateProject";
					return this;
				} else if (this.command[1] === "migration") {
					this._command = "generateMigration";
					return this;
				} else if (this.command[1] === "seeder") {
					this._command = "generateSeeder";
					return this;
				}
			}
			// > mongli migrate ...
			if (this.command[0] === "migrate") {
				if (this.command[1] === "status") {
					this._command = "migrateStatus";
					return this;
				} else if (this.command[1] === "one") {
					this._command = "migrateOne";
					return this;
				} else if (this.command[1] === "all") {
					this._command = "migrateAll";
					return this;
				} else if (this.command[1] === "undo") {
					if (this.command[2] === "one") {
						this._command = "migrateUndoOne";
						return this;
					} else if (this.command[2] === "all") {
						this._command = "migrateUndoAll";
						return this;
					}
				}
			}
			// > mongli seed ...
			if (this.command[0] === "seed") {
				if (this.command[1] === "status") {
					this._command = "seedStatus";
					return this;
				} else if (this.command[1] === "one") {
					this._command = "seedOne";
					return this;
				} else if (this.command[1] === "all") {
					this._command = "seedAll";
					return this;
				} else if (this.command[1] === "undo") {
					if (this.command[2] === "one") {
						this._command = "seedUndoOne";
						return this;
					} else if (this.command[2] === "all") {
						this._command = "seedUndoAll";
						return this;
					}
				}
			}
		}
		throw new Error("Mongli: command not identified.", this.command);
	}

	generateProject() {
		const { basepath } = this.options;
		const monglirc = path.resolve(basepath, this.options.monglirc);
		const config = path.resolve(basepath, this.options.config);
		const status = path.resolve(basepath, this.options.status);
		const migrations = path.resolve(basepath, this.options.migrations);
		const seeders = path.resolve(basepath, this.options.seeders);
		this.log("[ ] Executing...");
		this.log("  ~$ mongli generate project");
		this.log("   - basepath: " + basepath);
		this.log("   - monglirc: " + monglirc);
		this.log("   - config:   " + config);
		this.log("   - status:   " + status);
		// Create .monglirc file:
		if (fs.existsSync(monglirc)) {
			this.log(`[ ] Found '.monglirc' at: ${monglirc}`);
		} else {
			fs.outputFileSync(monglirc, this.constructor.DEFAULT_MONGLIRC_CONTENTS, "utf8");
			this.log(`[#] Successfully created '.monglirc' at:`);
			this.log(`   - ${monglirc}`);
		}
		// Create mongli-config.js file:
		if (fs.existsSync(config)) {
			this.log(`[ ] Found 'mongli-config.js' at: ${config}`);
		} else {
			fs.outputFileSync(config, this.constructor.DEFAULT_CONFIG_JS, "utf8");
			this.log(`[#] Successfully created 'mongli-config.js' at:`);
			this.log(`   - ${config}`);
		}
		// Create mongli-status.json file:
		if (fs.existsSync(status)) {
			this.log(`[ ] Found 'mongli-status.json' at: ${status}`);
		} else {
			fs.outputFileSync(status, this.constructor.DEFAULT_STATUS_JSON, "utf8");
			this.log(`[#] Successfully created 'mongli-status.json' at:`);
			this.log(`   - ${status}`);
		}
		// Create migrations folder:
		if (fs.existsSync(migrations)) {
			this.log(`[ ] Found 'migrations' at: ${migrations}`);
		} else {
			fs.mkdirSync(migrations);
			this.log(`[#] Successfully created 'migrations' at:`);
			this.log(`   - ${migrations}`);
		}
		// Create seeders folder:
		if (fs.existsSync(seeders)) {
			this.log(`[ ] Found 'seeders' at: ${seeders}`);
		} else {
			fs.mkdirSync(seeders);
			this.log(`[#] Successfully created 'seeders' at:`);
			this.log(`   - ${seeders}`);
		}
		this.log("[#] Executed successfully.");
	}

	generateMigration() {
		const { monglirc, name } = this.options;
		this.log("[ ] Executing...");
		this.log("  ~$ mongli generate migration");
		this.log("   - name: " + (name ? name : "-"));
		this.log("   - monglirc: " + monglirc);
		const mongliSettings = require(path.resolve(monglirc));
		const migrations = mongliSettings["path-migrations"];
		const migrationDate = new Date();
		const migrationName = `${migrationDate.getFullYear()}.${this.constructor.padLeft(
			migrationDate.getMonth() + 1,
			2
		)}.${this.constructor.padLeft(migrationDate.getDate(), 2)}-${this.constructor.padLeft(
			migrationDate.getHours(),
			2
		)}.${this.constructor.padLeft(migrationDate.getMinutes(), 2)}.${this.constructor.padLeft(
			migrationDate.getSeconds(),
			2
		)}.${this.constructor.padLeft(migrationDate.getMilliseconds(), 3)}.${name ? name : "unnamed"}.js`;
		fs.outputFileSync(path.resolve(migrations, migrationName), this.constructor.DEFAULT_MIGRATION_JS, "utf8");
		this.log("[#] Successfully added new migration" + (name ? " (" + name + ")." : "."));
	}

	generateSeeder() {
		const { monglirc, name } = this.options;
		this.log("[ ] Executing...");
		this.log("  ~$ mongli generate seeder");
		this.log("   - name: " + (name ? name : "-"));
		this.log("   - monglirc: " + monglirc);
		const mongliSettings = require(path.resolve(monglirc));
		const seeders = mongliSettings["path-seeders"];
		const seederDate = new Date();
		const seederName = `${seederDate.getFullYear()}.${this.constructor.padLeft(
			seederDate.getMonth() + 1,
			2
		)}.${this.constructor.padLeft(seederDate.getDate(), 2)}-${this.constructor.padLeft(
			seederDate.getHours(),
			2
		)}.${this.constructor.padLeft(seederDate.getMinutes(), 2)}.${this.constructor.padLeft(
			seederDate.getSeconds(),
			2
		)}.${this.constructor.padLeft(seederDate.getMilliseconds(), 3)}.${name ? name : "unnamed"}.js`;
		fs.outputFileSync(path.resolve(seeders, seederName), this.constructor.DEFAULT_SEEDER_JS, "utf8");
		this.log("[#] Successfully added new seeder" + (name ? " (" + name + ")." : "."));
	}

	migrateOrSeedStatus(migrateOrSeed = "migrate") {
		const { monglirc } = this.options;
		const texts = {};
		texts.migrateOrSeed = migrateOrSeed === "migrate" ? "migrate" : "seed";
		texts.migrationsOrSeeders = migrateOrSeed === "migrate" ? "migrations" : "seeders";
		texts.MigrationsOrSeeders = migrateOrSeed === "migrate" ? "Migrations" : "Seeders";
		texts.MigrationOrSeeder = migrateOrSeed === "migrate" ? "Migration" : "Seeder";
		this.log("[ ] Executing...");
		this.log(`  ~$ mongli ${texts.migrateOrSeed} status`);
		this.log("   - monglirc: " + monglirc);
		const mongliSettings = require(path.resolve(monglirc));
		const migrationsPath = path.resolve(mongliSettings[`path-${texts.migrationsOrSeeders}`]);
		const migrations = fs.readdirSync(migrationsPath);
		const statusPath = mongliSettings["path-status"];
		const status = require(path.resolve(statusPath));
		this.log(`[ ] ${texts.MigrationsOrSeeders} done: ` + status[texts.migrationsOrSeeders + "Executed"].length);
		status[texts.migrationsOrSeeders + "Executed"].forEach((migrationStatus) => {
			const position = migrations.indexOf(migrationStatus.name);
			const migrationDate = `${migrationStatus.date.getFullYear()}.${this.constructor.padLeft(
				migrationStatus.date.getMonth() + 1,
				2
			)}.${this.constructor.padLeft(migrationStatus.date.getDate(), 2)}-${this.constructor.padLeft(
				migrationStatus.date.getHours(),
				2
			)}.${this.constructor.padLeft(migrationStatus.date.getMinutes(), 2)}.${this.constructor.padLeft(
				migrationStatus.date.getSeconds(),
				2
			)}.${this.constructor.padLeft(migrationStatus.date.getMilliseconds(), 3)}`;
			migrations.splice(position, 1);
			this.log(`   - ${texts.MigrationsOrSeeders}: ` + migrationStatus.name);
			this.log("     - Done at: " + migrationDate);
		});
		this.log(`[ ] ${texts.MigrationsOrSeeders} pending: ` + migrations.length);
		migrations.forEach((migration) => {
			this.log(`   - ${texts.MigrationOrSeeder}: ` + migration);
		});
		this.log("[#] Successfully executed.");
	}

	migrateStatus() {
		return this.migrateOrSeedStatus("migrate");
	}

	seedStatus() {
		return this.migrateOrSeedStatus("seed");
	}

	migrateOrSeedDoOrUndoOneOrAll(migrateOrSeed = "migrate", doOrUndo = "do", oneOrAll = "one") {
		const { monglirc } = this.options;
		const texts = {};
		texts.migrateOrSeed = migrateOrSeed === "migrate" ? "migrate" : "seed";
		texts.migrationOrSeeder = migrateOrSeed === "migrate" ? "migration" : "seeder";
		texts.migrationsOrSeeders = migrateOrSeed === "migrate" ? "migrations" : "seeders";
		texts.MigrationOrSeeder = migrateOrSeed === "migrate" ? "Migration" : "Seeder";
		texts.MigrationsOrSeeders = migrateOrSeed === "migrate" ? "Migrations" : "Seeders";
		this.log(`[ ] Executing...`);
		this.log(`  ~$ mongli ${migrateOrSeed} ${doOrUndo === "do" ? "" : "undo "}${oneOrAll}`);
		this.log(`   - monglirc: ${monglirc}`);
		const paths = require(path.resolve(monglirc));
		const config = require(path.resolve(paths["path-config"]))[process.env.NODE_ENV || "test"];
		const status = require(path.resolve(paths["path-status"]));
		const settings = { paths, status, config };
		const MongoClient = Mongo.MongoClient;
		const allMigrationOrSeeders = [];
		try {
			fs.readdirSync(settings.paths[`path-${texts.migrationsOrSeeders}`]).forEach((migrationOrSeeder) => allMigrationOrSeeders.push(migrationOrSeeder));
		} catch (error) {
			this.log(`[X] Error trying to read ${texts.migrationsOrSeeders} directory.`);
			this.log(error);
			throw error;
		}
		const pendingMigrationOrSeeders = [];
		allMigrationOrSeeders.forEach((migrationOrSeeder) => {
			if (settings.status[`${texts.migrationsOrSeeders}Executed`].map((migrationOrSeeder) => migrationOrSeeder.name).indexOf(migrationOrSeeder) === -1) {
				pendingMigrationOrSeeders.push(migrationOrSeeder);
			}
		});
		const migrationsOrSeedersToExecute = (function() {
			if(doOrUndo === "do") {
				if(oneOrAll === "one") {
					return pendingMigrationOrSeeders.splice(0, 1);
				} else {
					return pendingMigrationOrSeeders.splice(0, Infinity);
				}
			} else if(doOrUndo === "undo") {
				const migrationsOrSeedersToUndo = settings.status[`${texts.migrationsOrSeeders}Executed`].map((migrationOrSeeder) => migrationOrSeeder.name).reverse();
				if(oneOrAll === "one") {
					return migrationsOrSeedersToUndo.splice(0, 1);
				} else {
					return migrationsOrSeedersToUndo.splice(0, Infinity);
				}
			}
		})();
		if (migrationsOrSeedersToExecute.length === 0) {
			return this.log(`[ ] No ${texts.migrationsOrSeeders} to ${doOrUndo === "do" ? "commit" : "rollback"} found.`);
		}
		this.log(`[ ] Starting to ${doOrUndo === "do" ? "execute" : "rollback"} ${migrationsOrSeedersToExecute.length} ${texts.migrationsOrSeeders}:`);
		migrationsOrSeedersToExecute.forEach((curr, i) => {
			this.log(`   - ${i}: ${curr}`);
		})
		MongoClient.connect(...settings.config, (error, db) => {
			if (error) {
				this.log("[X] Error trying to connect to database.");
				this.log(error);
				throw error;
			}
			this.log("[#] Connected to database.");
			var indexMigrationOrSeeder = 0;
			const next = (previousMigrationOrSeederName = undefined, time, date) => {
				if (previousMigrationOrSeederName) {
					const currentStatus = require(path.resolve(paths["path-status"]));
					if(doOrUndo === "do") {
						currentStatus[`${texts.migrationsOrSeeders}Executed`].push({
							name: previousMigrationOrSeederName,
							time: time,
							date
						});
					} else if(doOrUndo === "undo") {
						currentStatus[`${texts.migrationsOrSeeders}Executed`].pop();
					}
					this.log(`[#] ${texts.MigrationOrSeeder} ${previousMigrationOrSeederName} executed in ${time} milliseconds.`);
					fs.writeFileSync(path.resolve(paths["path-status"]), JSON.stringify(currentStatus, null, 4), "utf8");
					this.log(`[#] ${texts.MigrationOrSeeder} ${doOrUndo === "do" ? "commit" : "rollback"} persisted.`);
				}
				if (!(indexMigrationOrSeeder in migrationsOrSeedersToExecute)) {
					this.log(`[ ] ${migrationsOrSeedersToExecute.length} pending ${texts.migrationsOrSeeders} were executed.`);
					db.close();
					this.log("[#] Disconnected from database.");
					this.log(`[#] Successfully executed.`);
					return;
				}
				const migrationOrSeederName = migrationsOrSeedersToExecute[indexMigrationOrSeeder++];
				const migrationOrSeederPath = path.resolve(settings.paths[`path-${texts.migrationsOrSeeders}`], migrationOrSeederName);
				const migrationOrSeeder = require(migrationOrSeederPath);
				const migrationOrSeederCall = migrationOrSeeder[doOrUndo === "do" ? "up" : "down"];
				const timer = new Timer();
				this.log(`[#] Starting ${texts.migrationOrSeeder} ${doOrUndo === "do" ? "commit" : "rollback" } of: ${migrationOrSeederName}.`);
				const migrationOrSeederOutput = migrationOrSeederCall(db);
				if (migrationOrSeederOutput instanceof Promise) {
					migrationOrSeederOutput
						.then(() => {
							return next(migrationOrSeederName, timer.time());
						})
						.catch((error) => {
							this.log(`[X] Error in ${texts.migrationOrSeeder} ${migrationOrSeederName}.`);
							this.log(error);
							throw error;
						});
				} else {
					return next(migrationOrSeederName, timer.time(), (new Date()).toString());
				}
			};
			return next();
		});
	}

	migrateOne() {
		return this.migrateOrSeedDoOrUndoOneOrAll("migrate", "do", "one");
	}

	migrateAll() {
		return this.migrateOrSeedDoOrUndoOneOrAll("migrate", "do", "all");
	}

	migrateUndoOne() {
		return this.migrateOrSeedDoOrUndoOneOrAll("migrate", "undo", "one");
	}

	migrateUndoAll() {
		return this.migrateOrSeedDoOrUndoOneOrAll("migrate", "undo", "all");
	}

	seedOne() {
		return this.migrateOrSeedDoOrUndoOneOrAll("seed", "do", "one");
	}

	seedAll() {
		return this.migrateOrSeedDoOrUndoOneOrAll("seed", "do", "all");
	}

	seedUndoOne() {
		return this.migrateOrSeedDoOrUndoOneOrAll("seed", "undo", "one");
	}

	seedUndoAll() {
		return this.migrateOrSeedDoOrUndoOneOrAll("seed", "undo", "all");
	}

	execute() {
		return this[this._command]();
	}
}

module.exports = Mongli;
