import { Request, Response } from 'express';
import ProductService from '../services/product.service';
import ValidatedProduct from '../interfaces/ValidatedProduct';

export default class ProductController {
  public service: ProductService;

  constructor() {
    this.service = new ProductService();
    this.validateProducts = this.validateProducts.bind(this);
    this.updatePrice = this.updatePrice.bind(this);
  }

  async validateProducts(req: Request, res: Response) {
    const csvValues = req.body;
    const productsTable = await this.service.validateProducts(csvValues);
    res.status(200).json(productsTable);
  }

  async updatePrice(req: Request, res: Response) {
    const dataValues = req.body;

    dataValues.forEach(async (value: ValidatedProduct) => {
      await this.service.updatePrice(value);
    });
    
    res.status(201).json({ message: 'Preços atualizados' });
  }
}
