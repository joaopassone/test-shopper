import { Pool } from 'mysql2/promise';

export default class ProductModel {
  private connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  async getAllProductsCode(): Promise<number[]> {
    const [[{ codes }]] =  await this.connection.execute<any>(
      'SELECT JSON_ARRAYAGG(code) AS codes FROM shopperDB.products'
    );

    return codes;
  }
}
