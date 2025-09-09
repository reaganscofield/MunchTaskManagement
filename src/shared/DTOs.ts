import { IsEnum, IsNotEmpty, IsString, IsDateString, IsUUID, IsOptional, IsStrongPassword, IsEmail, IsArray, ValidateBy, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, Validate } from "class-validator";
import { TaskPriorities, TaskStatuses } from ".";
import { TaskPriority, TaskStatus } from "../application/interfaces/task.interfaces";

function IsUniqueArray(validationOptions?: ValidationOptions) {
  return ValidateBy(
    {
      name: "isUniqueArray",
      validator: {
        validate: (value: any) => {
          if (!Array.isArray(value)) return false;
          return value.length === new Set(value).size;
        },
        defaultMessage: () => "Array contains duplicate values"
      }
    },
    validationOptions
  );
}

@ValidatorConstraint({ name: 'isOptionalString', async: false })
export class IsOptionalStringConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (value === null || value === '' || value === undefined) {
      return false;
    }
    return typeof value === 'string' && value.trim().length > 0;
  }
  defaultMessage() {
    return 'Value must be a non-empty string or omitted entirely';
  }
}

@ValidatorConstraint({ name: 'isOptionalDateString', async: false })
export class IsOptionalDateStringConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (value === undefined) {
      return true;
    }
    if (value === null || value === '') {
      return false;
    }
    if (typeof value !== 'string') {
      return false;
    }
    const date = new Date(value);
    return !isNaN(date.getTime());
  }

  defaultMessage() {
    return 'Value must be a valid date string or omitted entirely';
  }
}

export function IsOptionalString(validationOptions?: ValidationOptions) {
  return Validate(IsOptionalStringConstraint, validationOptions);
}

export function IsOptionalDateString(validationOptions?: ValidationOptions) {
  return Validate(IsOptionalDateStringConstraint, validationOptions);
}

export class TaskDto {
  @IsString()
  @IsNotEmpty({ message: "Title is required" })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: "Description is required" })
  description!: string;

  @IsEnum(TaskPriorities, { message: "Invalid priority, must be LOW, MEDIUM, or HIGH" })
  @IsNotEmpty({ message: "Priority is required" })
  priority!: TaskPriority;

  @IsDateString({}, { message: "Due date is required and must be valid" })
  @IsNotEmpty({ message: "Due date is required" })
  dueDate!: string;
}

export class ValidateUUIDDto {
  @IsUUID(4, { message: "Invalid UUID" })
  @IsNotEmpty({ message: "UUID is required" })
  id!: string;
}

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatuses, { message: "Invalid status, must be OPEN, IN_PROGRESS, or COMPLETED" })
  status!: TaskStatus;
}

export class UpdateTaskDto {

  @IsOptionalString({ message: "Title must be a non-empty string or omitted entirely" })
  @IsOptional()
  title?: string;
  
  @IsOptionalString({ message: "Description must be a non-empty string or omitted entirely" })
  @IsOptional()
  description?: string;

  @IsOptionalDateString({ message: "Due date must be a valid date string or omitted entirely" })
  @IsOptional()
  dueDate?: string;

  @IsEnum(TaskPriorities, { message: "Invalid priority, must be LOW, MEDIUM, or HIGH" })
  @IsOptional()
  priority?: TaskPriority;
}

export class UserSignupDto {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  name!: string;

  @IsEmail({}, { message: "Invalid email" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string;

  @IsStrongPassword( 
    { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }, 
    { message: "Password must be at least 6 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol" }
  )
  @IsNotEmpty({ message: "Password is required" })
  password!: string;
}

export class UserSigninDto {
  @IsEmail({}, { message: "Invalid sign in credentials" })
  @IsNotEmpty({ message: "Invalid sign in credentials" })
  email!: string;

  @IsStrongPassword( 
    { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }, 
    { message: "Invalid sign in credentials" }
  )
  @IsNotEmpty({ message: "Invalid sign in credentials" })
  password!: string;
}

export class TaskLinkDto {
  @IsUUID(4, { message: "Invalid task ID" })
  @IsNotEmpty({ message: "Task ID is required" })
  taskId!: string;

  @IsUUID(4, { message: "Invalid user ID" })
  @IsNotEmpty({ message: "User ID is required" })
  userId!: string;
}

export class TaskTagDto {
  @IsUUID(4, { message: "Invalid task ID" })
  @IsNotEmpty({ message: "Task ID is required" })
  taskId!: string;

  @IsArray({ message: "Tag IDs must be an array" })
  @IsUUID(4, { message: "Invalid tag ID", each: true })
  @IsNotEmpty({ message: "Tag ID is required" })
  @IsUniqueArray({ message: "Tag IDs must be unique - no duplicates allowed" })
  tagIds!: string[];
}