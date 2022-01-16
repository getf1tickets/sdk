import {
  DataTypes,
  Model, Optional, Sequelize,
} from 'sequelize';
import { UUID } from '@/interfaces';
import { enumToArray } from '@/utils';
import { Payment } from '@/models/payment';

export enum PaymentMethodType {
  PAYPAL = 'paypal',
}

interface PaymentMethodAttributes {
  id: UUID;
  transactionId: string;
  type: PaymentMethodType;
  status: string;
}

interface PaymentMethodCreationAttributes extends Optional<PaymentMethodAttributes, 'id'> {}

export class PaymentMethod extends Model<PaymentMethodAttributes, PaymentMethodCreationAttributes>
  implements PaymentMethodAttributes {
  // model attributes
  declare id: UUID;

  declare transactionId: string;

  declare type: PaymentMethodType;

  declare status: string;

  // timestamps attributes
  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  declare readonly deletedAt: Date;

  static fn(sequelize: Sequelize) {
    PaymentMethod.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        transactionId: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        type: {
          type: DataTypes.ENUM(...enumToArray(PaymentMethodType, true)),
          allowNull: false,
          unique: false,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: false,
        },
      },
      {
        sequelize,
        tableName: 'f1tickets_payment_method',
        freezeTableName: true,
        paranoid: true,
      },
    );
  }

  static associate() {
    Payment.hasOne(PaymentMethod, {
      sourceKey: 'id',
      foreignKey: 'paymentId',
      as: 'method',
    });

    PaymentMethod.belongsTo(Payment, {
      foreignKey: 'paymentId',
      as: 'payment',
    });
  }
}

export default PaymentMethod;
