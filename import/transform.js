
//mongo shell commands

db.products.explain("executionStats").aggregate([
    {$match: { id: 1 }},
]);

db.products.explain("allPlansExecution").aggregate([
    {$match: { id: 1 }},
]);

//Working query
db.products.aggregate([
    {$match: { id: 1 }},
    {$lookup: {
        from: "features",
        localField: "id",
        foreignField: "prod_id",
        as: "features"
    }},
    {$lookup: {
        from: "styles",
        localField: "id",
        foreignField: "productId",
        as: "styles"
    }},
    { $out: { db: "atelier_products_prod", coll: "test" } }
]);

//Potential
db.products.explain("allPlansExecution").aggregate([
    { $sort : { 'id' : 1 } },
    {$match: { id: 1 }},
    {$lookup: {
        from: "features",
        localField: "id",
        foreignField: "prod_id",
        as: "features"
    }},
    {$lookup: {
        from: "styles",
        localField: "id",
        foreignField: "productId",
        as: "styles"
    }},
    {$lookup: {
        from: "related",
        localField: "id",
        foreignField: "current_product_id",
        as: "related"
    }},
], {allowDiskUse: true});

//Create indexes
db.skus.createIndex({styleId:1});
//styles documents - FINAL
db.styles.aggregate([
    { $sort : { 'id' : 1 } },
    {$lookup: {
        from: "photos",
        localField: "id",
        foreignField: "styleId",
        as: "photos"
    }},
    {$lookup: {
        from: "skus",
        localField: "id",
        foreignField: "styleId",
        as: "skus"
    }},
    { $out: { db: "atelier_products_prod", coll: "temp_styles" } }
]);
//product documents into new database
db.products.aggregate([
    { $sort : { 'id' : 1 } },
    {$lookup: {
        from: "features",
        localField: "id",
        foreignField: "prod_id",
        as: "features"
    }},
    {$lookup: {
        from: "related",
        localField: "id",
        foreignField: "current_product_id",
        as: "related"
    }},
    { $out: { db: "atelier_products_prod", coll: "temp_products" } }
], {allowDiskUse: true});
//From new db aggregate prod and styles
db.temp_products.aggregate([
    { $sort : { 'id' : 1 } },
    {$lookup: {
        from: "temp_styles",
        localField: "id",
        foreignField: "productId",
        as: "styles"
    }},
    { $out: { db: "atelier_products_prod", coll: "products" } }
], {allowDiskUse: true});
