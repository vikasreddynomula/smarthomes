package com.example;

import java.io.IOException;
//import java.util.HashMap;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import jakarta.persistence.EntityManagerFactory;
import java.util.logging.Logger;



@WebServlet("/api/login")
public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    
    private static final Logger logger = Logger.getLogger(LoginServlet.class.getName());


    

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    	CorsUtils.addCorsHeaders(resp);
    	resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        String email = req.getParameter("email");
        String password = req.getParameter("password");
        //HashMap<String, User> userStore = (HashMap<String, User>) getServletContext().getAttribute("userStore");


        if (email == null || password == null || email.isEmpty() || password.isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\": \"Email and password are required.\"}");
            return;
        }

        //User user = userStore.get(email);
        //if (user == null) {
        	//logger.info("no user found");
           // resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            //resp.getWriter().write("{\"error\": \"Invalid email or password.\"}");
        //} 
    else {

        	EntityManagerFactory entityManagerFactory = (EntityManagerFactory) getServletContext().getAttribute("entityManagerFactory");
        	logger.info("inside else block");
        	
        	User u=MySQLDataStoreUtilities.validateUser(email,password,entityManagerFactory);
        	
            if (u!=null) {
                resp.setStatus(HttpServletResponse.SC_OK);

                JsonObject jsonResponse = new JsonObject();
                jsonResponse.addProperty("name", u.getName());
                jsonResponse.addProperty("email", u.getEmail());
                jsonResponse.addProperty("user_id",u.getId());


                Gson gson = new Gson();
                resp.getWriter().write(gson.toJson(jsonResponse));
            } else {
            	logger.info("inside if-Else block");
                resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                resp.getWriter().write("{\"error\": \"Invalid email or password.\"}");
            }
        }
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    	CorsUtils.addCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }
}
