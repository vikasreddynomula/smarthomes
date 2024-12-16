package com.example;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.persistence.EntityManagerFactory;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.List;

@WebServlet("/api/salesReport")
public class SalesReportServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	CorsUtils.addCorsHeaders(response);
        EntityManagerFactory entityManagerFactory = (EntityManagerFactory) getServletContext().getAttribute("entityManagerFactory");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String reportType = request.getParameter("type");
        try {
            Gson gson = new Gson();
            String jsonResponse = "";

            switch (reportType) {
                case "productsSold":
                    List<ProductSales> productsSold = MySQLDataStoreUtilities.getAllProductsSold(entityManagerFactory);
                    jsonResponse = gson.toJson(productsSold);
                    break;
                case "dailySales":
                    List<DailySales> dailySales = MySQLDataStoreUtilities.getDailyTotalSales(entityManagerFactory);
                    jsonResponse = gson.toJson(dailySales);
                    break;
                default:
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    return;
            }
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
