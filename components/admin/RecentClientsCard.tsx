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

export function RecentClientsCard({
  clients,
  enablingPortal,
  onEnablePortalAccess,
}: RecentClientsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Recent Clients</span>
          </CardTitle>
        </div>
        <Button size="sm" asChild>
          <Link href="/admin/clients/add">
            <Plus className="h-4 w-4 mr-1" />
            Add Client
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {clients.length > 0 ? (
          <div className="space-y-4">
            {clients.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">
                    {client.first_name} {client.last_name}
                  </h4>
                  <p className="text-sm text-slate-600">{client.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{client.tier}</Badge>
                    <Badge variant="outline">{client.client_status}</Badge>
                    {client.has_portal_access && (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Portal Access
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/admin/clients/${client.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/admin/clients/${client.id}/edit`}>
                      <Edit className="h-4 w-4" />
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
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-900">
              No clients yet
            </h3>
            <p className="text-slate-600 mb-4">
              Get started by adding your first client
            </p>
            <Button asChild>
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
