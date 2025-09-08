import { dbConnection } from "../connection";
import { Optional, DataTypes, Model } from 'sequelize';
import { TaskLinkAttributes } from '../../application/interfaces/task-link.interfaces';
import { User } from './User';
import { Task } from './Task';

export type TaskLinkCreationAttributes = Optional<
    TaskLinkAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
>;

export class TaskLink extends Model<TaskLinkAttributes, TaskLinkCreationAttributes> implements TaskLinkAttributes {
    declare id: string;
    declare userId: string;
    declare taskId: string;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

TaskLink.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        userId: { type: DataTypes.UUID, allowNull: false },
        taskId: { type: DataTypes.UUID, allowNull: false },
    },
    {
        sequelize: dbConnection,
        modelName: 'TaskLink',
        tableName: 'task_links'
    }
);

TaskLink.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(TaskLink, { foreignKey: 'userId' });

TaskLink.belongsTo(Task, { foreignKey: 'taskId' });
Task.hasMany(TaskLink, { foreignKey: 'taskId' });