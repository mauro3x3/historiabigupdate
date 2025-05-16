import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MapGame, asMapGameArray } from '@/types/mapGame';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Plus, Play, Settings, Map } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import MapNavigation from '@/components/maps/MapNavigation';

const MapGames: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [newGameTitle, setNewGameTitle] = useState('');
  const [newGameDescription, setNewGameDescription] = useState('');

  const { data: mapGames, isLoading, refetch } = useQuery({
    queryKey: ['mapGames'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('map_games')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching map games:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch map games',
          variant: 'destructive'
        });
        return [];
      }
      
      return asMapGameArray(data || []);
    }
  });

  const handleCreateGame = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'You need to sign in to create a map game',
        variant: 'destructive'
      });
      return;
    }

    if (!newGameTitle.trim()) {
      toast({
        title: 'Required field',
        description: 'Please provide a title for your game',
        variant: 'destructive'
      });
      return;
    }

    const { data, error } = await supabase
      .from('map_games')
      .insert({
        title: newGameTitle,
        description: newGameDescription || null,
        created_by: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating game:', error);
      toast({
        title: 'Error',
        description: 'Failed to create map game',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Game created',
      description: 'Your map game has been created successfully'
    });
    
    setIsCreating(false);
    setNewGameTitle('');
    setNewGameDescription('');
    refetch();
    
    // Navigate to the game editor
    navigate(`/map-games/${data.id}/edit`);
  };

  const goToGame = (gameId: string) => {
    navigate(`/map-games/${gameId}`);
  };

  const goToEditGame = (gameId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/map-games/${gameId}/edit`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MapNavigation />
      
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-timelingo-navy">Map Games</h1>
            <p className="text-gray-600 mt-1">Test your historical knowledge by guessing when maps are from</p>
          </div>
          {user && (
            <Button onClick={() => setIsCreating(true)} className="bg-timelingo-purple hover:bg-timelingo-purple/90 flex items-center">
              <Plus size={18} className="mr-2" />
              Create New Game
            </Button>
          )}
        </div>

        {isCreating && (
          <Card className="mb-8 border-timelingo-purple/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-timelingo-purple/10 to-purple-100 rounded-t-lg">
              <CardTitle>Create New Map Game</CardTitle>
              <CardDescription>Create a new game where players guess the year of historical maps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div>
                <label htmlFor="title" className="text-sm font-medium block mb-1">Title*</label>
                <input
                  id="title"
                  type="text"
                  className="w-full p-2 border rounded-md border-gray-300 focus:border-timelingo-purple focus:ring-1 focus:ring-timelingo-purple"
                  value={newGameTitle}
                  onChange={(e) => setNewGameTitle(e.target.value)}
                  placeholder="e.g., European Borders Through History"
                />
              </div>
              <div>
                <label htmlFor="description" className="text-sm font-medium block mb-1">Description (optional)</label>
                <textarea
                  id="description"
                  className="w-full p-2 border rounded-md border-gray-300 focus:border-timelingo-purple focus:ring-1 focus:ring-timelingo-purple"
                  value={newGameDescription}
                  onChange={(e) => setNewGameDescription(e.target.value)}
                  placeholder="Describe your map game..."
                  rows={3}
                />
              </div>
              <p className="text-sm text-gray-500 italic">
                After creating your game, you'll be able to add map entries with images and set the correct years.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2 bg-gray-50 rounded-b-lg">
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
              <Button onClick={handleCreateGame} className="bg-timelingo-purple hover:bg-timelingo-purple/90">Create Game</Button>
            </CardFooter>
          </Card>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-timelingo-purple border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading games...</p>
          </div>
        ) : mapGames && mapGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mapGames.map((game) => (
              <Card 
                key={game.id} 
                className="cursor-pointer hover:shadow-md transition-shadow border-gray-200 hover:border-timelingo-purple/30 overflow-hidden"
                onClick={() => goToGame(game.id)}
              >
                <div className="h-2 bg-gradient-to-r from-timelingo-purple to-purple-400"></div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-timelingo-navy">{game.title}</CardTitle>
                    <div className="p-2 bg-timelingo-purple/10 rounded-full">
                      <Map size={18} className="text-timelingo-purple" />
                    </div>
                  </div>
                  {game.description && <CardDescription>{game.description}</CardDescription>}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(game.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between border-t bg-gray-50">
                  <Button 
                    variant="outline" 
                    onClick={() => goToGame(game.id)}
                    className="border-timelingo-purple text-timelingo-purple hover:bg-timelingo-purple/10"
                  >
                    <Play size={16} className="mr-2" />
                    Play
                  </Button>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      const url = `${window.location.origin}/map-games/${game.id}`;
                      navigator.clipboard.writeText(url);
                      toast({ title: 'Link copied!', description: 'Game link copied to clipboard.' });
                    }}
                    className="border-timelingo-gold text-timelingo-gold hover:bg-yellow-50"
                  >
                    Share
                  </Button>
                  {user && user.id === game.created_by && (
                    <Button variant="outline" onClick={(e) => goToEditGame(game.id, e)}>
                      <Settings size={16} className="mr-2" />
                      Edit
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 p-10">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Map size={32} className="text-timelingo-purple" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No map games available yet</h3>
            <p className="mb-6 text-gray-600">Create your first game to begin testing historical map knowledge</p>
            {user && (
              <Button onClick={() => setIsCreating(true)} className="bg-timelingo-purple hover:bg-timelingo-purple/90">
                <Plus size={16} className="mr-2" />
                Create Your First Game
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapGames;
