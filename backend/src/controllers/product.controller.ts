import { Request, Response } from 'express';
import ProductService from '../services/product.service';

export default class ProductController {
  public service: ProductService;

  constructor() {
    this.service = new ProductService();
    this.getAll = this.getAll.bind(this);
  }

  async getAll(_req: Request, res: Response) {
    const products = await this.service.getAll();
    res.status(200).json(products);
  }
}
