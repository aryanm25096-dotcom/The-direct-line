import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  AlertCircle, 
  MapPin, 
  Upload, 
  Send, 
  LayoutDashboard, 
  Smartphone,
  Activity,
  Clock,
  CheckCircle2,
  Loader2,
  ArrowRight,
  TrendingUp,
  Users
} from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Textarea } from './components/ui/textarea';
import { Input } from './components/ui/input';
import { Badge } from './components/ui/badge';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DirectLine = () => {
  const [viewMode, setViewMode] = useState('citizen');
  const [tickets, setTickets] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    reportedBy: ''
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch tickets on component mount
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API}/tickets`);
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await axios.post(`${API}/tickets`, {
        description: formData.description,
        location: formData.location,
        reportedBy: formData.reportedBy || 'Anonymous'
      });

      setFormData({ description: '', location: '', reportedBy: '' });
      setSubmitSuccess(true);
      
      // Refresh tickets list
      await fetchTickets();

      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting ticket:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await axios.patch(`${API}/tickets/${ticketId}/status`, {
        status: newStatus
      });
      
      // Refresh tickets list
      await fetchTickets();
    } catch (error) {
      console.error('Error updating ticket status:', error);
      alert('Failed to update ticket status. Please try again.');
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch(status) {
      case 'Pending': return 'default';
      case 'Dispatched': return 'secondary';
      case 'Resolved': return 'outline';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'text-amber-600';
      case 'Dispatched': return 'text-blue-600';
      case 'Resolved': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const calculateMetrics = () => {
    const activeReports = tickets.filter(t => t.status !== 'Resolved').length;
    const resolvedTickets = tickets.filter(t => t.status === 'Resolved');
    
    let avgResolutionTime = 0;
    if (resolvedTickets.length > 0) {
      const totalTime = resolvedTickets.reduce((sum, ticket) => {
        const created = new Date(ticket.createdAt);
        const resolved = new Date(ticket.resolvedAt);
        return sum + (resolved - created);
      }, 0);
      avgResolutionTime = Math.round(totalTime / resolvedTickets.length / (1000 * 60 * 60));
    }

    return { activeReports, avgResolutionTime };
  };

  const metrics = calculateMetrics();

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">The Direct Line</h1>
                <p className="text-xs text-slate-500">Direct Citizen-Government Connect</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 bg-slate-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'citizen' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('citizen')}
                className="transition-all duration-200"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Citizen
              </Button>
              <Button
                variant={viewMode === 'admin' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('admin')}
                className="transition-all duration-200"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : viewMode === 'citizen' ? (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-3 mb-8">
              <h2 className="text-3xl font-bold text-slate-900">Report an Issue</h2>
              <p className="text-slate-600">Help us make your city better. Your report reaches the right department instantly.</p>
            </div>

            {submitSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <p className="text-green-800 font-medium">Issue reported successfully! Tracking ID will be sent to you.</p>
              </div>
            )}

            <Card className="shadow-lg border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <span>Issue Details</span>
                </CardTitle>
                <CardDescription>Provide details about the civic issue you want to report</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Your Name (Optional)</label>
                    <Input
                      placeholder="Enter your name"
                      value={formData.reportedBy}
                      onChange={(e) => setFormData({...formData, reportedBy: e.target.value})}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Description *</label>
                    <Textarea
                      placeholder="Describe the issue in detail..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                      rows={5}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>Location *</span>
                    </label>
                    <Input
                      placeholder="Enter location or landmark"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                      <Upload className="w-4 h-4 text-blue-600" />
                      <span>Upload Image (Optional)</span>
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200 cursor-pointer">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 transition-all duration-200 hover:shadow-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing with AI...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Submit Report
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Recent Reports</h3>
              <div className="space-y-3">
                {tickets.slice(0, 3).map(ticket => (
                  <Card key={ticket.id} className="hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center space-x-2">
                            <Badge variant={getStatusBadgeVariant(ticket.status)} className={getStatusColor(ticket.status)}>
                              {ticket.status}
                            </Badge>
                            <span className="text-xs text-slate-500">{ticket.id}</span>
                          </div>
                          <p className="text-sm text-slate-700 font-medium">{ticket.description}</p>
                          <p className="text-xs text-slate-500 flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{ticket.location}</span>
                          </p>
                        </div>
                        <span className="text-xs text-slate-400">{formatTimeAgo(ticket.createdAt)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Municipal Dashboard</h2>
                <p className="text-slate-600 mt-1">Monitor and manage citizen reports in real-time</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-l-blue-600 shadow-md hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span>Active Reports</span>
                  </CardDescription>
                  <CardTitle className="text-4xl font-bold text-slate-900">{metrics.activeReports}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-slate-600">
                    <TrendingUp className="w-4 h-4 mr-1 text-blue-600" />
                    <span>Requires attention</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-600 shadow-md hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span>Avg Resolution Time</span>
                  </CardDescription>
                  <CardTitle className="text-4xl font-bold text-slate-900">
                    {metrics.avgResolutionTime > 0 ? `${metrics.avgResolutionTime}h` : 'N/A'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 mr-1 text-green-600" />
                    <span>Faster than last week</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-600 shadow-md hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>Total Reports</span>
                  </CardDescription>
                  <CardTitle className="text-4xl font-bold text-slate-900">{tickets.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-slate-600">
                    <Activity className="w-4 h-4 mr-1 text-purple-600" />
                    <span>All time</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Incoming Reports</CardTitle>
                <CardDescription>Manage and dispatch citizen reports to relevant departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tickets.map(ticket => (
                    <div 
                      key={ticket.id} 
                      className="border border-slate-200 rounded-lg p-5 hover:border-blue-300 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-3">
                            <Badge 
                              variant={getStatusBadgeVariant(ticket.status)} 
                              className={`${getStatusColor(ticket.status)} font-semibold`}
                            >
                              {ticket.status}
                            </Badge>
                            <span className="text-sm font-mono text-slate-500">{ticket.id}</span>
                            <Badge variant="outline" className="text-xs">{ticket.category}</Badge>
                          </div>
                          <p className="text-slate-900 font-medium text-base">{ticket.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-slate-600">
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{ticket.location}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{ticket.reportedBy}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatTimeAgo(ticket.createdAt)}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        {ticket.status === 'Pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(ticket.id, 'Dispatched')}
                            className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                          >
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Dispatch
                          </Button>
                        )}
                        {ticket.status === 'Dispatched' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(ticket.id, 'Resolved')}
                            className="bg-green-600 hover:bg-green-700 transition-colors duration-200"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Mark Resolved
                          </Button>
                        )}
                        {ticket.status === 'Resolved' && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-slate-600 text-sm">
            The Direct Line - Connecting Citizens with Government • Powered by AI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DirectLine;
