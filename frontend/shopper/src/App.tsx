import { ChangeEvent, MouseEvent, useState } from 'react';
import './App.css';
import fileReader from './utils/fileReader';
import axios from 'axios';

interface ValidatedProduct {
  code?: number;
  name?: string;
  costPrice?: number;
  salesPrice?: number;
  newPrice?: string;
  message?: string;
}

function App() {
  const [json, setJson] = useState({});
  const [validatedData, setValidatedData] = useState() as any;
  const [isUpdateButtonDisabled, setIsUpdateButtonDisabled] = useState(true);
  const [isValidationButtonDisabled, setIsValidationButtonDisabled] = useState(true);

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    await fileReader(e, setJson);
    setIsValidationButtonDisabled(false);
  }

  async function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const response = await axios({
      method: 'post',
      url: `http://localhost:8000/validate`,
      data: json,
    });

    const data = response.data as Array<ValidatedProduct>;

    setValidatedData(data);

    if (data.every(({ message }) => !message)) {
      setIsUpdateButtonDisabled(false);
    }
  }

  async function handleUpdate() {
    await axios({
      method: 'post',
      url: `http://localhost:8000/update`,
      data: validatedData,
    });

    setJson({});
    setValidatedData();
    setIsUpdateButtonDisabled(true);
    setIsValidationButtonDisabled(true);
  }

  return (
    <>
      <header>

      </header>
      <main>
        <h1>Atualização de preços</h1>
        { !validatedData && (
          <form>
            <label htmlFor='csvFile'>
              <input
                type='file'
                id='csvFile'
                name='csv'
                accept='text/csv'
                onChange={ handleChange }
              />
            </label>
            <div className='button-div'>
              <button
                type='submit'
                onClick={ handleClick }
                disabled={ isValidationButtonDisabled }
              >
                Validar
              </button>
            </div>
          </form> )}
        { validatedData && (
          <>
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Preço Atual</th>
                  <th>Novo preço</th>
                  <th>Mensagem</th>
                </tr>
              </thead>
              { validatedData.map((data: ValidatedProduct) => (
                <tbody key={ data.code }>
                  <tr>
                    <td>{ data.code }</td>
                    <td>{ data.name }</td>
                    <td>{ data.salesPrice }</td>
                    <td>{ data.newPrice }</td>
                    <td>{ data.message }</td>
                  </tr>
              </tbody>
              ))}
            </table>
            <div className='button-div'>
              <button
                type='button'
                onClick={ () => setValidatedData() }
              >
                Enviar novo arquivo
              </button>
              <button
                type='button'
                onClick={ handleUpdate }
                disabled = { isUpdateButtonDisabled }
              >
                Atualizar
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default App;
