# insert_script.py
import pymysql
import pymongo
from pymongo import MongoClient
import openai
import math
from elasticsearch import Elasticsearch

# Configure OpenAI
openai.api_key = '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'

# Setup Elasticsearch connection
es = Elasticsearch(
    "http://localhost:9200",
    basic_auth=('elastic', 'vikas1534')
)

def generate_embedding(text):
    response = openai.Embedding.create(input=text, model="text-embedding-3-small")
    return response['data'][0]['embedding']

def clean_embedding(embedding):
    if not all(isinstance(x, float) for x in embedding):
        print("Invalid data type found in embedding")
    return [float(x) if isinstance(x, float) and not (math.isnan(x) or math.isinf(x)) else 0.0 for x in embedding]

def generate_product_records():
    prompt = (
        "Generate 10 SmartHome product records. Each record should contain following fields: Product Name, Category, Price(mention currency($) and followed by its value only), Description. "
        "Categories include: Smart Lightings, Smart Thermostats, Smart Speakers, Smart Doorlocks. Limit each description to 30 words max strictly."
    )
    response = openai.Completion.create(
        engine="gpt-3.5-turbo-instruct",
        prompt=prompt,
        max_tokens=600,
        temperature=0.7
    )

    return response.choices[0].text.strip().split('\n')

def insert_reviews_into_mongo(review_texts, product_id):
    mongo_client = MongoClient('mongodb://localhost:27017/')
    mongo_db = mongo_client['productReviewsDB']
    reviews_collection = mongo_db['reviews']
    for review_text in review_texts:
        try:
            review_document = {
                "reviewText": review_text,
                "productId": product_id,
                "reviewDate": "2024-11-21",
                "reviewRating": "3",
                "userName": "Vikas Reddy Nomula"
            }
            result = reviews_collection.insert_one(review_document)
            print(f"Inserted review with ID: {result.inserted_id}")
        except Exception as e:
            print(f"Error inserting review: {review_text}. Error: {e}")

def generate_product_reviews(product_name, product_id,category):
    review_keywords_map = {
    "Smart Doorbells": {
        "positive": ["convenient", "secure", "real-time", "reliable", "clear video"],
        "negative": ["glitchy", "slow alerts", "poor connection", "privacy concerns"]
    },
    "Smart Doorlocks": {
        "positive": ["secure", "convenient", "remote access", "easy install"],
        "negative": ["battery drain", "app issues", "unreliable", "lock jams"]
    },
    "Smart Speakers": {
        "positive": ["responsive", "good sound", "versatile", "user-friendly"],
        "negative": ["poor privacy", "limited commands", "connectivity issues"]
    },
    "Smart Lightings": {
        "positive": ["customizable", "energy-efficient", "remote control", "mood-enhancing"],
        "negative": ["app problems", "delay", "connectivity issues", "limited brightness"]
    },
    "Smart Thermostats": {
        "positive": ["energy-saving", "easy to use", "efficient", "remote control"],
        "negative": ["difficult setup", "temperature inaccuracy", "app bugs", "connectivity issues"]
    }
}
    
    if category in review_keywords_map:
        positive_keywords = ", ".join(review_keywords_map[category]["positive"])
        negative_keywords = ", ".join(review_keywords_map[category]["negative"])
    else:
        print(f"Category '{category}' not found.")
        return []

    # Construct the prompt for OpenAI to generate reviews
    prompt = (
        f"Generate exactly 5 customer reviews (positive or negative) for the SmartHome product: {product_name}. "
        f"Use the following positive keywords: {positive_keywords}. "
        f"Use the following negative keywords: {negative_keywords}. "
        f"Give your response as reviewText only dont meantion if its positive or negative, and each review should be separated by /n. "
        f"Limit each reviewText to 10 words max strictly."
    )
    response = openai.Completion.create(
        engine="gpt-3.5-turbo-instruct",
        prompt=prompt,
        max_tokens=1000,
        temperature=0.7
    )
    reviews = parse_generated_reviews(response.choices[0].text.strip().split('\n'))
    insert_reviews_into_mongo(reviews, product_id)
    return reviews

def insert_product_into_mysql(category, name, description, price):
    try:
        mysql_conn = pymysql.connect(host='localhost', user='root', password='Legendary', database='Enterprisewebapplication', port=3306)
        cursor = mysql_conn.cursor()
        insert_query = "INSERT INTO Enterprisewebapplication.Products (category, description, name, price, manufacturerRebate, retailerDiscount) VALUES (%s, %s, %s, %s, %s, %s)"
        cursor.execute(insert_query, (category, description, name, price, 0, 0))
        mysql_conn.commit()
        product_id = cursor.lastrowid
        generate_product_reviews(name, product_id,category)
    except Exception as e:
        print(f"Error inserting product {name}: {e}")
    finally:
        cursor.close()
        mysql_conn.close()

