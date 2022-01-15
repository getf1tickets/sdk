import {
  DataTypes, Model, Optional, Sequelize,
} from 'sequelize';
import { enumToArray } from '@/utils';
import { UUID } from '@/interfaces';
import { User } from '@/models/user';

export enum UserAddressType {
  HOME = 'home',
  OFFICE = 'office',
}

interface UserAddressAttributes {
  id: UUID;
  type: UserAddressType;
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface UserAddressCreationAttributes extends Optional<UserAddressAttributes, 'id' | 'state'> {}

export class UserAddress extends Model<UserAddressAttributes, UserAddressCreationAttributes>
  implements UserAddressAttributes {
  declare id: UUID;

  declare type: UserAddressType;

  declare fullName: string;

  declare phoneNumber: string;

  declare address: string;

  declare city: string;

  declare state: string;

  declare zip: string;

  declare country: string;

  static fn(sequelize: Sequelize) {
    UserAddress.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        type: {
          type: DataTypes.ENUM(...enumToArray(UserAddressType, true)),
          allowNull: false,
        },
        fullName: {
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
        tableName: 'f1tickets_user_address',
        freezeTableName: true,
      },
    );
  }

  static associate() {
    User.hasMany(UserAddress, {
      sourceKey: 'id',
      foreignKey: 'userId',
      as: 'addresses',
    });

    UserAddress.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }
}

export default UserAddress;
