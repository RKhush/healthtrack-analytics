import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await login(email, password);
      authLogin(data);
      toast.success(`Welcome back, ${data.fullName}!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Invalid email or password!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{minHeight:'100vh', background:'linear-gradient(135deg, #1B3A6B, #0E7490)', display:'flex', alignItems:'center', justifyContent:'center', padding:'16px'}}>
      <div style={{background:'white', borderRadius:'16px', padding:'32px', width:'100%', maxWidth:'400px', boxShadow:'0 25px 50px rgba(0,0,0,0.25)'}}>
        
        <div style={{textAlign:'center', marginBottom:'24px'}}>
          <div style={{width:'48px', height:'48px', background:'#0E7490', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px'}}>
            <span style={{color:'white', fontWeight:'bold'}}>HT</span>
          </div>
          <h1 style={{fontSize:'20px', fontWeight:'bold', color:'#1a1a1a'}}>HealthTrack</h1>
          <p style={{color:'#666', fontSize:'14px'}}>Analytics Dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block', fontSize:'14px', fontWeight:'500', marginBottom:'4px'}}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@healthtrack.com"
              required
              style={{width:'100%', padding:'10px 12px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', boxSizing:'border-box'}}
            />
          </div>

          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block', fontSize:'14px', fontWeight:'500', marginBottom:'4px'}}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{width:'100%', padding:'10px 12px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', boxSizing:'border-box'}}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{width:'100%', padding:'12px', background:'#0E7490', color:'white', border:'none', borderRadius:'8px', fontSize:'14px', fontWeight:'600', cursor:'pointer'}}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{marginTop:'16px', padding:'12px', background:'#f5f5f5', borderRadius:'8px', fontSize:'12px', color:'#666', textAlign:'center'}}>
          Demo: admin@healthtrack.com / Admin@123
        </div>
      </div>
    </div>
  );
};

export default Login;