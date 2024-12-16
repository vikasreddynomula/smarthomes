### setting up Database:

-> open hw5sqlscripts and run first 2 commands "create and use"

-> After that proceed to run the backend

-> next run remaining scripts in the hw4sqlscripts.sql.


### Running Front End:

In the project directory navigate to folder frontend and open terminal, you can run:

### `npm start` to start the front end

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.


### Running Back End:

In the project directory navigate to folder Backend:

-> You can see the file named ProductCatalog.xml copy the file path and replace the file path in ajay utility.java with the one you have just copied and also change the path for UPLOAD_DIRECTORY in productservlet.java to your your system username.

-> Now do mvn clean install and copy the war file.

-> Now copy that war file and paste it in the apache tomcat/webapps folder

-> now open a terminal in apachetomcat/bin folder and run ./startup.sh



### Setting up logins:

-> now billavikas.reddy@gmail.com will be you manager account and vnomula@hawk.iit.edu will be your sales person account.

-> create another user using any mails will be considered as User.

### setting up elastic search:

-> pip install elastic search and also install docker in your local system.

-> run command 'docker pull docker.elastic.co/elasticsearch/elasticsearch:8.4.3'

-> next run following command 'docker run --name elasticsearch \
  -p 9200:9200 -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=true" \
  -e "ELASTIC_PASSWORD=vikas1534" \
  -e "xpack.security.http.ssl.enabled=false" \
  -v "/Users/vikasreddynomula/HW5_Nomula,VikasReddy/elasticsearch_data:/usr/share/elasticsearch/data" \
  docker.elastic.co/elasticsearch/elasticsearch:8.4.3'

-> now try hitting http://localhost:9200/ if it works then your elastic search is up and working

->  run following commands to create indexes for products and products reviews respectively:

curl -X PUT "http://localhost:9200/products" -H 'Content-Type: application/json' -u elastic:vikas1534 -d' 
{
  "mappings": {
    "properties": {
      "name": {
        "type": "text"
      },
      "price": {
        "type": "float"
      },
      "category": {
        "type": "keyword"
      },
      "description": {
        "type": "text"
      },
      "embedding": {
        "type": "dense_vector",
        "dims": 1536
      }
    }
  }
}'


curl -X PUT "http://localhost:9200/product_reviews" -H 'Content-Type: application/json' -u elastic:vikas1534 -d'
{              
  "mappings": {    
    "properties": {  
      "product_id": { 
        "type": "long"
      },              
      "review_text": { 
        "type": "text",
        "fields": {   
          "keyword": {        
            "type": "keyword", 
            "ignore_above": 256
          }
        }
      },            
      "embedding": {           
        "type": "dense_vector",
        "dims": 1536
      }
    }
  }
}'

### Running python scripts to generate 10 products with 5 reviews each and push all records in products and product reviews into elastic search:

->  Firstly, install packages pymysql,pymongo,openai and elasticsearch using either   brew or pip

-> change the api key if the present api key is expired or doesnt work

-> next run following command in hw5... directory python embedd.py

-> now try opening http://localhost:9200/products/_search if you see some records with their embeddings then push to elastic search is successful.


### Running Flask app to retreive semantically similar data for products and product reviews

-> change the api key if the present api key is expired or doesnt work

->  Run python pull.py which will run flask server app on port http://127.0.0.1:6001



### commands to delete indices:

curl -X DELETE "http://localhost:9200/products" -u elastic:vikas1534

curl -X DELETE "http://localhost:9200/product_reviews" -u elastic:vikas1534




