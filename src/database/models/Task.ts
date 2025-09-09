import { dbConnection } from "../connection";
import { Optional, DataTypes, Model } from 'sequelize';
import { TaskAttributes, TaskPriority, TaskStatus } from '../../application/interfaces/task.interfaces';
import { User } from './User';

export type TaskCreationAttributes = Optional<
  TaskAttributes,
  | 'id'
  | 'status'
  | 'priority'
  | 'description'
  | 'dueDate'
  | 'createdAt'
  | 'updatedAt'
>;

export class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  declare id: string;
  declare title: string;
  declare description: string | null;
  declare dueDate: Date | null;
  declare priority: TaskPriority;
  declare status: TaskStatus;
  declare createdByUserId: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Task.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    dueDate: { type: DataTypes.DATE, allowNull: true },
    priority: { type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'), defaultValue: 'MEDIUM' },
    status: { type: DataTypes.ENUM('OPEN', 'IN_PROGRESS', 'COMPLETED'), defaultValue: 'OPEN' },
    createdByUserId: { type: DataTypes.UUID, allowNull: false }
  },
  { 
    sequelize: dbConnection,
    modelName: 'Task', 
    tableName: 'tasks' 
  }
);

Task.belongsTo(User, { foreignKey: 'createdByUserId' });
User.hasMany(Task, { foreignKey: 'createdByUserId' });