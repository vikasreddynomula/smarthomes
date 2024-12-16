from flask import Flask, request, jsonify
import openai
from elasticsearch import Elasticsearch
from flask_cors import CORS
import pymysql

# Configure OpenAI
openai.api_key = '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'

# Setup Elasticsearch connection
es = Elasticsearch(
    "http://localhost:9200",
    basic_auth=('elastic', 'vikas1534')  # Replace 'vikas1534' with your actual Elasticsearch password
)

mysql_conn_params = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Legendary',
    'database': 'Enterprisewebapplication',
    'port': 3306
}

app = Flask(__name__)
CORS(app)

def generate_embedding(text):
    response = openai.Embedding.create(input=text, model="text-embedding-3-small")
    return response['data'][0]['embedding']

def get_product_details(product_id):
    try:
        mysql_conn = pymysql.connect(**mysql_conn_params)
        cursor = mysql_conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute("SELECT id, name, price, category, description FROM Products WHERE id = %s", (product_id,))
        product_details = cursor.fetchone()
        return product_details
    except Exception as e:
        print(f"Error fetching product details for product_id {product_id}: {e}")
        return None
    finally:
        cursor.close()
        mysql_conn.close()

@app.route('/search', methods=['GET'])
def find_similar_products():
    query_text = request.args.get('query')
    if not query_text:
        return jsonify({"error": "Query text is required"}), 400
    
    query_embedding = generate_embedding(query_text)
    search_body = {
        "query": {
            "script_score": {
                "query": {"match_all": {}},
                "script": {
                    "source": "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
                    "params": {"query_vector": query_embedding}
                }
            }
        }
    }
    try:
        results = es.search(index="products", body=search_body)
        product_details = [
            {
                "id": hit['_id'],
                "name": hit['_source'].get('name'),
                "price": hit['_source'].get('price'),
                "category": hit['_source'].get('category'),
                "description": hit['_source'].get('description')
            }
            for hit in results['hits']['hits']
        ]
        return jsonify(product_details)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/search_reviews', methods=['GET'])
def find_similar_reviews():
    query_text = request.args.get('query')
    if not query_text:
        return jsonify({"error": "Query text is required"}), 400
    
    query_embedding = generate_embedding(query_text)
    search_body = {
        "query": {
            "script_score": {
                "query": {"match_all": {}},
                "script": {
                    "source": "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
                    "params": {"query_vector": query_embedding}
                }
            }
        }
    }
    try:
        results = es.search(index="product_reviews", body=search_body)
        reviews_with_product_details = []

        for hit in results['hits']['hits']:
            review_id = hit['_id']
            product_id = hit['_source'].get('product_id')
            review_text = hit['_source'].get('review_text')

            # Fetch product details from MySQL using product_id
            product_details = get_product_details(product_id)

            # Add review details and product details to the response
            review_details = {
                "id": review_id,
                "review_text": review_text,
                "product_id": product_id
            }

            if product_details:
                review_details.update({
                    "name": product_details.get('name'),
                    "price": product_details.get('price'),
                    "category": product_details.get('category'),
                    "description": product_details.get('description')
                })

            reviews_with_product_details.append(review_details)

        return jsonify(reviews_with_product_details)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True,port=6001)
