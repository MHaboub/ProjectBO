import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

import { usersApi } from "../data/api";

const Profile = () => {
  const { currentUser, setCurrentUser, logout } = useAuth();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    username: currentUser?.username || "",
    role: currentUser?.role || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // New state variables to track password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await usersApi.update(currentUser.id, profileData);
      setCurrentUser(updatedUser);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation password must match.",
        variant: "destructive",
      });
      return;
    }

    try {
      await usersApi.changePassword(currentUser.id, passwordData.currentPassword, passwordData.newPassword);
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast({
        title: "Password update failed",
        description: error.message || "There was an error updating your password.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="animate-enter space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border">
              <img 
                src={'https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=' + currentUser?.firstName + '+' + currentUser?.lastName}   
                alt={currentUser?.firstName} 
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-semibold">{currentUser?.firstName +" "+currentUser?.lastName} </h2>
            <p className="text-sm text-muted-foreground">{currentUser?.username}</p>
            <div className="mt-2 px-3 py-1 bg-muted rounded-full text-xs font-medium uppercase">
              {currentUser?.role}
            </div>
            <Button 
              variant="outline" 
              className="mt-6 w-full"
              onClick={logout}
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
        
        <div className="w-full md:w-1/2">
          <Tabs defaultValue="account" className="w-full "> 
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Account Settings</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Card>
                <form onSubmit={handleProfileSubmit}>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                      Update your account information here.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">User Name</Label>
                    <Input
                      id="username"
                      value={profileData.username}
                      onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                      placeholder={currentUser.username}
                    />
                    </div>
                   
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Save Changes</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            <TabsContent value="security">
              <Card>
                <form onSubmit={handlePasswordSubmit}>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 relative">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-9 text-gray-500"
                        tabIndex={-1}
                        aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                      >
                        {showCurrentPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                    <div className="space-y-2 relative">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-9 text-gray-500"
                        tabIndex={-1}
                        aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                      >
                        {showNewPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                    <div className="space-y-2 relative">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-9 text-gray-500"
                        tabIndex={-1}
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      >
                        {showConfirmPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Update Password</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
