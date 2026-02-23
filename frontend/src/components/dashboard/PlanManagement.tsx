import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

interface Plan {
  id: number;
  name: string;
  price: number;
  durationMonths: number;
  productLimit: number;
  promptLimit: number;
  productEditLimit: number;
}

const PlanManagement: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    price: 0,
    durationMonths: 1,
    productCreateLimit: 0,
    productEditLimit: 0,
    promptCreateLimit: 0,
    promptEditLimit: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await apiClient.get('/subscription/plans');
        if (Array.isArray(data)) {
          setPlans(data);
        } else {
          setPlans([]);
          console.error('Plans API did not return an array:', data);
        }
      } catch (err) {
        setPlans([]);
        console.error('Error fetching plans:', err);
      }
    };
    fetchPlans();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'number' ? Number(value) : value,
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Ensure all numeric fields are numbers
      const payload = {
        ...form,
        price: Number(form.price),
        durationMonths: Number(form.durationMonths),
        productCreateLimit: Number(form.productCreateLimit),
        productEditLimit: Number(form.productEditLimit),
        promptCreateLimit: Number(form.promptCreateLimit),
        promptEditLimit: Number(form.promptEditLimit),
      };
      await apiClient.post('/subscription/plans', payload);
      setShowForm(false);
      // Refresh plans
      const data = await apiClient.get('/subscription/plans');
      if (Array.isArray(data)) {
        setPlans(data);
      } else {
        setPlans([]);
        console.error('Plans API did not return an array:', data);
      }
    } catch (err) {
      setPlans([]);
      console.error('Error creating or fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Manage Plans</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create Plan'}
        </button>
      </div>
      {showForm && (
        <form className="mb-6 grid grid-cols-2 gap-4" onSubmit={handleCreate}>
          <input name="name" placeholder="Plan Name" value={form.name} onChange={handleChange} required className="border p-2 rounded" />
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required className="border p-2 rounded" />
          <input name="durationMonths" type="number" placeholder="Duration (months)" value={form.durationMonths} onChange={handleChange} required className="border p-2 rounded" />
          <input name="productCreateLimit" type="number" placeholder="Product Create Limit" value={form.productCreateLimit} onChange={handleChange} required className="border p-2 rounded" />
          <input name="productEditLimit" type="number" placeholder="Product Edit Limit" value={form.productEditLimit} onChange={handleChange} required className="border p-2 rounded" />
          <input name="promptCreateLimit" type="number" placeholder="Prompt Create Limit" value={form.promptCreateLimit} onChange={handleChange} required className="border p-2 rounded" />
          <input name="promptEditLimit" type="number" placeholder="Prompt Edit Limit" value={form.promptEditLimit} onChange={handleChange} required className="border p-2 rounded" />
          <button type="submit" className="col-span-2 px-4 py-2 bg-green-600 text-white rounded" disabled={loading}>
            {loading ? 'Creating...' : 'Create Plan'}
          </button>
        </form>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(plans) && plans.length > 0 ? (
          plans.map(plan => (
            <div key={plan.id} className="border rounded-lg p-6 shadow-md min-w-[220px]">
              <h3 className="font-semibold text-lg mb-2">{plan.name}</h3>
              <p>Price: ₹{plan.price}</p>
              <p>Duration: {plan.durationMonths} month(s)</p>
              <p>Product Create Limit: {plan.productCreateLimit}</p>
              <p>Product Edit Limit: {plan.productEditLimit}</p>
              <p>Prompt Create Limit: {plan.promptCreateLimit}</p>
              <p>Prompt Edit Limit: {plan.promptEditLimit}</p>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-gray-500">No plans found or failed to load plans.</div>
        )}
      </div>
    </div>
  );
};

export default PlanManagement;
