# Instruções para rodar a aplicação
  
- Faça o clone do projeto para a sua máquina;
- Instale as dependências do frontend na pasta ROOT_PATH/frontend/shopper com o comando npm install;
- Instale as dependências do backend na pasta ROOT_PATH/backend com o comando npm install;
- Na raíz do projeto, rode o comando npm start.

O comando npm start irá iniciar 2 containers docker com o serviço do mySQL na porta 3306 e do backend na porta 8000.
Não é necessária a configuração de variáveis de ambiente, pois já estão definidas dentro do container.

Dados do mySQL:

- user: root
- senha: root
- host: localhost:3306

O comando npm start também irá iniciar o frontend por padrão na porta 3000, mas se ela já estiver sendo utilizada, será sugerida uma nova porta para iniciar.

O container irá iniciar o banco de dados com um database chamado shopperDB. O mesmo deve ser populado no mySQL através da query do arquivo que se encontra em 
../backend/src/database/database.sql.

Depois disso é só acessar a página através do http://localhost:3000 (ou na porta em que ele foi iniciado).
