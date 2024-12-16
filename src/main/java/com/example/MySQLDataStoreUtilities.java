 package com.example;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.Query;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

public class MySQLDataStoreUtilities {
	
    private static final Logger logger = Logger.getLogger(MySQLDataStoreUtilities.class.getName());

    public static boolean saveUser(User user, EntityManagerFactory entityManagerFactory) {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        EntityTransaction transaction = entityManager.getTransaction();
        try {
            transaction.begin();
            entityManager.persist(user);
            transaction.commit();
            return true;
        } catch (Exception e) {
            if (transaction.isActive()) {
                transaction.rollback();
            }
            e.printStackTrace();
            return false;
        } finally {
            entityManager.close();
        }
    }
    
    public static User validateUser(String email, String password, EntityManagerFactory entityManagerFactory) {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
        	logger.info("email:"+ email + password);
        	String jpql = "SELECT u FROM User u WHERE u.email = :email AND u.password = :password";
            TypedQuery<User> query = entityManager.createQuery(jpql, User.class);
            query.setParameter("email", email);
            query.setParameter("password", password);

            User user = query.getResultStream().findFirst().orElse(null);
            logger.info(user.getEmail());
            return user;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            entityManager.close();
        }
    }
    
    public static List<User> fetchAllUsers(EntityManagerFactory entityManagerFactory) {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        List<User> users = new ArrayList<>();
        try {
            logger.info("Fetching all users from the database.");
            String jpql = "SELECT u FROM User u";
            TypedQuery<User> query = entityManager.createQuery(jpql, User.class);

            users = query.getResultList();
            logger.info("Number of users fetched: " + users.size());
        } catch (Exception e) {
            logger.severe("Error fetching users: " + e.getMessage());
        } finally {
            entityManager.close();
        }
        return users;
    }
    
  
    
    public static Long saveProduct(Product product, EntityManagerFactory entityManagerFactory) {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        EntityTransaction transaction = entityManager.getTransaction();
        try {
            transaction.begin();
            entityManager.persist(product);
            transaction.commit();
            return product.getId();
        } catch (Exception e) {
            if (transaction.isActive()) {
                transaction.rollback();
            }
            e.printStackTrace();
            return null;
        } finally {
            entityManager.close();
        }
    }
    
    public static List<Product> fetchAllProducts(EntityManagerFactory entityManagerFactory) {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        List<Product> products = new ArrayList<>();
        try {
            logger.info("Fetching all products from the database.");
            String jpql = "SELECT p FROM Product p";
            TypedQuery<Product> query = entityManager.createQuery(jpql, Product.class);

            products = query.getResultList();
            logger.info("Number of products fetched: " + products.size());
        } catch (Exception e) {
            logger.severe("Error fetching products: " + e.getMessage());
        } finally {
            entityManager.close();
        }
        return products;
    }

	public static boolean updateProduct(Product product, EntityManagerFactory entityManagerFactory,Long id) {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        EntityTransaction transaction = entityManager.getTransaction();
		try {
	        transaction.begin();
	        // Find the existing product by ID
	        Product existingProduct = entityManager.find(Product.class, id);
	        if (existingProduct != null) {
	            // Update the fields of the existing product
	            existingProduct.setName(product.getName());
	            existingProduct.setPrice(product.getPrice());
	            existingProduct.setDescription(product.getDescription());
	            existingProduct.setCategory(product.getCategory());
	            existingProduct.setAccessories(product.getAccessories());
	            existingProduct.setManufacturerRebate(product.getManufacturerRebate());
	            existingProduct.setRetailerDiscount(product.getRetailerDiscount());
	            

	            // Persist the changes
	            entityManager.merge(existingProduct);
	            transaction.commit();
	            return true;
	        } else {
	            System.out.println("Product with ID " + product.getId() + " not found.");
	            return false;
	        }
	    } catch (Exception e) {
	        if (transaction.isActive()) {
	            transaction.rollback();
	        }
	        e.printStackTrace();
	        return false;
	    } finally {
	        entityManager.close();
	    }
		
	
		
		
	}
	
	
	public static boolean deleteProductById(Long productId, EntityManagerFactory entityManagerFactory) {
	    EntityManager entityManager = entityManagerFactory.createEntityManager();
	    EntityTransaction transaction = entityManager.getTransaction();
	    try {
	        transaction.begin();
	        // Find the existing product by ID
	        Product product = entityManager.find(Product.class, productId);
	        if (product != null) {
	            // Remove the product from the database
	            entityManager.remove(product);
	            transaction.commit();
	            return true;
	        } else {
	            System.out.println("Product with ID " + productId + " not found.");
	            return false;
	        }
	    } catch (Exception e) {
	        if (transaction.isActive()) {
	            transaction.rollback();
	        }
	        e.printStackTrace();
	        return false;
	    } finally {
	        entityManager.close();
	    }
	}

	public static boolean saveUserCart(Cart cart, EntityManagerFactory entityManagerFactory) {
	    EntityManager entityManager = entityManagerFactory.createEntityManager();
	    EntityTransaction transaction = entityManager.getTransaction();
	    try {
	        transaction.begin();
	        
	        // Check if a cart item already exists for the given user_id and product_id
	        Cart existingCart = entityManager.createQuery(
	            "SELECT c FROM Cart c WHERE c.user_id = :userId AND c.productId = :productId", Cart.class)
	            .setParameter("userId", cart.getUser_id())
	            .setParameter("productId", cart.getProductId())
	            .getResultStream()
	            .findFirst()
	            .orElse(null);

	        if (existingCart != null) {
	            // Update the quantity and total price of the existing cart item
	            int newQuantity = existingCart.getQuantity() + cart.getQuantity();
	            double totalPrice = newQuantity * cart.getPrice(); // Assuming price is per unit

	            existingCart.setQuantity(newQuantity);
	            existingCart.setTotalPrice(totalPrice); // Assuming there's a totalPrice field in Cart class
	            
	            entityManager.merge(existingCart);
	        } else {
	            // No existing cart item found, insert a new one
	            entityManager.persist(cart);
	        }
	        
	        transaction.commit();
	        return true;
	    } catch (Exception e) {
	        if (transaction.isActive()) {
	            transaction.rollback();
	        }
	        e.printStackTrace();
	        return false;
	    } finally {
	        entityManager.close();
	    }
	}


	 public static List<Cart> getCartByUser(Long userId, EntityManagerFactory entityManagerFactory) {
	        EntityManager entityManager = entityManagerFactory.createEntityManager();
	        List<Cart> userCarts = null;

	        try {
	            // Create a TypedQuery to fetch carts by userId
	            TypedQuery<Cart> query = entityManager.createQuery(
	                "SELECT c FROM Cart c WHERE c.user_id = :userId", Cart.class
	            );
	            query.setParameter("userId", userId);

	            // Execute the query and get the result list
	            userCarts = query.getResultList();
	        } finally {
	            entityManager.close(); // Always close the EntityManager to avoid memory leaks
	        }

	        return userCarts;
	    }

	public static boolean removeCartById(Long cartId, EntityManagerFactory entityManagerFactory) {
		EntityManager entityManager = entityManagerFactory.createEntityManager();
	    EntityTransaction transaction = entityManager.getTransaction();
	    try {
	        transaction.begin();
	        // Find the existing product by ID
	        Cart cart = entityManager.find(Cart.class, cartId);
	        if (cart != null) {
	            // Remove the product from the database
	            entityManager.remove(cart);
	            transaction.commit();
	            return true;
	        } else {
	            System.out.println("Product with ID " + cartId + " not found.");
	            return false;
	        }
	    } catch (Exception e) {
	        if (transaction.isActive()) {
	            transaction.rollback();
	        }
	        e.printStackTrace();
	        return false;
	    } finally {
	        entityManager.close();
	    }
	}
	
	public static boolean saveOrder(Order order, EntityManagerFactory entityManagerFactory) {
		EntityManager entityManager = entityManagerFactory.createEntityManager();
	    try {
	        entityManager.getTransaction().begin();

	        entityManager.merge(order);

	        entityManager.getTransaction().commit();
	        return true;
	        
	    } catch (Exception e) {
	        entityManager.getTransaction().rollback();
	        e.printStackTrace();
	        return false;
	    } finally {
	        entityManager.close();
	    }
    
	}
	
	public static boolean deleteOrder(Long orderId, EntityManagerFactory entityManagerFactory) {
	    EntityManager entityManager = entityManagerFactory.createEntityManager();
	    try {
	        entityManager.getTransaction().begin();

	        // Find the order by orderId
	        Order order = entityManager.find(Order.class, orderId);
	        
	        

	        if (order != null) {
	        	updateProductQuantity(order.getOrderItems(),entityManagerFactory,"add");
	            // Remove the order if found
	            entityManager.remove(order);
	            entityManager.getTransaction().commit();
	            return true;
	        } else {
	            System.out.println("Order with ID " + orderId + " not found.");
	            return false;
	        }

	    } catch (Exception e) {
	        entityManager.getTransaction().rollback();
	        e.printStackTrace();
	        return false;
	    } finally {
	        entityManager.close();
	    }
	}

	
	public static List<Order> getOrdersByUserId(Long userId, EntityManagerFactory entityManagerFactory) {
	    EntityManager entityManager = entityManagerFactory.createEntityManager();
	    List<Order> orders = null;
	    try {
	        entityManager.getTransaction().begin();
	        TypedQuery<Order> query = entityManager.createQuery(
	            "SELECT o FROM Order o LEFT JOIN FETCH o.orderItems WHERE o.userId = :userId", Order.class);
	        query.setParameter("userId", userId);
	        orders = query.getResultList();
	        entityManager.getTransaction().commit();
	    } catch (Exception e) {
	        entityManager.getTransaction().rollback();
	        e.printStackTrace();
	    } finally {
	        entityManager.close();
	    }
	    return orders;
	}
	
	public static List<Order> getAllOrders(EntityManagerFactory entityManagerFactory) {
	    EntityManager entityManager = entityManagerFactory.createEntityManager();
	    List<Order> orders = null;
	    try {
	        entityManager.getTransaction().begin();
	        TypedQuery<Order> query = entityManager.createQuery(
	            "SELECT o FROM Order o LEFT JOIN FETCH o.orderItems", Order.class);
	        orders = query.getResultList();
	        entityManager.getTransaction().commit();
	    } catch (Exception e) {
	        entityManager.getTransaction().rollback();
	        e.printStackTrace();
	    } finally {
	        entityManager.close();
	    }
	    return orders;
	}
	
	public static void updateOrderStatus(Long orderId, String newStatus, EntityManagerFactory entityManagerFactory) {
	    EntityManager entityManager = entityManagerFactory.createEntityManager();
	    try {
	        entityManager.getTransaction().begin();
	        

	        Query query = entityManager.createQuery(
	            "UPDATE Order o SET o.orderStatus = :newStatus WHERE o.id = :orderId");
	        query.setParameter("newStatus", newStatus);
	        query.setParameter("orderId", orderId);
	        
	        int rowsUpdated = query.executeUpdate();  
	        entityManager.getTransaction().commit();
	        
	        System.out.println("Rows updated: " + rowsUpdated);
	    } catch (Exception e) {
	        entityManager.getTransaction().rollback();
	        e.printStackTrace();
	    } finally {
	        entityManager.close();
	    }
	}
	
	public static List<Store> getStoreList(EntityManagerFactory entityManagerFactory){
		EntityManager entityManager = entityManagerFactory.createEntityManager();
		
		TypedQuery<Store> query = entityManager.createQuery(
	            "SELECT s FROM Store s", Store.class);
		
		return query.getResultList();
	}
	
	
	public static boolean saveUserLikedProduct(UserLikedProducts likedProduct, EntityManagerFactory entityManagerFactory) {
	    EntityManager entityManager = entityManagerFactory.createEntityManager();
	    EntityTransaction transaction = entityManager.getTransaction();
	    try {
	        transaction.begin();

	        // Check if the record already exists
	        UserLikedProducts existingLikedProduct = null;
	        try {
	            existingLikedProduct = entityManager.createQuery(
	                "SELECT u FROM UserLikedProducts u WHERE u.userId = :userId AND u.productId = :productId", UserLikedProducts.class)
	                .setParameter("userId", likedProduct.getUserId())
	                .setParameter("productId", likedProduct.getProductId())
	                .getSingleResult();
	        } catch (NoResultException e) {
	            // No existing record found, proceed to insert
	        }

	        if (existingLikedProduct != null) {
	            // Update the existing record
	            existingLikedProduct.setIsLiked(likedProduct.getIsLiked());
	            entityManager.merge(existingLikedProduct);
	        } else {
	            // Insert a new record
	            entityManager.persist(likedProduct);
	        }

	        transaction.commit();
	        return true;
	    } catch (Exception e) {
	        if (transaction.isActive()) {
	            transaction.rollback();
	        }
	        e.printStackTrace();
	        return false;
	    } finally {
	        entityManager.close();
	    }
	}


	public static List<UserLikedProducts> getProductLikes(Long userId,EntityManagerFactory entityManagerFactory) {
		EntityManager entityManager = entityManagerFactory.createEntityManager();
		
		TypedQuery<UserLikedProducts> query = entityManager.createQuery(
	            "SELECT l FROM UserLikedProducts l WHERE l.userId = :userId", UserLikedProducts.class);
		query.setParameter("userId", userId);
		
		return query.getResultList();
	    
		
		
	}

	
	public static List<ProductLikeCount> getTopFiveMostLikedProducts(EntityManagerFactory entityManagerFactory) {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            String jpql = "SELECT new com.example.ProductLikeCount(p, COUNT(u.productId)) " +
                          "FROM UserLikedProducts u JOIN Product p ON u.productId = p.id " +
                          "WHERE u.isLiked = true " +
                          "GROUP BY p.id " +
                          "ORDER BY COUNT(u.productId) DESC";
                          
            TypedQuery<ProductLikeCount> query = entityManager.createQuery(jpql, ProductLikeCount.class);
            query.setMaxResults(5);

            return query.getResultList();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            entityManager.close();
        }
    }
	
	
	public static List<MostSoldProducts> getTopFiveMostSoldProducts(EntityManagerFactory entityManagerFactory) {
	    EntityManager entityManager = entityManagerFactory.createEntityManager();
	    try {
	    	String jpql = "SELECT new com.example.MostSoldProducts(p, SUM(oi.quantity)) " +
                    "FROM Order o JOIN o.orderItems oi JOIN Product p ON oi.productId = p.id " +
                    "GROUP BY p " + 
                    "ORDER BY SUM(oi.quantity) DESC";
	        TypedQuery<MostSoldProducts> query = entityManager.createQuery(jpql, MostSoldProducts.class);
	        query.setMaxResults(5); 
	        return query.getResultList();
	    } catch (Exception e) {
	        e.printStackTrace();
	        return null;
	    } finally {
	        entityManager.close();
	    }
	}



    public static List<MostProductsSoldByZipCode> getTopFiveZipCodesByProductSales(EntityManagerFactory entityManagerFactory) {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
        	String jpql = "SELECT new com.example.MostProductsSoldByZipCode(" +
                    "SUBSTRING(o.address, LENGTH(o.address) - LOCATE(',', REVERSE(o.address)) + 2) AS zipCode, " +
                    "COUNT(oi.productId) AS totalProducts, " +
                    "o.StoreId) " +
                    "FROM Order o JOIN o.orderItems oi " +
                    "WHERE o.deliveryOption = 'store_pickup' " +
                    "GROUP BY zipCode, o.StoreId " + 
                    "ORDER BY totalProducts DESC";
            TypedQuery<MostProductsSoldByZipCode> query = entityManager.createQuery(jpql, MostProductsSoldByZipCode.class);
            query.setMaxResults(5); 
            return query.getResultList();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            entityManager.close();
        }
    }

    public static void updateProductQuantity(List<OrderItems> orderItems, EntityManagerFactory entityManagerFactory,String op) {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        EntityTransaction transaction = entityManager.getTransaction();

        try {
            transaction.begin();
            if(op=="sub") {
            for (OrderItems orderItem : orderItems) {
                Product existingProduct = entityManager.find(Product.class, orderItem.getProductId());
                if (existingProduct != null) {
                    int updatedQuantity = existingProduct.getQuantity() - orderItem.getQuantity();

                    // Check if the quantity would go negative
                    if (updatedQuantity < 0) {
                        System.out.println("Insufficient quantity for product ID: " + orderItem.getProductId());
                        throw new IllegalArgumentException("Insufficient quantity for product: " + orderItem.getProductId());
                    }

                    // Update the product quantity
                    existingProduct.setQuantity(updatedQuantity);
                    entityManager.merge(existingProduct);
                } else {
                    System.out.println("Product with ID " + orderItem.getProductId() + " not found.");
                }
            }
            }
            else {
            	
            	for (OrderItems orderItem : orderItems) {
                    Product existingProduct = entityManager.find(Product.class, orderItem.getProductId());
                    if (existingProduct != null) {
                        int updatedQuantity = existingProduct.getQuantity() + orderItem.getQuantity();

                        existingProduct.setQuantity(updatedQuantity);
                        entityManager.merge(existingProduct);
                    } else {
                        System.out.println("Product with ID " + orderItem.getProductId() + " not found.");
                    }
                }
            }

            // Commit the transaction after the loop
            transaction.commit();

        } catch (Exception e) {
            if (transaction.isActive()) {
                transaction.rollback();
            }
            e.printStackTrace();
        } finally {
            entityManager.close();
        }
    }
    
    public static List<ProductSales> getAllProductsSold(EntityManagerFactory entityManagerFactory) {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            String jpql = "SELECT new com.example.ProductSales(oi.name, oi.price, SUM(oi.quantity), SUM(oi.totalPrice)) " +
                          "FROM Order o JOIN o.orderItems oi " +
                          "GROUP BY oi.productId, oi.name, oi.price";
            TypedQuery<ProductSales> query = entityManager.createQuery(jpql, ProductSales.class);
            return query.getResultList();
        } finally {
            entityManager.close();
        }
    }


    public static List<DailySales> getDailyTotalSales(EntityManagerFactory entityManagerFactory) {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            String jpql = "SELECT new com.example.DailySales(o.purchaseDate, SUM(o.totalSales)) " +
                          "FROM Order o " +
                          "GROUP BY o.purchaseDate";
            TypedQuery<DailySales> query = entityManager.createQuery(jpql, DailySales.class);
            return query.getResultList();
        } finally {
            entityManager.close();
        }
    }

	public static Boolean createTicket(Ticket ticket, EntityManagerFactory entityManagerFactory) {
		EntityManager entityManager = entityManagerFactory.createEntityManager();
        EntityTransaction transaction = entityManager.getTransaction();
        try {
            transaction.begin();
            entityManager.persist(ticket);
            transaction.commit();
            return true;
        } catch (Exception e) {
            if (transaction.isActive()) {
                transaction.rollback();
            }
            e.printStackTrace();
            return false;
        } finally {
            entityManager.close();
        }
	}

	public static Ticket getTicketDetails(Long ticketNumber, EntityManagerFactory entityManagerFactory) {
		EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {

        	String jpql = "SELECT t FROM Ticket t WHERE t.ticketNumber = :ticketNumber";
            TypedQuery<Ticket> query = entityManager.createQuery(jpql, Ticket.class);
            query.setParameter("ticketNumber", ticketNumber);


            Ticket ticket = query.getResultStream().findFirst().orElse(null);

            return ticket;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            entityManager.close();
        }
	}


}
