import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import toast from 'react-hot-toast';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Doctor');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(fullName, email, password, role);
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error('Registration failed. Email may already exist.');
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
          <h1 style={{fontSize:'20px', fontWeight:'bold', color:'#1a1a1a'}}>Create Account</h1>
          <p style={{color:'#666', fontSize:'14px'}}>Join HealthTrack Analytics</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block', fontSize:'14px', fontWeight:'500', marginBottom:'4px'}}>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Dr. John Smith"
              required
              style={{width:'100%', padding:'10px 12px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', boxSizing:'border-box'}}
            />
          </div>

          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block', fontSize:'14px', fontWeight:'500', marginBottom:'4px'}}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@healthtrack.com"
              required
              style={{width:'100%', padding:'10px 12px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', boxSizing:'border-box'}}
            />
          </div>

          <div style={{marginBottom:'14px'}}>
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

          <div style={{marginBottom:'20px'}}>
            <label style={{display:'block', fontSize:'14px', fontWeight:'500', marginBottom:'4px'}}>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{width:'100%', padding:'10px 12px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', boxSizing:'border-box', background:'white'}}
            >
              <option value="Doctor">Doctor</option>
              <option value="Analyst">Analyst</option>
            </select>
            <p style={{fontSize:'11px', color:'#888', marginTop:'4px'}}>Admin accounts can only be created by existing admins</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{width:'100%', padding:'12px', background:'#0E7490', color:'white', border:'none', borderRadius:'8px', fontSize:'14px', fontWeight:'600', cursor:'pointer'}}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div style={{marginTop:'16px', textAlign:'center'}}>
          <span style={{fontSize:'13px', color:'#666'}}>Already have an account? </span>
          <a href="/login" style={{fontSize:'13px', color:'#0E7490', fontWeight:'600', textDecoration:'none'}}>
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;