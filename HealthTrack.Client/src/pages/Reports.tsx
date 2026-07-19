import Layout from '../components/Layout';

const Reports = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500">Live Power BI Analytics Dashboard</p>
        </div>
        <div 
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" 
          style={{height: '600px'}}
        >
          <iframe
            title="HealthTrack-Report"
            src="https://app.powerbi.com/view?r=eyJrIjoiMDFlZmQxMDktM2UwZi00MGFlLThmOGUtOGY5OWY1ZGNjZDNhIiwidCI6ImI2NDE3Y2QwLTFmNzMtNDQ3MS05YTM5LTIwOTUzODIyYTM0YSIsImMiOjN9"
            style={{width:'100%', height:'100%', border:'none'}}
            allowFullScreen
          />
        </div>
      </div>
    </Layout>
  );
};

export default Reports;