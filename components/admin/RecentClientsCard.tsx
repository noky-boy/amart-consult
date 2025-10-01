"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Users, Plus, Eye, Edit, Key } from "lucide-react";
import type { Client } from "@/lib/supabase";

interface RecentClientsCardProps {
  clients: Client[];
  enablingPortal: string | null;
  onEnablePortalAccess: (client: Client) => void;
}

// @ts-ignore - Client component event handler
export function RecentClientsCard({
  clients,
  enablingPortal,
  onEnablePortalAccess,
}: RecentClientsCardProps) {
  return (
    <Card>
      <CardHeader className="flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Users className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Recent Clients</span>
        </CardTitle>
        <Button size="sm" asChild className="w-full sm:w-auto">
          <Link href="/admin/clients/add">
            <Plus className="h-4 w-4 mr-1" />
            Add Client
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {clients.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {clients.map((client) => (
              <div
                key={client.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-slate-200 rounded-lg gap-3 sm:gap-0"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 truncate">
                    {client.first_name} {client.last_name}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 truncate">
                    {client.email}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {client.tier}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {client.client_status}
                    </Badge>
                    {client.has_portal_access && (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 text-xs"
                      >
                        Portal Access
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 justify-end sm:justify-start">
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/admin/clients/${client.id}`}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Link>
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/admin/clients/${client.id}/edit`}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                  {!client.has_portal_access ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEnablePortalAccess(client)}
                      disabled={enablingPortal === client.id}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      title="Enable portal access"
                    >
                      {enablingPortal === client.id ? (
                        <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Key className="h-4 w-4" />
                      )}
                      <span className="sr-only">Enable Portal</span>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-green-600 cursor-default"
                      title="Portal access already enabled"
                      disabled
                    >
                      <Key className="h-4 w-4" />
                      <span className="sr-only">Portal Enabled</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <Users className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base sm:text-lg font-semibold text-slate-900">
              No clients yet
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Get started by adding your first client
            </p>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/admin/clients/add">
                <Plus className="h-4 w-4 mr-2" />
                Add First Client
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
