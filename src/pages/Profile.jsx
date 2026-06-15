import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { gamesData } from '../data/games';
import GameCard from '../components/GameCard';
import './Profile.css';

const Profile = () => {
  const { user, plan, trialSeconds } = useAuth();
  const [recentGames, setRecentGames] = useState([]);

  // Calculate playtime based on AuthContext
  const freeTimeLimitSeconds = 5400; // 90 mins
  const playtimeMinutes = Math.floor((freeTimeLimitSeconds - (trialSeconds || 0)) / 60);

  useEffect(() => {

    // For demonstration, grab a few random games as "recently played"
    // In a real app, you would save IDs to localStorage or Supabase
    const savedRecents = JSON.parse(localStorage.getItem('arcade_recent_games') || '[]');
    if (savedRecents.length > 0) {
      const recents = savedRecents.map(id => gamesData.find(g => g.id === id)).filter(Boolean);
      setRecentGames(recents);
    } else {
      setRecentGames(gamesData.slice(0, 4));
    }
  }, []);

  const handleManageBilling = async () => {
    try {
      // In production, this hits our actual backend server running Stripe
      const res = await fetch('http://localhost:4242/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: localStorage.getItem('stripe_session_id') || 'demo_session' 
          // Note: In reality, you look up Customer ID by Email
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Billing portal requires a live Stripe customer ID.");
      }
    } catch (e) {
      console.error(e);
      alert("Billing portal requires the backend server to be running.");
    }
  };

  if (!user) {
    return (
      <div className="profile-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h1 className="neon-text">ACCESS DENIED</h1>
        <p>You must log in to view your Empire Dashboard.</p>
      </div>
    );
  }

  const freeTimeLimit = 90; // 1.5 hours = 90 minutes
  const timeRemaining = Math.max(0, freeTimeLimit - playtimeMinutes);
  const progressPercentage = plan === 'PRO' ? 100 : (playtimeMinutes / freeTimeLimit) * 100;

  return (
    <div className="profile-container fade-in">
      {/* Identity Header */}
      <header className="profile-header glass-panel">
        <div className="avatar-section">
          <div className="avatar-circle">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <h1 className="username">{user.email.split('@')[0]}</h1>
            <p className="user-email">{user.email}</p>
          </div>
        </div>
        
        <div className="badge-section">
          <div className={`status-badge ${plan === 'PRO' ? 'badge-pro' : 'badge-free'}`}>
            {plan === 'PRO' ? 'HELL YEAH PRO' : 'FREE TIER'}
          </div>
          {plan === 'FREE' && (
            <button className="btn-upgrade" onClick={() => window.location.href = '/pricing'}>
              UPGRADE NOW
            </button>
          )}
        </div>
      </header>

      <div className="profile-grid">
        {/* Playtime Tracker */}
        <section className="stats-panel glass-panel">
          <h2>Global Empire Playtime</h2>
          <p className="stats-desc">Tracking playtime across Arcade, Iron Claw, and Gamer Gurls.</p>
          
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progressPercentage}%`, backgroundColor: plan === 'PRO' ? 'var(--neon-green)' : 'var(--neon-pink)' }}></div>
          </div>

          <div className="time-stats">
            {plan === 'PRO' ? (
              <h3 className="time-unlimited neon-green-text">UNLIMITED ACCESS</h3>
            ) : (
              <h3>
                <span className="time-spent">{playtimeMinutes}m</span> / <span className="time-total">{freeTimeLimit}m</span> Free Trial
              </h3>
            )}
          </div>
          {plan === 'FREE' && timeRemaining <= 15 && (
            <p className="warning-text">⚠️ You are nearing the paywall limit. Upgrade to PRO to avoid interruption!</p>
          )}
        </section>

        {/* Account Management */}
        <section className="billing-panel glass-panel">
          <h2>Subscription & Billing</h2>
          <div className="billing-details">
            <p><strong>Current Plan:</strong> {plan === 'PRO' ? 'Hell Yeah PRO ($12/mo)' : 'Free Tier'}</p>
            <p><strong>Status:</strong> Active</p>
          </div>
          <button className="btn-manage" onClick={handleManageBilling}>
            Manage Billing Portal
          </button>
        </section>
      </div>

      {/* Recent Games */}
      <section className="recent-games glass-panel">
        <h2>Jump Back In</h2>
        <div className="games-grid">
          {recentGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

    </div>
  );
};

export default Profile;
