require('newrelic');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001
const { Product, Product_Simple } = require('./db/index.js');

app.use(cors());

//Routing
app.get('/', (req, res) => {
    res.send('this is the root');
});

//LIST PRODUCTS
app.get('/products', (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let count = parseInt(req.query.count) || 5;
    Product_Simple
        .find()
        .skip((page - 1) * count)
        .limit(count)
        .lean()
        .then(products => products
            .map(p => ({ 
                id: p.id, 
                name: p.name, 
                slogan: p.slogan, 
                description: p.description, 
                category: p.category, 
                default_price: p.default_price 
        })))
        .then(results => res.send(results))
        .catch(err => res.status(500).send(err.message));
})

//PRODUCT INFO Returns all product level info for a specified product id.
app.get('/products/:product_id', (req, res) => {
    if (!req.params.product_id) {
        res.sendStatus(400);
    } else {
        Product
            .find({ id: req.params.product_id })
            .select('id name description slogan category default_price features')
            .lean()
            .then(products => {
                let product = products[0];
                product.features = product.features.map(({feature, value}) => ({feature, value}));
                res.send(product);
            })
            .catch(err => res.status(404).send(err.message));
    }
})

//PRODUCT STYLES
app.get('/products/:product_id/styles', (req, res) => {
    if (!req.params.product_id) {
        res.sendStatus(400);
    } else {
        Product
            .find({ id: req.params.product_id })
            .select('id styles')
            .lean()
            .then(products => products[0])
            .then(p => ({
                product_id: p.id,
                results: p.styles.map(s => ({
                    style_id: s.id,
                    name: s.name,
                    original_price: s.original_price,
                    sale_price: typeof s.sale_price === 'number' ? s.sale_price : 0,
                    'default?': s.default_style,
                    photos: s.photos.map(p => ({ thumbnail_url: p[" thumbnail_url"], url: p.url })),
                    skus: s.skus.reduce((obj, { quantity, size }) => {obj[size] = quantity; return obj;}, {})
                }))
            }))
            .then(styles => res.send(styles))
            .catch(err => res.status(404).send(err.message));
    }
});

//RELATED PRODUCTS
app.get('/products/:product_id/related', (req, res) => {
    if (!req.params.product_id) {
        res.sendStatus(400);
    } else {
        Product
            .find({ id: req.params.product_id })
            .select('related')
            .lean()
            .then(products => products[0])
            .then(p => p.related.reduce((arr, doc) => {arr.push(doc.related_product_id); return arr;}, []))
            .then(related => res.send(related.sort()))
            .catch(err => res.status(404).send(err.message));
    }
})

//Port listener
app.listen(port, () => {
    console.log(`Express running on port ${port}`);
})
