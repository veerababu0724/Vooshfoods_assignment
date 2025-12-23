import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [status, setStatus] = useState({});

  useEffect(() => {
    fetch("https://vooshassignmentbackend.onrender.com/api/products")
      .then(res => res.json())
      .then(setProducts);

    fetch("https://vooshassignmentbackend.onrender.com/api/metrics")
      .then(res => res.json())
      .then(setMetrics);

    fetch("https://vooshassignmentbackend.onrender.com/api/status")
      .then(res => res.json())
      .then(setStatus);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>📊 Product Dashboard</h1>

      <h3>Pipeline Status:
        <span style={{
          color: status.status === "OK" ? "green" : "red",
          marginLeft: 10
        }}>
          {status.status}
        </span>
      </h3>

      <p>Last Run: {status.last_run_time}</p>
      {status.error_message && <p>Error: {status.error_message}</p>}

      <hr />

      <h3>Metrics</h3>
      <p>Total Products: {metrics.total_products}</p>
      <p>Average Price (USD): {metrics.avg_price_usd}</p>

      <hr />

      <h3>Products</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Price (USD)</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.product_id}>
              <td>{p.product_id}</td>
              <td>{p.title}</td>
              <td>{p.category}</td>
              <td>{p.price_usd}</td>
              <td>{p.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;