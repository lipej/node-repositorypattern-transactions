/* eslint no-console: ["error", { allow: ["error"] }] */
const Logger = {
	error: (name: string, message: string) => console.error(
		`\x1b[31m${name}: \x1b[0m\x1b[34m${message.replace(/(\r\n|\n|\r)/gm, '')}`,
	),
}

export default Logger
