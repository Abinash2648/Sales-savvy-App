"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Footer } from "./Footer"
import Logo from "./Logo"
import "./assets/style.css"
import CustomModal from "./CustomModal"

const AdminDashboard = () => {
  const navigate = useNavigate()

  const [modalType, setModalType] = useState(null)
  const [modalData, setModalData] = useState(null)
  const [response, setResponse] = useState(null)

  // Centralized card data
  const cardData = [
    {
      title: "Add Product",
      description: "Create and manage new product listings with validation",
      team: "Product Management",
      modalType: "addProduct",
    },
    {
      title: "Delete Product",
      description: "Remove products from inventory system",
      team: "Product Management",
      modalType: "deleteProduct",
    },
    {
      title: "View User Details",
      description: "Fetch and display details of a specific user",
      team: "User Management",
      modalType: "viewUser",
    },
    {
      title: "Modify User",
      description: "Update user details and manage roles",
      team: "User Management",
      modalType: "modifyUser",
    },
    {
      title: "Monthly Business",
      description: "View revenue metrics for specific months",
      team: "Analytics",
      modalType: "monthlyBusiness",
    },
    {
      title: "Daily Business",
      description: "Track daily revenue and transactions",
      team: "Analytics",
      modalType: "dailyBusiness",
    },
    {
      title: "Yearly Business",
      description: "Analyze annual revenue performance",
      team: "Analytics",
      modalType: "yearlyBusiness",
    },
    {
      title: "Overall Business",
      description: "View total revenue since inception",
      team: "Analytics",
      modalType: "overallBusiness",
    },
  ]

  // Unified handler function for all form submissions
  const handleSubmit = async (data) => {
    switch (modalType) {
      case "addProduct":
        await handleAddProductSubmit(data)
        break
      case "deleteProduct":
        await handleDeleteProductSubmit(data)
        break
      case "viewUser":
        await handleViewUserSubmit(data)
        break
      case "modifyUser":
        await handleModifyUserSubmit(data)
        break
      case "monthlyBusiness":
        await handleMonthlyBusiness(data)
        break
      case "dailyBusiness":
        await handleDailyBusiness(data)
        break
      case "yearlyBusiness":
        await handleYearlyBusiness(data)
        break
      case "overallBusiness":
        await handleOverallBusiness()
        break
      default:
        console.error("Unknown modal type:", modalType)
    }
  }

  // Product Management Handlers
  const handleAddProductSubmit = async (productData) => {
    try {
      const response = await fetch("http://localhost:9090/admin/products/add", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })
      const data = await response.json()
      setResponse({ product: data, imageUrl: productData.imageUrl })
      setModalType("response")
    } catch (error) {
      console.error("Error adding product:", error)
      setResponse({ message: "Error: Failed to add product" })
      setModalType("response")
    }
  }

  const handleDeleteProductSubmit = async ({ productId }) => {
    try {
      const response = await fetch("http://localhost:9090/admin/products/delete", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      })
      if (response.ok) {
        setResponse({ message: "Product deleted successfully" })
      } else {
        const errorMessage = await response.text()
        setResponse({ message: `Error: ${errorMessage}` })
      }
      setModalType("response")
    } catch (error) {
      console.error("Error deleting product:", error)
      setResponse({ message: "Error: Something went wrong" })
      setModalType("response")
    }
  }

  // User Management Handlers
  const handleViewUserSubmit = async ({ userId }) => {
    try {
      const response = await fetch("http://localhost:9090/admin/user/getbyid", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })
      if (response.ok) {
        const data = await response.json()
        setResponse({ user: data })
        setModalType("response")
      } else {
        const errorMessage = await response.text()
        setResponse({ message: `Error: ${errorMessage}` })
        setModalType("response")
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
      setResponse({ message: "Error: Something went wrong" })
      setModalType("response")
    }
  }

  const handleModifyUserSubmit = async (data) => {
    if (!data.username) {
      // Fetch user details
      try {
        const response = await fetch("http://localhost:9090/admin/user/getbyid", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: data.userId }),
        })
        if (response.ok) {
          const userDetails = await response.json()
          setResponse({ user: userDetails })
          setModalType("modifyUser")
        } else {
          const error = await response.text()
          setResponse({ message: `Error: ${error}` })
          setModalType("response")
        }
      } catch (error) {
        console.error("Error fetching user details:", error)
        setResponse({ message: "Error: Something went wrong" })
        setModalType("response")
      }
    } else {
      // Update user details
      try {
        const response = await fetch("http://localhost:9090/admin/user/modify", {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
        if (response.ok) {
          const updatedUser = await response.json()
          setResponse({ user: updatedUser })
          setModalType("response")
        } else {
          const error = await response.text()
          setResponse({ message: `Error: ${error}` })
          setModalType("response")
        }
      } catch (error) {
        console.error("Error updating user details:", error)
        setResponse({ message: "Error: Something went wrong" })
        setModalType("response")
      }
    }
  }

  // Business Analytics Handlers
  const handleMonthlyBusiness = async (data) => {
    try {
      const response = await fetch(
        `http://localhost:9090/admin/business/monthly?month=${data?.month}&year=${data?.year}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      if (response.ok) {
        const data = await response.json()
        setResponse({ monthlyBusiness: data })
        setModalType("monthlyBusiness")
      } else {
        const errorMessage = await response.text()
        setResponse({ message: `Error: ${errorMessage}` })
        setModalType("monthlyBusiness")
      }
    } catch (error) {
      console.error("Error fetching monthly business details:", error)
      setResponse({ message: "Error: Something went wrong" })
      setModalType("response")
    }
  }

  const handleDailyBusiness = async (data) => {
    try {
      const response = await fetch(`http://localhost:9090/admin/business/daily?date=${data?.date}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setResponse({ dailyBusiness: data })
        setModalType("dailyBusiness")
      } else {
        const errorMessage = await response.text()
        setResponse({ message: `Error: ${errorMessage}` })
        setModalType("response")
      }
    } catch (error) {
      console.error("Error fetching daily business details:", error)
      setResponse({ message: "Error: Something went wrong" })
      setModalType("response")
    }
  }

  const handleYearlyBusiness = async (data) => {
    try {
      const response = await fetch(`http://localhost:9090/admin/business/yearly?year=${data?.year}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setResponse({ yearlyBusiness: data })
        setModalType("yearlyBusiness")
      } else {
        const errorMessage = await response.text()
        setResponse({ message: `Error: ${errorMessage}` })
        setModalType("response")
      }
    } catch (error) {
      console.error("Error fetching yearly business details:", error)
      setResponse({ message: "Error: Something went wrong" })
      setModalType("response")
    }
  }

  const handleOverallBusiness = async () => {
    try {
      const response = await fetch(`http://localhost:9090/admin/business/overall`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setResponse({ overallBusiness: data })
        setModalType("overallBusiness")
      } else {
        const errorMessage = await response.text()
        setResponse({ message: `Error: ${errorMessage}` })
        setModalType("response")
      }
    } catch (error) {
      console.error("Error fetching overall business details:", error)
      setResponse({ message: "Error: Something went wrong" })
      setModalType("response")
    }
  }

  // Group cards by team
  const groupedCards = cardData.reduce((acc, card) => {
    if (!acc[card.team]) {
      acc[card.team] = []
    }
    acc[card.team].push(card)
    return acc
  }, {})

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <Logo />
        
        <div className="admin-nav">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate("/admin")}>Logout</button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="cards-grid">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="card"
              onClick={() => {
                setModalType(card.modalType)
                setModalData(null) // Clear any previous data
              }}
            >
              <div className="card-content">
                <h3 className="card-title">{card.title}</h3>
                <p className="card-description">{card.description}</p>
                <span className="card-team">
                  <p className="teams">Team:</p> {card.team}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {modalType && (
        <CustomModal
          modalType={modalType}
          onClose={() => {
            setModalType(null)
            setResponse(null)
          }}
          onSubmit={(data) => handleSubmit(data)}
          response={response}
        />
      )}

      <Footer />
    </div>
  )
}

export default AdminDashboard
