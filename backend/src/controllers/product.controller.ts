import { Request, Response } from 'express';
import ProductService from '../services/product.service';

export default class ProductController {
  public service: ProductService;

  constructor() {
    this.service = new ProductService();
    this.validateProducts = this.validateProducts.bind(this);
  }

  async validateProducts(req: Request, res: Response) {
    const csvValues = req.body;
    const productsTable = await this.service.validateProducts(csvValues);
    res.status(200).json(productsTable);
  }
}
