import { dbConnection } from "../connection";
import { Optional, DataTypes, Model } from 'sequelize';
import { TaskTagAttributes } from '../../application/interfaces/task-tag.interfaces';
import { Task } from './Task';
import { Tag } from './Tag';

export type TaskTagCreationAttributes = Optional<
    TaskTagAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
>;

export class TaskTag extends Model<TaskTagAttributes, TaskTagCreationAttributes> implements TaskTagAttributes {
    declare id: string;
    declare taskId: string;
    declare tagId: string;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

TaskTag.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        taskId: { type: DataTypes.UUID, allowNull: false },
        tagId: { type: DataTypes.UUID, allowNull: false },
    },
    {
        sequelize: dbConnection,
        modelName: 'TaskTag',
        tableName: 'task_tags'
    }
);

TaskTag.belongsTo(Task, { foreignKey: 'taskId' });
Task.hasMany(TaskTag, { foreignKey: 'taskId' });

TaskTag.belongsTo(Tag, { foreignKey: 'tagId' });
Tag.hasMany(TaskTag, { foreignKey: 'tagId' });