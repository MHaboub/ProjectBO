
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { statisticsApi,participantsApi,formationsApi } from "@/data/api";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({

    current: 0,

    completed: 0,
    upcoming: 0,
  });
  const [Participants, setParticipants] = useState(
    {
      Participants: 0,
      Instructor: 0,
});
const [trainings, setTrainings] = useState([]);


const [loading, setLoading] = useState(false);

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
    const activeTrainings = trainingsWithStatus.filter(training => training.status === "active");
    setTrainings(activeTrainings);
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




  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statisticsApi.getFormationStats();
        setStats(data);
      } catch (err) {
        console.log(err.message || "Failed to load stats");
      } 
    };
    fetchStats();
    const fetchParticipantStats = async () => {
      try {
        const data1 = await participantsApi.getParticipantCountWithProfileExtern();
        const data2 = await participantsApi.getParticipantCountWithProfileIntern();
        const data3 = await participantsApi.getParticipantCountWithProfileParticipant(); 
        
        setParticipants({
          Instructor: data2.count + data1.count,

          Participants: data3.count,
        });
      } catch (err) {
        console.log(err.message || "Failed to load stats");
      } 
    };
    fetchParticipantStats();
  }, []);
  console.log(stats);
  console.log("trainings = ", trainings);

  

  return (
    <div className="animate-enter space-y-6 flex-grow flex flex-col w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Welcome back,</span>
          <span className="font-medium">{currentUser?.name}</span>
        </div> 
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="stats-card w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Trainings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.current + stats.completed + stats.upcoming}</div>
          </CardContent>
        </Card>
        <Card className="stats-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Trainings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.current}</div>
          </CardContent>
        </Card>
        <Card className="stats-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Participants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Participants.Participants}</div>
          </CardContent>
        </Card>
        <Card className="stats-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Instructor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Participants.Instructor}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Trainings In Progress</h2>
          <Link to="/trainings" className="text-primary hover:underline text-sm">
            View all
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-[70rem]">
        {trainings.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-10">
            No Training Active Right Now
          </div>
        ) : (
          trainings.map((training) => (
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
                 
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
