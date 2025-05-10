import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { formationsApi } from "@/data/api";

const Trainings = () => {
  const { isTrainer } = useAuth();
  const { toast } = useToast();
  const [trainings, setTrainings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [newTraining, setNewTraining] = useState({
    title: "",
    domain: "",
    startDate: "",
    endDate: "",
    budget: 0,
    lieu: "",
    time: "Full-time",
    durationDays: 0
  });

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
    return diffDays;
  };

  useEffect(() => {
    if (newTraining.startDate && newTraining.endDate) {
      const duration = calculateDuration(newTraining.startDate, newTraining.endDate);
      setNewTraining(prev => ({
        ...prev,
        durationDays: duration
      }));
    }
  }, [newTraining.startDate, newTraining.endDate]);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const data = await formationsApi.getAll();
      const today = new Date();
      const trainingsWithStatus = data.map((training) => {
        const startDate = new Date(training.startDate);
        const endDate = new Date(training.endDate);
        let status = "upcoming";
        if (endDate < today) status = "completed";
        else if (startDate <= today && endDate >= today) status = "active";
        return { ...training, status };
      });
      setTrainings(trainingsWithStatus);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch trainings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTrainingStatus = (training) => {
    const today = new Date();
    const startDate = new Date(training.startDate);
    const endDate = new Date(training.endDate);
    
    if (endDate < today) return "completed";
    if (startDate <= today && endDate >= today) return "active";
    return "upcoming";
  };

  const handleAddTraining = async () => {
    if (!newTraining.title || !newTraining.startDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const createdTraining = await formationsApi.create(newTraining);
      const status = getTrainingStatus(createdTraining);
      setTrainings([...trainings, { ...createdTraining, status }]);

      toast({
        title: "Success",
        description: `Training "${newTraining.title}" has been created`,
      });

      setNewTraining({
        title: "",
        description: "",
        domain: "",
        startDate: "",
        endDate: "",
        budget: 0,
        lieu: "",
        time: "Full-time",
        durationDays: 0
      });
      setDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create training",
        variant: "destructive",
      });
    }
  };

  const filteredTrainings = trainings
    .filter((training) => {
      if (activeTab !== "all") {
        return training.status === activeTab;
      }
      return true;
    })
    .filter(
      (training) =>
        training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (training.domain && training.domain.toLowerCase().includes(searchTerm.toLowerCase()))
        || (training.budget && training.budget.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        || (training.lieu && training.lieu.toLowerCase().includes(searchTerm.toLowerCase()))
        || (training.time && training.time.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        || (training.durationDays && training.durationDays.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        || (training.startDate && training.startDate.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        || (training.endDate && training.endDate.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div className="animate-enter space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Trainings</h1>
        {isTrainer && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
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
                New Training
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-full overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Training</DialogTitle>
                <DialogDescription>
                  Add details for your new training course.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newTraining.title}
                    onChange={(e) => setNewTraining({ ...newTraining, title: e.target.value })}
                    placeholder="Introduction to React"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newTraining.startDate}
                      onChange={(e) => setNewTraining({ ...newTraining, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newTraining.endDate}
                      onChange={(e) => setNewTraining({ ...newTraining, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain</Label>
                  <Select
                    value={newTraining.domain}
                    onValueChange={(value) => setNewTraining({ ...newTraining, domain: value })}
                  >
                    <SelectTrigger id="domain">
                      <SelectValue placeholder="Select domain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Management">Management</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Data_Analytics">Data Analytics</SelectItem>
                      <SelectItem value="Data_Science">Data Science</SelectItem>
                      <SelectItem value="Human_resources">Human Resources</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={newTraining.budget}
                    onChange={(e) => setNewTraining({ ...newTraining, budget: parseFloat(e.target.value) })}
                    placeholder="e.g. 1000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lieu">Location</Label>
                  <Input
                    id="lieu"
                    value={newTraining.lieu}
                    onChange={(e) => setNewTraining({ ...newTraining, lieu: e.target.value })}
                    placeholder="e.g. New York"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Select
                    value={newTraining.time}
                    onValueChange={(value) => setNewTraining({ ...newTraining, time: value })}
                  >
                    <SelectTrigger id="time">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="durationDays">Duration (days)</Label>
                  <Input
                    id="durationDays"
                    type="number"
                    value={newTraining.durationDays}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTraining}>Create Training</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Input
          placeholder="Search trainings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-[70rem]">
        {filteredTrainings.map((training) => (
          <Card key={training.id} className="card-hover">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{training.title}</CardTitle>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                    training.status === "active"
                      ? "bg-green-100 text-green-800"
                      : training.status === "completed"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {training.status.charAt(0).toUpperCase() + training.status.slice(1)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1 mb-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Domain:</span> {training.domain}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Start:</span> {training.startDate}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">End:</span> {training.endDate}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Budget:</span> ${training.budget}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Location:</span> {training.lieu}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Time:</span> {training.time}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Duration (days):</span> {training.durationDays}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Link to={`/trainings/${training.id}`} className="text-primary hover:underline">
                  View details
                </Link>
                {isTrainer && (
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTrainings.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/10">
          <p className="text-lg font-medium">No trainings found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          {isTrainer && (
            <Button className="mt-4" onClick={() => setDialogOpen(true)}>
              Create a training
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Trainings;
