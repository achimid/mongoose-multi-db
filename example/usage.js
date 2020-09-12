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







