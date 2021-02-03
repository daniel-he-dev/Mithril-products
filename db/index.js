const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect(process.env.CONNECTIONSTRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB: ', process.env.CONNECTIONSTRING);
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

const Product_Simple = db.model('Product_Simple', new Schema({ 
    id: Number,
    name: String,
    slogan: String,
    description: String,
    category: String,
    default_price: String,
}), 'products_simple');

module.exports = { Product, Product_Simple };