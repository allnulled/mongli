module.exports = {
	development: ["mongodb://localhost:27017/mongli_development", { useNewUrlParser: true }],
	test: ["mongodb://localhost:27017/mongli_test", { useNewUrlParser: true }],
	production: ["mongodb://localhost:27017/mongli_production", { useNewUrlParser: true }]
};