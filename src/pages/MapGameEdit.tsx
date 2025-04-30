import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { MapGame, MapGameEntry, asMapGame, asMapGameEntryArray } from '@/types/mapGame';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Play, Save, Trash2, Plus, Upload, ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const MapGameEdit: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [addingEntry, setAddingEntry] = useState(false);
  const [newEntryYear, setNewEntryYear] = useState<number>(2000);
  const [newEntryHint, setNewEntryHint] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Fetch game details
  const { data: game, isLoading: isGameLoading, refetch: refetchGame } = useQuery({
    queryKey: ['mapGameEdit', gameId],
    queryFn: async () => {
      if (!gameId) return null;
      const { data, error } = await supabase
        .from('map_games')
        .select('*')
        .eq('id', gameId)
        .single();
        
      if (error) {
        console.error('Error fetching game:', error);
        if (error.code === 'PGRST116') {
          toast({
            title: 'Game not found',
            description: 'The game you are trying to edit does not exist',
            variant: 'destructive',
          });
          navigate('/map-games');
        }
        return null;
      }
      
      return asMapGame(data);
    }
  });
  
  // Fetch game entries
  const { data: entries, isLoading: isEntriesLoading, refetch: refetchEntries } = useQuery({
    queryKey: ['mapGameEntriesEdit', gameId],
    queryFn: async () => {
      if (!gameId) return [];
      const { data, error } = await supabase
        .from('map_game_entries')
        .select('*')
        .eq('game_id', gameId)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error('Error fetching entries:', error);
        return [];
      }
      
      return asMapGameEntryArray(data || []);
    }
  });
  
  // Set form values from game data
  useEffect(() => {
    if (game) {
      setTitle(game.title);
      setDescription(game.description || '');
      setIsPublic(game.is_public);
    }
  }, [game]);
  
  // Check ownership
  useEffect(() => {
    if (game && user && game.created_by !== user.id) {
      toast({
        title: 'Access denied',
        description: 'You do not have permission to edit this game',
        variant: 'destructive',
      });
      navigate('/map-games');
    }
  }, [game, user, navigate]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Image size should be less than 5MB',
        variant: 'destructive',
      });
      return;
    }
    
    setUploadedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleUpdateGame = async () => {
    if (!gameId || !user) return;
    
    const { error } = await supabase
      .from('map_games')
      .update({
        title,
        description: description || null,
        is_public: isPublic,
      })
      .eq('id', gameId);
      
    if (error) {
      console.error('Error updating game:', error);
      toast({
        title: 'Error',
        description: 'Failed to update game',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Success',
      description: 'Game updated successfully',
    });
    
    refetchGame();
  };
  
  const handleAddEntry = async () => {
    if (!gameId || !user || !uploadedImage) {
      toast({
        title: 'Missing information',
        description: 'Please provide all required information',
        variant: 'destructive',
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // 1. Upload the image to storage
      const fileName = `${Date.now()}_${uploadedImage.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('map_game_images')
        .upload(fileName, uploadedImage);
      
      if (uploadError) {
        throw new Error(uploadError.message);
      }
      
      // 2. Get the public URL for the uploaded image
      const { data: publicUrlData } = await supabase.storage
        .from('map_game_images')
        .getPublicUrl(fileName);
      
      const imageUrl = publicUrlData.publicUrl;
      
      // 3. Create the entry in the database
      const { error: entryError } = await supabase
        .from('map_game_entries')
        .insert({
          game_id: gameId,
          image_url: imageUrl,
          correct_year: newEntryYear,
          hint: newEntryHint || null,
        });
      
      if (entryError) {
        throw new Error(entryError.message);
      }
      
      toast({
        title: 'Success',
        description: 'Entry added successfully',
      });
      
      // Reset form and state
      setAddingEntry(false);
      setNewEntryYear(2000);
      setNewEntryHint('');
      setUploadedImage(null);
      setImagePreview(null);
      
      // Refresh entries list
      refetchEntries();
    } catch (error) {
      console.error('Error adding entry:', error);
      toast({
        title: 'Error',
        description: `Failed to add entry: ${(error as Error).message}`,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDeleteEntry = async (entryId: string) => {
    if (!gameId || !user) return;
    
    const { error } = await supabase
      .from('map_game_entries')
      .delete()
      .eq('id', entryId);
      
    if (error) {
      console.error('Error deleting entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete entry',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Success',
      description: 'Entry deleted successfully',
    });
    
    refetchEntries();
  };
  
  const handleDeleteGame = async () => {
    if (!gameId || !user) return;
    
    const { error } = await supabase
      .from('map_games')
      .delete()
      .eq('id', gameId);
      
    if (error) {
      console.error('Error deleting game:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete game',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Success',
      description: 'Game deleted successfully',
    });
    
    navigate('/map-games');
  };
  
  const isLoading = isGameLoading || isEntriesLoading;
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p>Loading game...</p>
      </div>
    );
  }
  
  if (!game) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p>Game not found.</p>
        <Button onClick={() => navigate('/map-games')} className="mt-4">
          Back to Map Games
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/map-games')} className="mr-2">
            <ArrowLeft size={16} className="mr-1" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Edit: {game.title}</h1>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => navigate(`/map-games/${gameId}`)}>
            <Play size={16} className="mr-2" />
            Play
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 size={16} className="mr-2" />
                Delete Game
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the game and all its entries.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => {}}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteGame}>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Game Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title*</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Game title"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Game description"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isPublic">Public game (visible to everyone)</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpdateGame} className="w-full">
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Map Entries</CardTitle>
              <Button onClick={() => setAddingEntry(!addingEntry)}>
                {addingEntry ? 'Cancel' : (
                  <>
                    <Plus size={16} className="mr-2" />
                    Add Entry
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              {addingEntry && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>New Entry</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="year">Year*</Label>
                      <Input
                        id="year"
                        type="number"
                        value={newEntryYear}
                        onChange={(e) => setNewEntryYear(parseInt(e.target.value) || 2000)}
                        placeholder="Year of the map"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="hint">Hint (optional)</Label>
                      <Input
                        id="hint"
                        value={newEntryHint}
                        onChange={(e) => setNewEntryHint(e.target.value)}
                        placeholder="e.g., Between 1800-1900"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="image">Map Image*</Label>
                      <div className="mt-2">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload size={24} className="mb-2 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG or GIF (max. 5MB)</p>
                          </div>
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                      
                      {imagePreview && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Preview:</p>
                          <img
                            src={imagePreview}
                            alt="Upload preview"
                            className="max-h-64 object-contain border rounded"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handleAddEntry}
                      disabled={!uploadedImage || isUploading}
                      className="w-full"
                    >
                      {isUploading ? 'Uploading...' : 'Add Entry'}
                    </Button>
                  </CardFooter>
                </Card>
              )}
              
              {entries && entries.length > 0 ? (
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <div key={entry.id} className="flex items-center border rounded p-3">
                      <img
                        src={entry.image_url}
                        alt={`Map from ${entry.correct_year}`}
                        className="w-24 h-24 object-cover rounded mr-4"
                      />
                      <div className="flex-1">
                        <p className="font-medium">Year: {entry.correct_year}</p>
                        {entry.hint && <p className="text-gray-500">Hint: {entry.hint}</p>}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteEntry(entry.id)}
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No entries yet. Add your first map entry.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapGameEdit;
