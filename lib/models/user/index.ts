import {
  DataTypes, Model, Optional, Sequelize,
} from 'sequelize';
import { UUID } from '@/interfaces';

interface UserAttributes {
  id: UUID;
  email: string;
  hashedPassword: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// eslint-disable-next-line import/prefer-default-export
export class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  declare id: UUID;

  declare email: string;

  declare hashedPassword: string;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  static fn(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        hashedPassword: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'f1tickets_user',
        freezeTableName: true,
      },
    );
  }
}

export default User;
