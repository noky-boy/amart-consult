import { TabsList, TabsTrigger } from "@ui/tabs"
import { Button } from "@ui/button"
import { CardContent } from "@ui/card"
import { Link } from "next/link"
import { TrendingUp, Users, Mail, FileText, MessageSquare, BarChart3 } from "lucide-react"

export default function DashboardPage() {
  return (
    <div>
      <TabsList className="grid w-full grid-cols-6 bg-white p-1 rounded-lg shadow-sm">
        <TabsTrigger value="overview" className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4" />
          <span>Overview</span>
        </TabsTrigger>
        <TabsTrigger value="clients" className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>Clients</span>
        </TabsTrigger>
        <TabsTrigger value="newsletter" className="flex items-center space-x-2">
          <Mail className="h-4 w-4" />
          <span>Newsletter</span>
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
          <BarChart3 className="h-4 w-4" />
          <span>Analytics</span>
        </TabsTrigger>
      </TabsList>

      <CardContent className="space-y-4">
        <Button className="w-full justify-start bg-transparent" variant="outline">
          <Mail className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
        <Button className="w-full justify-start bg-transparent" variant="outline">
          <Mail className="h-4 w-4 mr-2" />
          Schedule Email
        </Button>
        <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
          <Link href="/email-templates">
            <Mail className="h-4 w-4 mr-2" />
            Email Templates
          </Link>
        </Button>
        <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
          <Link href="/admin/automation">
            <BarChart3 className="h-4 w-4 mr-2" />
            Automation
          </Link>
        </Button>
      </CardContent>
    </div>
  )
}
