import {
  Association,
  DataTypes,
  HasOneGetAssociationMixin,
  Model, Optional, Sequelize,
} from 'sequelize';
import { Product } from '@/models/product';
import { Order } from '@/models/order';

interface OrderProductAttributes {
  id: number;
  quantity: number;
}

interface OrderProductCreationAttributes extends Optional<OrderProductAttributes, 'id'> {}

export class OrderProduct extends Model<OrderProductAttributes, OrderProductCreationAttributes>
  implements OrderProductAttributes {
  // model attributes
  declare id: number;

  declare quantity: number;

  // timestamps attributes
  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  declare readonly deletedAt: Date;

  // association attributes
  declare readonly product?: Product;

  declare getProduct: HasOneGetAssociationMixin<Product>;

  declare static associations: {
    product: Association<OrderProduct, Product>;
  };

  static fn(sequelize: Sequelize) {
    OrderProduct.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: false,
        },
      },
      {
        sequelize,
        tableName: 'f1tickets_order_product',
        freezeTableName: true,
        paranoid: true,
      },
    );
  }

  static associate() {
    Order.hasMany(OrderProduct, {
      sourceKey: 'id',
      foreignKey: 'orderId',
      as: 'products',
    });

    OrderProduct.belongsTo(Product, {
      foreignKey: 'productId',
      as: 'product',
    });
  }
}

export default OrderProduct;
