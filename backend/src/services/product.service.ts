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
    const codeCheckedValues = await Promise.all(
      fieldCheckedValues.map(async (value) => await this.codeCheck(value))
    );
    const priceCheckedValues = codeCheckedValues.map((value) => this.priceCheck(value));

    return priceCheckedValues;
  }

  private fieldsCheck(csvValue: CSV) {
    const { code, price } = csvValue;

    if (!code) return ({ ...csvValue, message: 'O código do produto não foi fornecido' });
    if (!price) return ({ ...csvValue, message: 'O novo preço não foi fornecido' });

    return csvValue;
  }

  private async codeCheck(csvValue: CSV) {
    const { code, message } = csvValue;
    const codesArray = await this.getAllProductsCode();

    if (message || codesArray.includes(code)) return csvValue;
    else return ({ ...csvValue, message: 'O código do produto não existe' });
  }

  private priceCheck(csvValue: CSV) {
    const { price, message } = csvValue;
    const isPriceValid = price && (/\d\d\.\d\d/).test(price.toString());

    if (message || isPriceValid) return csvValue;
    else return ({ ...csvValue, message: 'O preço não é um valor numérico válido' });
  }
}
