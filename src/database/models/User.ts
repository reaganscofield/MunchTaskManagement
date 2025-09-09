import { dbConnection } from "../connection";
import { Optional, DataTypes, Model } from 'sequelize';
import { UserAttributes } from '../../application/interfaces/user.interfaces';

export type UserCreationAttributes = Optional<
  UserAttributes,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    declare id: string;
    declare name: string;
    declare email: string;
    declare password: string;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

User.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        name: { type: DataTypes.STRING(255), allowNull: false },
        email: { type: DataTypes.STRING(255), allowNull: false },
        password: { type: DataTypes.STRING(255), allowNull: false },
    },
    {
        sequelize: dbConnection,
        modelName: 'User',
        tableName: 'users'
    }
);