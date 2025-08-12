"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  MessageSquare,
  FileText,
  Camera,
  Bell,
  LogOut,
  TrendingUp,
  BarChart3,
  Clock,
  CheckCircle,
  Users,
  Download,
  Send,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [newMessage, setNewMessage] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Sarah Johnson",
      role: "Project Manager",
      message: "Foundation work is progressing well. We should have the concrete poured by end of week.",
      timestamp: "2024-03-15T10:30:00Z",
      isClient: false,
    },
    {
      id: 2,
      sender: "John Doe",
      role: "Client",
      message: "Great to hear! Can you send me some photos of the current progress?",
      timestamp: "2024-03-15T14:20:00Z",
      isClient: true,
    },
  ])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "John Doe",
        role: "Client",
        message: newMessage,
        timestamp: new Date().toISOString(),
        isClient: true,
      }
      setMessages([...messages, message])
      setNewMessage("")
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                <Image src="/images/amart-logo.png" alt="Amart Consult" width={120} height={40} />
              </Link>
              <div className="h-6 w-px bg-gradient-to-b from-slate-300 to-slate-100"></div>
              <h1 className="text-xl font-serif font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Client Portal
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative hover:bg-slate-100 transition-colors">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-pulse"></span>
              </Button>
              <div className="flex items-center space-x-3 bg-slate-50 rounded-full px-3 py-2">
                <Avatar className="h-8 w-8 ring-2 ring-indigo-100">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-semibold">
                    JD
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-slate-700">John Doe</span>
              </div>
              <Button variant="ghost" size="sm" className="hover:bg-red-50 hover:text-red-600 transition-colors">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white/70 backdrop-blur-sm border-r border-slate-200/60 min-h-screen">
          <nav className="p-6">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center justify-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === "overview"
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-200 transform scale-105"
                    : "text-slate-700 hover:bg-slate-100 hover:scale-102 hover:shadow-sm"
                }`}
              >
                <BarChart3 className="mr-3 h-4 w-4" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab("timeline")}
                className={`w-full flex items-center justify-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === "timeline"
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-200 transform scale-105"
                    : "text-slate-700 hover:bg-slate-100 hover:scale-102 hover:shadow-sm"
                }`}
              >
                <Clock className="mr-3 h-4 w-4" />
                Timeline
              </button>
              <button
                onClick={() => setActiveTab("photos")}
                className={`w-full flex items-center justify-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === "photos"
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-200 transform scale-105"
                    : "text-slate-700 hover:bg-slate-100 hover:scale-102 hover:shadow-sm"
                }`}
              >
                <Camera className="mr-3 h-4 w-4" />
                Photos
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className={`w-full flex items-center justify-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === "documents"
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-200 transform scale-105"
                    : "text-slate-700 hover:bg-slate-100 hover:scale-102 hover:shadow-sm"
                }`}
              >
                <FileText className="mr-3 h-4 w-4" />
                Documents
              </button>
              <button
                onClick={() => setActiveTab("messages")}
                className={`w-full flex items-center justify-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === "messages"
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-200 transform scale-105"
                    : "text-slate-700 hover:bg-slate-100 hover:scale-102 hover:shadow-sm"
                }`}
              >
                <MessageSquare className="mr-3 h-4 w-4" />
                Messages
                <span className="ml-auto bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  3
                </span>
              </button>
            </div>

            <div className="mt-8 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 text-center">Your Project Team</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                      SJ
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-700">Sarah Johnson</p>
                    <p className="text-xs text-slate-500">Project Manager</p>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white text-xs">
                      MK
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-700">Mike Kim</p>
                    <p className="text-xs text-slate-500">Lead Architect</p>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Project Overview</h2>
                <p className="text-slate-600">Modern Family Home - Accra, Ghana</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50 h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center h-full justify-between">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl mb-4">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-sm font-medium text-slate-600 mb-2">Overall Progress</p>
                      <p className="text-3xl font-bold text-slate-900 mb-4">68%</p>
                      <Progress value={68} className="h-2 w-full" />
                      <p className="text-xs text-slate-500 mt-2">+5% from last week</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-orange-50 h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center h-full justify-between">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mb-4">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-sm font-medium text-slate-600 mb-2">Days Remaining</p>
                      <p className="text-3xl font-bold text-slate-900 mb-4">45</p>
                      <p className="text-xs text-slate-500">Expected completion: May 15, 2024</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-green-50 h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center h-full justify-between">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mb-4">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-sm font-medium text-slate-600 mb-2">Completed Tasks</p>
                      <p className="text-3xl font-bold text-slate-900 mb-4">12/18</p>
                      <Progress value={67} className="h-2 w-full" />
                      <p className="text-xs text-slate-500 mt-2">6 tasks remaining</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50 h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center h-full justify-between">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-4">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-sm font-medium text-slate-600 mb-2">Team Members</p>
                      <p className="text-3xl font-bold text-slate-900 mb-4">8</p>
                      <p className="text-xs text-slate-500">Active on project</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-white to-slate-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2">
                      <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                      <span>Recent Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">Foundation work completed</p>
                          <p className="text-xs text-slate-500">2 hours ago • Sarah Johnson</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">New photos uploaded</p>
                          <p className="text-xs text-slate-500">1 day ago • Mike Kim</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                        <div className="h-2 w-2 bg-orange-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">Material delivery scheduled</p>
                          <p className="text-xs text-slate-500">2 days ago • Sarah Johnson</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-white to-slate-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2">
                      <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                        <BarChart3 className="h-4 w-4 text-white" />
                      </div>
                      <span>Project Phases</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-900">Foundation</span>
                            <span className="text-xs text-green-600 font-medium">Complete</span>
                          </div>
                          <Progress value={100} className="h-1 mt-1" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-900">Framing</span>
                            <span className="text-xs text-blue-600 font-medium">In Progress</span>
                          </div>
                          <Progress value={75} className="h-1 mt-1" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="h-3 w-3 bg-slate-300 rounded-full"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-500">Electrical</span>
                            <span className="text-xs text-slate-400 font-medium">Pending</span>
                          </div>
                          <Progress value={0} className="h-1 mt-1" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="h-3 w-3 bg-slate-300 rounded-full"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-500">Finishing</span>
                            <span className="text-xs text-slate-400 font-medium">Pending</span>
                          </div>
                          <Progress value={0} className="h-1 mt-1" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-6">
              <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-white to-slate-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <span>Project Timeline</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500"></div>
                    <div className="space-y-8">
                      <div className="relative flex items-start space-x-4">
                        <div className="h-4 w-4 bg-green-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                        <div className="flex-1 bg-green-50 p-4 rounded-lg border border-green-200">
                          <h3 className="font-semibold text-green-800">Foundation Complete</h3>
                          <p className="text-sm text-green-600 mt-1">All foundation work finished ahead of schedule</p>
                          <p className="text-xs text-green-500 mt-2">Completed March 10, 2024</p>
                        </div>
                      </div>
                      <div className="relative flex items-start space-x-4">
                        <div className="h-4 w-4 bg-blue-500 rounded-full border-4 border-white shadow-lg z-10 animate-pulse"></div>
                        <div className="flex-1 bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h3 className="font-semibold text-blue-800">Framing in Progress</h3>
                          <p className="text-sm text-blue-600 mt-1">Structural framing 75% complete</p>
                          <p className="text-xs text-blue-500 mt-2">Expected completion: March 25, 2024</p>
                          <Progress value={75} className="mt-3 h-2" />
                        </div>
                      </div>
                      <div className="relative flex items-start space-x-4">
                        <div className="h-4 w-4 bg-slate-300 rounded-full border-4 border-white shadow-lg z-10"></div>
                        <div className="flex-1 bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <h3 className="font-semibold text-slate-600">Electrical & Plumbing</h3>
                          <p className="text-sm text-slate-500 mt-1">Rough-in work scheduled to begin</p>
                          <p className="text-xs text-slate-400 mt-2">Scheduled: April 1, 2024</p>
                        </div>
                      </div>
                      <div className="relative flex items-start space-x-4">
                        <div className="h-4 w-4 bg-slate-300 rounded-full border-4 border-white shadow-lg z-10"></div>
                        <div className="flex-1 bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <h3 className="font-semibold text-slate-600">Interior Finishing</h3>
                          <p className="text-sm text-slate-500 mt-1">Drywall, painting, and final touches</p>
                          <p className="text-xs text-slate-400 mt-2">Scheduled: April 15, 2024</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "photos" && (
            <div className="space-y-6">
              <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-white to-slate-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                      <Camera className="h-5 w-5 text-white" />
                    </div>
                    <span>Project Photos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div
                        key={i}
                        className="group relative aspect-square bg-slate-100 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                      >
                        <Image
                          src={`/placeholder.svg?height=200&width=200&query=construction progress ${i}`}
                          alt={`Progress photo ${i}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-2 left-2 text-white text-xs">March {i + 5}, 2024</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-6">
              <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-white to-slate-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <span>Project Documents</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Architectural Plans v2.1", type: "PDF", size: "2.4 MB", date: "March 15, 2024" },
                      { name: "Building Permit", type: "PDF", size: "1.2 MB", date: "March 10, 2024" },
                      { name: "Material Specifications", type: "PDF", size: "3.1 MB", date: "March 8, 2024" },
                      { name: "Contract Agreement", type: "PDF", size: "856 KB", date: "February 28, 2024" },
                    ].map((doc, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <FileText className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{doc.name}</p>
                            <p className="text-sm text-slate-500">
                              {doc.type} • {doc.size} • {doc.date}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="hover:bg-slate-200">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Project Communication</h2>
                <p className="text-slate-600">Stay connected with your project team</p>
              </div>

              <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-white to-slate-50">
                <CardHeader className="pb-4 text-center">
                  <CardTitle className="flex items-center justify-center space-x-2">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                      <MessageSquare className="h-4 w-4 text-white" />
                    </div>
                    <span>Project Communication</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 overflow-y-auto space-y-4 mb-4 p-4 bg-slate-50 rounded-lg">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.isClient ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                            message.isClient
                              ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white"
                              : "bg-white text-slate-900 border border-slate-200"
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium">{message.sender}</span>
                            <span className={`text-xs ${message.isClient ? "text-indigo-200" : "text-slate-500"}`}>
                              {message.role}
                            </span>
                          </div>
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${message.isClient ? "text-indigo-200" : "text-slate-400"}`}>
                            {formatTimestamp(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-white"
                      rows={3}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 px-6 self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
