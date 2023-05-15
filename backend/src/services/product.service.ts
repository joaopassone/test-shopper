import ProductModel from '../models/product.model';
import connection from '../database/connection';
import CSV from '../interfaces/CSV';

export default class ProductService {
  public model: ProductModel;

  constructor() {
    this.model = new ProductModel(connection);
  }

  private async getAllProductsCode() {
    return this.model.getAllProductsCode();
  }

  async validateProducts(csvValues: CSV[]) {
    const fieldCheckedValues = csvValues.map((value) => this.fieldsCheck(value));
  }

  private fieldsCheck(csvValue: CSV) {
    const { code, price } = csvValue;

    if (!code) return ({ ...csvValue, message: "O código do produto não foi fornecido" });
    if (!price) return ({ ...csvValue, message: "O novo preço não foi fornecido" });

    return csvValue;
  }
}