def parse_and_insert_products(product_records):
    print(product_records)
    current_product = {}
    for record in product_records:
        if not record.strip():
            continue

        if len(record) != 0 and record[0].isdigit() and (record[1] == '.' or record[1].isdigit() and record[2] == '.'):
            record = record.split('. ', 1)[1].strip()

        try:
            if record.startswith('Product Name: '):
                if 'name' in current_product and 'category' in current_product and 'description' in current_product and 'price' in current_product:
                    insert_product_into_mysql(
                        current_product['category'],
                        current_product['name'],
                        current_product['description'],
                        current_product['price']
                    )
                current_product = {}
                current_product['name'] = record.split('Product Name: ')[1].strip()
            elif record.startswith('Category: '):
                current_product['category'] = record.split('Category: ')[1].strip()
            elif record.startswith('Description: '):
                current_product['description'] = record.split('Description: ')[1].strip()
            elif record.startswith('Price: $'):
                try:
                    current_product['price'] = float(record.split('Price: $')[1].strip())
                except ValueError:
                    print(f"Error parsing price for record: {record}")
        except Exception as e:
            print(f"Error parsing record: {record}. Error: {e}")

    if 'name' in current_product and 'category' in current_product and 'description' in current_product and 'price' in current_product:
        insert_product_into_mysql(
            current_product['category'],
            current_product['name'],
            current_product['description'],
            current_product['price']
        )

def parse_generated_reviews(review_records):
    reviews = []
    for record in review_records:
        try:
            if record[0].isdigit() and record[1] == '.':
                review_text = record.split('. ', 1)[1].strip()
                review_text = review_text.replace("/n", "").strip()
                cleaned_review = review_text.replace('"', '')
                reviews.append(cleaned_review)
            else:
                print(f"Record format not recognized: {record}")
        except Exception as e:
            print(f"Error parsing record: {record}. Error: {e}")
    return reviews

def store_in_elasticsearch(product_id, product_name, product_price, category, description, embedding):
    if embedding:
        cleaned_embedding = clean_embedding(embedding)
        document = {
            "name": product_name,
            "price": product_price,
            "category": category,
            "description": description,
            "embedding": cleaned_embedding
        }
        try:
            es.index(index="products", id=product_id, body=document)
        except Exception as e:
            print(f"Error indexing product {product_id}: {e}")
    else:
        print(f"No embedding available for product {product_id}")


def push_to_elasticsearch(index_name, doc_id, document):
    try:
        response = es.index(index=index_name, id=doc_id, body=document)
        print(f"Successfully indexed document {doc_id} in index {index_name}")
    except Exception as e:
        print(f"Error indexing document {doc_id}: {e}")


def store_review_in_elasticsearch(review_id, product_id, review_text, embedding):
    if embedding:
        cleaned_embedding = clean_embedding(embedding)
        document = {
            "product_id": product_id,
            "review_text": review_text,
            "embedding": cleaned_embedding
        }
        push_to_elasticsearch("product_reviews", review_id, document)
    else:
        print(f"No embedding available for review {review_id}")

# Generate product records and insert them
product_records = generate_product_records()
parse_and_insert_products(product_records)

# Connect to MySQL to retrieve products for embeddings
mysql_conn = pymysql.connect(host='localhost', user='root', password='Legendary', database='Enterprisewebapplication', port=3306)
cursor = mysql_conn.cursor()
cursor.execute("SELECT id, name, price, category, description FROM Enterprisewebapplication.products")
products = cursor.fetchall()
cursor.close()
mysql_conn.close()

# Generate and store embeddings for products in Elasticsearch
for product_id, product_name, product_price, category, description in products:
    embedding = generate_embedding(description)
    store_in_elasticsearch(product_id, product_name, product_price, category, description, embedding)

# Connect to MongoDB and retrieve reviews for embeddings
mongo_client = MongoClient('mongodb://localhost:27017/')
mongo_db = mongo_client['productReviewsDB']
reviews_collection = mongo_db['reviews']

# Generate and store embeddings for reviews in Elasticsearch
for review in reviews_collection.find():
    review_text = review.get('reviewText', '').strip()
    product_id = review.get('productId')
    if review_text and product_id:
        embedding = generate_embedding(review_text)
        try:
            reviews_collection.update_one({'_id': review['_id']}, {'$set': {'embedding': embedding}})
            store_review_in_elasticsearch(review['_id'], product_id, review_text, embedding)
        except Exception as e:
            print(f"Error processing review {review['_id']}: {e}")
    else:
        print(f"Missing or empty 'reviewText' or 'productId' for review {review['_id']}")
