import {
  DataTypes,
  Model, Optional, Sequelize,
} from 'sequelize';
import { UUID } from '@/interfaces/index';
import { Product } from '@/models/product';

interface ProductTagAttributes {
  id: UUID;
  tag: string;
}

interface ProductTagCreationAttributes extends Optional<ProductTagAttributes, 'id'> {}

export class ProductTag extends Model<ProductTagAttributes, ProductTagCreationAttributes>
  implements ProductTagAttributes {
  // model attributes
  declare id: UUID;

  declare tag: string;

  // timestamps attributes
  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  declare readonly deletedAt: Date;

  static fn(sequelize: Sequelize) {
    ProductTag.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        tag: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: false,
        },
      },
      {
        sequelize,
        tableName: 'f1tickets_product_tag',
        freezeTableName: true,
        paranoid: true,
      },
    );
  }

  static associate() {
    Product.hasMany(ProductTag, {
      sourceKey: 'id',
      foreignKey: 'productId',
      as: 'tags',
    });
  }
}

export default ProductTag;
