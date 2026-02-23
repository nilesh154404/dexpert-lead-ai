import React, { useEffect, useState } from 'react';

interface Plan {
  id: number;
  name: string;
  price: number;
  durationMonths: number;
  productLimit: number;
  promptLimit: number;
  productEditLimit: number;
}

const PlanSelection: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    fetch('/api/subscription/available-plans')
      .then(res => res.json())
      .then(data => setPlans(data));
  }, []);

  const handleChoose = (plan: Plan) => {
    setSelectedPlan(plan);
    setApproved(false);
  };

  const handleApprove = async () => {
    if (!selectedPlan) return;
    setLoading(true);
    // Replace adminId with actual logged-in admin id
    await fetch('/api/subscription/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId: selectedPlan.id, adminId: 1 }),
    });
    setLoading(false);
    setApproved(true);
  };

  return (
    <div>
      <h2>Available Plans</h2>
      <div style={{ display: 'flex', gap: 20 }}>
        {plans.map(plan => (
          <div key={plan.id} style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
            <h3>{plan.name}</h3>
            <p>Price: ₹{plan.price}</p>
            <p>Duration: {plan.durationMonths} month(s)</p>
            <button onClick={() => handleChoose(plan)}>Choose Plan</button>
          </div>
        ))}
      </div>
      {selectedPlan && (
        <div style={{ marginTop: 32, border: '1px solid #888', padding: 24, borderRadius: 8 }}>
          <h3>Plan Details: {selectedPlan.name}</h3>
          <ul>
            <li>Product Limit: {selectedPlan.productLimit}</li>
            <li>Prompt Limit: {selectedPlan.promptLimit}</li>
            <li>Product Edit Limit: {selectedPlan.productEditLimit}</li>
            <li>Duration: {selectedPlan.durationMonths} month(s)</li>
            <li>Price: ₹{selectedPlan.price}</li>
          </ul>
          <button onClick={handleApprove} disabled={loading || approved}>
            {approved ? 'Plan Approved!' : loading ? 'Approving...' : 'Approve'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PlanSelection;
