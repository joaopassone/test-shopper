import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import Product from '../interfaces/Product';
import ValidatedProduct from '../interfaces/ValidatedProduct';

export default class ProductModel {
  private connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  // retorna um array com os códigos de produtos do banco de dados
  async getAllProductCodes(): Promise<number[]> {
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

  // retorna um array com todos os ids dos packs
  async getAllPackIds(): Promise<number[]> {
    const [[{ packIds }]] =  await this.connection.execute<RowDataPacket[]>(
      `SELECT JSON_ARRAYAGG(pack_id) AS packIds FROM
        (SELECT DISTINCT pack_id FROM shopperDB.packs) AS ids`
    );

    return packIds;
  }
  // retorna todos os produtos de um pack
  async getPackProductsByPackId(id: number) {
    const [packProducts] =  await this.connection.execute<RowDataPacket[]>(
      'SELECT product_id AS code, qty FROM shopperDB.packs WHERE pack_id = ?',
      [id],
    );

    return packProducts;
  }

  // retorna os packs que possuem determinado produto
  async getPacksFromProduct(code: number) {
    const [[{ packIds }]] =  await this.connection.execute<RowDataPacket[]>(
      `SELECT JSON_ARRAYAGG(pack_id) AS packIds FROM
        (SELECT DISTINCT pack_id FROM shopperDB.packs WHERE product_id = ?) AS ids`,
        [code],
    );

    return packIds as number[];
  }

  // atualiza o preço na tabela de produtos
  async updatePrice(product: ValidatedProduct) {
    const { code, newPrice } = product;
    const [{ affectedRows }] =  await this.connection.execute<ResultSetHeader>(
      `UPDATE shopperDB.products
        SET sales_price = ?
        WHERE code = ?`,
        [newPrice, code],
    );

    return affectedRows;
  }
}
