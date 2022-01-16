import {
  Association,
  DataTypes,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  Model, Optional, Sequelize,
} from 'sequelize';
import { UUID } from '@/interfaces/index';

import { ProductImage } from '@/models/product/image';
import { ProductTag } from '@/models/product/tag';

interface ProductAttributes {
  id: UUID;
  name: string;
  price: number;
  description: string;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {}

export class Product extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes {
  // model attributes
  declare id: UUID;

  declare name: string;

  declare price: number;

  declare description: string;

  // timestamps attributes
  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  declare readonly deletedAt: Date;

  // association attributes
  declare readonly images?: ProductImage[];

  declare getImages: HasManyGetAssociationsMixin<ProductImage>;

  declare createImage: HasManyCreateAssociationMixin<ProductImage>;

  declare readonly tags?: ProductTag[];

  declare getTags: HasManyGetAssociationsMixin<ProductTag>;

  declare createTag: HasManyCreateAssociationMixin<ProductTag>;

  declare static associations: {
    images: Association<Product, ProductImage>;
    tags: Association<Product, ProductTag>;
  };

  static fn(sequelize: Sequelize) {
    Product.init(
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
          unique: false,
        },
        price: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'f1tickets_product',
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

export * from '@/models/product/image';
export * from '@/models/product/tag';
export default {
  Product,
  ProductImage,
  ProductTag,
};
