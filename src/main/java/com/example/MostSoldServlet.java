package com.example;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import jakarta.persistence.EntityManagerFactory;
import java.io.IOException;
import java.util.List;
import com.google.gson.Gson;

@WebServlet("/api/getmostsoldproducts")
public class MostSoldServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	CorsUtils.addCorsHeaders(response);
    	response.setContentType("application/json");
    	response.setCharacterEncoding("UTF-8");
        EntityManagerFactory entityManagerFactory = (EntityManagerFactory) getServletContext().getAttribute("entityManagerFactory");

        try {
            List<MostSoldProducts> topProducts = MySQLDataStoreUtilities.getTopFiveMostSoldProducts(entityManagerFactory);
            
            Gson gson = new Gson();
            String jsonResponse = gson.toJson(topProducts);

            response.getWriter().write(jsonResponse);
            
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);

        }
    }
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        CorsUtils.addCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }
    
}

