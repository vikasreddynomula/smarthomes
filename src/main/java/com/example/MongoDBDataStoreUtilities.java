package com.example;

import com.google.gson.Gson;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;

public class MongoDBDataStoreUtilities {

	
	private static final String COLLECTION_NAME = "reviews";
	private static final String CONNECTION_STRING = "mongodb://localhost:27017";
    private static final String DATABASE_NAME = "productReviewsDB";
    private static MongoClient mongoClient = null;

    // Singleton pattern to ensure a single connection
    public static MongoDatabase getDatabase() {
        if (mongoClient == null) {
            mongoClient = MongoClients.create(CONNECTION_STRING);
        }
        return mongoClient.getDatabase(DATABASE_NAME);
    }

    // Close the MongoDB client when the application is shutting down
    public static void close() {
        if (mongoClient != null) {
            mongoClient.close();
        }
    }

    public boolean saveReview(ProductReview review) {
        try {
            // Get the database and collection
            MongoDatabase database = getDatabase();
            MongoCollection<Document> collection = database.getCollection(COLLECTION_NAME);

            // Convert the Review object to a MongoDB Document and insert it
            Document reviewDoc = review.toDocument();
            collection.insertOne(reviewDoc);

            System.out.println("Review saved successfully!");
            return true;
        } catch (Exception e) {
            System.err.println("Error saving review: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
    
    public List<ProductReview> getReviewsByProductId(Long productId) {
        List<ProductReview> reviewsList = new ArrayList<>();
        try {
        	MongoDatabase database = getDatabase();
        	
            MongoCollection<Document> collection = database.getCollection("reviews");
            MongoCursor<Document> cursor = collection.find(Filters.eq("productId", productId)).iterator();
            Gson gson = new Gson();
            while (cursor.hasNext()) {
                Document doc = cursor.next();
                ProductReview review = gson.fromJson(doc.toJson(), ProductReview.class);
                reviewsList.add(review);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return reviewsList;
    }
}
