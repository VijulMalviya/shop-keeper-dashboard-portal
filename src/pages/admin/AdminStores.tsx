
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useStores } from '@/hooks/useStores';
import { Loading, LoadingSpinner } from '@/components/ui/loading';
import { Store } from '@/services/mockData';
import { Search, Edit, X, Store as StoreIcon, Users, MapPin, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminStores() {
  const {
    stores,
    isLoading,
    error,
    refetch,
    addStore,
    updateStore,
    deleteStore,
    isAddingStore,
    isUpdatingStore,
    isDeletingStore
  } = useStores();

  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    storeId: '',
    memberCount: 0
  });

  useEffect(() => {
    const filtered = stores.filter(store =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.storeId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStores(filtered);
  }, [stores, searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStore) {
        await updateStore(editingStore.id, formData);
      } else {
        await addStore(formData);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving store:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this store?')) {
      try {
        await deleteStore(id);
      } catch (error) {
        console.error('Error deleting store:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', storeId: '', memberCount: 0 });
    setEditingStore(null);
    setIsAddDialogOpen(false);
  };

  const openEditDialog = (store: Store) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      storeId: store.storeId,
      memberCount: store.memberCount
    });
    setIsAddDialogOpen(true);
  };

  if (isLoading && stores.length === 0) {
    return <Loading text="Loading stores..." className="p-8" />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Locations</h1>
          <p className="text-gray-600 mt-2">Manage your retail network</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()} className="bg-black text-white hover:bg-gray-800">
                Add New Store
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingStore ? 'Edit Store' : 'Add New Store'}</DialogTitle>
                <DialogDescription>
                  {editingStore ? 'Update store information' : 'Enter store details below'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Store Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="storeId">Store ID</Label>
                  <Input
                    id="storeId"
                    value={formData.storeId}
                    onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="memberCount">Member Count</Label>
                  <Input
                    id="memberCount"
                    type="number"
                    value={formData.memberCount}
                    onChange={(e) => setFormData({ ...formData, memberCount: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={isAddingStore || isUpdatingStore}
                  >
                    {(isAddingStore || isUpdatingStore) && <LoadingSpinner size="sm" className="mr-2" />}
                    {editingStore ? 'Update' : 'Add'} Store
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search stores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading && stores.length > 0 && (
        <div className="flex items-center justify-center mb-4">
          <LoadingSpinner size="sm" className="mr-2" />
          <span className="text-sm text-gray-600">Updating stores...</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store, index) => (
          <Card key={store.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center text-white">
                    <StoreIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{store.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      ID: {store.storeId}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(store)}
                    className="h-8 w-8 p-0"
                    disabled={isUpdatingStore}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(store.id)}
                    className="h-8 w-8 p-0 text-red-600"
                    disabled={isDeletingStore}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Members</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{store.memberCount}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStores.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <StoreIcon className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-xl text-gray-500 mb-2">No stores found</p>
          <p className="text-gray-400">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}
