FROM mongo:latest
COPY /aws_seed.archive /aws_seed.archive
CMD mongorestore --host mongodb --archive=/aws_seed.archive --db=atelier_products_prod