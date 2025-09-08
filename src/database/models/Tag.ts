import { dbConnection } from "../connection";
import { Optional, DataTypes, Model } from 'sequelize';
import { TagAttributes } from '../../application/interfaces/tag.interfaces';

export type TagCreationAttributes = Optional<
    TagAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
>;

export class Tag extends Model<TagAttributes, TagCreationAttributes> implements TagAttributes {
    declare id: string;
    declare name: string;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Tag.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        name: { type: DataTypes.STRING(255), allowNull: false },
    },
    {
        sequelize: dbConnection,
        modelName: 'Tag',
        tableName: 'tags'
    }
);