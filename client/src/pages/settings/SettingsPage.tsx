import React, {useState, useEffect} from 'react';
import {useProfile, useUpdateProfile} from '../../hooks/useProfile'
import { User, Lock, Bell, Globe, Palette, CreditCard } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import { useEntrepreneurProfile, useUpdateEntrepreneurProfile, useInvestorProfile, useUpdateInvestorProfile } from '../../hooks/useExtendedProfile';

import api from '../../lib/api';

export const SettingsPage: React.FC = () => {
  
  const { user, updateUser: syncAuthUser } = useAuth();
  const { data: profile } = useProfile(user?._id ?? '');
  const { mutate: updateProfile, isPending } = useUpdateProfile(syncAuthUser);
  const { data: startupProfile } = useEntrepreneurProfile(user?.role === 'entrepreneur' ? user._id : '');
  const { mutate: updaateEntrepreneurProfile, isPending: isStartupPending } = useUpdateEntrepreneurProfile();
  const { data: investorProfile } = useInvestorProfile(user?.role === 'investor' ? user._id : '');
  const { mutate: updateInvestorProfile, isPending: isInvestorPending } = useUpdateInvestorProfile();
  
  if (!user) return null;

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordState, setPasswordState] = useState({ error: '', success: '' });
  const [isPasswordPending, setIsPasswordPending] = useState(false);
  const [otp, setOtp] = useState({enabled: false, modalOpen: false, input: '', error: '', loading: false, serverOtp: ''});
  const [startupName, setStartupName] = useState('');
  const [industry, setIndustry] = useState('');
  const [pitchSummary, setPitchSummary] = useState('');
  const [fundingNeeded, setFundingNeeded] = useState('');
  const [location, setLocation] = useState('');
  const [foundedYear, setFoundedYear] = useState('');
  const [teamSize, setTeamSize] = useState('');

  const [investmentInterests, setInvestmentInterests] = useState('');
  const [investmentStage, setInvestmentStage] = useState('');
  const [portfolioCompanies, setPortfolioCompanies] = useState('');
  const [minimumInvestment, setMinimumInvestment] = useState('');
  const [maximumInvestment, setMaximumInvestment] = useState('');
  const [totalInvestments, setTotalInvestments] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? '');
      setBio(profile.bio ?? '');
      setOtp(prev => ({ ...prev, enabled: profile.otpEnabled ?? false }));
    }
  }, [profile]);

  useEffect(() => {
    if (startupProfile) {
      setStartupName(startupProfile.startupName ?? '');
      setIndustry(startupProfile.industry ?? '');
      setPitchSummary(startupProfile.pitchSummary ?? '');
      setFundingNeeded(startupProfile.fundingNeeded ?? '');
      setLocation(startupProfile.location ?? '');
      setFoundedYear(startupProfile.foundedYear?.toString() ?? '');
      setTeamSize(startupProfile.teamSize?.toString() ?? '');
    }
  }, [startupProfile]);

  useEffect(() => {
    if (investorProfile) {
      setInvestmentInterests(investorProfile.investmentInterests.join(', '));
      setInvestmentStage(investorProfile.investmentStage.join(', '));
      setPortfolioCompanies(investorProfile.portfolioCompanies.join(', '));
      setMinimumInvestment(investorProfile.minimumInvestment ?? '');
      setMaximumInvestment(investorProfile.maximumInvestment ?? '');
      setTotalInvestments(investorProfile.totalInvestments?.toString() ?? '');
    }
  }, [investorProfile]);

  const handleChangePassword = async () => { 
    setPasswordState({ error: '', success: '' }); 
    
    if (newPassword !== confirmPassword) { 
      setPasswordState({ error: 'New passwords do not match', success: '' }); 
      return; 
    } 
    
    if (newPassword.length < 6) { 
      setPasswordState({ error: 'New password must be at least 6 characters', success: '' }); 
      return; 
    } 
    
    setIsPasswordPending(true); 
    try { 
      await api.patch('/auth/change-password', 
        { currentPassword: currentPassword.trim(), newPassword: newPassword.trim() 
      }); 
      setPasswordState({ error: '', success: 'Password updated successfully' }); 
      setCurrentPassword(''); 
      setNewPassword(''); 
      setConfirmPassword(''); 
    } catch (err: any) { 
      setPasswordState({ error: err.response?.data?.message ?? 'Failed to update password', success: '' }); 
    } finally { 
      setIsPasswordPending(false); 
    }
  };

  const handleGenerateOtp = async () => {
    setOtp(prev => ({ ...prev, error: '', loading: true }));

    try {
      const res = await api.post('/auth/2fa/generate');

      setOtp(prev => ({
        ...prev,
        modalOpen: true,
        serverOtp: res.data.otp,
        loading: false,
      }));
    } catch (err: any) {
      setOtp(prev => ({
        ...prev,
        error: err.response?.data?.message ?? 'Failed to generate OTP',
        loading: false,
      }));
    }
  };

  const handleVerifyOtp = async () => {
    setOtp(prev => ({ ...prev, error: '', loading: true }));

    try {
      await api.post('/auth/2fa/verify', { otpCode: otp.input });

      setOtp(prev => ({
        ...prev,
        enabled: true,
        modalOpen: false,
        input: '',
        serverOtp: '',
        loading: false,
      }));
    } catch (err: any) {
      setOtp(prev => ({
        ...prev,
        error: err.response?.data?.message ?? 'Invalid OTP',
        loading: false,
      }));
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and settings</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings navigation */}
        <Card className="lg:col-span-1">
          <CardBody className="p-2">
            <nav className="space-y-1">
              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-primary-700 bg-primary-50 rounded-md">
                <User size={18} className="mr-3" />
                Profile
              </button>
              
              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                <Lock size={18} className="mr-3" />
                Security
              </button>
              
              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                <Bell size={18} className="mr-3" />
                Notifications
              </button>
              
              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                <Globe size={18} className="mr-3" />
                Language
              </button>
              
              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                <Palette size={18} className="mr-3" />
                Appearance
              </button>
              
              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                <CreditCard size={18} className="mr-3" />
                Billing
              </button>
            </nav>
          </CardBody>
        </Card>
        
        {/* Main settings content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Profile Settings</h2>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar
                  src={profile?.avatar ?? null}
                  alt={profile?.name ?? null}
                  size="xl"
                />
                
                <div>
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                  <p className="mt-2 text-sm text-gray-500">
                    JPG, GIF or PNG. Max size of 800K
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                
                <Input
                  label="Email"
                  type="email"
                  defaultValue={user.email}
                />
                
                <Input
                  label="Role"
                  value={user.role}
                  disabled
                />
                
                <Input
                  label="Location"
                  defaultValue="San Francisco, CA"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              {user.role === 'entrepreneur' && (
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-medium text-gray-900">Startup Info</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Startup Name" value={startupName} onChange={(e) => setStartupName(e.target.value)} />
                      <Input label="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
                      <Input label="Funding Needed" value={fundingNeeded} onChange={(e) => setFundingNeeded(e.target.value)} />
                      <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                      <Input label="Founded Year" type="number" value={foundedYear} onChange={(e) => setFoundedYear(e.target.value)} />
                      <Input label="Team Size" type="number" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pitch Summary</label>
                      <textarea
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        rows={4}
                        value={pitchSummary}
                        onChange={(e) => setPitchSummary(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        isLoading={isStartupPending}
                        onClick={() => updaateEntrepreneurProfile({
                          userId: user._id,
                          data: {
                            startupName,
                            industry,
                            pitchSummary,
                            fundingNeeded,
                            location,
                            foundedYear: foundedYear ? parseInt(foundedYear) : null,
                            teamSize: teamSize ? parseInt(teamSize) : null,
                          },
                        })}
                      >
                        Save Startup Info
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              )}

              {user.role === 'investor' && (
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-medium text-gray-900">Investor Info</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Min Investment" value={minimumInvestment} onChange={(e) => setMinimumInvestment(e.target.value)} />
                      <Input label="Max Investment" value={maximumInvestment} onChange={(e) => setMaximumInvestment(e.target.value)} />
                      <Input label="Total Investments" type="number" value={totalInvestments} onChange={(e) => setTotalInvestments(e.target.value)} />
                    </div>
                    <Input
                      label="Investment Interests (comma separated)"
                      value={investmentInterests}
                      onChange={(e) => setInvestmentInterests(e.target.value)}
                    />
                    <Input
                      label="Investment Stages (comma separated)"
                      value={investmentStage}
                      onChange={(e) => setInvestmentStage(e.target.value)}
                    />
                    <Input
                      label="Portfolio Companies (comma separated)"
                      value={portfolioCompanies}
                      onChange={(e) => setPortfolioCompanies(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button
                        isLoading={isInvestorPending}
                        onClick={() => updateInvestorProfile({
                          userId: user._id,
                          data: {
                            investmentInterests: investmentInterests.split(',').map((s) => s.trim()).filter(Boolean),
                            investmentStage: investmentStage.split(',').map((s) => s.trim()).filter(Boolean),
                            portfolioCompanies: portfolioCompanies.split(',').map((s) => s.trim()).filter(Boolean),
                            minimumInvestment,
                            maximumInvestment,
                            totalInvestments: totalInvestments ? parseInt(totalInvestments) : 0,
                          },
                        })}
                      >
                        Save Investor Info
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              )}
              
              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button
                  isLoading={isPending}
                  onClick={() => updateProfile({ id: user!._id, data: { name, bio } })}
                >
                  Save Changes
                </Button>
              </div>
            </CardBody>
          </Card>
          
          {/* Security Settings */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
            </CardHeader>
            <CardBody className="space-y-6">
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    <Badge variant={otp.enabled ? 'success' : 'error'} className="mt-1">
                      {otp.enabled ? 'Enabled' : 'Not Enabled'}
                    </Badge>
                  </div>
                  {!otp.enabled && (
                    <Button variant="outline" onClick={handleGenerateOtp} isLoading={otp.loading}>
                      Enable
                    </Button>
                  )}
                </div>
                {otp.error && <p className="text-sm text-red-600 mt-2">{otp.error}</p>}
              </div>

              {otp.modalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-sm space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Verify OTP</h3>
                    <p className="text-sm text-gray-600">
                      Your OTP
                    </p>
                    <p className="text-2xl font-bold tracking-widest text-center text-primary-600">
                      {otp.serverOtp}
                    </p>
                    <Input
                      label="Enter OTP"
                      value={otp.input}
                      onChange={(e) => setOtp(prev => ({ ...prev, input: e.target.value }))}
                    />
                    {otp.error && <p className="text-sm text-red-600">{otp.error}</p>}
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setOtp(prev => ({ ...prev, modalOpen: false }))}>Cancel</Button>
                      <Button onClick={handleVerifyOtp} isLoading={otp.loading}>Verify</Button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Change Password</h3>
                <div className="space-y-4">
                  
                <Input
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <Input
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {passwordState.error && <p className="text-sm text-red-600 ">{passwordState.error}</p>}
                {passwordState.success && <p className="text-sm text-green-600">{passwordState.success}</p>}

                  
                  <div className="flex justify-end">
                      <Button 
                        onClick={handleChangePassword} 
                        isLoading={isPasswordPending}
                        disabled={!currentPassword || !newPassword || !confirmPassword}
                      >
                        Update Password
                      </Button>
                  </div>

                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};