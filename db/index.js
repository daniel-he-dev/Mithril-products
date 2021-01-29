const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect('mongodb://localhost:27017/atelier_products_prod', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('connected db')
});


//Define Objects
const Product = db.model('Product', new Schema({ 
    id: Number,
    name: String,
    slogan: String,
    description: String,
    category: String,
    default_price: String,
    features: [new Schema({
        id: Number,
        prod_id: Number,
        feature: String,
        value: String
    })],
    related: [new Schema({
        id: Number,
        current_product_id: Number,
        related_product_id: Number
    })],
    styles: [new Schema({
        id: Number,
        productId: Number,
        name: String,
        sale_price: Number,
        original_price: Number,
        default_style: Number,
        photos: [new Schema({
            id: Number,
            styleId: Number,
            url: String,
            thumbnail_url: String
        })],
        skus: [new Schema({
            id: Number,
            styleId: Number,
            size: String,
            quantity: Number
        })]
    })]
}), 'products')

//Check they are working
// Product.find({ id: 1 })
//     .then(res => console.log(res[0].styles[0].photos[1]));



module.exports = { Product };

//DECIDED TO USE MONGOOSE ODM INSTEAD OF MONGODB PACKAGE
// const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert');

// const url = 'mongodb://localhost:27017';

// const dbName = 'atelier_products';
// // const dbName = 'test';

// MongoClient.connect(url, (err, client) => {
//     assert.strictEqual(null, err);
//     console.log("Connected successfully to server");

//     const db = client.db(dbName);

//     client.close();
// })
