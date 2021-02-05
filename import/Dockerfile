FROM mongo:latest
# COPY /aws_seed.archive /aws_seed.archive
COPY /products_aws.archive /products_aws.archive
CMD mongorestore --host mongodb --archive=/products_aws.archive --db=atelier_products_prod