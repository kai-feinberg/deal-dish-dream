import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Profile, UserPreferences } from "@/types/database";

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [preferences, setPreferences<{
    dietaryRestrictions: string[];
    allergies: string[];
    preferences: string[];
  }>({
    dietaryRestrictions: [],
    allergies: [],
    preferences: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        
        // Fetch preferences
        const { data: preferencesData, error: preferencesError } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (preferencesError) throw preferencesError;
        
        setProfile(profileData as Profile);
        if (preferencesData) {
          setPreferences({
            dietaryRestrictions: preferencesData.dietary_restrictions || [],
            allergies: preferencesData.allergies || [],
            preferences: preferencesData.preferences || [],
          });
        }
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error loading profile",
          description: "We couldn't load your profile data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      
      {isLoading ? (
        <p>Loading profile...</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>View your profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={`https://avatar.vercel.sh/${user?.email}.png`} />
                <AvatarFallback>{profile?.first_name?.[0]}{profile?.last_name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">{profile?.first_name} {profile?.last_name}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Dietary Restrictions</h3>
              {preferences.dietaryRestrictions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {preferences.dietaryRestrictions.map((restriction) => (
                    <Badge key={restriction}>{restriction}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No dietary restrictions specified.</p>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Allergies</h3>
              {preferences.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {preferences.allergies.map((allergy) => (
                    <Badge key={allergy}>{allergy}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No allergies specified.</p>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Preferences</h3>
              {preferences.preferences.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {preferences.preferences.map((preference) => (
                    <Badge key={preference}>{preference}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No specific preferences specified.</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleSignOut}>Sign Out</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
