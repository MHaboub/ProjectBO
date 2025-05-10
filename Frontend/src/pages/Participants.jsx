import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { participantsApi } from "@/data/api";

const Participants = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const initialFormData = {
    firstName: "",
    lastName: "",
    email: "",
    telephone: "",
    structure: "",
    profile: ""
  };

  const [formData, setFormData] = useState(initialFormData);

  const structures = ["IT", "Marketing", "HR", "Sales", "Finance", "Operations"];
  const profiles = ["Intern", "Extern", "Participant"];

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadParticipants();
  }, []);

  const loadParticipants = async () => {
    try {
      const data = await participantsApi.getAll();
      setParticipants(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load participants",
        variant: "destructive",
      });
    }
  };

  const handleAddParticipant = async () => {
    try {
      await participantsApi.create(formData);
      toast({
        title: "Success",
        description: "Participant added successfully"
      });
      setDialogOpen(false);
      loadParticipants();
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        telephone: "",
        structure: "",
        profile: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add participant",
        variant: "destructive"
      });
    }
  };

  const handleEditParticipant = async () => {
    try {
      await participantsApi.update(selectedParticipant.id, formData);
      toast({
        title: "Success",
        description: "Participant updated successfully"
      });
      setEditDialogOpen(false);
      loadParticipants();
      setSelectedParticipant(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update participant",
        variant: "destructive"
      });
    }
  };

  const handleDeleteParticipant = async (id) => {
    if (window.confirm("Are you sure you want to delete this participant?")) {
      try {
        await participantsApi.delete(id);
        toast({
          title: "Success",
          description: "Participant deleted successfully"
        });
        loadParticipants();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete participant",
          variant: "destructive"
        });
      }
    }
  };

  const openEditDialog = (participant) => {
    setSelectedParticipant(participant);
    setFormData({
      firstName: participant.firstName,
      lastName: participant.lastName,
      email: participant.email,
      telephone: participant.telephone,
      structure: participant.structure,
      profile: participant.profile
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

  const getSortedParticipants = (participants) => {
    if (!sortConfig.key) return participants;

    return [...participants].sort((a, b) => {
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

  const filteredAndSortedParticipants = getSortedParticipants(
    participants.filter((participant) =>
      Object.values(participant)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentParticipants = filteredAndSortedParticipants.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedParticipants.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const renderParticipantDialog = (isEdit = false) => (
    <Dialog open={isEdit ? editDialogOpen : dialogOpen} onOpenChange={isEdit ? setEditDialogOpen : setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Participant" : "Add New Participant"}</DialogTitle>
          <DialogDescription>
            Fill in the participant information.
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john.doe@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telephone">Telephone</Label>
            <Input
              id="telephone"
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              placeholder="+33123456789"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="structure">Structure</Label>
            <Select
              value={formData.structure}
              onValueChange={(value) => setFormData({ ...formData, structure: value })}
            >
              <SelectTrigger id="structure">
                <SelectValue placeholder="Select a structure" />
              </SelectTrigger>
              <SelectContent>
                {structures.map((structure) => (
                  <SelectItem key={structure} value={structure}>
                    {structure}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile">Profile</Label>
            <Select
              value={formData.profile}
              onValueChange={(value) => setFormData({ ...formData, profile: value })}
            >
              <SelectTrigger id="profile">
                <SelectValue placeholder="Select a profile" />
              </SelectTrigger>
              <SelectContent>
                {profiles.map((profile) => (
                  <SelectItem key={profile} value={profile}>
                    {profile}
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
          <Button onClick={isEdit ? handleEditParticipant : handleAddParticipant}>
            {isEdit ? "Save Changes" : "Add Participant"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="animate-enter space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Participants Management</h1>
        {isAdmin && (
          <Dialog>
            <DialogTrigger asChild>
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
                Add Participant
              </Button>
            </DialogTrigger>
          </Dialog>
        )}
      </div>

      <div className="flex w-full items-center space-x-2 mb-4">
        <Input 
          placeholder="Search participants..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Participants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th 
                    className="p-3 cursor-pointer hover:bg-muted/50 text-center"
                    onClick={() => handleSort('name')}
                  >
                    Name {getSortIcon('name')}
                  </th>
                  <th 
                    className="text-left p-3 cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('email')}
                  >
                    Email {getSortIcon('email')}
                  </th>
                  <th 
                    className="text-left p-3 cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('telephone')}
                  >
                    Telephone {getSortIcon('telephone')}
                  </th>
                  <th 
                    className="text-left p-3 cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('structure')}
                  >
                    Structure {getSortIcon('structure')}
                  </th>
                  <th 
                    className="text-left p-3 cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('profile')}
                  >
                    Profile {getSortIcon('profile')}
                  </th>
                  <th className="text-center p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentParticipants.map((participant) => (
                  <tr key={participant.id} className="border-b hover:bg-muted/50">
                    <td className="flex items-center gap-3 p-3">
                    <img 
                               src={'https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=' + participant?.firstName + '+' + participant?.lastName}   
                               alt={participant.firstName} 
                               className="h-8 w-8 rounded-full"
                          />
                      {participant.firstName} {participant.lastName}
                    </td>
                    <td className="p-3">{participant.email}</td>
                    <td className="p-3">{participant.telephone}</td>
                    <td className="p-3">{participant.structure}</td>
                    <td className="p-3">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        participant.profile === "Extern" 
                          ? "bg-red-100 text-red-800" 
                          : participant.profile === "Intern"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                      
                      {participant.profile}
                      </span>
                      </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditDialog(participant)}
                        >
                          Edit
                        </Button>
                        {isAdmin && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteParticipant(participant.id)}
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

      {renderParticipantDialog(false)} {/* Add Dialog */}
      {renderParticipantDialog(true)}  {/* Edit Dialog */}
    </div>
  );
};

export default Participants;
