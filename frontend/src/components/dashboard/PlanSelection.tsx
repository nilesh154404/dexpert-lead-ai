import React, { useEffect, useState } from 'react';

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

const PlanSelection: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscribedPlanId, setSubscribedPlanId] = useState<number|null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const [plansData, mySub] = await Promise.all([
          apiClient.get('/subscription/available-plans'),
          apiClient.get('/subscription/current').catch(() => null),
        ]);
        if (Array.isArray(plansData)) {
          setPlans(plansData);
        } else {
          setPlans([]);
        }
        if (mySub && mySub.planId) {
          setSubscribedPlanId(mySub.planId);
        } else if (mySub && mySub.plan && mySub.plan.id) {
          setSubscribedPlanId(mySub.plan.id);
        }
      } catch (err) {
        setPlans([]);
        setSubscribedPlanId(null);
        console.error('Error fetching plans:', err);
      }
    };
    fetchPlans();
  }, []);

  // Multi-step confirmation state
  const [confirmStep, setConfirmStep] = useState(0);
  const handleChoose = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
    setApproved(false);
    setConfirmStep(1);
  };

  const handleApprove = async () => {
    if (!selectedPlan) return;
    if (confirmStep < 3) {
      setConfirmStep(confirmStep + 1);
      return;
    }
    setLoading(true);
    try {
      await apiClient.post('/subscription/subscribe', { planId: selectedPlan.id });
      setApproved(true);
      setShowModal(false);
      setConfirmStep(0);
    } catch (err) {
      console.error('Error subscribing to plan:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Your Plan section */}
      {subscribedPlanId && plans.length > 0 && (() => {
        const myPlan = plans.find(p => p.id === subscribedPlanId);
        if (!myPlan) return null;
        return (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2 text-green-700">Your Plan</h2>
            <div className="border rounded-lg p-6 shadow-md min-w-[220px] ring-2 ring-green-500 bg-green-50 relative">
              <h3 className="font-semibold text-lg mb-2">{myPlan.name}</h3>
              <ul className="mb-2">
                <li>Product Create Limit: {myPlan.productCreateLimit}</li>
                <li>Prompt Create Limit: {myPlan.promptCreateLimit}</li>
                <li>Product Edit Limit: {myPlan.productEditLimit}</li>
                <li>Prompt Edit Limit: {myPlan.promptEditLimit}</li>
                <li>Duration: {myPlan.durationMonths} month(s)</li>
                <li>Price: ₹{myPlan.price}</li>
              </ul>
              <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">Current Plan</span>
            </div>
          </div>
        );
      })()}

      <h2 className="text-xl font-bold mb-4">Available Plans</h2>
      <div className="flex gap-6 flex-wrap">
        {(() => {
          let sortedPlans = plans;
          if (subscribedPlanId) {
            const idx = plans.findIndex(p => p.id === subscribedPlanId);
            if (idx > 0) {
              // Move selected plan to top
              sortedPlans = [plans[idx], ...plans.slice(0, idx), ...plans.slice(idx+1)];
            }
          }
          return sortedPlans.map(plan => (
            <div
              key={plan.id}
              className={
                'border rounded-lg p-6 shadow-md min-w-[220px] relative ' +
                (plan.id === subscribedPlanId ? 'ring-2 ring-green-500' : '')
              }
            >
              <h3 className="font-semibold text-lg mb-2">{plan.name}</h3>
              <p>Price: ₹{plan.price}</p>
              <p>Duration: {plan.durationMonths} month(s)</p>
              {plan.id === subscribedPlanId && (
                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">Your Selected Plan</span>
              )}
              <button
                className="mt-2 px-4 py-1 bg-blue-600 text-white rounded"
                onClick={() => handleChoose(plan)}
              >
                {plan.id === subscribedPlanId ? 'Selected (Switch?)' : 'Choose Plan'}
              </button>
            </div>
          ));
        })()}
      </div>

      {/* Modal for plan details and confirm (no external deps) */}
      {showModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto p-6 z-10 relative">
            <div className="text-lg font-bold mb-2">Plan Details: {selectedPlan.name}</div>
            <ul className="mb-4">
              <li>Product Create Limit: {selectedPlan.productCreateLimit}</li>
              <li>Prompt Create Limit: {selectedPlan.promptCreateLimit}</li>
              <li>Product Edit Limit: {selectedPlan.productEditLimit}</li>
              <li>Prompt Edit Limit: {selectedPlan.promptEditLimit}</li>
              <li>Duration: {selectedPlan.durationMonths} month(s)</li>
              <li>Price: ₹{selectedPlan.price}</li>
            </ul>
            {/* Multi-step confirmation messages */}
            {confirmStep === 1 && (
              <div className="mb-4 text-yellow-700 font-semibold">Are you sure you want to switch to this plan?</div>
            )}
            {confirmStep === 2 && (
              <div className="mb-4 text-yellow-700 font-semibold">This will replace your current plan. Continue?</div>
            )}
            {confirmStep === 3 && (
              <div className="mb-4 text-red-700 font-semibold">Final confirmation: Switching plans may affect your limits and access. Proceed?</div>
            )}
            <div className="flex gap-4">
              <button className="px-6 py-2 bg-green-600 text-white rounded" onClick={handleApprove} disabled={loading || approved}>
                {approved
                  ? 'Plan Approved!'
                  : loading
                  ? 'Approving...'
                  : confirmStep < 3
                  ? 'Next'
                  : 'Confirm Approve'}
              </button>
              <button className="px-6 py-2 bg-gray-300 text-gray-800 rounded" onClick={() => { setShowModal(false); setConfirmStep(0); }} disabled={loading}>Cancel</button>
            </div>
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onClick={() => { setShowModal(false); setConfirmStep(0); }} disabled={loading}>&times;</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanSelection;
