import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [leads, setLeads] = useState([]);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("");
  const [insights, setInsights] = useState([]);
  const fetchInsights = async () => {
    try {
      const res = await axios.get(
        "https://ai-sales-dashboard-api.onrender.com/api/insights",
      );

      setInsights(res.data.insights);
    } catch (error) {
      console.error(error);
    }
  };

  const chartData = [
    {
      status: "Qualified",
      count: leads.filter((l) => l.status === "Qualified").length,
    },
    {
      status: "Contacted",
      count: leads.filter((l) => l.status === "Contacted").length,
    },
    {
      status: "Proposal Sent",
      count: leads.filter((l) => l.status === "Proposal Sent").length,
    },
    {
      status: "Won",
      count: leads.filter((l) => l.status === "Won").length,
    },
  ];

useEffect(() => {
  fetchLeads();
}, []);

  const fetchLeads = async () => {
    try {
      const res = await axios.get(
        "https://ai-sales-dashboard-api.onrender.com/api/leads",
      );

      setLeads(res.data);

      await fetchInsights();
    } catch (error) {
      console.error(error);
    }
  };

  const addLead = async (e) => {
    e.preventDefault();

    if (!name || !company || !status) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post(
        "https://ai-sales-dashboard-api.onrender.com/api/leads",
        {
          name,
          company,
          status,
        },
      );

   setName("");
   setCompany("");
   setStatus("");

   await fetchLeads();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteLead = async (id) => {
    try {
      await axios.delete(
        `https://ai-sales-dashboard-api.onrender.com/api/leads/${id}`,
      );

      await fetchLeads();
    } catch (error) {
      console.error(error);
    }
  };

  const updateLeadStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `https://ai-sales-dashboard-api.onrender.com/api/leads/${id}`,
        {
          status: newStatus,
        },
      );

      await fetchLeads();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 p-6">
      <h1 className="text-5xl font-bold mb-8 text-slate-800">
        AI Sales Dashboard
      </h1>

      <p className="text-gray-600 mb-6">
        Monitor leads, track conversions, and generate AI-powered business
        insights.
      </p>

      {/* KPI CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 ">
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
          <h3 className="text-gray-500">Total Leads</h3>

          <p className="text-3xl font-bold">{leads.length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition ">
          <h3 className="text-gray-500">Qualified</h3>

          <p className="text-3xl font-bold text-green-600">
            {leads.filter((l) => l.status === "Qualified").length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
          <h3 className="text-gray-500">Won</h3>

          <p className="text-3xl font-bold text-blue-600">
            {leads.filter((l) => l.status === "Won").length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
          <h3 className="text-gray-500">Conversion</h3>

          <p className="text-3xl font-bold">18%</p>
        </div>
      </div>

      {/* AI INSIGHTS */}

      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 border-l-4 border-blue-500">
        <h2 className="text-2xl font-bold mb-4">AI Business Insights</h2>

        <ul className="space-y-2">
          {insights.map((item, index) => (
            <li key={index}>🤖 {item}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <h2 className="text-2xl font-bold mb-4">Sales Pipeline Analytics</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="status" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ADD LEAD FORM */}

      <form
        onSubmit={addLead}
        className="bg-white p-6 rounded-2xl shadow-lg mb-6 flex flex-wrap gap-3"
      >
        <input
          placeholder="Lead Name"
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Company"
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <select
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Select Status</option>

          <option value="Qualified">Qualified</option>

          <option value="Contacted">Contacted</option>

          <option value="Proposal Sent">Proposal Sent</option>

          <option value="Won">Won</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg cursor-pointer transition"
        >
          Add Lead
        </button>
      </form>

      {/* LEADS TABLE */}

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Recent Leads</h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Name</th>

              <th className="text-left py-2">Company</th>

              <th className="text-left py-2">Status</th>

              <th className="text-left py-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id} className="border-b">
                <td className="py-2">{lead.name}</td>

                <td>{lead.company}</td>

                <td>
                  <select
                    value={lead.status}
                    onChange={(e) => updateLeadStatus(lead._id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="Contacted">Contacted</option>

                    <option value="Qualified">Qualified</option>

                    <option value="Proposal Sent">Proposal Sent</option>

                    <option value="Won">Won</option>
                  </select>
                </td>

                <td>
                  <button
                    onClick={() => deleteLead(lead._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg cursor-pointer transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
