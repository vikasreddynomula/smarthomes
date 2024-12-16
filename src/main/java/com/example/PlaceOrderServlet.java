package com.example;

import com.google.gson.Gson;

import jakarta.persistence.EntityManagerFactory;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@WebServlet("/api/order/*")
public class PlaceOrderServlet extends HttpServlet {
    private static final Logger logger = Logger.getLogger(PlaceOrderServlet.class.getName());
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if (req.getRequestURI().endsWith("/place")) {
        	PlaceOrder(req, resp);
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if (req.getRequestURI().endsWith("/get")) {
            getUserOrders(req, resp);
        }
        if(req.getRequestURI().endsWith("/fetchAll")) {
        	getAllOrders(req,resp);
        }
    }
    


	@Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if (req.getRequestURI().endsWith("/cancel")) {
            cancelOrder(req, resp);
        }
    }
    
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if (req.getRequestURI().endsWith("/updateStatus")) {
            updateOrderStatus(req, resp);
        }
    }

    private void cancelOrder(HttpServletRequest req, HttpServletResponse resp) {
    	
    	CorsUtils.addCorsHeaders(resp);
    	resp.setContentType("application/json");
    	
    	
    	String orderId =req.getParameter("orderId");
    	
    	EntityManagerFactory entityManagerFactory = (EntityManagerFactory) getServletContext().getAttribute("entityManagerFactory");
        
        
    	
    	boolean removed = MySQLDataStoreUtilities.deleteOrder(Long.parseLong(orderId),entityManagerFactory);

        if (removed) {
            try {
                resp.getWriter().write("{\"message\": \"Order successfully canceled.\"}");
                resp.setStatus(HttpServletResponse.SC_OK); // 200 OK
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
           
            try {
                resp.getWriter().write("{\"error\": \"Order not found or already canceled.\"}");
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND); // 404 Not Found
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    	
    	
		
		
	}
    
    
    private void getAllOrders(HttpServletRequest req, HttpServletResponse resp) {

        CorsUtils.addCorsHeaders(resp);
        resp.setContentType("application/json");


        EntityManagerFactory entityManagerFactory = (EntityManagerFactory) getServletContext().getAttribute("entityManagerFactory");
        
        
    	
        List<Order> allOrders= MySQLDataStoreUtilities.getAllOrders(entityManagerFactory);



        Gson gson = new Gson();
        String allOrdersJson = gson.toJson(allOrders);


        try {
            resp.getWriter().write(allOrdersJson);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


	private void getUserOrders(HttpServletRequest req, HttpServletResponse resp) {
    	CorsUtils.addCorsHeaders(resp);
    	resp.setContentType("application/json");
    	
    	String userId = req.getParameter("user");
    	
    	EntityManagerFactory entityManagerFactory = (EntityManagerFactory) getServletContext().getAttribute("entityManagerFactory");
        
        
    	
    	List<Order> userOrders = MySQLDataStoreUtilities.getOrdersByUserId(Long.parseLong(userId),entityManagerFactory);

    	
    	 Gson gson = new Gson();
    	 
    	
        String orderJson = gson.toJson(userOrders);
        
        logger.info(orderJson);
        
        System.out.println(orderJson);
        try {
			resp.getWriter().write(orderJson);
		} catch (IOException e) {
			
			e.printStackTrace();
		}
    	
        
		
	}
	
	 public static LocalDate calculateCancelDate(LocalDate deliveryDate, int businessDays) {
	        LocalDate cancelDate = deliveryDate;
	        int daysSubtracted = 0;

	        while (daysSubtracted < businessDays) {
	            cancelDate = cancelDate.minusDays(1);
	            if (cancelDate.getDayOfWeek() != DayOfWeek.SATURDAY && cancelDate.getDayOfWeek() != DayOfWeek.SUNDAY) {
	                daysSubtracted++;
	            }
	        }
	        return cancelDate;
	 }
	private void PlaceOrder(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        CorsUtils.addCorsHeaders(response);
        response.setContentType("application/json");
        

        BufferedReader reader = request.getReader();
        String requestBody = reader.lines().collect(Collectors.joining());

        System.out.println("Raw JSON Body: " + requestBody);

        
        Gson gson = new Gson();
        Order order = gson.fromJson(requestBody, Order.class);

        
        LocalDate deliveryDate = LocalDate.now().plusWeeks(2);
        LocalDate purchaseDate = LocalDate.now();
        
        String formattedDeliveryDate = deliveryDate.format(DateTimeFormatter.ISO_DATE);

        
        LocalDate cancelDate = calculateCancelDate(deliveryDate, 5);
        String formattedCancelDate = cancelDate.format(DateTimeFormatter.ISO_DATE);
        String formattedPurchaseDate= purchaseDate.format(DateTimeFormatter.ISO_DATE);

        
        String orderNumber = UUID.randomUUID().toString().replace("-", "");

        
        order.setDeliveryDate(formattedDeliveryDate);   
        order.setCancelAvailableTill(formattedCancelDate);
        order.setPurchaseDate(formattedPurchaseDate);
        order.setOrderNumber(orderNumber);
        order.setOrderStatus("Placed");
        //order.setEmail(userEmail);
        List<OrderItems> orderItems=order.getOrderItems();

        EntityManagerFactory entityManagerFactory = (EntityManagerFactory) getServletContext().getAttribute("entityManagerFactory");
        
        MySQLDataStoreUtilities.saveOrder(order,entityManagerFactory);
        MySQLDataStoreUtilities.updateProductQuantity(orderItems,entityManagerFactory,"sub");
        
        for(OrderItems items:orderItems) {
        	MySQLDataStoreUtilities.removeCartById(items.getCart_id(), entityManagerFactory);
        }
		/*
		 * Map<String, List<Order>>orderStore = (HashMap<String, List<Order>>)
		 * getServletContext().getAttribute("orderStore");
		 * 
		 * Map<String, List<Cart>>cartStore = (HashMap<String, List<Cart>>)
		 * getServletContext().getAttribute("cartStore");
		 * 
		 * 
		 * if(orderStore.containsKey(userEmail)) { List<Order>
		 * userOrders=orderStore.get(userEmail); userOrders.add(order); } else {
		 * orderStore.computeIfAbsent(userEmail, k -> new ArrayList<>()).add(order); }
		 * 
		 * cartStore.remove(userEmail);
		 */
        


        System.out.println("Parsed Order: " + order);

        String orderJson = gson.toJson(order);
        response.getWriter().write(orderJson);
    }
	
	private void updateOrderStatus(HttpServletRequest req, HttpServletResponse resp) {

	    CorsUtils.addCorsHeaders(resp);
	    resp.setContentType("application/json");


	    String orderId = req.getParameter("orderId");
	    String newOrderStatus = req.getParameter("orderStatus");
	    
	    EntityManagerFactory entityManagerFactory = (EntityManagerFactory) getServletContext().getAttribute("entityManagerFactory");
        
        MySQLDataStoreUtilities.updateOrderStatus(Long.parseLong(orderId),newOrderStatus,entityManagerFactory);
	    
	    

	    try {
	        resp.getWriter().write("Update successful");
	    } catch (IOException e) {
	        e.printStackTrace();
	    }
	}

	
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        CorsUtils.addCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }
}
