import { Pool, RowDataPacket } from 'mysql2/promise';
import Product from '../interfaces/Product';

export default class ProductModel {
  private connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  // retorna um array com os códigos de produtos do banco de dados
  async getAllProductsCode(): Promise<number[]> {
    const [[{ codes }]] =  await this.connection.execute<RowDataPacket[]>(
      'SELECT JSON_ARRAYAGG(code) AS codes FROM shopperDB.products'
    );

    return codes;
  }

  // busca um produto pelo seu código
  async getProductByCode(code: number): Promise<Product> {
    const [[product]] =  await this.connection.execute<RowDataPacket[]>(
      `SELECT code, name, cost_price AS costPrice, sales_price AS salesPrice
        FROM shopperDB.products
        WHERE code = ?`,
      [code],
    );

    return product as Product;
  }
}
