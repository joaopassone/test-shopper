import * as express from 'express';
import ProductController from './controllers/product.controller';

export default class App {
  public app: express.Express;
  private productController: ProductController;

  constructor() {
    this.app = express();
    this.app.use(express.json());

    this.productController = new ProductController();

    this.app.get('/validate', this.productController.validateProducts);
  }

  public start(PORT: string | number): void {
    this.app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
  }
}
