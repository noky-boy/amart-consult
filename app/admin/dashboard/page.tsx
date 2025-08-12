"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Building2,
  FileText,
  MessageSquare,
  TrendingUp,
  Upload,
  Download,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Send,
  ImageIcon,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [selectedClient, setSelectedClient] = useState<string | null>(null)

  const router = useRouter()

  const dashboardStats = [
    {
      title: "Total Clients",
      value: "24",
      change: "+3 this month",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Projects",
      value: "18",
      change: "+2 this week",
      icon: Building2,
      color: "text-green-600",
    },
    {
      title: "Documents Shared",
      value: "156",
      change: "+12 today",
      icon: FileText,
      color: "text-purple-600",
    },
    {
      title: "Messages",
      value: "89",
      change: "+5 unread",
      icon: MessageSquare,
      color: "text-orange-600",
    },
  ]

  const recentClients = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      project: "Modern Villa Design",
      status: "In Progress",
      progress: 75,
      lastActivity: "2 hours ago",
      tier: "Tier 3",
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael.chen@email.com",
      project: "Office Complex Renovation",
      status: "Review",
      progress: 90,
      lastActivity: "1 day ago",
      tier: "Tier 3",
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@email.com",
      project: "Residential Apartment",
      status: "Planning",
      progress: 25,
      lastActivity: "3 hours ago",
      tier: "Tier 3",
    },
  ]

  const recentMessages = [
    {
      id: "1",
      client: "Sarah Johnson",
      message: "Could you please review the latest design revisions?",
      time: "10:30 AM",
      unread: true,
    },
    {
      id: "2",
      client: "Michael Chen",
      message: "The construction timeline looks perfect. Thank you!",
      time: "Yesterday",
      unread: false,
    },
    {
      id: "3",
      client: "Emily Rodriguez",
      message: "I have some questions about the material selections.",
      time: "2 days ago",
      unread: true,
    },
  ]

  const recentDocuments = [
    {
      id: "1",
      name: "Villa_FloorPlan_v3.pdf",
      client: "Sarah Johnson",
      type: "Floor Plan",
      size: "2.4 MB",
      uploadedAt: "2 hours ago",
    },
    {
      id: "2",
      name: "Office_3D_Render.jpg",
      client: "Michael Chen",
      type: "3D Render",
      size: "5.1 MB",
      uploadedAt: "1 day ago",
    },
    {
      id: "3",
      name: "Material_Specifications.docx",
      client: "Emily Rodriguez",
      type: "Specifications",
      size: "1.8 MB",
      uploadedAt: "3 days ago",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Review":
        return "bg-yellow-100 text-yellow-800"
      case "Planning":
        return "bg-purple-100 text-purple-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedClient) {
      // Handle message sending logic here
      setNewMessage("")
      setSelectedClient(null)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    sessionStorage.clear()
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-indigo-600" />
                <span className="text-xl font-bold text-slate-900">Amart Admin</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-slate-100 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white p-1 rounded-lg shadow-sm">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Clients</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Documents</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Messages</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Clients */}
              <Card className="bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Clients</CardTitle>
                    <CardDescription>Latest client activities and project updates</CardDescription>
                  </div>
                  <Link href="/admin/clients/add">
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Client
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentClients.map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {client.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900">{client.name}</p>
                          <p className="text-sm text-slate-600">{client.project}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className={getStatusColor(client.status)}>
                              {client.status}
                            </Badge>
                            <span className="text-xs text-slate-500">{client.lastActivity}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <Progress value={client.progress} className="w-20" />
                          <span className="text-sm font-medium">{client.progress}%</span>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Messages */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Recent Messages</CardTitle>
                  <CardDescription>Latest client communications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 border rounded-lg transition-colors ${message.unread ? "border-indigo-200 bg-indigo-50" : "border-slate-200 hover:bg-slate-50"}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-medium text-slate-900">{message.client}</p>
                            {message.unread && (
                              <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{message.message}</p>
                          <p className="text-xs text-slate-500">{message.time}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div>
                    <CardTitle>Client Management</CardTitle>
                    <CardDescription>Manage all Tier 3 clients and their projects</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Link href="/admin/clients/add">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Client
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentClients.map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center justify-between p-6 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="text-lg">
                            {client.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-slate-900">{client.name}</h3>
                          <p className="text-slate-600">{client.email}</p>
                          <p className="text-sm text-slate-500">{client.project}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="secondary" className={getStatusColor(client.status)}>
                              {client.status}
                            </Badge>
                            <Badge variant="outline">{client.tier}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-1">
                            <Progress value={client.progress} className="w-24" />
                            <span className="text-sm font-medium">{client.progress}%</span>
                          </div>
                          <p className="text-xs text-slate-500">Last active: {client.lastActivity}</p>
                        </div>
                        <div className="flex space-x-1">
                          <Link href={`/admin/clients/${client.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/clients/${client.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div>
                    <CardTitle>Document & Image Management</CardTitle>
                    <CardDescription>Manage and share project documents and images with clients</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export All
                    </Button>
                    <Button variant="outline">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Upload Pictures
                    </Button>
                    <Link href="/admin/documents/upload">
                      <Button>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="relative group">
                        <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
                          <img
                            src={`/placeholder.svg?height=150&width=150&query=construction${i}`}
                            alt={`Project image ${i}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                            <Button size="sm" variant="secondary">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="secondary">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Documents</h3>
                  {recentDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <FileText className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900">{doc.name}</h3>
                          <p className="text-sm text-slate-600">Client: {doc.client}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <Badge variant="outline">{doc.type}</Badge>
                            <span className="text-xs text-slate-500">{doc.size}</span>
                            <span className="text-xs text-slate-500">Uploaded {doc.uploadedAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Message List */}
              <Card className="lg:col-span-1 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Conversations</CardTitle>
                  <CardDescription>Recent client messages</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {recentMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedClient === message.client
                          ? "bg-indigo-100 border-indigo-200"
                          : message.unread
                            ? "bg-blue-50 hover:bg-blue-100"
                            : "hover:bg-slate-50"
                      }`}
                      onClick={() => setSelectedClient(message.client)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm">{message.client}</p>
                        {message.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      </div>
                      <p className="text-xs text-slate-600 truncate">{message.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{message.time}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Message Compose */}
              <Card className="lg:col-span-2 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>{selectedClient ? `Message ${selectedClient}` : "Select a conversation"}</CardTitle>
                  {selectedClient && <CardDescription>Send a message to your client</CardDescription>}
                </CardHeader>
                <CardContent>
                  {selectedClient ? (
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 bg-slate-50 max-h-64 overflow-y-auto">
                        <div className="space-y-3">
                          <div className="flex justify-end">
                            <div className="bg-indigo-600 text-white p-3 rounded-lg max-w-xs">
                              <p className="text-sm">
                                Hello! I've uploaded the latest design revisions for your review.
                              </p>
                              <p className="text-xs opacity-75 mt-1">2:30 PM</p>
                            </div>
                          </div>
                          <div className="flex justify-start">
                            <div className="bg-white border p-3 rounded-lg max-w-xs">
                              <p className="text-sm">Thank you! I'll review them and get back to you with feedback.</p>
                              <p className="text-xs text-slate-500 mt-1">2:45 PM</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Textarea
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="flex-1"
                          rows={3}
                        />
                        <Button onClick={handleSendMessage} className="self-end">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">Select a conversation to start messaging</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Project Status Overview</CardTitle>
                  <CardDescription>Current status of all active projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">In Progress</span>
                      <span className="text-sm text-slate-600">12 projects</span>
                    </div>
                    <Progress value={67} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Under Review</span>
                      <span className="text-sm text-slate-600">4 projects</span>
                    </div>
                    <Progress value={22} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Planning</span>
                      <span className="text-sm text-slate-600">2 projects</span>
                    </div>
                    <Progress value={11} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Client Satisfaction</CardTitle>
                  <CardDescription>Average client satisfaction ratings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">4.8</div>
                      <p className="text-sm text-slate-600">Average Rating</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm w-8">5★</span>
                        <Progress value={85} className="flex-1 h-2" />
                        <span className="text-sm text-slate-600">85%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm w-8">4★</span>
                        <Progress value={12} className="flex-1 h-2" />
                        <span className="text-sm text-slate-600">12%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm w-8">3★</span>
                        <Progress value={3} className="flex-1 h-2" />
                        <span className="text-sm text-slate-600">3%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminDashboard
