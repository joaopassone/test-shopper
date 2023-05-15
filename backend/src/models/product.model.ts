import { Pool } from 'mysql2/promise';

export default class ProductModel {
  private connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  async getAll() {
    try {
      const [products] =  await this.connection.execute(
        'SELECT * FROM shopperDB.products'
      );
      
      return products;
    } catch(err: any) {
      return err.message;
    }
  }
}
