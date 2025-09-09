import { Sequelize} from "sequelize";
import { dbConnection } from "../connection";

// Import all models
import { User } from "./User";
import { Task } from "./Task";
import { Tag } from "./Tag";
import { TaskLink } from "./TaskLink";
import { TaskTag } from "./TaskTag";

const db: { [key: string]: any } = {
  User,
  Task,
  Tag,
  TaskLink,
  TaskTag,
  sequelize: dbConnection,
  Sequelize
};

// Set up associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName] && typeof db[modelName] === 'object' && db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;
