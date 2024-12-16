package com.example;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.EntityTransaction;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import java.io.BufferedReader;
import java.io.IOException;
//import java.util.ArrayList;
//import java.util.HashMap;
import java.util.List;
//import java.util.Map;

@WebServlet("/api/cart/*")
public class CartServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    // Handle POST requests to add/update products
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if (req.getRequestURI().endsWith("/add")) {
            addToCart(req, resp);
        }
    }

    // Handle GET requests to fetch all products for a user
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if (req.getRequestURI().endsWith("/get")) {
            getCart(req, resp);
        }
    }
    
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if (req.getRequestURI().endsWith("/remove")) {
        	deleteFromCart(req, resp);
        }
    }

    private void addToCart(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    	CorsUtils.addCorsHeaders(resp);
        BufferedReader reader = req.getReader();
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }


        Gson gson = new Gson();
        Cart cartProduct = gson.fromJson(sb.toString(), Cart.class);


        String userId = req.getParameter("user");
        String productId = req.getParameter("product");

        double totalPrice = (cartProduct.getPrice() - cartProduct.getRetailerDiscount() )* cartProduct.getQuantity();
        
        cartProduct.setTotalPrice(totalPrice);
        cartProduct.setUser_id(Long.valueOf(userId));
        cartProduct.setProductId(Long.valueOf(productId));
        
        EntityManagerFactory entityManagerFactory = (EntityManagerFactory) getServletContext().getAttribute("entityManagerFactory");
        MySQLDataStoreUtilities.saveUserCart(cartProduct,entityManagerFactory);


    
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write("{\"message\": \"Product added/updated in cart successfully.\"}");
    }

    private void getCart(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    	CorsUtils.addCorsHeaders(resp);
        String userId = req.getParameter("user");

        EntityManagerFactory entityManagerFactory = (EntityManagerFactory) getServletContext().getAttribute("entityManagerFactory");
        
        List<Cart>userCarts=MySQLDataStoreUtilities.getCartByUser(Long.valueOf(userId),entityManagerFactory);
       
        

        // Convert userCart to JSON and send as response
        Gson gson = new Gson();
        String jsonResponse = gson.toJson(userCarts);

        // Send the cart data as JSON response
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(jsonResponse);
    }
    
    private void deleteFromCart(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        CorsUtils.addCorsHeaders(resp);

        // Get email and product name from the request parameters
        String cartId=req.getParameter("cart");

		/*
		 * if (userEmail == null || productName == null) {
		 * resp.setStatus(HttpServletResponse.SC_BAD_REQUEST); resp.getWriter().
		 * write("{\"error\": \"Email and product name are required.\"}"); return; }
		 * 
		 * // Get the cart store from the servlet context Map<String, List<Cart>>
		 * userStore = (Map<String, List<Cart>>)
		 * getServletContext().getAttribute("cartStore");
		 * 
		 * // Get the user's cart List<Cart> userCart = userStore.get(userEmail);
		 */
        if (cartId != null) {
        	 EntityManagerFactory entityManagerFactory = (EntityManagerFactory) getServletContext().getAttribute("entityManagerFactory");
             
            // Remove the product from the cart if it exists
            boolean removed = MySQLDataStoreUtilities.removeCartById(Long.valueOf(cartId),entityManagerFactory);

            if (removed) {
                // Update the cart store
                //userStore.put(userEmail, userCart);

                // Send success response
                resp.setContentType("application/json");
                resp.setCharacterEncoding("UTF-8");
                resp.getWriter().write("{\"message\": \"Product removed from cart successfully.\"}");
            } else {
                // Product not found in the cart
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                resp.getWriter().write("{\"error\": \"Product not found in the cart.\"}");
            }
        } else {
            // User's cart not found
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            resp.getWriter().write("{\"error\": \"Cart not found for the specified user.\"}");
        }
    }

    
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    	CorsUtils.addCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }
}
