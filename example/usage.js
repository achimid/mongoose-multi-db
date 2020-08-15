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

}

main()







