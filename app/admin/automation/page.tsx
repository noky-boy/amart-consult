"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Zap,
  Mail,
  Users,
  Target,
  Play,
  Pause,
  Settings,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Calendar,
  Filter,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

export default function AutomationPage() {
  const [activeTab, setActiveTab] = useState("workflows")
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)

  const automationWorkflows = [
    {
      id: "welcome-series",
      name: "Welcome Email Series",
      description: "5-email onboarding sequence for new subscribers",
      status: "Active",
      trigger: "New Subscription",
      emails: 5,
      subscribers: 1247,
      openRate: "72%",
      clickRate: "18%",
      lastRun: "2 hours ago",
    },
    {
      id: "lead-magnet-followup",
      name: "Lead Magnet Follow-up",
      description: "Follow-up sequence for Ghana Building Calculator downloads",
      status: "Active",
      trigger: "Lead Magnet Download",
      emails: 3,
      subscribers: 89,
      openRate: "68%",
      clickRate: "22%",
      lastRun: "1 hour ago",
    },
    {
      id: "client-onboarding",
      name: "Client Onboarding",
      description: "Welcome sequence for new Tier 3 clients",
      status: "Draft",
      trigger: "New Client Added",
      emails: 4,
      subscribers: 0,
      openRate: "-",
      clickRate: "-",
      lastRun: "Never",
    },
  ]

  const segmentationRules = [
    {
      id: "local-clients",
      name: "Local Clients",
      description: "Subscribers from Ghana",
      criteria: "Location: Ghana",
      count: 892,
      status: "Active",
    },
    {
      id: "international-clients",
      name: "International Clients",
      description: "Subscribers from outside Ghana",
      criteria: "Location: Not Ghana",
      count: 355,
      status: "Active",
    },
    {
      id: "high-engagement",
      name: "High Engagement",
      description: "Subscribers with >50% open rate",
      criteria: "Open Rate > 50%",
      count: 623,
      status: "Active",
    },
    {
      id: "tier3-prospects",
      name: "Tier 3 Prospects",
      description: "Downloaded lead magnet, not yet client",
      criteria: "Downloaded Calculator + Not Client",
      count: 156,
      status: "Active",
    },
  ]

  const automationTriggers = [
    {
      id: "new-subscriber",
      name: "New Subscriber",
      description: "When someone subscribes to newsletter",
      icon: Users,
      active: true,
    },
    {
      id: "lead-magnet-download",
      name: "Lead Magnet Download",
      description: "When someone downloads the building calculator",
      icon: Target,
      active: true,
    },
    {
      id: "client-signup",
      name: "Client Signup",
      description: "When someone becomes a Tier 3 client",
      icon: CheckCircle,
      active: true,
    },
    {
      id: "project-milestone",
      name: "Project Milestone",
      description: "When a client project reaches specific milestones",
      icon: Calendar,
      active: false,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Draft":
        return "bg-yellow-100 text-yellow-800"
      case "Paused":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="flex items-center space-x-2">
                <Zap className="h-8 w-8 text-indigo-600" />
                <span className="text-xl font-bold text-slate-900">Email Automation</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Workflow
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Workflows</p>
                  <p className="text-3xl font-bold text-slate-900">3</p>
                  <p className="text-sm text-green-600 mt-1">+1 this month</p>
                </div>
                <div className="p-3 rounded-full bg-indigo-100">
                  <Zap className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Emails Sent</p>
                  <p className="text-3xl font-bold text-slate-900">2,847</p>
                  <p className="text-sm text-green-600 mt-1">+12% this week</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Avg Open Rate</p>
                  <p className="text-3xl font-bold text-slate-900">69.3%</p>
                  <p className="text-sm text-green-600 mt-1">+2.1% vs last month</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Segments</p>
                  <p className="text-3xl font-bold text-slate-900">4</p>
                  <p className="text-sm text-slate-500 mt-1">1,247 total subscribers</p>
                </div>
                <div className="p-3 rounded-full bg-orange-100">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white p-1 rounded-lg shadow-sm">
            <TabsTrigger value="workflows" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Workflows</span>
            </TabsTrigger>
            <TabsTrigger value="segments" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Segments</span>
            </TabsTrigger>
            <TabsTrigger value="triggers" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Triggers</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Workflows Tab */}
          <TabsContent value="workflows" className="space-y-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div>
                    <CardTitle>Email Automation Workflows</CardTitle>
                    <CardDescription>Manage your automated email sequences and campaigns</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Workflow
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {automationWorkflows.map((workflow) => (
                    <div
                      key={workflow.id}
                      className="flex items-center justify-between p-6 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-indigo-100 rounded-lg">
                          <Mail className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{workflow.name}</h3>
                          <p className="text-sm text-slate-600">{workflow.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant="secondary" className={getStatusColor(workflow.status)}>
                              {workflow.status}
                            </Badge>
                            <span className="text-xs text-slate-500">Trigger: {workflow.trigger}</span>
                            <span className="text-xs text-slate-500">{workflow.emails} emails</span>
                            <span className="text-xs text-slate-500">Last run: {workflow.lastRun}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex items-center space-x-4 mb-1">
                            <div className="text-center">
                              <p className="text-sm font-medium text-slate-900">{workflow.subscribers}</p>
                              <p className="text-xs text-slate-500">Subscribers</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium text-slate-900">{workflow.openRate}</p>
                              <p className="text-xs text-slate-500">Open Rate</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium text-slate-900">{workflow.clickRate}</p>
                              <p className="text-xs text-slate-500">Click Rate</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            {workflow.status === "Active" ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Segments Tab */}
          <TabsContent value="segments" className="space-y-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div>
                    <CardTitle>Subscriber Segmentation</CardTitle>
                    <CardDescription>Create and manage subscriber segments for targeted campaigns</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Segment
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {segmentationRules.map((segment) => (
                    <div
                      key={segment.id}
                      className="flex items-center justify-between p-6 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                          <Filter className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{segment.name}</h3>
                          <p className="text-sm text-slate-600">{segment.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant="secondary" className={getStatusColor(segment.status)}>
                              {segment.status}
                            </Badge>
                            <span className="text-xs text-slate-500">Criteria: {segment.criteria}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-slate-900">{segment.count}</p>
                          <p className="text-xs text-slate-500">Subscribers</p>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Triggers Tab */}
          <TabsContent value="triggers" className="space-y-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Automation Triggers</CardTitle>
                <CardDescription>Configure when automated workflows should be triggered</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {automationTriggers.map((trigger) => (
                    <div
                      key={trigger.id}
                      className="flex items-center justify-between p-6 border border-slate-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-orange-100 rounded-lg">
                          <trigger.icon className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{trigger.name}</h3>
                          <p className="text-sm text-slate-600">{trigger.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Switch checked={trigger.active} />
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Workflow Performance</CardTitle>
                  <CardDescription>Performance metrics for your automation workflows</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {automationWorkflows
                      .filter((w) => w.status === "Active")
                      .map((workflow) => (
                        <div key={workflow.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{workflow.name}</span>
                            <span className="text-sm text-slate-600">{workflow.openRate} open rate</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: workflow.openRate }}></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Subscriber Growth</CardTitle>
                  <CardDescription>Monthly subscriber acquisition by source</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Lead Magnet</span>
                      <span className="text-sm text-slate-600">89 subscribers</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Homepage</span>
                      <span className="text-sm text-slate-600">45 subscribers</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Blog</span>
                      <span className="text-sm text-slate-600">23 subscribers</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Footer</span>
                      <span className="text-sm text-slate-600">12 subscribers</span>
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
