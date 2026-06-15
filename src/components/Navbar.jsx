import React, { useState, useEffect } from 'react';
import { Gamepad2, Menu, X, Search, User, Globe, Sun, Moon, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { getBranding } from '../config/branding';
import './Navbar.css';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, plan, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const brand = getBranding();

  useEffect(() => {
    if (user) {
      const checkAdmin = async () => {
        const { supabase } = await import('../supabaseClient');
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (data && data.role === 'admin') setIsAdmin(true);
      };
      checkAdmin();
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled glass-panel' : ''}`}>
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {brand.domain === 'cyborggamers.com' ? (
            <span style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '1.5rem', color: '#00f3ff', letterSpacing: '2px' }}>{brand.logoText}</span>
          ) : (
            <img src="/logo.png" alt={brand.name} style={{ height: '40px', objectFit: 'contain' }} />
          )}
        </Link>

        <div className="navbar-links desktop-only">
          <Link to="/" className="nav-link active">{t('nav.home')}</Link>
          <Link to="/games" className="nav-link">{t('nav.games')}</Link>
          <Link to="/categories" className="nav-link">{t('nav.categories')}</Link>
          <a href="https://discord.gg/v33kZn6c" target="_blank" rel="noopener noreferrer" className="nav-link" style={{ color: '#5865F2', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <MessageSquare size={16} /> Discord
          </a>
          {user && <Link to="/profile" className="nav-link" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Profile</Link>}
          {user && <Link to="/my-library" className="nav-link" style={{ color: 'var(--primary-color)' }}>My Library</Link>}
          <Link to="/about" className="nav-link">{t('nav.about')}</Link>
        </div>

        <div className="navbar-actions desktop-only">
          <div className="lang-switcher" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
            <Globe size={16} />
            <select 
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              value={i18n.language || 'en'}
              style={{ background: 'transparent', color: 'inherit', border: 'none', outline: 'none', cursor: 'pointer' }}
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
              <option value="pt">PT</option>
              <option value="it">IT</option>
              <option value="hi">HI</option>
              <option value="pa">PA</option>
            </select>
          </div>
          <button className="icon-btn" aria-label="Search">
            <Search size={20} />
          </button>
          <button className="icon-btn" aria-label="Toggle Theme" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="user-greeting" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={16} />
                {user.user_metadata?.username || user.email}
                {plan === 'PRO' && <span style={{ background: 'var(--accent-gradient)', color: '#fff', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '10px', fontWeight: 'bold' }}>PRO</span>}
                {isAdmin && <Link to="/admin" style={{ marginLeft: '0.5rem', background: 'var(--primary-color)', color: '#000', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '10px', fontWeight: 'bold', textDecoration: 'none' }}>ADMIN</Link>}
              </span>
              <button className="btn btn-outline" onClick={logout}>{t('nav.logout')}</button>
              {plan === 'FREE' && <button className="btn btn-primary" onClick={() => navigate('/pricing')}>{t('nav.gopro')}</button>}
            </div>
          ) : (
            <>
              <button className="btn btn-outline" onClick={() => navigate('/login')}>{t('nav.login')}</button>
              <button className="btn btn-primary" onClick={() => navigate('/signup')}>{t('nav.signup')}</button>
            </>
          )}
        </div>

        <button 
          className="mobile-menu-btn mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu glass-panel animate-fade-in">
          <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>{t('nav.home')}</Link>
          <Link to="/games" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>{t('nav.games')}</Link>
          <Link to="/categories" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>{t('nav.categories')}</Link>
          <a href="https://discord.gg/v33kZn6c" target="_blank" rel="noopener noreferrer" className="mobile-nav-link" style={{ color: '#5865F2', fontWeight: 'bold' }}>Discord Community</a>
          {user && <Link to="/profile" className="mobile-nav-link" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }} onClick={() => setMobileMenuOpen(false)}>Profile</Link>}
          {user && <Link to="/my-library" className="mobile-nav-link" style={{ color: 'var(--primary-color)' }} onClick={() => setMobileMenuOpen(false)}>My Library</Link>}
          <div className="mobile-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'inherit' }}>
            <Globe size={18} />
            <select 
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              value={i18n.language || 'en'}
              style={{ background: 'transparent', color: 'inherit', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '4px 8px', outline: 'none', cursor: 'pointer', flex: 1 }}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="pt">Português</option>
              <option value="it">Italiano</option>
              <option value="hi">हिंदी</option>
              <option value="pa">ਪੰਜਾਬੀ</option>
            </select>
          </div>
          <button className="mobile-nav-link" style={{ background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'inherit' }} onClick={toggleTheme}>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <hr className="menu-divider" />
          {user ? (
            <>
              <div style={{ padding: '0.5rem 0', color: 'var(--primary-color)' }}>{t('nav.hello')}, {user.user_metadata?.username || user.email}</div>
              <button className="btn btn-outline full-width" onClick={() => { logout(); setMobileMenuOpen(false); }}>{t('nav.logout')}</button>
              {plan === 'FREE' && <button className="btn btn-primary full-width" onClick={() => { navigate('/pricing'); setMobileMenuOpen(false); }}>{t('nav.gopro')}</button>}
            </>
          ) : (
            <>
              <button className="btn btn-outline full-width" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>{t('nav.login')}</button>
              <button className="btn btn-primary full-width" onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }}>{t('nav.signup')}</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
