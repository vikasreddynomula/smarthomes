package com.example;


import java.io.BufferedReader;
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import jakarta.persistence.EntityManagerFactory;
import java.util.logging.Logger;



@WebServlet("/api/addTicket")
public class TicketServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    
    private static final Logger logger = Logger.getLogger(LoginServlet.class.getName());


    

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        CorsUtils.addCorsHeaders(resp);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        // Parse JSON request body directly into a Ticket object
        BufferedReader reader = req.getReader();
        Ticket ticket = new Gson().fromJson(reader, Ticket.class);
        	EntityManagerFactory entityManagerFactory = (EntityManagerFactory) getServletContext().getAttribute("entityManagerFactory");
        	logger.info("inside else block");
        	
        	Boolean isInserted=MySQLDataStoreUtilities.createTicket(ticket,entityManagerFactory);
        	
            if (isInserted) {
                resp.setStatus(HttpServletResponse.SC_OK);

                
            } else {
            	logger.info("inside if-Else block");
                resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                resp.getWriter().write("{\"error\": \"Invalid email or password.\"}");
            }
        }
    
    @Override
    protected void doGet(HttpServletRequest req ,HttpServletResponse resp) throws ServletException, IOException {
    	CorsUtils.addCorsHeaders(resp);
    	resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        
        String ticketNumber = req.getParameter("ticketNumber");
        if (ticketNumber == null || ticketNumber.isEmpty()) {
            logger.warning("Ticket number is null or empty.");
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\": \"Ticket number is required.\"}");
            return;
        }

       EntityManagerFactory entityManagerFactory = (EntityManagerFactory) getServletContext().getAttribute("entityManagerFactory");
       
       Ticket ticket = MySQLDataStoreUtilities.getTicketDetails(Long.parseLong(ticketNumber),entityManagerFactory);
       
       if(ticket!=null) {
       resp.setStatus(HttpServletResponse.SC_OK);
       Gson gson = new Gson();
       resp.getWriter().write(gson.toJson(ticket));
       }
       else {
       	logger.info("inside if-Else block");
           resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
           resp.getWriter().write("{\"error\": \"Invalid email or password.\"}");
       }
       
    }


    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    	CorsUtils.addCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }
}

