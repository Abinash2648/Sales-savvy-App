"use client"

import { useEffect, useState } from "react"
import "./assets/modalStyle.css"

const CustomModal = ({ modalType, onClose, onSubmit, response }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    imageUrl: "",
  })

  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    // Reset form data when modal type changes
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      categoryId: "",
      imageUrl: "",
    })
    setInputValue("")
  }, [modalType])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleGeneralInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    switch (modalType) {
      case "addProduct":
        const processedData = {
          name: formData.name,
          description: formData.description,
          price: Number.parseFloat(formData.price),
          stock: Number.parseInt(formData.stock, 10),
          categoryId: Number.parseInt(formData.categoryId, 10),
          imageUrl: formData.imageUrl,
        }
        onSubmit(processedData)
        break

      case "deleteProduct":
        const productId = Number.parseInt(inputValue, 10)
        onSubmit({ productId })
        break

      case "viewUser":
        const userId = Number.parseInt(inputValue, 10)
        onSubmit({ userId })
        break

      case "modifyUser":
        if (!response?.user) {
          // First step: fetch user
          const userId = Number.parseInt(inputValue, 10)
          onSubmit({ userId })
        } else {
          // Second step: update user
          const formData = new FormData(e.target)
          const username = formData.get("username")
          const email = formData.get("email")
          const role = formData.get("role")
          const userId = Number.parseInt(inputValue, 10)

          const data = {
            userId,
            username,
            email,
            role,
          }

          onSubmit(data)
        }
        break

      case "monthlyBusiness":
        onSubmit({
          month: formData.month,
          year: formData.year,
        })
        break

      case "dailyBusiness":
        onSubmit({
          date: formData.date,
        })
        break

      case "yearlyBusiness":
        onSubmit({
          year: formData.year,
        })
        break

      case "overallBusiness":
        onSubmit({})
        break

      default:
        console.error("Unknown modal type:", modalType)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {modalType === "addProduct" && (
          <>
            <h2>Add Product</h2>
            <form className="modal-form">
              <div className="modal-form-item">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="modal-form-item">
                <label htmlFor="price">Price:</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>

              <div className="modal-form-item">
                <label htmlFor="stock">Stock:</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                />
              </div>

              <div className="modal-form-item">
                <label htmlFor="categoryId">Category ID:</label>
                <input
                  type="number"
                  id="categoryId"
                  name="categoryId"
                  placeholder="Category ID"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                />
              </div>

              <div className="modal-form-item">
                <label htmlFor="imageUrl">Image URL:</label>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  placeholder="Image URL"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                />
              </div>

              <div className="modal-form-item">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </form>

            <button onClick={handleSubmit}>Submit</button>
            <button onClick={onClose}>Cancel</button>
          </>
        )}

        {modalType === "deleteProduct" && (
          <>
            <h2>Delete Product</h2>
            <form>
              <input
                type="number"
                placeholder="Enter Product ID"
                value={inputValue}
                onChange={handleGeneralInputChange}
              />
            </form>
            <button onClick={handleSubmit}>Delete</button>
            <button onClick={onClose}>Cancel</button>
          </>
        )}

        {modalType === "viewUser" && (
          <>
            <h2>View User Details</h2>
            <form>
              <input type="number" placeholder="Enter User ID" value={inputValue} onChange={handleGeneralInputChange} />
            </form>
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={onClose}>Cancel</button>
          </>
        )}

        {modalType === "modifyUser" && (
          <>
            <h2>Modify User</h2>
            {!response?.user ? (
              <form onSubmit={handleSubmit}>
                <div className="modal-form-item">
                  <label htmlFor="userId">User ID:</label>
                  <input
                    type="number"
                    id="userId"
                    name="userId"
                    placeholder="Enter User ID"
                    value={inputValue}
                    onChange={handleGeneralInputChange}
                  />
                </div>
                <button type="submit">Fetch User</button>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="modal-form-item">
                  <label htmlFor="username">Username:</label>
                  <input type="text" id="username" name="username" defaultValue={response.user.username} />
                </div>
                <div className="modal-form-item">
                  <label htmlFor="email">Email:</label>
                  <input type="email" id="email" name="email" defaultValue={response.user.email} />
                </div>
                <div className="modal-form-item">
                  <label htmlFor="role">Role:</label>
                  <input type="text" id="role" name="role" defaultValue={response.user.role} />
                </div>
                <button type="submit">Update User</button>
              </form>
            )}
            <button onClick={onClose}>Cancel</button>
          </>
        )}

        {modalType === "monthlyBusiness" && (
          <>
            <h2>Monthly Business</h2>
            {!response && (
              <form className="modal-form">
                <div className="modal-form-item">
                  <label htmlFor="month">Month:</label>
                  <input
                    type="number"
                    id="month"
                    name="month"
                    placeholder="Enter Month (1-12)"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="modal-form-item">
                  <label htmlFor="year">Year:</label>
                  <input type="number" id="year" name="year" placeholder="Enter Year" onChange={handleInputChange} />
                </div>
                <button onClick={handleSubmit}>Submit</button>
              </form>
            )}
            {response && (
              <div>
                <div className="business-response-item">
                  <div>Total Business: ₹</div>
                  <div>{response?.monthlyBusiness?.totalBusiness?.toFixed(2)}</div>
                </div>
                <div className="business-response-item">
                  <h5>Category Sales</h5>
                </div>
                {Object.keys(response?.monthlyBusiness?.categorySales || {})?.map((key) => (
                  <div key={key} className="business-response-item">
                    <div>{key}</div>
                    <div>{response?.monthlyBusiness?.categorySales[key]}</div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={onClose}>Cancel</button>
          </>
        )}

        {modalType === "dailyBusiness" && (
          <>
            <h2>Day Business</h2>
            {!response && (
              <form className="modal-form">
                <div className="modal-form-item">
                  <label htmlFor="date">Date:</label>
                  <input
                    type="text"
                    id="date"
                    name="date"
                    placeholder="Enter Date (YYYY-MM-DD)"
                    onChange={handleInputChange}
                  />
                </div>
                <button onClick={handleSubmit}>Submit</button>
              </form>
            )}
            {response && (
              <div>
                <div className="business-response-item">
                  <div>Total Business: ₹</div>
                  <div>{response?.dailyBusiness?.totalBusiness?.toFixed(2)}</div>
                </div>
                <div className="business-response-item">
                  <h5>Category Sales</h5>
                </div>
                {Object.keys(response?.dailyBusiness?.categorySales || {})?.map((key) => (
                  <div key={key} className="business-response-item">
                    <div>{key}</div>
                    <div>{response?.dailyBusiness?.categorySales[key]}</div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={onClose}>Cancel</button>
          </>
        )}

        {modalType === "yearlyBusiness" && (
          <>
            <h2>Yearly Business</h2>
            {!response && (
              <form className="modal-form">
                <div className="modal-form-item">
                  <label htmlFor="year">Year:</label>
                  <input type="number" id="year" name="year" placeholder="Enter Year" onChange={handleInputChange} />
                </div>
                <button onClick={handleSubmit}>Submit</button>
              </form>
            )}
            {response && (
              <div>
                <div className="business-response-item">
                  <div>Total Business: ₹</div>
                  <div>{response?.yearlyBusiness?.totalBusiness?.toFixed(2)}</div>
                </div>
                <div className="business-response-item">
                  <h5>Category Sales</h5>
                </div>
                {Object.keys(response?.yearlyBusiness?.categorySales || {})?.map((key) => (
                  <div key={key} className="business-response-item">
                    <div>{key}</div>
                    <div>{response?.yearlyBusiness?.categorySales[key]}</div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={onClose}>Cancel</button>
          </>
        )}

        {modalType === "overallBusiness" && (
          <>
            <h2>Overall Business</h2>
            {!response && <button onClick={handleSubmit}>Get Overall Business</button>}
            {response && (
              <div>
                <div className="business-response-item">
                  <div>Total Business: ₹</div>
                  <div>{response?.overallBusiness?.totalBusiness?.toFixed(2)}</div>
                </div>
                <div className="business-response-item">
                  <h5>Category Sales</h5>
                </div>
                {Object.keys(response?.overallBusiness?.categorySales || {})?.map((key) => (
                  <div key={key} className="business-response-item">
                    <div>{key}</div>
                    <div>{response?.overallBusiness?.categorySales[key]}</div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={onClose}>Cancel</button>
          </>
        )}

        {modalType === "response" && (
          <>
            <h2>Operation Result</h2>
            <div className="response-container">
              {response?.message && (
                <p className={response.message.includes("Error") ? "error-message" : "success-message"}>
                  {response.message}
                </p>
              )}

              {response?.product && (
                <div className="product-details">
                  <h3>Product Added Successfully</h3>
                  <p>
                    <strong>ID:</strong> {response.product.id}
                  </p>
                  <p>
                    <strong>Name:</strong> {response.product.name}
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{response.product.price}
                  </p>
                  {response.imageUrl && (
                    <img
                      src={response.imageUrl || "/placeholder.svg"}
                      alt={response.product.name}
                      className="product-image"
                    />
                  )}
                </div>
              )}

              {response?.user && !modalType.includes("modify") && (
                <div className="user-details">
                  <h3>User Details</h3>
                  <p>
                    <strong>ID:</strong> {response.user.userId}
                  </p>
                  <p>
                    <strong>Username:</strong> {response.user.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {response.user.email}
                  </p>
                  <p>
                    <strong>Role:</strong> {response.user.role}
                  </p>
                </div>
              )}
            </div>
            <button onClick={onClose}>Close</button>
          </>
        )}
      </div>
    </div>
  )
}

export default CustomModal
