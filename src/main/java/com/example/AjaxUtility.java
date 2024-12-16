package com.example;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.Element;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.Query;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

public class AjaxUtility {
    
    private static HashMap<Long, Product> productMap = new HashMap<>();
    private static final String XML_FILE_PATH = "/Users/vikasreddynomula/HW5_Nomula,VikasReddy/Back end/ServletAPI/src/main/java/com/example/ProductCatalog.xml";

    public static void loadProducts(EntityManagerFactory entityManagerFactory) {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        EntityTransaction transaction = entityManager.getTransaction();
        try {
            // Check if there are products already in the database
            Query query = entityManager.createQuery("SELECT COUNT(p) FROM Product p");
            long productCount = (long) query.getSingleResult();

            if (productCount > 0) {
                // If products are already in the database, load them into the HashMap
                System.out.println("Products already exist in the database. Skipping XML loading.");
                loadProductsIntoHashMap(entityManager);
                return;
            }

            // Step 2: Load products from XML if the table is empty
            File inputFile = new File(XML_FILE_PATH);
            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            
            // Prevent XML External Entity (XXE) attacks
            dbFactory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
            dbFactory.setFeature("http://xml.org/sax/features/external-general-entities", false);
            dbFactory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
            
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
            Document doc = dBuilder.parse(inputFile);
            doc.getDocumentElement().normalize();

            NodeList nodeList = doc.getElementsByTagName("DATA_RECORD");

            transaction.begin();

            for (int i = 0; i < nodeList.getLength(); i++) {
                Node node = nodeList.item(i);
                if (node.getNodeType() == Node.ELEMENT_NODE) {
                    Element element = (Element) node;

                    // Create a Product object and populate it
                    Product product = new Product();
                    product.setId(Long.parseLong(element.getElementsByTagName("id").item(0).getTextContent()));
                    product.setAccessories(element.getElementsByTagName("accessories").item(0).getTextContent());
                    product.setCategory(element.getElementsByTagName("category").item(0).getTextContent());
                    product.setDescription(element.getElementsByTagName("description").item(0).getTextContent());
                    product.setFileFormat(element.getElementsByTagName("fileFormat").item(0).getTextContent());
                    product.setManufacturerName(element.getElementsByTagName("manufacturerName").item(0).getTextContent());
                    product.setManufacturerRebate(Double.parseDouble(element.getElementsByTagName("manufacturerRebate").item(0).getTextContent()));
                    product.setName(element.getElementsByTagName("name").item(0).getTextContent());
                    product.setPrice(Double.parseDouble(element.getElementsByTagName("price").item(0).getTextContent()));
                    product.setRetailerDiscount(Double.parseDouble(element.getElementsByTagName("retailerDiscount").item(0).getTextContent()));
                    product.setQuantity(Integer.parseInt(element.getElementsByTagName("quantity").item(0).getTextContent()));

                    // Use merge instead of persist to avoid detached entity errors
                    entityManager.merge(product);

                    // Add the product to the HashMap
                    productMap.put(product.getId(), product);
                }
            }

            // Commit transaction
            transaction.commit();

        } catch (Exception e) {
            if (transaction.isActive()) {
                transaction.rollback();
            }
            e.printStackTrace();
        } finally {
            entityManager.close();
        }
    }

    public static void loadProductsToMap(List<Product> products) {
        for (Product product : products) {
            productMap.put(product.getId(), product);
        }
    }
    
    private static void loadProductsIntoHashMap(EntityManager entityManager) {
        try {
            List<Product> products = entityManager.createQuery("SELECT p FROM Product p", Product.class).getResultList();
            for (Product product : products) {
                productMap.put(product.getId(), product);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    public static List<Product> searchProducts(String query) {
        List<Product> matchedProducts = new ArrayList<>();
        for (Map.Entry<Long, Product> entry : productMap.entrySet()) {
            Product product = entry.getValue();
            if (product.getName().toLowerCase().startsWith(query.toLowerCase())) {
                matchedProducts.add(product);
            }
        }
        return matchedProducts;
    }

    // Method to get the product map
    public static Map<Long, Product> getProductMap() {
        return productMap;
    }
}
