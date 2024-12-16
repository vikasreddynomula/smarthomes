package com.example;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

import com.mysql.cj.jdbc.AbandonedConnectionCleanupThread;

import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

import java.io.*;


import java.util.HashMap;
import java.util.List;

@WebListener
public class AppContextListener implements ServletContextListener {


    
    private EntityManagerFactory entityManagerFactory;
    
    @Override
    public void contextInitialized(ServletContextEvent sce) {
    	
    	entityManagerFactory = Persistence.createEntityManagerFactory("UserPU");
        sce.getServletContext().setAttribute("entityManagerFactory", entityManagerFactory);

        AjaxUtility.loadProducts(entityManagerFactory);
        
        //HashMap<String, Product> productStore = loadStore(PRODUCT_FILE_PATH);
        //sce.getServletContext().setAttribute("productStore", productStore);
        System.out.println("Product store loaded from file.");
        
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
    	
    	 EntityManagerFactory emFactory = (EntityManagerFactory) sce.getServletContext().getAttribute("entityManagerFactory");
         if (emFactory != null) {
             emFactory.close();
             System.out.println("EntityManagerFactory closed.");
         }
        // Save user store

        // Save product store
        //HashMap<String, Product> productStore = (HashMap<String, Product>) sce.getServletContext().getAttribute("productStore");
        //saveStore(productStore, PRODUCT_FILE_PATH);
        //System.out.println("Product store saved to file.");

        
        
        
        try {
            AbandonedConnectionCleanupThread.checkedShutdown();
        } catch (Exception e) {
            Thread.currentThread().interrupt(); // Restore interrupted status
        }
        
        
    }

}
