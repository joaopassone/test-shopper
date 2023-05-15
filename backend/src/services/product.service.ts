import ProductModel from '../models/product.model';
import connection from '../database/connection';

export default class ProductService {
  public model: ProductModel;

  constructor() {
    this.model = new ProductModel(connection);
  }

  async getAll() {
    return this.model.getAll();
  }
}
