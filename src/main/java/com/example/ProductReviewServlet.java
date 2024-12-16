package com.example;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;

@WebServlet("/api/addProductReview")
public class ProductReviewServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
	private MongoDBDataStoreUtilities mongoutilities = new MongoDBDataStoreUtilities();
    private Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	CorsUtils.addCorsHeaders(response);
    	response.setContentType("application/json");
    	response.setCharacterEncoding("UTF-8");
        // Read JSON data from the request body
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }

        // Convert JSON string to Review object
        ProductReview review = gson.fromJson(sb.toString(), ProductReview.class);

        // Save review to MongoDB
        boolean isSaved = mongoutilities.saveReview(review);
        if (isSaved) {
            response.getWriter().write("Review submitted successfully!");
        } else {
            response.getWriter().write("Failed to submit review.");
        }
    }
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response)throws ServletException, IOException {
    	CorsUtils.addCorsHeaders(response);
    	response.setContentType("application/json");
    	response.setCharacterEncoding("UTF-8");
    	
    	Long productId = Long.parseLong(request.getParameter("productId"));
    	
    	List<ProductReview> productReviews=mongoutilities.getReviewsByProductId(productId);
    	
    	Gson gson = new Gson();
    	response.getWriter().write(gson.toJson(productReviews));
    	
    	
    }
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    	CorsUtils.addCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }
}

