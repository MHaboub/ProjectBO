import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { trainingData } from "@/data/mockData";
import { statisticsApi, participantsApi } from "@/data/api";

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const generateMonthlyData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((month) => ({
    name: month,
    enrollments: getRandomNumber(5, 30),
    completions: getRandomNumber(2, 15),
    dropouts: getRandomNumber(0, 5),
  }));
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

const Statistics = () => {
  const [chartData, setChartData] = useState({
    monthly: [],
    trainings: [],
    roles: [3],
    completion: [],
  });
  
  const [timeRange, setTimeRange] = useState("current");
  const [selectedYear, setSelectedYear] = useState("current");


  useEffect(() => {
    fetchMonthlyStats(selectedYear);
    // Calculate training statistics
    fetchNbParticipantStats();
    fetchNbTrainingCompletion();
    const trainingStats = trainingData.map((training) => ({
      name: training.title.length > 15 ? `${training.title.substring(0, 15)}...` : training.title,
      participants: training.participants.length,
      completed: training.participants.filter((p) => p.status === "completed").length,
      active: training.participants.filter((p) => p.status === "active").length,
    }));

    setChartData((prev) => ({
      ...prev,
      trainings: trainingStats,
    }));
  }, [selectedYear]);

  const fetchNbTrainingCompletion = async () => {
    try {
      const response = await statisticsApi.getFormationStats();
      const total = response.current + response.completed + response.upcoming;
      const data =[ {
        name: "Completed",
        value: Math.round(response.completed),
      }, {
        name: "In Progress",  
        value:  Math.round(response.current),
      }, {  
        name: "Not Started",
        value: Math.round(response.upcoming),
      }];

      console.log("Training completion stats:", data);

     
      setChartData((prev) => ({
        ...prev,
        completion: data,
      }));
    } catch (error) {
      console.error('Failed to fetch training completion stats:', error);
    }
  };

  const fetchNbParticipantStats = async () => {
    try {
      const response = await participantsApi.getParticipantCountWithProfileParticipant();
      const data = {
        name: "Participant",
        value: response.count,
      };
      const response1 = await participantsApi.getParticipantCountWithProfileIntern();
      const data1 = {
        name: "Internal Instructor",
        value: response1.count,
      };
      const response2 = await participantsApi.getParticipantCountWithProfileExtern();
      const data2 = {
        name: "External Instructor",
        value: response2.count,
      };
      console.log("Participant stats:", data, data1, data2);
      setChartData((prev) => ({
        ...prev,
        roles: [data, data1, data2],
      }));
      console.log("Chart data:", chartData.roles);
    } catch (error) {
      console.error('Failed to fetch participant stats:', error);
    }

  };
  const fetchMonthlyStats = async (yearRange) => {
    try {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      let targetYear;
      
      switch(yearRange) {
        case "last":
          targetYear = currentYear - 1;
          break;
        case "next":
          targetYear = currentYear + 1;
          break;
        case "current":
        default:
          targetYear = currentYear;
          break;
      }
      
      // Get data for all 12 months of the selected year
      const monthlyData = [];
      for (let month = 1; month <= 12; month++) {
        const stats = await statisticsApi.getMonthlyStats(month, targetYear);
        const monthName = new Date(targetYear, month - 1).toLocaleString('default', { month: 'short' });
        monthlyData.push({
          name: monthName,
          enrollments: stats.totalParticipants,
          formations: stats.formationCount
        });
      }
      
      setChartData(prev => ({
        ...prev,
        monthly: monthlyData
      }));
    } catch (error) {
      console.error('Failed to fetch monthly stats:', error);
    }
  };

  const filterTimeRange = (range) => {
    setTimeRange(range);
    let filteredData;
    
    switch(range) {
      case "month":
        // Last 30 days (last 4 weeks)
        filteredData = chartData.monthly.slice(8, 12);
        break;
      case "quarter":
        // Last quarter (3 months)
        filteredData = chartData.monthly.slice(6, 12);
        break;
      case "year":
      default:
        // Full year
        filteredData = chartData.monthly;
        break;
    }
    
    setChartData((prev) => ({
      ...prev,
      monthly: filteredData,
    }));
  };

  return (
    <div className="animate-enter space-y-6">
      <div className="flex items-center justify-between w-[40rem]">
        <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trainings">Training Stats</TabsTrigger>
          <TabsTrigger value="users">User Stats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <div className="flex items-center gap-2 ">
            <Label htmlFor="year-range">Year:</Label>
            <Select value={selectedYear} onValueChange={(value) => setSelectedYear(value)}>
              <SelectTrigger id="year-range" className="w-[180px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last">Last Year</SelectItem>
                <SelectItem value="current">This Year</SelectItem>
                <SelectItem value="next">Next Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
            <Card className="col-span-2 w-full">
              <CardHeader>
                <CardTitle>Monthly Enrollments</CardTitle>
                <CardDescription>Training enrollments and formations over time</CardDescription>
              </CardHeader>
              <CardContent style={{ width: '100%', height: '500px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={chartData.monthly}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="enrollments" 
                      name="Total Participants"
                      stroke="#0088FE" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="formations" 
                      name="Number of Formations"
                      stroke="#00C49F" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* <Card className="col-span-2 w-full">
              <CardHeader>
                <CardTitle>Training Completion Status</CardTitle>
                <CardDescription>Overall completion rate</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.completion}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.completion.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card> */}
          </div>
        </TabsContent>
        
        <TabsContent value="trainings">
          {/* <Card>
            <CardHeader>
              <CardTitle>Training Participation</CardTitle>
              <CardDescription>Number of participants per training</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData.trainings}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="active" name="Active" stackId="a" fill="#0088FE" />
                  <Bar dataKey="completed" name="Completed" stackId="a" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card> */}
          <Card className="col-span-2 w-full">
              <CardHeader>
                <CardTitle>Training Completion Status</CardTitle>
                <CardDescription>Overall completion rate</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.completion}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.completion.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
              <CardDescription>Users by role</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.roles}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, value}) => `${name}: ${value}`}
                  >
                    {chartData.roles.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;
