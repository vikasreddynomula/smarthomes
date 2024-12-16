package com.example;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import org.json.JSONObject;

import com.google.gson.Gson;

import jakarta.persistence.EntityManagerFactory;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet(urlPatterns = {"/api/productlike", "/api/getmostliked"})
public class LikedProductServlet extends HttpServlet {
    
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        CorsUtils.addCorsHeaders(resp);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        try {
            // Read JSON payload from request body
            StringBuilder sb = new StringBuilder();
            BufferedReader reader = req.getReader();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            
            // Parse JSON object
            JSONObject jsonObject = new JSONObject(sb.toString());

            // Extract parameters from JSON
            Long userId = jsonObject.getLong("userId");
            Long productId = jsonObject.getLong("productId");
            Boolean isLiked = jsonObject.getBoolean("isLiked");

            // Create UserLikedProducts object
            UserLikedProducts likedProduct = new UserLikedProducts();
            likedProduct.setUserId(userId);
            likedProduct.setProductId(productId);
            likedProduct.setIsLiked(isLiked);

            EntityManagerFactory entityManagerFactory = (EntityManagerFactory) getServletContext().getAttribute("entityManagerFactory");
            boolean success = MySQLDataStoreUtilities.saveUserLikedProduct(likedProduct, entityManagerFactory);

            // Send response
            PrintWriter out = resp.getWriter();
            if (success) {
                resp.setStatus(HttpServletResponse.SC_CREATED);
                out.write("{\"message\": \"Product like saved successfully.\"}");
            } else {
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.write("{\"message\": \"Failed to save product like.\"}");
            }
        } catch (NumberFormatException e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"message\": \"Invalid number format for userId or productId.\"}");
        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"message\": \"Invalid request parameters.\"}");
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        CorsUtils.addCorsHeaders(resp);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        String path = req.getServletPath();

        if ("/api/productlike".equals(path)) {
            handleGetProductLikes(req, resp);
        } else if ("/api/getmostliked".equals(path)) {
            handleGetMostLikedProducts(req, resp);
        } else {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            resp.getWriter().write("{\"message\": \"Invalid endpoint.\"}");
        }
    }

    private void handleGetProductLikes(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Long userId = Long.parseLong(req.getParameter("userId"));
            EntityManagerFactory entityManagerFactory = (EntityManagerFactory) getServletContext().getAttribute("entityManagerFactory");
            List<UserLikedProducts> userLikedProducts = MySQLDataStoreUtilities.getProductLikes(userId, entityManagerFactory);

            Gson gson = new Gson();
            String jsonResponse = gson.toJson(userLikedProducts);

            resp.getWriter().write(jsonResponse);
        } catch (NumberFormatException e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"message\": \"Invalid userId format.\"}");
        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"message\": \"Failed to retrieve liked products.\"}");
        }
    }

    private void handleGetMostLikedProducts(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            EntityManagerFactory entityManagerFactory = (EntityManagerFactory) getServletContext().getAttribute("entityManagerFactory");
            List<ProductLikeCount> topLikedProducts = MySQLDataStoreUtilities.getTopFiveMostLikedProducts(entityManagerFactory);

            Gson gson = new Gson();
            String jsonResponse = gson.toJson(topLikedProducts);

            resp.getWriter().write(jsonResponse);
        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"message\": \"Failed to retrieve most liked products.\"}");
        }
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        CorsUtils.addCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }
}
