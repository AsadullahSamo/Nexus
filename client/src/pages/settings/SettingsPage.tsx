import React, {useState, useEffect, useRef} from 'react';
import {useProfile, useUpdateProfile} from '../../hooks/useProfile'
import { User, Lock, CreditCard } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import { useEntrepreneurProfile, useUpdateEntrepreneurProfile, useInvestorProfile, useUpdateInvestorProfile } from '../../hooks/useExtendedProfile';

import api from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

export const SettingsPage: React.FC = () => {

  const queryClient = useQueryClient()
  
  const { user, updateUser: syncAuthUser } = useAuth();
  const { data: profile } = useProfile(user?._id ?? '');
  const { mutate: updateProfile } = useUpdateProfile(syncAuthUser);
  const { data: startupProfile } = useEntrepreneurProfile(user?.role === 'entrepreneur' ? user._id : '');
  const { mutate: updateEntrepreneurProfile  } = useUpdateEntrepreneurProfile();
  const { data: investorProfile } = useInvestorProfile(user?.role === 'investor' ? user._id : '');
  const { mutate: updateInvestorProfile } = useUpdateInvestorProfile();
  
  if (!user) return null;

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordState, setPasswordState] = useState({ error: '', success: '' });
  const [isPasswordPending, setIsPasswordPending] = useState(false);
  const [otp, setOtp] = useState({enabled: false, modalOpen: false, input: '', error: '', loading: false, serverOtp: ''});
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'billing'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [entrepreneurFields, setEntrepreneurFields] = useState({
    startupName: '', industry: '', pitchSummary: '', fundingNeeded: '', location: '', 
    foundedYear: '', teamSize: ''
  });

  const [investorFields, setInvestorFields] = useState({
    investmentInterests: '', investmentStage: '', portfolioCompanies: '',
    minimumInvestment: '', maximumInvestment: '', totalInvestments: ''
  })



  const navigate = useNavigate()
  
  useEffect(() => {
    if (profile) {
      setName(profile.name ?? '');
      setBio(profile.bio ?? '');
      setOtp(prev => ({ ...prev, enabled: profile.otpEnabled ?? false }));
    }
  }, [profile]);

  useEffect(() => {
    if (startupProfile) {
      setEntrepreneurFields(({
        startupName: startupProfile.startupName ?? '',
        industry: startupProfile.industry ?? '',
        pitchSummary: startupProfile.pitchSummary ?? '',
        fundingNeeded: startupProfile.fundingNeeded ?? '',
        location: startupProfile.location ?? '',
        foundedYear: startupProfile.foundedYear?.toString() ?? '',
        teamSize: startupProfile.teamSize?.toString() ?? ''
      }));
    }
  }, [startupProfile]);

  useEffect(() => {
    if (investorProfile) {
      setInvestorFields( ({
        investmentInterests: investorProfile.investmentInterests.join(', '),
        investmentStage: investorProfile.investmentStage.join(', '),
        portfolioCompanies: investorProfile.portfolioCompanies.join(', '),
        minimumInvestment: investorProfile.minimumInvestment ?? '',
        maximumInvestment: investorProfile.maximumInvestment ?? '',
        totalInvestments: investorProfile.totalInvestments?.toString() ?? ''
      }));
    }
  }, [investorProfile]);

  const updateEntrepreneurField = (
    field: keyof typeof entrepreneurFields,
    value: string
  ) => {
    setEntrepreneurFields(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateInvestorField = (
    field: keyof typeof investorFields,
    value: string
  ) => {
    setInvestorFields(prev => ({
      ...prev,
      [field]: value,
    }));
  };

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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setIsUploadingAvatar(true);
    try {
      const res = await api.patch(`/users/${user!._id}/avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      syncAuthUser(res.data.user);
      await queryClient.refetchQueries({ queryKey: ['user', user!._id] });    
    } catch (err: any) {
      console.error('Avatar upload failed:', err);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const saves: Promise<any>[] = [
        new Promise((resolve, reject) =>
          updateProfile(
            { id: user!._id, data: { name, bio } },
            { onSuccess: resolve, onError: reject }
          )
        ),
      ];

      if (user!.role === 'entrepreneur') {
        saves.push(
          new Promise((resolve, reject) =>
            updateEntrepreneurProfile(
              {
                userId: user!._id,
                data: {
                  startupName: entrepreneurFields.startupName,
                  industry: entrepreneurFields.industry,
                  pitchSummary: entrepreneurFields.pitchSummary,
                  fundingNeeded: entrepreneurFields.fundingNeeded,
                  location: entrepreneurFields.location,
                  foundedYear: entrepreneurFields.foundedYear ? parseInt(entrepreneurFields.foundedYear) : null,
                  teamSize: entrepreneurFields.teamSize ? parseInt(entrepreneurFields.teamSize) : null,
                },
              },
              { onSuccess: resolve, onError: reject }
            )
          )
        );
      }

      if (user!.role === 'investor') {
        saves.push(
          new Promise((resolve, reject) =>
            updateInvestorProfile(
              {
                userId: user!._id,
                data: {
                  investmentInterests: investorFields.investmentInterests.split(',').map((s) => s.trim()).filter(Boolean),
                  investmentStage: investorFields.investmentStage.split(',').map((s) => s.trim()).filter(Boolean),
                  portfolioCompanies: investorFields.portfolioCompanies.split(',').map((s) => s.trim()).filter(Boolean),
                  minimumInvestment: investorFields.minimumInvestment,
                  maximumInvestment: investorFields.maximumInvestment,
                  totalInvestments: investorFields.totalInvestments ? parseInt(investorFields.totalInvestments) : 0,
                },
              },
              { onSuccess: resolve, onError: reject }
            )
          )
        );
      }

      await Promise.all(saves);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
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
             {[
                { icon: <User size={18} />, label: 'Profile', tab: 'profile' as const },
                { icon: <Lock size={18} />, label: 'Security', tab: 'security' as const },
                { icon: <CreditCard size={18} />, label: 'Billing', tab: 'billing' as const },
              ].map(({ icon, label, tab }) => (
                <button
                  key={label}
                  onClick={() => tab === 'billing' ? navigate('/payments') : setActiveTab(tab)}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3">{icon}</span>
                  {label}
                </button>
              ))}
            </nav>
          </CardBody>
        </Card>
        
        {/* Main settings content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Profile Settings</h2>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="flex items-center gap-6">
                  
                  <div className="flex items-center gap-6">
                    <Avatar 
                      src={user.avatar ? `${import.meta.env.VITE_SERVER_URL}/uploads/${user.avatar}` : null} 
                      alt={user?.name ?? null} 
                      size="xl" 
                    />
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        isLoading={isUploadingAvatar}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Change Photo
                      </Button>
                      <p className="mt-2 text-sm text-gray-500">JPG or PNG. Max size of 10MB</p>
                    </div>
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
                    disabled
                  />
                  
                  <Input
                    label="Role"
                    value={user.role}
                    disabled
                  />

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

                </div>
                

                {user.role === 'entrepreneur' && (
                  <Card>
                    <CardHeader>
                      <h2 className="text-lg font-medium text-gray-900">Startup Info</h2>
                    </CardHeader>
                    <CardBody className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Startup Name" value={entrepreneurFields.startupName} onChange={(e) =>updateEntrepreneurField('startupName', e.target.value) } />
                        <Input label="Industry" value={entrepreneurFields.industry} onChange={(e) => updateEntrepreneurField('industry', e.target.value) } />
                        <Input label="Funding Needed" value={entrepreneurFields.fundingNeeded} onChange={(e) => updateEntrepreneurField('fundingNeeded', e.target.value) } />
                        <Input label="Location" value={entrepreneurFields.location} onChange={(e) => updateEntrepreneurField('location', e.target.value) } />
                        <Input label="Founded Year" type="number" value={entrepreneurFields.foundedYear} onChange={(e) => updateEntrepreneurField('foundedYear', e.target.value) } />
                        <Input label="Team Size" type="number" value={entrepreneurFields.teamSize} onChange={(e) => updateEntrepreneurField('teamSize', e.target.value) } />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pitch Summary</label>
                        <textarea
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          rows={4}
                          value={entrepreneurFields.pitchSummary}
                          onChange={(e) => updateEntrepreneurField('pitchSummary', e.target.value)}
                        />
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
                        <Input label="Min Investment" value={investorFields.minimumInvestment} onChange={(e) => updateInvestorField('minimumInvestment', e.target.value) } />
                        <Input label="Max Investment" value={investorFields.maximumInvestment} onChange={(e) => updateInvestorField('maximumInvestment', e.target.value) } />
                        <Input label="Total Investments" type="number" value={investorFields.totalInvestments} onChange={(e) => updateInvestorField('totalInvestments', e.target.value) } />
                      </div>
                      <Input
                        label="Investment Interests (comma separated)"
                        value={investorFields.investmentInterests}
                        onChange={(e) => updateInvestorField('investmentInterests', e.target.value) }
                      />
                      <Input
                        label="Investment Stages (comma separated)"
                        value={investorFields.investmentStage}
                        onChange={(e) => updateInvestorField('investmentStage', e.target.value) }
                      />
                      <Input
                        label="Portfolio Companies (comma separated)"
                        value={investorFields.portfolioCompanies}
                        onChange={(e) => updateInvestorField('portfolioCompanies', e.target.value) }
                      />
                    </CardBody>
                  </Card>
                )}
                
                <div className="flex justify-end items-center gap-3">
                  {saveSuccess && (
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8L6.5 11.5L13 4.5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Saved successfully
                    </span>
                  )}
                  <Button variant="outline" onClick={() => {
                    setName(profile?.name ?? '');
                    setBio(profile?.bio ?? '');
                  }}>
                    Cancel
                  </Button>
                  <Button isLoading={isSaving} onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          
          {/* Security Settings */}
          {activeTab === 'security' && (
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
          )}
        </div>
      </div>
    </div>
  );
};