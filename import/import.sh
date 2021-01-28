#! /bin/sh
# Import statements for MongoDB

#missing headerline
mongoimport -d atelier_products -c features --type csv --file features.csv --fields "id,prod_id,feature,value"
#require cleaning
mongoimport -d atelier_products -c photos --type csv --file photos-clean.csv --headerline
#fine
mongoimport -d atelier_products -c skus --type csv --file skus.csv --headerline
#fine
mongoimport -d atelier_products -c related --type csv --file related.csv --headerline
#fine
mongoimport -d atelier_products -c styles --type csv --file styles.csv --headerline
#require cleaning
mongoimport -d atelier_products -c products --type csv --file products-clean.csv --headerline