import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/Customers.css";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    username: '',
    email: '',
    phone: '',
    address: '',
    monthlySalary: '',
    creditScore: '',
    employmentStatus: 'Employed'
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    console.log("TOKEN IN CUSTOMERS:", localStorage.getItem("token"));
    setLoading(true);

    api.get("/customer")
      .then(res => {
        console.log("CUSTOMERS RESPONSE:", res.data);
        setCustomers(res.data);
        setError(null);
      })
      .catch(err => {
        console.error("CUSTOMERS ERROR:", err);
        setError("Failed to fetch customers");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await api.delete(`/customer/${id}`);
        fetchCustomers();
      } catch (err) {
        alert('Failed to delete customer');
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await api.put(`/customer/${editingCustomer.id}`, formData);
      } else {
        await api.post('/customer', formData);
      }
      setShowForm(false);
      setEditingCustomer(null);
      resetForm();
      fetchCustomers();
    } catch (err) {
      alert('Failed to save customer');
      console.error(err);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name || '',
      surname: customer.surname || '',
      username: customer.username || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      monthlySalary: customer.monthlySalary || '',
      creditScore: customer.creditScore || '',
      employmentStatus: customer.employmentStatus || 'Employed'
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      surname: '',
      username: '',
      email: '',
      phone: '',
      address: '',
      monthlySalary: '',
      creditScore: '',
      employmentStatus: 'Employed'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getLoanEligibilityColor = (eligible) => {
    return eligible ? '#10b981' : '#ef4444';
  };

  const getCreditScoreClass = (score) => {
    if (score >= 750) return 'excellent';
    if (score >= 650) return 'good';
    if (score >= 550) return 'fair';
    return 'poor';
  };

  if (loading) {
    return <div className="loading">Loading customers...</div>;
  }

  return (
    <div className="customers-container">
      <div className="header">
        <div>
          <h1>Bank Customer Management</h1>
          <p className="subtitle">Manage customer information and loan eligibility</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setShowForm(true);
            setEditingCustomer(null);
            resetForm();
          }}
        >
          + Add New Customer
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <div className="card-icon">👥</div>
          <div className="card-content">
            <p className="card-label">Total Customers</p>
            <h3 className="card-value">{customers.length}</h3>
          </div>
        </div>
        <div className="card">
          <div className="card-icon">✓</div>
          <div className="card-content">
            <p className="card-label">Loan Eligible</p>
            <h3 className="card-value">
              {customers.filter(c => c.loanEligible).length}
            </h3>
          </div>
        </div>
        <div className="card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <p className="card-label">Total Loan Capacity</p>
            <h3 className="card-value">
              {formatCurrency(
                customers.reduce((sum, c) => sum + (c.maxLoanAmount || 0), 0)
              )}
            </h3>
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="table-container">
        <table className="customers-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Monthly Salary</th>
              <th>Credit Score</th>
              <th>Employment</th>
              <th>Loan Eligible</th>
              <th>Max Loan Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  <div className="customer-name">
                    <div className="avatar">
                      {customer.name?.charAt(0)}{customer.surname?.charAt(0)}
                    </div>
                    <div>
                      <div className="name-primary">
                        {customer.name} {customer.surname}
                      </div>
                      <div className="name-secondary">@{customer.username}</div>
                    </div>
                  </div>
                </td>
                <td>{customer.email}</td>
                <td>{customer.phone || 'N/A'}</td>
                <td>
                  <span className="salary">
                    {customer.monthlySalary ? formatCurrency(customer.monthlySalary) : 'N/A'}
                  </span>
                </td>
                <td>
                  <span className={`credit-score ${getCreditScoreClass(customer.creditScore)}`}>
                    {customer.creditScore || 'N/A'}
                  </span>
                </td>
                <td>
                  <span className="employment-badge">
                    {customer.employmentStatus || 'N/A'}
                  </span>
                </td>
                <td>
                  <span
                    className="eligibility-badge"
                    style={{
                      backgroundColor: customer.loanEligible
                        ? 'rgba(16, 185, 129, 0.1)'
                        : 'rgba(239, 68, 68, 0.1)',
                      color: getLoanEligibilityColor(customer.loanEligible)
                    }}
                  >
                    {customer.loanEligible ? '✓ Eligible' : '✗ Not Eligible'}
                  </span>
                </td>
               <td>
                 <span className="loan-amount">
                   {customer.loanEligible && customer.maxLoanAmount
                     ? formatCurrency(customer.maxLoanAmount)
                     : customer.loanEligible === false
                       ? 'Not Eligible'
                       : 'N/A'}
                 </span>
               </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(customer)}
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(customer.id)}
                      title="Delete"
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {customers.length === 0 && !loading && (
          <div className="empty-state">
            <p>No customers found. Add your first customer to get started!</p>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    value={formData.surname}
                    onChange={(e) => setFormData({...formData, surname: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Username *</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Monthly Salary *</label>
                  <input
                    type="number"
                    value={formData.monthlySalary}
                    onChange={(e) => setFormData({...formData, monthlySalary: e.target.value})}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label>Credit Score *</label>
                  <input
                    type="number"
                    value={formData.creditScore}
                    onChange={(e) => setFormData({...formData, creditScore: e.target.value})}
                    required
                    min="300"
                    max="850"
                  />
                </div>


                <div className="form-group">
                  <label>Employment Status *</label>
                  <select
                    value={formData.employmentStatus}
                    onChange={(e) => setFormData({...formData, employmentStatus: e.target.value})}
                    required
                  >
                    <option value="Employed">Employed</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Unemployed">Unemployed</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingCustomer ? 'Update Customer' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}