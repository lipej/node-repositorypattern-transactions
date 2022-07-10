import { Sequelize, DataTypes } from 'sequelize'

export const sequelize = new Sequelize('sqlite::memory:')

export const AccountModel = sequelize.define('Account', {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	balance: {
		type: DataTypes.NUMBER,
		defaultValue: 0,
	},
})
