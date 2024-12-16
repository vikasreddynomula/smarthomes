package com.example;

import java.io.IOException;
//import java.util.HashMap;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;

import jakarta.persistence.EntityManagerFactory;

@WebServlet("/api/signup")
public class SignupServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    	CorsUtils.addCorsHeaders(resp);

        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        

        try {
            // Read JSON data from request body
            StringBuilder jsonData = new StringBuilder();
            String line;
            while ((line = req.getReader().readLine()) != null) {
                jsonData.append(line);
            }

            // Parse JSON data to User object using Gson
            Gson gson = new Gson();
            User user = gson.fromJson(jsonData.toString(), User.class);
            
            EntityManagerFactory entityManagerFactory = (EntityManagerFactory) getServletContext().getAttribute("entityManagerFactory");

            
            //HashMap<String, User> userStore = (HashMap<String, User>) getServletContext().getAttribute("userStore");
            //if (userStore == null) {
               // userStore = new HashMap<>();
                //getServletContext().setAttribute("userStore", userStore);
           // }


            if (user.getName() == null || user.getEmail() == null || user.getPhoneNumber() == null
                    || user.getFullAddress() == null || user.getPassword() == null) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400 Bad Request
                resp.getWriter().write("{\"error\": \"Invalid JSON format\"}");
                return;
            }


            if ( MySQLDataStoreUtilities.validateUser(user.getEmail(), user.getPassword(), entityManagerFactory)!=null) {

                resp.setStatus(HttpServletResponse.SC_CONFLICT);
                resp.getWriter().write("{\"message\": \"User already exists\"}");
            } else {
            	
                //userStore.put(user.getEmail(), user);
                
                MySQLDataStoreUtilities.saveUser(user, entityManagerFactory);
                
                resp.setStatus(HttpServletResponse.SC_OK); // 200 OK
                resp.getWriter().write("{\"message\": \"User registered successfully\"}");
            }
        } catch (JsonSyntaxException e) {
            // Handle JSON parsing error
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400 Bad Request
            resp.getWriter().write("{\"error\": \"Invalid JSON format\"}");
        }
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    	CorsUtils.addCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    // Utility method to add CORS headers

}
