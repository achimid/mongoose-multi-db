module.exports = {
    connections: [
        'mongodb+srv://notify-api:notify-api-987@cluster0-fe9ce.gcp.mongodb.net/log-01?retryWrites=true&w=majority', 
        'mongodb+srv://notify-api:notify-api-987@cluster0-fe9ce.gcp.mongodb.net/log-02?retryWrites=true&w=majority', 
        'mongodb+srv://notify-api:notify-api-987@cluster0-fe9ce.gcp.mongodb.net/log-03?retryWrites=true&w=majority', 
        'mongodb+srv://notify-api:notify-api-987@cluster0-fe9ce.gcp.mongodb.net/log-04?retryWrites=true&w=majority', 
        'mongodb+srv://notify-api:notify-api-987@cluster0-fe9ce.gcp.mongodb.net/log-05?retryWrites=true&w=majority', 
        'mongodb+srv://notify-api:notify-api-987@cluster0-fe9ce.gcp.mongodb.net/log-06?retryWrites=true&w=majority', 
        'mongodb+srv://notify-api:notify-api-987@cluster0-fe9ce.gcp.mongodb.net/log-07?retryWrites=true&w=majority'
    ],
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    },
    strategy: 'size',
    helthcheck: { interval: 2000 },
    log: true,
    autocreate: false
}