require('newrelic');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3001
const { Product, Product_Simple } = require('./db/index.js');

app.use(cors());

//Routing
app.get('/', (req, res) => {
    res.send('this is the root');
});

//Loader.io Setup
app.get('/loaderio-7dac35a5eeb86bd42725aa98c7fa4592', (req, res) => {
    console.log('hello');
    res.sendFile(path.join(__dirname, '/loaderio-7dac35a5eeb86bd42725aa98c7fa4592.txt'), (err) => console.log(err));
});

//LIST PRODUCTS
app.get('/products', async(req, res) => {
    let page = parseInt(req.query.page) || 1;
    let count = parseInt(req.query.count) || 5;
    try {
        let products = await Product_Simple.find().skip((page - 1) * count).limit(count).lean();
        products.forEach(product => delete product._id);
        return res.send(products);
    } catch(err) {
        return res.status(500).send(err.message);
    }
})

//PRODUCT INFO Returns all product level info for a specified product id.
app.get('/products/:product_id', async(req, res) => {
    let id = req.params.product_id;
    if (!id) {
        return res.sendStatus(400);
    }
    
    try {
        let [product] = await Product.find({ id })
            .select('id name description slogan category default_price features')
            .lean();
        product.features = product.features.map(({feature, value}) => ({feature, value}));
        return res.send(product);
    } catch(err) {
        return res.status(404).send(err.message);
    }
})

//PRODUCT STYLES
app.get('/products/:product_id/styles', async(req, res) => {
    let id = req.params.product_id;
    if (!id) {
        return res.sendStatus(400);
    }

    try {
        let [product] = await Product.find({ id }).select('id styles').lean();
        let styles = {
            product_id: product.id,
            results: product.styles.map(s => ({
                style_id: s.id,
                name: s.name,
                original_price: s.original_price,
                sale_price: typeof s.sale_price === 'number' ? s.sale_price : 0,
                'default?': s.default_style,
                photos: s.photos.map(p => ({ thumbnail_url: p[" thumbnail_url"], url: p.url })),
                skus: s.skus.reduce((obj, { quantity, size }) => {obj[size] = quantity; return obj;}, {})
            }))
        }
        return res.send(styles);
    } catch (err) {
        return res.status(404).send(err.message);
    }
});

//RELATED PRODUCTS
app.get('/products/:product_id/related', async(req, res) => {
    let id = req.params.product_id;
    if (!id) {
        return res.sendStatus(400);
    }

    try {
        let [product] = await Product.find({ id }).select('related').lean();
        let related = product.related.reduce((arr, el) => [ ...arr, el.related_product_id ], []);
        return res.send(related.sort());
    } catch (err) {
        return res.status(404).send(err.message);
    }
})

//Port listener
app.listen(port, () => {
    console.log(`Express running on port ${port}`);
})
