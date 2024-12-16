package com.example;

import java.io.IOException;
//import java.util.Collection;
//import java.util.HashMap;
import java.util.List;

import jakarta.persistence.EntityManagerFactory;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

@WebServlet("/api/users")
public class UserListServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    	CorsUtils.addCorsHeaders(resp);
    	resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        EntityManagerFactory entityManagerFactory = (EntityManagerFactory) getServletContext().getAttribute("entityManagerFactory");
        // Get the HashMap of users
        //HashMap<String, User> userStore = (HashMap<String, User>) getServletContext().getAttribute("userStore");

        // Convert userStore values to a collection
        //Collection<User> users = userStore.values();

        // Convert users collection to JSON using Gson
        Gson gson = new Gson();
        List<User> users=MySQLDataStoreUtilities.fetchAllUsers(entityManagerFactory);
        String jsonResponse = gson.toJson(users);

        // Send the JSON response
        resp.getWriter().write(jsonResponse);
    }
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    	CorsUtils.addCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }
}
