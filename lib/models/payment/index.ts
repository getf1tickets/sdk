import {
  Association,
  DataTypes,
  HasOneCreateAssociationMixin,
  HasOneGetAssociationMixin,
  Model, Optional, Sequelize,
} from 'sequelize';
import { UUID } from '@/interfaces';
import { PaymentMethod } from '@/models/payment/method';
import { enumToArray } from '@/utils';

export enum PaymentStatus {
  CREATED = 'created',
  FAILED = 'failed',
  SUCCESS = 'success',
  CANCELLED = 'cancelled',
}

interface PaymentAttributes {
  id: UUID;
  amount: number;
  status: PaymentStatus;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id'> {
  orderId?: UUID;
}

export class Payment extends Model<PaymentAttributes, PaymentCreationAttributes>
  implements PaymentAttributes {
  // model attributes
  declare id: UUID;

  declare amount: number;

  declare status: PaymentStatus;

  // timestamps attributes
  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  declare readonly deletedAt: Date;

  // association attributes
  declare readonly method?: PaymentMethod;

  declare getMethod: HasOneGetAssociationMixin<PaymentMethod>;

  declare createMethod: HasOneCreateAssociationMixin<PaymentMethod>;

  declare static associations: {
    method: Association<Payment, PaymentMethod>;
  };

  static fn(sequelize: Sequelize) {
    Payment.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        amount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: false,
        },
        status: {
          type: DataTypes.ENUM(...enumToArray(PaymentStatus, true)),
          allowNull: false,
          unique: false,
        },
      },
      {
        sequelize,
        tableName: 'f1tickets_payment',
        freezeTableName: true,
        paranoid: true,
      },
    );
  }
}

export * from '@/models/payment/method';
export default {
  Payment,
  PaymentMethod,
};
