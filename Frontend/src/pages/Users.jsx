import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { usersApi } from "@/data/api";

const Users = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const initialFormData = {
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "USER"
  };

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  const [formData, setFormData] = useState(initialFormData);

  const roles = ["USER", "ADMIN", "MANAGER"];

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    }
  };

  const handleAddUser = async () => {
    try {
      await usersApi.create(formData);
      toast({
        title: "Success",
        description: "User added successfully"
      });
      setDialogOpen(false);
      loadUsers();
      setFormData(initialFormData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive"
      });
    }
  };

  const handleEditUser = async () => {
    try {
      await usersApi.update(selectedUser.id, formData);
      toast({
        title: "Success",
        description: "User updated successfully"
      });
      setEditDialogOpen(false);
      loadUsers();
      setSelectedUser(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await usersApi.delete(id);
        toast({
          title: "Success",
          description: "User deleted successfully"
        });
        loadUsers();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive"
        });
      }
    }
  };

  const openEditDialog = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    });
    setEditDialogOpen(true);
  };

  const handleOpenAddDialog = () => {
    setFormData(initialFormData);
    setDialogOpen(true);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortedUsers = (users) => {
    if (!sortConfig.key) return users;

    return [...users].sort((a, b) => {
      let aValue = sortConfig.key === 'name' 
        ? `${a.firstName} ${a.lastName}`.toLowerCase()
        : a[sortConfig.key].toLowerCase();
      let bValue = sortConfig.key === 'name'
        ? `${b.firstName} ${b.lastName}`.toLowerCase()
        : b[sortConfig.key].toLowerCase();

      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return '↕️';
    }
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  const filteredAndSortedUsers = getSortedUsers(
    users.filter((user) =>
      Object.values(user)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredAndSortedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const renderUserDialog = (isEdit = false) => (
    <Dialog open={isEdit ? editDialogOpen : dialogOpen} onOpenChange={isEdit ? setEditDialogOpen : setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            Fill in the user information.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Doe"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="johndoe"
            />
          </div>
          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => isEdit ? setEditDialogOpen(false) : setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={isEdit ? handleEditUser : handleAddUser}>
            {isEdit ? "Save Changes" : "Add User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="animate-enter space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
        {isAdmin && (
          <Button className="bg-primary hover:bg-primary/90" onClick={handleOpenAddDialog}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 mr-2"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Add User
          </Button>
        )}
      </div>

      <div className="flex w-full items-center space-x-2 mb-4">
        <Input 
          placeholder="Search users..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th
                    className="p-3 cursor-pointer hover:bg-muted/50 text-center"
                    onClick={() => handleSort('name')}
                   >Name
                   {getSortIcon('name')}
                   </th>
                  <th 
                   className="text-left p-3 cursor-pointer hover:bg-muted/50"
                   onClick={() => handleSort('username')}
                  >Username
                  {getSortIcon('username')}
                  </th>
                  <th 
                   className="text-left p-3 cursor-pointer hover:bg-muted/50"
                   onClick={() => handleSort('role')}
                  >Role
                  {getSortIcon('Role')}
                  </th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="flex items-center gap-3 p-3">
                      <img 
                        src={'https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=' + user.firstName + '+' + user.lastName}
                        alt={user.firstName} 
                        className="h-8 w-8 rounded-full"
                      />
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="p-3">{user.username}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        user.role === "ADMIN" 
                          ? "bg-red-100 text-red-800" 
                          : user.role === "MANAGER"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditDialog(user)}
                        >
                          Edit
                        </Button>
                        {isAdmin && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <Button
                  key={number}
                  variant={currentPage === number ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(number)}
                >
                  {number}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {renderUserDialog(false)} {/* Add Dialog */}
      {renderUserDialog(true)}  {/* Edit Dialog */}
    </div>
  );
};

export default Users;
