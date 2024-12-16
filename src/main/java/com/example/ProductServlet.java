package com.example;

import jakarta.persistence.EntityManagerFactory;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;

//import com.google.gson.Gson;

import java.io.File;
import java.io.IOException;
//import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Collection;
//import java.util.HashMap;
import java.util.List;

@WebServlet("/api/product/*")
@MultipartConfig(fileSizeThreshold = 1024 * 1024, // 1MB
maxFileSize = 1024 * 1024 * 5, // 5MB
maxRequestSize = 1024 * 1024 * 10)
public class ProductServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final String UPLOAD_DIRECTORY = "/Users/vikasreddynomula/HW5_Nomula,VikasReddy/Front End/public/product_images";

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if (req.getRequestURI().endsWith("/add")) {
            addProduct(req, resp);
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // Update Product
        if (req.getRequestURI().endsWith("/update")) {
            updateProduct(req, resp);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // Delete Product
        if (req.getRequestURI().endsWith("/delete")) {
            deleteProduct(req, resp);
        }
    }

    private void addProduct(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
        // Extract form fields
    	CorsUtils.addCorsHeaders(resp);
        String name = req.getParameter("name");
        String price = req.getParameter("price");
        String description = req.getParameter("description");
        String category = req.getParameter("category");
        String[] accessories = req.getParameterValues("accessories");
        String rD=req.getParameter("retailerDiscount");
        String mR=req.getParameter("manufacturerRebate");
        String mN=req.getParameter("manufacturerName");
        int quantity= Integer.parseInt(req.getParameter("quantity"));
        
        
        //String[] accessoryImages = req.getParameterValues("accessoryImages");

        // Handle file upload
        Part filePart = req.getPart("image"); 
        String fileFormat = getFileExtension(filePart.getContentType()); 

        // Create Product object
        List<String> accessoriesList = accessories!=null? Arrays.asList(accessories) : null;
        
        String accessoriesString= (accessoriesList != null && !accessoriesList.isEmpty())? String.join(", ", accessories): "";
        
        Double retailerDiscount = rD!=null?(Double.valueOf(rD) / 100.0)*Double.parseDouble(price) : 0.0 ;
        
        Double	manufacturerRebate = mR!=null?Double.valueOf(mR): 0.0;
        
        
        
        
        Product product = new Product(name, Double.parseDouble(price), description, category, accessoriesString,manufacturerRebate,retailerDiscount,quantity);
        product.setManufacturerName(mN);
        product.setFileFormat(fileFormat);
        // Access product store from ServletContext
       // HashMap<String, Product> productStore = (HashMap<String, Product>) getServletContext().getAttribute("productStore");

        // Add product to the store
        //productStore.put(name, product);
        EntityManagerFactory entityManagerFactory = (EntityManagerFactory) getServletContext().getAttribute("entityManagerFactory");
        
        Long productId=MySQLDataStoreUtilities.saveProduct(product,entityManagerFactory);
        
        String filePath = UPLOAD_DIRECTORY + File.separator + productId.toString() + fileFormat;

        filePart.write(filePath);
        
        Collection<Part> accessoryImages = req.getParts();
        int count=1;
        if(accessoryImages!=null) {
        	for (Part part : accessoryImages) {
        		if (part.getName().equals("accessoryimages")) {
        			String accessoryfileFormat = getFileExtension(part.getContentType()); 
        			part.write(UPLOAD_DIRECTORY + File.separator + productId.toString() + "_accessory_"+ count +accessoryfileFormat);
        			System.out.println("Accessory image saved: " + UPLOAD_DIRECTORY + File.separator + productId.toString() + "_accessory"+ count +accessoryfileFormat);
        			count++;
        		}
        	}
        }

        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write("{\"message\": \"Product added successfully.\"}");
    }

    private void updateProduct(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
        // Extract form fields
        CorsUtils.addCorsHeaders(resp);
        String name = req.getParameter("name");
        String price = req.getParameter("price");
        String description = req.getParameter("description");
        String category = req.getParameter("category");
        String[] accessories = req.getParameterValues("accessories");
        Long id=Long.valueOf(req.getParameter("id"));
        String rD=req.getParameter("retailerDiscount");
        String mR=req.getParameter("manufacturerRebate");
        String mN=req.getParameter("manufacturerName");
        int quantity = Integer.parseInt(req.getParameter("quantity"));
        

        // Access product store from ServletContext
        //HashMap<String, Product> productStore = (HashMap<String, Product>) getServletContext().getAttribute("productStore");

		/*
		 * if (productStore.containsKey(oldName)) { // Get the existing product details
		 * Product existingProduct = productStore.get(oldName); String fileFormat =
		 * existingProduct.getFileFormat(); // Retain the old file format
		 * 
		 * // Handle file upload (only if a new file is provided)
		 * 
		 * String oldFilePath = UPLOAD_DIRECTORY + File.separator + oldName +
		 * existingProduct.getFileFormat(); String newFilePath = UPLOAD_DIRECTORY +
		 * File.separator + name + existingProduct.getFileFormat(); File oldFile = new
		 * File(oldFilePath); File newFile = new File(newFilePath);
		 * 
		 * if (oldFile.exists()) { boolean renamed = oldFile.renameTo(newFile); //
		 * Rename the file if (!renamed) {
		 * resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		 * resp.getWriter().write("{\"error\": \"Failed to rename the image file.\"}");
		 * return; } }
		 */
        if(id!=null) {
            // Update the product with new data
            List<String> accessoriesList = accessories != null ? Arrays.asList(accessories) : null;
            String accessoriesString= (accessoriesList != null && !accessoriesList.isEmpty())? String.join(", ", accessories): "";
            
            
            Double retailerDiscount = rD!=null?(Double.valueOf(rD) / 100.0) : 0.0 ;
            
            Double	manufacturerRebate = mR!=null?Double.valueOf(mR): 0.0;
            
            Product updatedProduct = new Product(name, Double.parseDouble(price), description, category, accessoriesString,retailerDiscount,manufacturerRebate,quantity);
            
            updatedProduct.setManufacturerName(mN);
            
            EntityManagerFactory entityManagerFactory = (EntityManagerFactory) getServletContext().getAttribute("entityManagerFactory");
            MySQLDataStoreUtilities.updateProduct(updatedProduct, entityManagerFactory,id);
            
            //updatedProduct.setFileFormat(fileFormat); // Retain or update the file format
            //productStore.remove(oldName);
            //productStore.put(name, updatedProduct); // Replace the old product with the updated product

            // Respond with a success message
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.getWriter().write("{\"message\": \"Product updated successfully.\"}");
        } else {
            // If the product does not exist, return a 404 error
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            resp.getWriter().write("{\"error\": \"Product not found.\"}");
        }
    }


    private void deleteProduct(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Long id = Long.valueOf(req.getParameter("id"));
        String fileFormat=req.getParameter("fileFormat");
        int accessoryCount= Integer.parseInt(req.getParameter("accessoryCount"));
        CorsUtils.addCorsHeaders(resp);

       // HashMap<String, Product> productStore = (HashMap<String, Product>) getServletContext().getAttribute("productStore");

		/*
		 * if (productStore.containsKey(productName)) { Product product =
		 * productStore.get(productName); String fileFormat = product.getFileFormat();
		 * productStore.remove(productName);
		 */

        if(id!=null) {
            String filePath = UPLOAD_DIRECTORY + File.separator + id.toString() +fileFormat;
            File file = new File(filePath);
            
            EntityManagerFactory entityManagerFactory = (EntityManagerFactory) getServletContext().getAttribute("entityManagerFactory");
            MySQLDataStoreUtilities.deleteProductById(id, entityManagerFactory);
            

            if (file.exists()) {
                boolean deleted = file.delete();
                if (!deleted) {
                    resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    resp.getWriter().write("{\"error\": \"Failed to delete the image file.\"}");
                    return;
                }
            }
            
           
            for (int count = 1; count <= accessoryCount; count++) {

                String accessoryfilePath = UPLOAD_DIRECTORY + File.separator + id.toString() + "_accessory_" + count + fileFormat;

                File accessoryFile = new File(accessoryfilePath);
                
                if (accessoryFile.exists()) {
                    // Attempt to delete the file
                    if (!accessoryFile.delete()) {
                        System.out.println("Failed to delete accessory image: " + filePath);
                    } else {
                        System.out.println("Accessory image deleted: " + filePath);
                    }
                } else {
                    System.out.println("Accessory image not found: " + filePath);
                }
            }


            // Respond with success message
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.getWriter().write("{\"message\": \"Product and associated image deleted successfully.\"}");
        } else {
            // If the product does not exist, return a 404 error
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            resp.getWriter().write("{\"error\": \"Product not found.\"}");
        }
    }
    
    private String getFileExtension(String mimeType) {
        switch (mimeType) {
            case "image/jpeg":
                return ".jpg";
            case "image/png":
                return ".png";
            case "image/gif":
                return ".gif";
            // Add more MIME types as needed
            default:
                return ""; // Default to no extension if MIME type is unknown
        
        }
    }
    
    

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    	CorsUtils.addCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

}

