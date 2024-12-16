import { useState } from "react";
import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";


function AddProduct() {

    const location = useLocation();
    const productToEdit = location.state?.product || null;
  const [formValues, setFormValues] = useState({
    name: productToEdit?productToEdit.name:"",
    manufacturerName: productToEdit?productToEdit.manufacturerName:"",
    description: productToEdit?productToEdit.description:"",
    price: productToEdit?productToEdit.price:"",
    manufacturerRebate: productToEdit?productToEdit.manufacturerRebate:"",
    retailerDiscount:productToEdit?productToEdit.retailerDiscount:"",
    category: productToEdit?productToEdit.category:"Smart Doorbells",
    accessories: productToEdit&&productToEdit.accessories!=null?productToEdit.accessories:[],
    image: null,
  });
  
  const [newAccessory, setNewAccessory] = useState(""); // To handle accessory input
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };


  const handleAccessoryInputChange = (e) => {
    setNewAccessory(e.target.value);
  };

  async function handleAddProduct(formValues) {
    try {
      const formData = new FormData();
  
      formData.append("name", formValues.name);
      formData.append("price", formValues.price);
      formData.append("category", formValues.category);
      formData.append("description", formValues.description);
      formData.append("manufacturerRebate",formValues.manufacturerRebate);
      formData.append("retailerDiscount",formValues.retailerDiscount);
      formData.append("manufacturerName",formValues.manufacturerName);
      formData.append("quantity",1);
      if(!productToEdit){
      formData.append("image", formValues.image);
    const accessoryImages = document.getElementById("accessoryImageInput").files;
    for (let i = 0; i < accessoryImages.length; i++) {
      formData.append("accessoryimages", accessoryImages[i]);
    }

      }
      if(productToEdit){
        formData.append("id",productToEdit.id);
      }
    console.log(formValues.category);
      formValues.accessories.forEach(accessory => {
        formData.append("accessories", accessory);
      });

      
  

      if (productToEdit) {

        await axios.put(`http://localhost:8080/ServletAPI/api/product/update`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {

        await axios.post(`http://localhost:8080/ServletAPI/api/product/add`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
  
      console.log("Product added successfully");
      navigate("/manager")
    } catch (error) {
      console.error("Error adding product");
    }
}

  const handleAddAccessory = () => {
    setFormValues({ 
      ...formValues, 
      accessories: [...formValues.accessories, newAccessory] 
    });
    setNewAccessory("");
  };


  const handleRemoveAccessory = (index) => {
    const updatedAccessories = formValues.accessories.filter((_, i) => i !== index);
    setFormValues({ ...formValues, accessories: updatedAccessories });
  };


  const handleImageChange = (e) => {
    setFormValues({ ...formValues, image: e.target.files[0] });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleAddProduct(formValues);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "30px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>{productToEdit?"Edit Product":"Add New Product"}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label><strong>Name:</strong></label><br />
          <input
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
            style={{ width: "90%", padding: "8px", marginTop: "5px" }}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label><strong>Manufacturer Name:</strong></label><br />
          <input
            type="text"
            name="manufacturerName"
            value={formValues.manufacturerName}
            onChange={handleInputChange}
            placeholder="Enter product name"
            style={{ width: "90%", padding: "8px", marginTop: "5px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label><strong>Description:</strong></label><br />
          <textarea
            name="description"
            value={formValues.description}
            onChange={handleInputChange}
            placeholder="Enter product description"
            style={{ width: "90%", padding: "8px", marginTop: "5px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label><strong>Price:</strong></label><br />
          <input
            type="number"
            name="price"
            value={formValues.price}
            onChange={handleInputChange}
            placeholder="Enter product price"
            style={{ width: "90%", padding: "8px", marginTop: "5px" }}
            step="0.01"
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label><strong>Manufacturer Rebate:</strong></label><br />
          <input
            type="number"
            name="manufacturerRebate"
            value={formValues.manufacturerRebate}
            onChange={handleInputChange}
            placeholder="Enter Rebate Value"
            style={{ width: "90%", padding: "8px", marginTop: "5px" }}
            step="0.01"
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label><strong>Retailer Discount:</strong></label><br />
          <input
            type="number"
            name="retailerDiscount"
            value={formValues.retailerDiscount}
            onChange={handleInputChange}
            placeholder="Enter Retailer Discount in %"
            style={{ width: "90%", padding: "8px", marginTop: "5px" }}
            step="0.01"
            required
          />
        </div>


        <div style={{ marginBottom: "10px" }}>
          <label><strong>Category:</strong></label><br />
          <select
            name="category"
            value={formValues.category}
            onChange={handleInputChange}
            style={{ width: "93%", padding: "8px", marginTop: "5px" }}
            required
          >
            <option value="Smart Doorbells">Smart Doorbells</option>
            <option value="Smart Doorlocks">Smart Doorlocks</option>
            <option value="Smart Speakers">Smart Speakers</option>
            <option value="Smart Lightings">Smart Lightings</option>
            <option value="Smart Thermostats">Smart Thermostats</option>
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label><strong>Accessories:</strong></label><br />
          <input
            type="text"
            value={newAccessory}
            onChange={handleAccessoryInputChange}
            placeholder="Enter accessory"
            style={{ width: "90%", padding: "8px", marginTop: "5px" }}
          />
          <button type="button" onClick={handleAddAccessory} style={{ padding: "10px",marginTop:"10px" }}>
            Add Accessory
          </button>

          <ul style={{ listStyleType: "none", paddingLeft: "0", marginTop: "10px" }}>
            {formValues.accessories.map((accessory, index) => (
              <li key={index} style={{ marginBottom: "5px" }}>
                {accessory} 
                <button type="button" onClick={() => handleRemoveAccessory(index)} style={{ marginLeft: "10px", color: "red" }}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {!productToEdit?
        <div style={{ marginBottom: "20px" }}>
          <label><strong>Image:</strong></label><br />
          <input
            type="file"
            onChange={handleImageChange}
            style={{ marginTop: "5px" }}
            required
          />
        </div>:<div></div>}


        {!productToEdit?
        <div style={{ marginBottom: "20px" }}>
          <label><strong>AccessoryImages:</strong></label><br />
          <input
            type="file"
            id="accessoryImageInput"
            style={{ marginTop: "5px" }}
            multiple
          />
        </div>:<div></div>}


        <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px" }}>
          {productToEdit?"Update Product":"Add Product"}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
