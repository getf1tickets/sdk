import {
  DataTypes, Model, Optional, Sequelize,
} from 'sequelize';
import { UUID } from '@/interfaces';
import { User } from '@/models/user';

interface UserInfoAttributes {
  id: UUID;
  name: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface UserInfoCreationAttributes extends Optional<UserInfoAttributes, 'id' | 'state'> {}

export class UserInfo extends Model<UserInfoAttributes, UserInfoCreationAttributes>
  implements UserInfoAttributes {
  declare id: UUID;

  declare name: string;

  declare phoneNumber: string;

  declare address: string;

  declare city: string;

  declare state: string;

  declare zip: string;

  declare country: string;

  static fn(sequelize: Sequelize) {
    UserInfo.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phoneNumber: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        address: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        city: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        state: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        zip: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        country: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'f1tickets_user_info',
        freezeTableName: true,
      },
    );
  }

  static associate() {
    User.hasOne(UserInfo, {
      sourceKey: 'id',
      foreignKey: 'userId',
      as: 'info',
    });

    UserInfo.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }
}

export default UserInfo;
