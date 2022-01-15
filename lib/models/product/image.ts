import {
  DataTypes,
  Model, Optional, Sequelize,
} from 'sequelize';
import { UUID } from '@/interfaces/index';
import { Product } from '@/models/product';

interface ProductImageAttributes {
  id: UUID;
  url: string;
}

interface ProductImageCreationAttributes extends Optional<ProductImageAttributes, 'id'> {}

export class ProductImage extends Model<ProductImageAttributes, ProductImageCreationAttributes>
  implements ProductImageAttributes {
  // model attributes
  declare id: UUID;

  declare url: string;

  // timestamps attributes
  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  declare readonly deletedAt: Date;

  static fn(sequelize: Sequelize) {
    ProductImage.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        url: {
          type: DataTypes.TEXT,
          allowNull: false,
          unique: false,
        },
      },
      {
        sequelize,
        tableName: 'f1tickets_product_image',
        freezeTableName: true,
        paranoid: true,
      },
    );
  }

  static associate() {
    Product.hasMany(ProductImage, {
      sourceKey: 'id',
      foreignKey: 'productId',
      as: 'images',
    });
  }
}

export default ProductImage;
