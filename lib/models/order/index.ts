import {
  Association,
  DataTypes,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  Model, Optional, Sequelize,
} from 'sequelize';
import { UUID } from '@/interfaces/index';
import { enumToArray } from '@/utils';
import { User, UserAddress } from '@/models/user';
import OrderProduct from '@/models/order/product';

export enum OrderStatus {
  CREATED = 'created',
  WAITING_PAYMENT = 'waiting_payment',
  COMPLETED = 'completed',
}

interface OrderAttributes {
  id: UUID;
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id' | 'discount'> {}

export class Order extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes {
  // model attributes
  declare id: UUID;

  declare subtotal: number;

  declare discount: number;

  declare total: number;

  declare status: OrderStatus;

  // timestamps attributes
  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  declare readonly deletedAt: Date;

  // association attributes
  declare readonly products?: OrderProduct[];

  declare getProducts: HasManyGetAssociationsMixin<OrderProduct>;

  declare createProduct: HasManyCreateAssociationMixin<OrderProduct>;

  declare static associations: {
    products: Association<Order, OrderProduct>;
  };

  static fn(sequelize: Sequelize) {
    Order.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        subtotal: {
          type: DataTypes.FLOAT,
          allowNull: false,
          unique: false,
        },
        discount: {
          type: DataTypes.FLOAT,
          allowNull: true,
          unique: false,
        },
        total: {
          type: DataTypes.FLOAT,
          allowNull: false,
          unique: false,
        },
        status: {
          type: DataTypes.ENUM(...enumToArray(OrderStatus, true)),
          allowNull: false,
          unique: false,
        },
      },
      {
        sequelize,
        tableName: 'f1tickets_order',
        freezeTableName: true,
        paranoid: true,
      },
    );
  }

  static associate() {
    Order.hasOne(User, {
      sourceKey: 'id',
      foreignKey: 'userId',
      as: 'user',
    });

    Order.hasOne(UserAddress, {
      sourceKey: 'id',
      foreignKey: 'addressId',
      as: 'address',
    });
  }
}

export * from '@/models/order/product';
export default {
  Order,
  OrderProduct,
};
