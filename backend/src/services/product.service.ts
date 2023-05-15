import ProductModel from '../models/product.model';
import connection from '../database/connection';
import CSV from '../interfaces/CSV';
import ValidatedProduct from '../interfaces/ValidatedProduct';

export default class ProductService {
  public model: ProductModel;

  constructor() {
    this.model = new ProductModel(connection);
  }

  private async getAllProductCodes() {
    return this.model.getAllProductCodes();
  }

  private async getProductByCode(code: number) {
    return this.model.getProductByCode(code);
  }

  private async getAllPackIds() {
    return this.model.getAllPackIds();
  }

  private async getPackProductsByPackId(id: number) {
    return this.model.getPackProductsByPackId(id);
  }

  // valida os valores do arquivo .csv
  async validateProducts(productEntries: CSV[]) {
    const fieldCheckedValues = productEntries.map((value) => this.hasAllFields(value));
    const codeCheckedValues = await Promise.all(
      fieldCheckedValues.map(async (value) => await this.doesCodeExist(value))
    );
    const priceCheckedValues = codeCheckedValues.map((value) => this.priceCheck(value));

    return this.getProductsByCode(priceCheckedValues);
  }

  // verifica que o arquivo csv tem todos os campos preenchidos
  private hasAllFields(productEntry: CSV): CSV {
    const { code, newPrice } = productEntry;

    if (!code) return ({ ...productEntry, message: 'O código do produto não foi fornecido' });
    if (!newPrice) return ({ ...productEntry, message: 'O novo preço não foi fornecido' });

    return productEntry;
  }

  // verifica se existe o código do produto
  private async doesCodeExist(productEntry: CSV): Promise<CSV> {
    const { code, message } = productEntry;
    const codesArray = await this.getAllProductCodes();

    if (message || codesArray.includes(+code)) return productEntry;
    
    return ({ ...productEntry, message: 'O código do produto não existe' });
  }

  // verifica se o preço é um valor numérico válido
  private priceCheck(productEntry: CSV): CSV {
    const { newPrice, message } = productEntry;
    const isPriceValid = newPrice && (/\d+\.\d\d/).test(newPrice);

    if (message || isPriceValid) return productEntry;

    return ({ ...productEntry, message: 'O preço não é um valor numérico válido' });
  }

  // busca os produtos validados no banco de dados
  private async getProductsByCode(productEntries: CSV[]) {
    const productsArray = await Promise.all(productEntries.map(async (productEntry) => {
      const { message, code, newPrice } = productEntry;
      if (message) return productEntry;
      const product = await this.getProductByCode(+code);
      return ({ ...product, newPrice });
    }));

    return this.validateScenario(productsArray);
  }

  // valida os requisitos da seção CENÁRIO
  private async validateScenario(productsArray: ValidatedProduct[]) {
    const financialCheckedProducts = productsArray.map((product) => {
      const { message } = product;
      if (!message) return this.isBellowCost(product);
      return product;
    });
    const marketingCheckedProducts = financialCheckedProducts.map((product) => {
      const { message } = product;
      if (!message) return this.readjustmentCheck(product);
      return product;
    });

    return this.packProductsUpdate(marketingCheckedProducts);
  }

  // verifica se o novo valor está abaixo do preço de custo
  private isBellowCost(product: ValidatedProduct) {
    const { newPrice, costPrice } = product;

    if (newPrice && costPrice && +newPrice < costPrice) {
      return ({ ...product, message: 'O novo valor está abaixo do valor de custo' });
    }

    return product;
  }

  // verifica se o reajuste está dentro dos 10%
  private readjustmentCheck(product: ValidatedProduct) {
    const { newPrice, salesPrice } = product;

    if (newPrice && salesPrice && +Math.abs(+newPrice - salesPrice).toFixed(2) > +(0.1 * salesPrice).toFixed(2)) {
      return ({ ...product, message: 'O novo valor ultrapassa a margem de 10% de ajuste' });
    }

    return product;
  }

  // calcula a diferença no reajuste dos preços
  private getPriceAdjustments(productsArray: ValidatedProduct[]) {
    return productsArray
      .filter((product) => !product.message)
      .map((product) => {
        const { code, newPrice, salesPrice } = product;
        return ({ code, priceDifference: (+newPrice! - salesPrice!).toFixed(2) });
      });
  }

  // verifica se há atualização do valor dos produtos do pack ao atualizar o valor do pack
  private async packProductsUpdate(productsArray: ValidatedProduct[]) {
    const packIds = await this.getAllPackIds();
    const priceAdjustments = this.getPriceAdjustments(productsArray);

    const packsValidation = await Promise.all(productsArray.map(async (product) => {
      const { message, code } = product;

      if (!message && packIds.includes(code!)) {
        const packProducts = await this.getPackProductsByPackId(code!);

        const packAdjustment = priceAdjustments
        .find((adjustment) => adjustment?.code === code)
        ?.priceDifference || 0;

        const packProductsAdjustments = packProducts.map((product) => {
          const adjustment = priceAdjustments.find((adjustment) => adjustment?.code === product.code);
          if (adjustment) return product.qty * +adjustment.priceDifference;
          return 0;
        });

        const totalPackProductsAdjustments = packProductsAdjustments.reduce((acc, adjustment) => {
          return acc + adjustment;
        }, 0);

        const isPackAdjustmentValid = (+packAdjustment - totalPackProductsAdjustments) === 0;
        if (!isPackAdjustmentValid) return ({ ...product, message: 'O valor do pack precisa ser igual a soma do valor dos seus produtos' });
      }
      
      return product; 
    }));
    
    return packsValidation;
  }
}
