"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
  Upload,
  Download,
  Eye,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ClientDetails({ params }: { params: { id: string } }) {
  // Mock client data
  const client = {
    id: params.id,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+233 XX XXX XXXX",
    company: "Smith Enterprises",
    address: "123 Main Street, Accra, Ghana",
    project: {
      title: "Modern Villa Design",
      type: "Residential",
      description: "A contemporary 4-bedroom villa with modern amenities and sustainable design features.",
      status: "In Progress",
      progress: 65,
      budget: "GHS 250,000 - 500,000",
      timeline: "8 months",
      startDate: "2024-01-15",
    },
    tier: "Tier 3",
    joinDate: "2024-01-10",
    lastActivity: "2 hours ago",
  }

  const milestones = [
    { title: "Initial Consultation", status: "completed", date: "2024-01-15" },
    { title: "Site Survey", status: "completed", date: "2024-01-22" },
    { title: "Concept Design", status: "completed", date: "2024-02-05" },
    { title: "Design Development", status: "in-progress", date: "2024-02-20" },
    { title: "Construction Documents", status: "pending", date: "2024-03-15" },
    { title: "Final Review", status: "pending", date: "2024-04-01" },
  ]

  const documents = [
    { name: "Site Survey Report.pdf", type: "PDF", size: "2.4 MB", date: "2024-01-22" },
    { name: "Concept Drawings.dwg", type: "CAD", size: "15.2 MB", date: "2024-02-05" },
    { name: "Material Specifications.xlsx", type: "Excel", size: "1.8 MB", date: "2024-02-10" },
  ]

  const messages = [
    {
      id: 1,
      sender: "John Smith",
      message: "Thank you for the latest design updates. I have a few questions about the kitchen layout.",
      time: "2 hours ago",
      type: "client",
    },
    {
      id: 2,
      sender: "Admin",
      message: "I'll schedule a call to discuss the kitchen layout changes. Are you available tomorrow afternoon?",
      time: "1 hour ago",
      type: "admin",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-slate-300" />
              <Image src="/images/amart-logo.png" alt="Amart Consult" width={120} height={40} className="h-8 w-auto" />
              <h1 className="text-xl font-semibold text-slate-900">Client Details</h1>
            </div>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
              <Link href={`/admin/clients/${params.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Client
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Client Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2 border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{client.name}</CardTitle>
                  <CardDescription className="text-base">{client.project.title}</CardDescription>
                </div>
                <Badge variant={client.project.status === "In Progress" ? "default" : "secondary"} className="text-sm">
                  {client.project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-900">{client.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-900">{client.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-900">{client.company}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-900">Joined {client.joinDate}</span>
                </div>
              </div>
              <div className="flex items-start gap-3 mt-4">
                <MapPin className="h-4 w-4 text-slate-400 mt-1" />
                <span className="text-slate-900">{client.address}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Project Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-900">Overall Progress</span>
                    <span className="text-sm text-slate-600">{client.project.progress}%</span>
                  </div>
                  <Progress value={client.project.progress} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-900">{client.project.budget}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-900">{client.project.timeline}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{client.tier}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    {/* <Label className="text-sm font-medium text-slate-600">Project Type</Label> */}
                    <span className="text-sm font-medium text-slate-600">Project Type</span>
                    <p className="text-slate-900">{client.project.type}</p>
                  </div>
                  <div>
                    {/* <Label className="text-sm font-medium text-slate-600">Description</Label> */}
                    <span className="text-sm font-medium text-slate-600">Description</span>
                    <p className="text-slate-900">{client.project.description}</p>
                  </div>
                  <div>
                    {/* <Label className="text-sm font-medium text-slate-600">Start Date</Label> */}
                    <span className="text-sm font-medium text-slate-600">Start Date</span>
                    <p className="text-slate-900">{client.project.startDate}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Project Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            milestone.status === "completed"
                              ? "bg-green-500"
                              : milestone.status === "in-progress"
                                ? "bg-blue-500"
                                : "bg-slate-300"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">{milestone.title}</p>
                          <p className="text-xs text-slate-600">{milestone.date}</p>
                        </div>
                        <Badge
                          variant={
                            milestone.status === "completed"
                              ? "default"
                              : milestone.status === "in-progress"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {milestone.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Project Documents</CardTitle>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-900">{doc.name}</p>
                          <p className="text-sm text-slate-600">
                            {doc.type} • {doc.size} • {doc.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Client Communication</CardTitle>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === "admin" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-md p-3 rounded-lg ${
                          message.type === "admin" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-900"
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p
                          className={`text-xs mt-1 ${message.type === "admin" ? "text-indigo-100" : "text-slate-500"}`}
                        >
                          {message.sender} • {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Document uploaded</p>
                      <p className="text-xs text-slate-600">Material Specifications.xlsx • 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="h-2 w-2 bg-blue-500 rounded-full" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Message received</p>
                      <p className="text-xs text-slate-600">Client inquiry about kitchen layout • 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="h-2 w-2 bg-indigo-500 rounded-full" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Milestone completed</p>
                      <p className="text-xs text-slate-600">Concept Design phase finished • 1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={`block text-sm font-medium ${className}`}>{children}</span>
}
