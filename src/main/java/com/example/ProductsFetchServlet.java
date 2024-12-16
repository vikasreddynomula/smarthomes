package com.example;

import jakarta.persistence.EntityManagerFactory;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@WebServlet("/api/products")
public class ProductsFetchServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    	CorsUtils.addCorsHeaders(resp);
        //HashMap<String, Product> productStore = (HashMap<String, Product>) getServletContext().getAttribute("productStore");


        Map<Long, Object> responseMap = new HashMap<>();

        EntityManagerFactory entityManagerFactory = (EntityManagerFactory) getServletContext().getAttribute("entityManagerFactory");

        List<Product> products=MySQLDataStoreUtilities.fetchAllProducts(entityManagerFactory);
        for (Product product :	products) {



            Map<String, Object> productData = new HashMap<>();
            productData.put("name", product.getName());
            productData.put("price", product.getPrice());
            productData.put("description", product.getDescription());
            productData.put("category", product.getCategory());
            productData.put("id", product.getId().toString());
            String accessoriesString = product.getAccessories(); // Assume this returns the comma-separated string
            List<String> accessoriesList = (accessoriesString!=null && !accessoriesString.trim().isEmpty()) ? Arrays.asList(accessoriesString.split("\\s*,\\s*")): new ArrayList<>() ;// Split by comma and trim spaces
            
            productData.put("accessories", accessoriesList);
            productData.put("fileFormat", product.getFileFormat());
            productData.put("manufacturerRebate", product.getManufacturerRebate());
            productData.put("retailerDiscount", product.getRetailerDiscount());
            productData.put("finalPrice", (product.getPrice()-(product.getRetailerDiscount())));
            productData.put("manufacturerName", product.getManufacturerName());
            productData.put("inStock", product.getQuantity());
            
            responseMap.put(product.getId(), productData);
            
        }


        Gson gson = new Gson();
        String jsonResponse = gson.toJson(responseMap);

        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(jsonResponse);
    }
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    	CorsUtils.addCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }
}
