"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { clientService } from "@/lib/supabase";
import type { Client } from "@/lib/supabase";

function ClientListing() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [projectTypeFilter, setProjectTypeFilter] = useState<string>("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const clientData = await clientService.getAll();
        setClients(clientData);
        setFilteredClients(clientData);
      } catch (err: any) {
        console.error("Failed to fetch clients:", err);
        setError("Failed to load clients");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...clients];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (client) =>
          `${client.first_name} ${client.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (client.company &&
            client.company.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (client) => client.client_status === statusFilter
      );
    }

    // Tier filter
    if (tierFilter !== "all") {
      filtered = filtered.filter((client) => client.tier === tierFilter);
    }

    setFilteredClients(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [clients, searchTerm, statusFilter, tierFilter, projectTypeFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planning":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Review":
        return "bg-purple-100 text-purple-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "On Hold":
        return "bg-orange-100 text-orange-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this client? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await clientService.delete(clientId);
      setClients(clients.filter((c) => c.id !== clientId));
    } catch (err: any) {
      alert("Failed to delete client: " + err.message);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Company",
      "Project Title",
      "Status",
      "Tier",
      "Created",
    ];
    const csvData = filteredClients.map((client) => [
      `${client.first_name} ${client.last_name}`,
      client.email,
      client.company || "",
      client.client_status,
      client.tier,
      new Date(client.created_at).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clients-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClients = filteredClients.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
              <Image
                src="/images/amart-logo.png"
                alt="Amart Consult"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
              <h1 className="text-xl font-semibold text-slate-900">
                All Clients
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button size="sm" asChild>
                <Link href="/admin/clients/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Client
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              {/* Tier Filter */}
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Tiers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="Tier 1">Tier 1</SelectItem>
                  <SelectItem value="Tier 2">Tier 2</SelectItem>
                  <SelectItem value="Tier 3">Tier 3</SelectItem>
                </SelectContent>
              </Select>

              {/* Project Type Filter */}
              <Select
                value={projectTypeFilter}
                onValueChange={setProjectTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Project Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Project Types</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="renovation">Renovation</SelectItem>
                  <SelectItem value="interior">Interior Design</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setTierFilter("all");
                  setProjectTypeFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-slate-600">
              Showing {currentClients.length} of {filteredClients.length}{" "}
              clients
              {filteredClients.length !== clients.length && (
                <span> (filtered from {clients.length} total)</span>
              )}
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Client List */}
        <Card>
          <CardHeader>
            <CardTitle>Clients</CardTitle>
          </CardHeader>
          <CardContent>
            {currentClients.length > 0 ? (
              <div className="space-y-4">
                {currentClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold">
                          {client.first_name[0]}
                          {client.last_name[0]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">
                          {client.first_name} {client.last_name}
                        </h3>
                        <p className="text-sm text-slate-600">{client.email}</p>
                        {client.company && (
                          <p className="text-sm text-slate-500">
                            {client.company}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(client.client_status)}>
                          {client.client_status}
                        </Badge>
                        <Badge variant="outline">{client.tier}</Badge>
                      </div>

                      <div className="text-sm text-slate-600">
                        {new Date(client.created_at).toLocaleDateString()}
                      </div>

                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/clients/${client.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/clients/${client.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClient(client.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MoreHorizontal className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {clients.length === 0
                    ? "No clients yet"
                    : "No clients match your filters"}
                </h3>
                <p className="text-slate-600 mb-4">
                  {clients.length === 0
                    ? "Get started by adding your first client"
                    : "Try adjusting your search or filter criteria"}
                </p>
                {clients.length === 0 && (
                  <Button asChild>
                    <Link href="/admin/clients/add">
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Client
                    </Link>
                  </Button>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="text-sm text-slate-600">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ClientListingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50">
          <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </header>
          <div className="max-w-7xl mx-auto p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ClientListing />
    </Suspense>
  );
}
