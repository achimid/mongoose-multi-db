const mongoose = require('mongoose')

const getConfigValidated = (config) => {

    if (!config) throw 'config can not be empty'
    if (!config.connections || !config.connections.length) throw 'config.connections can not be empty'
    
    if (!config.helthcheck || !config.helthcheck.interval) {
        config.helthcheck = { interval: 60000}
    }

    return config
}

const model = (collection, schema, config) => {
    
    const conf = getConfigValidated(config)

    const models = conf.connections
        .map(uri => uri.trim())
        .map(uri => mongoose.createConnection(uri, conf.options))    
        .map(conn => conn.model(collection, schema))
    
    let selectedModel = {size: 0, model: models[0]}
    
    const getSmallDB = (a,b) => a.size <= b.size ? -1 : 1

    const promiseStatus = (model) => (res) => model.collection.stats((err, r) => {
        try { res({model, size: r.size, ns: r.ns }) } catch (error) { res(selectedModel) }
    })

    const selectSmallDB = async () => {
        selectedModel = [...await Promise.all(models.map(model => new Promise(promiseStatus(model))))].sort(getSmallDB)[0]
        if (config.log) console.info(`[mongoose-multi-db] Main database switched [${selectedModel.ns}]`)
    }
    
    const filter = (list) => {
        const listFilter = (list || []).filter(v => v)
        return listFilter.length ? listFilter[0] : null
    }
    
    const join = (list) => Array.prototype.concat.apply([], list)
    
    const get = (data) => selectedModel.model(data)
    
    const raw = (callback) => Promise.all(models.map(callback))

    const one = (callback) => raw(callback).then(filter)
    
    const many = (callback) => raw(callback).then(join)

    setInterval(selectSmallDB, conf.helthcheck.interval)

    return {        
        get,
        one,
        many,
        raw,
    }
}

module.exports = {
    ...mongoose,
    model
}
