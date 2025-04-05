import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { UserPreferences } from '@/types';
import { LogOut, Settings, Bell, Shield, User } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  has_completed_onboarding: boolean;
  created_at: string;
}

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    dietaryRestrictions: [],
    allergies: [],
    preferences: [],
  });
  
  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);
  
  const fetchProfileData = async () => {
    try {
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (profileError) throw profileError;
      setProfile(profileData as Profile);
      
      // Fetch preferences data
      const { data: preferencesData, error: preferencesError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (preferencesError) throw preferencesError;
      
      setUserPreferences({
        dietaryRestrictions: preferencesData.dietary_restrictions || [],
        allergies: preferencesData.allergies || [],
        preferences: preferencesData.preferences || [],
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  const handleUpdatePreferences = () => {
    setIsUpdating(true);
    
    // Simulating API call
    setTimeout(() => {
      setIsUpdating(false);
      
      toast({
        title: "Preferences updated",
        description: "Your dietary preferences have been updated successfully.",
      });
    }, 1000);
  };
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button variant="ghost" onClick={handleSignOut} className="text-muted-foreground hover:text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-muted rounded-full p-2 w-14 h-14 flex items-center justify-center">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <CardTitle>{profile?.first_name} {profile?.last_name || "User"}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <nav className="space-y-1">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="#preferences">
                    <Settings className="h-4 w-4 mr-2" />
                    Preferences
                  </a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="#notifications">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="#privacy">
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy & Security
                  </a>
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-2/3">
          <Tabs defaultValue="preferences">
            <TabsList className="mb-4">
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle id="preferences">Dietary Preferences</CardTitle>
                  <CardDescription>
                    Manage your dietary restrictions and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Dietary Restrictions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                      {userPreferences.dietaryRestrictions.length > 0 ? (
                        userPreferences.dietaryRestrictions.map((restriction, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="bg-recipe-orange/20 rounded-full p-1">
                              <div className="w-2 h-2 rounded-full bg-recipe-orange"></div>
                            </div>
                            <span>{restriction.charAt(0).toUpperCase() + restriction.slice(1)}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No dietary restrictions set.</p>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-3">Allergies</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                      {userPreferences.allergies.length > 0 ? (
                        userPreferences.allergies.map((allergy, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="bg-red-100 rounded-full p-1">
                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            </div>
                            <span>{allergy.charAt(0).toUpperCase() + allergy.slice(1)}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No allergies set.</p>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-3">Food Preferences</h3>
                    <div className="flex flex-wrap gap-2">
                      {userPreferences.preferences.length > 0 ? (
                        userPreferences.preferences.map((pref, index) => (
                          <span key={index} className="bg-muted px-3 py-1 rounded-full text-sm">
                            {pref}
                          </span>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No specific preferences set.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <a href="/onboarding">Edit Preferences</a>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle id="notifications">Notification Settings</CardTitle>
                  <CardDescription>
                    Manage how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weekly-deals" className="block">Weekly deals reminders</Label>
                      <p className="text-muted-foreground text-sm">Get notified when it's time to upload new deals</p>
                    </div>
                    <Switch id="weekly-deals" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="recipe-suggestions" className="block">Recipe suggestions</Label>
                      <p className="text-muted-foreground text-sm">Receive personalized recipe suggestions</p>
                    </div>
                    <Switch id="recipe-suggestions" defaultChecked />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle id="privacy">Privacy & Data</CardTitle>
                  <CardDescription>
                    Manage your privacy settings and data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="data-collection" className="block">Data collection</Label>
                      <p className="text-muted-foreground text-sm">Allow usage data collection to improve services</p>
                    </div>
                    <Switch id="data-collection" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Basic information about your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                    <p>{user?.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                    <p>{profile ? `${profile.first_name} ${profile.last_name}` : "Not provided"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Member since</h3>
                    <p>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "Unknown"}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Edit Profile</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
