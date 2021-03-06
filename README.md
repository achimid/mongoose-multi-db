
## Sobre

Esta biblioteca tem como objetivo facilitar o gerenciamento de multiplas conexões de banco de dados utilizando a biblioteca Node JS ([Mongoose](https://github.com/Automattic/mongoose)), para mais informações sobre o mongoose acesse [GitHub](https://github.com/Automattic/mongoose) ou [NPM](https://www.npmjs.com/package/mongoose).

Criei essa biblioteca devido a uma limitação que havia em meus projetos pessoais que utilizavam um serviço de banco de dados [MongoDB](https://pt.wikipedia.org/wiki/MongoDB), sendo a versão grátis fornecido pela [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), com um limite de 512MB de espaço para a conta grátis.

Com a utilização do [mongoose-multi-db](https://github.com/achimid/mongoose-multi-db) como camada de abstração é possivel efetuar o balanceamento os dados em multiplos bancos de dados configurados em seu projeto. Isso inclui as principais operações disponibilidadas pela biblioteca mongoose.




## Pré-requisitos
Para utilizar essa lib você deve possuir o `mongoose` instalado em seu projeto:

```
npm install mongoose
```

## Instalação
Para importar em seu projeto basta fazer o download e incluir este arquivo [[mongoose-multi-db.js](https://raw.githubusercontent.com/achimid/mongoose-multi-db/master/mongoose-multi-db.js)] em seu projeto (ainda **não** disponivel no [NPM](https://www.npmjs.com/)):

![Imagem Exemplo 01](https://github.com/achimid/mongoose-multi-db/raw/master/img/01.png)


## Configuração

Para configurar a lib pe necessário informar um objeto de configuração, o campo `connection` deve ser informado uma lista de conexões de banco de dados. Este campo é **obrigatório**.

```javascript
{
    connections: [
        'mongodb://localhost:27017/db1', 
        'mongodb://localhost:27017/db2',        
    ]
}
```

Porem você pode adicionar mais informações na configuração, como por exemplo:
```javascript
{
    connections: [
        'mongodb://localhost:27017/db1', 
        'mongodb://localhost:27017/db2',        
    ],
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    },
    strategy: 'size',
    helthcheck: { interval: 2000 },
    log: true
}
```

A seguir vocẽ pode visualizar a descrição de cada campo da configuração.

| Campo  | Descrição |
| ------------- | ------------- |
| connections   | URIs de conexão com o banco de dados  |
| options       | Options utilizadas para criar a conexão utilizando o mongoose [[*Options](https://mongoosejs.com/docs/connections.html)]  |
| strategy      | Estratégia utilizada para selecionar qual BD será persistido [size][random]  |
| interval      | Intervale entre checagens do banco de dados [strategy=size]  |
| log           | Flag para habilitar o log  |



## Utilização

Para utilização da biblioteca são necessário 2 passos principais. 
* O primeiro passo é a criação do modelo [*(Mongoose Model)*](https://mongoosejs.com/docs/models.html)
* O segundo passo é a utilização das funções de *wrapper* (get, one, many, raw)


### 1º Passo - *Mongoose Model*

Para a utilização da biblioteca, você de importar o arquivo baixado anteriormente na criação do seu *Mongoose Model*. Exemplo:

```javascript
const mongoose = require('mongoose-multi-db')

const config = {
    connections: [
        'mongodb://localhost:27017/db1', 
        'mongodb://localhost:27017/db2',        
    ]
}

const schema = mongoose.Schema({    
    name: { type: String }, 
    age: { type: Number }, 
    phone: { type: String }, 
    email: { type: String }
}, { versionKey: false, timestamps: false })

module.exports = mongoose.model('person', schema, config)
```

Recomendo que você mantenha a configuração em um arquivo separado ou utilize variaveis de ambiente para uma melhor organização.

### 2º Passo - *Wrapper Functions*

As Wrapper Functions são funções que vão executar/extrair os valores dos vários banco de dados. São 4 funções: **get(), one(), many(), raw()**

Estas funções vão executar as operações no banco de dados selecionado *(strategy)* em forma de callback, agregar ou filtrar os resultados se necessário e entregar o resultado. A função de callback será executada em todos os banco de dados conectados.

#### get()

Esta função retorna um novo model, selecionado segundo a strategy. Quando um model for salvo, sele **não** será salvo em todos os bancos, apenas em um deles. A função *get()* retorna um modelo já conectado com o banco que será salvo. Veja o exemplo de utilização abaixo:

Utilizando **mongoose-multi-db**:
```javascript
Model.get({name: 'Jonny'}).save()
```

Utilizando **mongoose**:
```javascript
new Model({name: 'Jonny'}).save()
```

O retorno a função *get()* é um [*Mongoose Model*](https://mongoosejs.com/docs/models.html).


#### one()

Devo utilizar a função *one()* quando quero realizar uma operação que tenha apenas um retorno. Veja o exemplo de utilização abaixo, onde o objetivo é recuperar um documento utilizando a função `findById`:

Utilizando **mongoose-multi-db**:
```javascript
const person = await Model.one(Person => Person.findById('123'))
```

Utilizando **mongoose**:
```javascript
const person = await Model.findById('123')
```

O retorno da função *one()* é uma [Promisse](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Promise). Como argumento do callback você receberá um [*Mongoose Model*](https://mongoosejs.com/docs/models.html) de cada banco de dados, no exemplo: `Person`, e você deve realizar a operação desejada com este *Model*.

#### many()


Devo utilizar a função *many()* quando quero realizar uma operação que tenha uma lista de retorno. Veja o exemplo de utilização abaixo, onde o objetivo é recuperar um documento utilizando a função `find`:

Utilizando **mongoose-multi-db**:
```javascript
const personList = await Model.one(Person => Person.find())
```

Utilizando **mongoose**:
```javascript
const personList = await Model.find()
```

O retorno da função *many()* é uma lista de [Promisse](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Promise) resolvida. Como argumento do callback você receberá um [*Mongoose Model*](https://mongoosejs.com/docs/models.html) de cada banco de dados, no exemplo: `Person`, e você deve realizar a operação desejada com este *Model*.

#### raw()

Devo utilizar a função *many()* quando quero realizar uma operação que tenha uma lista de retorno. Veja o exemplo de utilização abaixo, onde o objetivo é recuperar um documento utilizando a função `find`:

Utilizando **mongoose-multi-db**:
```javascript
const personDeleted = Model.raw(Person => Person.deleteOne({_id: '123'}))
```

Utilizando **mongoose**:
```javascript
const personList = await Model.deleteOne({_id: '123'})
```

O retorno da função *many()* é uma lista de [Promisse](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Promise) resolvida, de todas as execuções dos comandos nos bancos de dados, podendo incluir items nullos.


### Mais exemplo de utilização

Você pode encontrar o exemplo completo na pasta [example](https://github.com/achimid/mongoose-multi-db/tree/master/example) deste repositorio

```javascript
const Model = require('./model')

const main = async () => {

    const data = {
        name: 'Jonny Boss', 
        age: 46, 
        phone: '(550) 456-6544', 
        email: 'jonnyboss@email.com'
    }

    const person = Model.get(data)

    const personSaved = await person.save()

    const personById = await Model.one(Person => Person.findById(person.id))
    
    const personFinded = await Model.many(Person => Person.find().limit(2).skip(1))

    const personUpdated = await Model.one(Person => Person.findByIdAndUpdate(person.id, { age: 47 }))

    const personDeleted = await Model.raw(Person => Person.deleteOne({_id: person.id}))



    const dataPenny = {
        name: 'Penny Doe', 
        age: 25, 
        phone: '(550) 789-1234', 
        email: 'pennydoe@email.com'
    }


    const personPennySaved = await Model.create(dataPenny)

    const personPennyInsertMany = await Model.insertMany([dataPenny])
    
    const personPennyFindById = await Model.findById(personPennySaved.id)

    const personPennyFindOne = await Model.findOne({ age: dataPenny.age})

    const personPennyFindByIdAndUpdate = await Model.findByIdAndUpdate(personPennySaved.id, { age: 26})

    const personPennyFindAll = await Model.findAll()

    const personPennyFind = await Model.find({ name: dataPenny.name })

    const personPennyFindAllLean = await Model.findAllLean({ name: dataPenny.name })

    const personPennyFindLean = await Model.findLean({ name: dataPenny.name })

    const personPennyDeleteOne = await Model.deleteOne({ name: dataPenny.name})

    const personPennyDeleteMany = await Model.deleteMany({ name: dataPenny.name})
    


}

main()
```


## Detalhes

* Como funciona a seleção de banco de dados
* Como funciona as operações one(), many(), raw()
* Debugger na função de callback