import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { formationsApi, participantsApi } from "@/data/api";

const TrainingDetail = () => {
  const { id } = useParams();
  const { isTrainer } = useAuth();
  const { toast } = useToast();

  const [training, setTraining] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [allParticipants, setAllParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTrainingData, setEditTrainingData] = useState({});
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState("");
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
    return diffDays;
  };

  useEffect(() => {
    fetchTraining();
    fetchParticipants();
    fetchAllParticipants(); // Load participants with profile Participant
    fetchInternInstructors(); // Load Intern Instructors
    fetchExternInstructors(); // Load Extern Instructors
  }, [id]);

  useEffect(() => {
    if (editTrainingData.startDate && editTrainingData.endDate) {
      const duration = calculateDuration(editTrainingData.startDate, editTrainingData.endDate);
      setEditTrainingData(prev => ({
        ...prev,
        durationDays: duration
      }));
    }
  }, [editTrainingData.startDate, editTrainingData.endDate]);

  const fetchTraining = async () => {
    try {
      setLoading(true);
      const data = await formationsApi.getById(id);
      setTraining(data);
      setEditTrainingData({
        title: data.title || "",
        domain: data.domain || "",
        startDate: data.startDate || "",
        endDate: data.endDate || "",
        budget: data.budget || 0,
        lieu: data.lieu || "",
        time: data.time || "",
        durationDays: data.durationDays || 0,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch training details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async () => {
    try {
      setLoadingParticipants(true);
      const data = await formationsApi.getParticipants(id);
      setParticipants(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch participants",
        variant: "destructive",
      });
    } finally {
      setLoadingParticipants(false);
    }
  };

  const [internInstructors, setInternInstructors] = useState([]);
  const [externInstructors, setExternInstructors] = useState([]);
  const [selectedInternInstructorId, setSelectedInternInstructorId] = useState("");
  const [selectedExternInstructorId, setSelectedExternInstructorId] = useState("");

  const fetchAllParticipants = async () => {
    try {
      const data = await participantsApi.getParticipantsWithProfileParticipant();
      setAllParticipants(data);
      if (data.length > 0) {
        setSelectedParticipantId(data[0].id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch participants with profile Participant",
        variant: "destructive",
      });
    }
  };

  const fetchInternInstructors = async () => {
    try {
      const data = await participantsApi.getParticipantsWithProfileIntern();
      setInternInstructors(data);
      if (data.length > 0) {
        setSelectedInternInstructorId(data[0].id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch Intern Instructors",
        variant: "destructive",
      });
    }
  };

  const fetchExternInstructors = async () => {
    try {
      const data = await participantsApi.getParticipantsWithProfileExtern();
      setExternInstructors(data);
      if (data.length > 0) {
        setSelectedExternInstructorId(data[0].id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch Extern Instructors",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTraining = async () => {
    try {
      await formationsApi.update(id, editTrainingData);
      toast({
        title: "Success",
        description: "Training updated successfully",
      });
      setEditMode(false);
      fetchTraining();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update training",
        variant: "destructive",
      });
    }
  };

  const [internDialogOpen, setInternDialogOpen] = useState(false);
  const [externDialogOpen, setExternDialogOpen] = useState(false);

  const handleAddParticipant = async () => {
    if (!selectedParticipantId) return;

    setIsAddingParticipant(true);
    try {
      const result = await formationsApi.addParticipant(id, selectedParticipantId);
      await fetchParticipants();
      setAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Participant added successfully",
      });
    } catch (error) {
      const errorMessage = error?.message || '';
      if (
        errorMessage.toLowerCase().includes('error') ||
        errorMessage.toLowerCase().includes('failed') ||
        errorMessage.toLowerCase().includes('invalid')
      ) {
        toast({
          title: "Error",
          description: "Failed to add participant",
          variant: "destructive",
        });
      }
    } finally {
      setIsAddingParticipant(false);
    }
  };
  
  const handleAddInternInstructor = async () => {
    if (!selectedInternInstructorId) return;

    setIsAddingParticipant(true);
    try {
      const result = await formationsApi.addParticipant(id, selectedInternInstructorId);
      await fetchParticipants();
      setInternDialogOpen(false);
      toast({
        title: "Success",
        description: "Intern Instructor added successfully",
      });
    } catch (error) {
      const errorMessage = error?.message || '';
      if (
        errorMessage.toLowerCase().includes('error') ||
        errorMessage.toLowerCase().includes('failed') ||
        errorMessage.toLowerCase().includes('invalid')
      ) {
        toast({
          title: "Error",
          description: "Failed to add Intern Instructor",
          variant: "destructive",
        });
      }
    } finally {
      setIsAddingParticipant(false);
    }
  };

  const handleAddExternInstructor = async () => {
    if (!selectedExternInstructorId) return;

    setIsAddingParticipant(true);
    try {
      const result = await formationsApi.addParticipant(id, selectedExternInstructorId);
      await fetchParticipants();
      setExternDialogOpen(false);
      toast({
        title: "Success",
        description: "Extern Instructor added successfully",
      });
    } catch (error) {
      const errorMessage = error?.message || '';
      if (
        errorMessage.toLowerCase().includes('error') ||
        errorMessage.toLowerCase().includes('failed') ||
        errorMessage.toLowerCase().includes('invalid')
      ) {
        toast({
          title: "Error",
          description: "Failed to add Extern Instructor",
          variant: "destructive",
        });
      }
    } finally {
      setIsAddingParticipant(false);
    }
  };

  const handleRemoveParticipant = async (participantId) => {
    try {
      await formationsApi.removeParticipant(id, participantId);
      toast({
        title: "Success",
        description: "Participant removed successfully",
      });
      fetchParticipants();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove participant",
        variant: "destructive",
      });
    }
  };

  // Get current participants for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentParticipants = participants.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(participants.length / itemsPerPage);

  // Change page
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div>Loading training details...</div>;
  }

  if (!training) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p>Training not found</p>
      </div>
    );
  }

  return (
    <div className="animate-enter space-y-6 mx-autow-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Link to="/trainings" className="text-sm text-muted-foreground hover:underline mb-2 inline-block">
            &larr; Back to Trainings
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{training.title}</h1>
        </div>
{/*          
        <span className={`inline-block px-3 py-1 text-sm rounded-full ${
          training.status === "active" 
            ? "bg-green-100 text-green-800" 
            : training.status === "completed"
            ? "bg-blue-100 text-blue-800"
            : "bg-yellow-100 text-yellow-800"
        }`}>
          {training.status ? training.status.charAt(0).toUpperCase() + training.status.slice(1) : ""}
        </span> */}
      </div>
      
      <Card> 
      
      {editMode ? (
            <div className="space-y-5 max-w-lg ml-6 mt-6">
              <h1 className="text-3xl font-bold tracking-tight" >Edit Training</h1>
              <label className="text-sm font-medium text-muted-foreground mt-10">Title
              <input
                type="text"
                
                value={editTrainingData.title}
                onChange={(e) => setEditTrainingData({ ...editTrainingData, title: e.target.value })}
                placeholder="Title"
                className="input input-bordered w-full py-3 text-black bg-gray-100 rounded-md p-5"
              /></label>
              <label className="text-sm font-medium text-muted-foreground">Domain
              <input
                type="text"
                value={editTrainingData.domain}
                onChange={(e) => setEditTrainingData({ ...editTrainingData, domain: e.target.value })}
                placeholder="Domain"
                label="Domain"
                className="input input-bordered w-full py-3 text-black  bg-gray-100 rounded-md p-5"
              /></label>
              <label className="text-sm font-medium text-muted-foreground">Start Date
              <input
                type="date"
                value={editTrainingData.startDate}
                onChange={(e) => setEditTrainingData({ ...editTrainingData, startDate: e.target.value })}
                className="input input-bordered w-full py-3 text-black  bg-gray-100 rounded-md p-5"
              />  </label>
              <label className="text-sm font-medium text-muted-foreground">End Date
              <input
                type="date"
                value={editTrainingData.endDate}
                onChange={(e) => setEditTrainingData({ ...editTrainingData, endDate: e.target.value })}
                className="input input-bordered w-full py-3 text-black  bg-gray-100 rounded-md p-5"
              /></label>
              <label className="text-sm font-medium text-muted-foreground">Budget
              <input
                type="number"
                value={editTrainingData.budget}
                onChange={(e) => setEditTrainingData({ ...editTrainingData, budget: Number(e.target.value) })}
                placeholder="Budget"
                className="input input-bordered w-full py-3 text-black  bg-gray-100 rounded-md p-5 "
              /> </label>
              <label className="text-sm font-medium text-muted-foreground">Location
              <input
                type="text"
                value={editTrainingData.lieu}
                onChange={(e) => setEditTrainingData({ ...editTrainingData, lieu: e.target.value })}
                placeholder="Location"
                className="input input-bordered w-full py-3 text-black  bg-gray-100 rounded-md p-5 "
              />  </label>
              <label className="text-sm font-medium text-muted-foreground">Time
              <input
                type="text"
                value={editTrainingData.time}
                onChange={(e) => setEditTrainingData({ ...editTrainingData, time: e.target.value })}
                placeholder="Time"
                className="input input-bordered w-full py-3 text-black  bg-gray-100 rounded-md p-5 "
              />     </label>
              <label className="text-sm font-medium text-muted-foreground">Duration (days)
              <input
                type="number"
                value={editTrainingData.durationDays}
                onChange={(e) => setEditTrainingData({ ...editTrainingData, durationDays: Number(e.target.value) })}
                placeholder="Duration (days)"
                    disabled
                className="input input-bordered w-full py-3 text-black  bg-gray-100 rounded-md p-5"
              />    </label>
              <div className="flex gap-2 mt-2">
                <Button onClick={handleUpdateTraining}>Save</Button>
                <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <></>
          )}
             <CardHeader className="flex justify-between">
         
        
        {!editMode && (

        <CardTitle className="flex items-center justify-between mb-4 w-"> <span>Training Information </span>  <Button className="px-10 ml-16" onClick={() => setEditMode(true)}>Edit</Button></CardTitle>
        )}</CardHeader>
        <CardContent>
          {!editMode && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Domain</h3>
                <p className="text-sm">{training.domain}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
                <p className="text-sm">{training.startDate}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">End Date</h3>
                <p className="text-sm">{training.endDate || "Not specified"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Budget</h3>
                <p className="text-sm">${training.budget}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                <p className="text-sm">{training.lieu}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Time</h3>
                <p className="text-sm">{training.time}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Duration (days)</h3>
                <p className="text-sm">{training.durationDays}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between mb-0 pb-1.5">
          
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogTrigger asChild>
          <CardTitle className="flex items-center justify-between mb-0"> <span>Participants</span>
            <Button className="w-[10.4rem] ">Add Participant</Button></CardTitle>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Participant</DialogTitle>
          </DialogHeader>
          <Select value={selectedParticipantId} onValueChange={setSelectedParticipantId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a participant" />
            </SelectTrigger>
            <SelectContent>
              {allParticipants.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.firstName} {p.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button 
              onClick={handleAddParticipant} 
              disabled={!selectedParticipantId || isAddingParticipant}
            >
              {isAddingParticipant ? "Adding..." : "Add Participant"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CardHeader>

    <CardHeader className="flex justify-between items-end mt-0 pt-0">
      <Dialog open={internDialogOpen} onOpenChange={setInternDialogOpen}>
        <DialogTrigger   asChild>
          <Button className="items-end w-fit">Add Intern Instructor</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Intern Instructor</DialogTitle>
          </DialogHeader>
          <Select value={selectedInternInstructorId} onValueChange={setSelectedInternInstructorId}>
            <SelectTrigger>
              <SelectValue placeholder="Select an intern instructor" />
            </SelectTrigger>
            <SelectContent>
              {internInstructors.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.firstName} {p.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button
              onClick={handleAddInternInstructor}
              disabled={!selectedInternInstructorId || isAddingParticipant}
            >
              {isAddingParticipant ? "Adding..." : "Add Intern Instructor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

        <Dialog open={externDialogOpen} onOpenChange={setExternDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Extern Instructor</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Extern Instructor</DialogTitle>
            </DialogHeader>
            <Select value={selectedExternInstructorId} onValueChange={setSelectedExternInstructorId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an extern instructor" />
              </SelectTrigger>
              <SelectContent>
                {externInstructors.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.firstName} {p.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button
                onClick={handleAddExternInstructor}
                disabled={!selectedExternInstructorId || isAddingParticipant}
              >
                {isAddingParticipant ? "Adding..." : "Add Extern Instructor"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
         
        <CardContent>
          {loadingParticipants ? (
            <div>Loading participants...</div>
          ) : participants.length === 0 ? (
            <p>No participants found.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telephone</TableHead>
                    <TableHead>Structure</TableHead>
                    <TableHead>Profile</TableHead>
                    {isTrainer && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentParticipants.map((participant) => (
                    <TableRow key={participant.id}>
                      <TableCell className="flex items-center gap-3">
                        <img 
                          src={'https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=' + participant?.firstName + '+' + participant?.lastName}   
                          alt={participant.firstName} 
                          className="h-8 w-8 rounded-full"
                        />
                        {participant.firstName} {participant.lastName}
                      </TableCell>
                      <TableCell>{participant.email}</TableCell>
                      <TableCell>{participant.telephone}</TableCell>
                      <TableCell>{participant.structure}</TableCell>
                      <TableCell>{participant.profile}</TableCell>
                      {isTrainer && (
                        <TableCell>
                          <Button variant="destructive" size="sm" onClick={() => handleRemoveParticipant(participant.id)}>
                            Delete
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingDetail;
