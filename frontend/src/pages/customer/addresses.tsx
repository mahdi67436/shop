import { useState } from 'react'
import { Plus, MapPin, Edit, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Address {
  id: string
  name: string
  phone: string
  address: string
  city: string
  district: string
  postalCode: string
  isDefault: boolean
}

export function AddressBookPage() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      name: 'Home',
      phone: '+8801XXXXXXXXX',
      address: '123 Main Street, Dhaka',
      city: 'Dhaka',
      district: 'Dhaka',
      postalCode: '1200',
      isDefault: true,
    },
  ])
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    name: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    isDefault: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    setTimeout(() => {
      if (editingId) {
        setAddresses(addresses.map(a => a.id === editingId ? { ...formData, id: editingId } : a))
        setEditingId(null)
      } else {
        setAddresses([...addresses, { ...formData, id: Date.now().toString() }])
      }
      setIsAdding(false)
      setFormData({
        name: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        postalCode: '',
        isDefault: false,
      })
      setIsLoading(false)
    }, 1000)
  }

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id))
  }

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isDefault: a.id === id,
    })))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Addresses</h1>
          <Button onClick={() => { setIsAdding(true); setEditingId(null); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Address
          </Button>
        </div>

        {(isAdding || editingId) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Address' : 'New Address'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Address Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Home, Office, etc."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+8801XXXXXXXXX"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Dhaka"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">District</label>
                  <Input
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="Dhaka"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Postal Code</label>
                  <Input
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="1200"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="default"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="default" className="text-sm">Set as default address</label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingId ? 'Update' : 'Save'} Address
                </Button>
                <Button type="button" variant="outline" onClick={() => { setIsAdding(false); setEditingId(null); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div key={address.id} className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${address.isDefault ? 'border-2 border-blue-500' : ''}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold">{address.name}</span>
                  {address.isDefault && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditingId(address.id); setFormData(address); setIsAdding(true); }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{address.address}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{address.city}, {address.district} - {address.postalCode}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{address.phone}</p>
              {!address.isDefault && (
                <button
                  onClick={() => handleSetDefault(address.id)}
                  className="text-sm text-blue-600 hover:text-blue-700 mt-2"
                >
                  Set as default
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
