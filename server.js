const express = require('express');
const app = express();
const port = process.env.PORT || 3000
const { Product } = require('./db/index.js');

//Routing
app.get('/', (req, res) => {
    res.send('this is the root');
});

//LIST PRODUCTS
app.get('/products', (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let count = parseInt(req.query.count) || 5;
    Product.find().skip((page - 1) * count).limit(count)
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
        Product.find({ id: req.params.product_id })
            .then(products => products[0])
            .then(p => ({ 
                id: p.id, 
                name: p.name, 
                slogan: p.slogan, 
                description: p.description, 
                category: p.category, 
                default_price: p.default_price, 
                features: p.features.map(({feature, value}) => ({feature, value}))
            }))
            .then(product => res.send(product))
            .catch(err => res.status(404).send(err.message));
    }
})

//PRODUCT STYLES
app.get('/products/:product_id/styles', (req, res) => {
    if (!req.params.product_id) {
        res.sendStatus(400);
    } else {
        Product.find({ id: req.params.product_id })
            .then(products => products[0])
            .then(p => ({
                product_id: p.id,
                results: p.styles.map(s => ({
                    style_id: s.id,
                    name: s.name,
                    original_price: s.original_price,
                    sale_price: s.sale_price,
                    'default?': s.default_style,
                    photos: s.photos.map(p => p.toObject()).map(p => ({ thumbnail_url: p[" thumbnail_url"], url: p.url })),
                    skus: s.skus.reduce((obj, { id, quantity, size }) => {obj[id] = { quantity, size }; return obj;}, {})
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
        Product.find({ id: req.params.product_id })
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
