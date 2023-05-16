import { ChangeEvent } from 'react';

interface CSV {
  code: number;
  newPrice: string;
}

export default async function fileReader(
  e: ChangeEvent<HTMLInputElement>, setJson: (json: Array<CSV>) => void) {
  const csvFile = e.target.files;
  const reader = new FileReader();

  if (csvFile) reader.readAsText(csvFile[0]);

  reader.onload = () => {
    const text = reader.result as string;
    const products = text.split('\n');
    products.shift();

    const json: Array<{ code: number, newPrice: string }> = [];

    products.forEach((product) => {
      const data = product.split(',');
      json.push({ code: +data[0], newPrice: data[1] })
    });

    setJson(json);
  }
}
