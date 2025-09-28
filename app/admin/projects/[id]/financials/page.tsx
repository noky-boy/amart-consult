"use client";

import type React from "react";
import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Save,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  PieChart,
  Calculator,
  CreditCard,
  Receipt,
  Target,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { projectService, getFinancialSummary } from "@/lib/supabase";
import type { Project, Client } from "@/lib/supabase";

type ProjectWithClient = Project & { client: Client };

export default function ProjectFinancialManagement({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [project, setProject] = useState<ProjectWithClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [financialData, setFinancialData] = useState({
    contract_sum: "",
    cash_received: "",
  });

  const [paymentHistory, setPaymentHistory] = useState<
    {
      amount: string;
      date: string;
      description: string;
    }[]
  >([]);

  const [newPayment, setNewPayment] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        setError("");

        const projectData = await projectService.getWithClient(id);
        setProject(projectData);

        // Set financial data from project
        setFinancialData({
          contract_sum: projectData.contract_sum?.toString() || "",
          cash_received: projectData.cash_received?.toString() || "",
        });

        // Initialize payment history if there's received cash
        if (projectData.cash_received && projectData.cash_received > 0) {
          setPaymentHistory([
            {
              amount: projectData.cash_received.toString(),
              date: new Date().toISOString().split("T")[0],
              description: "Current total received",
            },
          ]);
        }
      } catch (err: any) {
        console.error("Failed to fetch project data:", err);
        setError("Failed to load project data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectData();
    }
  }, [id]);

  const handleFinancialUpdate = async () => {
    if (!financialData.contract_sum.trim()) {
      setError("Please enter the contract sum");
      return;
    }

    const contractSum = parseFloat(financialData.contract_sum);
    const cashReceived = parseFloat(financialData.cash_received) || 0;

    if (isNaN(contractSum) || contractSum <= 0) {
      setError("Please enter a valid contract sum");
      return;
    }

    if (isNaN(cashReceived) || cashReceived < 0) {
      setError("Please enter a valid cash received amount");
      return;
    }

    if (cashReceived > contractSum) {
      setError("Cash received cannot exceed contract sum");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updatedProject = await projectService.update(id, {
        contract_sum: contractSum,
        cash_received: cashReceived,
      });

      setProject((prev) => (prev ? { ...prev, ...updatedProject } : null));
      setSuccess("Financial information updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      console.error("Error updating financials:", error);
      setError("Failed to update financial information: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const addPaymentRecord = () => {
    if (!newPayment.amount.trim() || !newPayment.date) {
      setError("Please enter payment amount and date");
      return;
    }

    const amount = parseFloat(newPayment.amount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid payment amount");
      return;
    }

    setPaymentHistory([
      ...paymentHistory,
      {
        amount: amount.toString(),
        date: newPayment.date,
        description: newPayment.description || `Payment on ${newPayment.date}`,
      },
    ]);

    // Update cash received total
    const currentReceived = parseFloat(financialData.cash_received) || 0;
    const newTotal = currentReceived + amount;

    setFinancialData((prev) => ({
      ...prev,
      cash_received: newTotal.toString(),
    }));

    // Clear new payment form
    setNewPayment({
      amount: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
    });

    setError("");
  };

  const removePaymentRecord = (index: number) => {
    const removedPayment = paymentHistory[index];
    const removedAmount = parseFloat(removedPayment.amount);

    // Update cash received total
    const currentReceived = parseFloat(financialData.cash_received) || 0;
    const newTotal = Math.max(0, currentReceived - removedAmount);

    setFinancialData((prev) => ({
      ...prev,
      cash_received: newTotal.toString(),
    }));

    // Remove from payment history
    setPaymentHistory(paymentHistory.filter((_, i) => i !== index));
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return isNaN(num) ? "GHS 0" : `GHS ${num.toLocaleString()}`;
  };

  // Loading state
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
        <div className="max-w-4xl mx-auto p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !project) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="px-6 py-4">
            <div className="flex items-center gap-4">
              <Link href="/admin/projects">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Projects
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
                Financial Management
              </h1>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!project) return null;

  // Calculate financial summary
  const contractSum = parseFloat(financialData.contract_sum) || 0;
  const cashReceived = parseFloat(financialData.cash_received) || 0;
  const balance = contractSum - cashReceived;
  const paymentProgress =
    contractSum > 0 ? Math.round((cashReceived / contractSum) * 100) : 0;
  const isFullyPaid = balance <= 0;
  const totalPayments = paymentHistory.reduce(
    (sum, payment) => sum + parseFloat(payment.amount),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href={`/admin/projects/${id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Project
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
              Financial Management
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Alerts */}
        {error && (
          <Alert className="border-red-200 bg-red-50 mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50 mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-700">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Project Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{project.project_title}</CardTitle>
            <CardDescription>
              Client: {project.client.first_name} {project.client.last_name}
              {project.client.company && ` - ${project.client.company}`}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Target className="h-4 w-4 text-blue-600" />
                Contract Sum
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {formatCurrency(contractSum)}
              </div>
              <p className="text-sm text-slate-600">Total project value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="h-4 w-4 text-green-600" />
                Cash Received
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                {formatCurrency(cashReceived)}
              </div>
              <p className="text-sm text-slate-600">
                {paymentProgress}% of contract
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <TrendingDown className="h-4 w-4 text-orange-600" />
                Outstanding Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  balance > 0 ? "text-orange-600" : "text-green-600"
                }`}
              >
                {formatCurrency(balance)}
              </div>
              <p className="text-sm text-slate-600">
                {isFullyPaid ? "Fully paid" : "Remaining amount"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Progress */}
        {contractSum > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Payment Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">
                    Payment Status
                  </span>
                  <span className="text-sm text-slate-600">
                    {paymentProgress}% Complete
                  </span>
                </div>
                <Progress value={paymentProgress} className="h-3" />
                <div className="flex justify-between text-sm text-slate-600">
                  <span>{formatCurrency(0)}</span>
                  <span>{formatCurrency(contractSum)}</span>
                </div>
                {isFullyPaid && (
                  <div className="flex items-center gap-2 text-green-700 font-medium">
                    <CheckCircle className="h-4 w-4" />
                    Project Fully Paid
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Financial Information Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Financial Information
            </CardTitle>
            <CardDescription>
              Update the contract sum and payment details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contract_sum">Contract Sum (GHS) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="contract_sum"
                    type="number"
                    step="0.01"
                    min="0"
                    value={financialData.contract_sum}
                    onChange={(e) =>
                      setFinancialData((prev) => ({
                        ...prev,
                        contract_sum: e.target.value,
                      }))
                    }
                    placeholder="Enter total contract value"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cash_received">Cash Received (GHS)</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="cash_received"
                    type="number"
                    step="0.01"
                    min="0"
                    value={financialData.cash_received}
                    onChange={(e) =>
                      setFinancialData((prev) => ({
                        ...prev,
                        cash_received: e.target.value,
                      }))
                    }
                    placeholder="Total amount received"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Calculated Balance */}
            {financialData.contract_sum && (
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-slate-600">Contract Sum</div>
                    <div className="font-semibold text-slate-900">
                      {formatCurrency(financialData.contract_sum)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Cash Received</div>
                    <div className="font-semibold text-green-700">
                      {formatCurrency(financialData.cash_received)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Balance</div>
                    <div
                      className={`font-semibold ${
                        balance > 0 ? "text-orange-600" : "text-green-600"
                      }`}
                    >
                      {formatCurrency(balance)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={handleFinancialUpdate}
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Financial Information
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Payment History
            </CardTitle>
            <CardDescription>
              Track individual payments and maintain records
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add New Payment */}
            <div className="p-4 border border-slate-200 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-4">
                Record New Payment
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Amount (GHS)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newPayment.amount}
                    onChange={(e) =>
                      setNewPayment((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    placeholder="Payment amount"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={newPayment.date}
                    onChange={(e) =>
                      setNewPayment((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={newPayment.description}
                    onChange={(e) =>
                      setNewPayment((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Payment description"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addPaymentRecord} className="w-full">
                    Add Payment
                  </Button>
                </div>
              </div>
            </div>

            {/* Payment Records */}
            {paymentHistory.length > 0 ? (
              <div className="space-y-3">
                {paymentHistory.map((payment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <CreditCard className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium text-slate-900">
                          {formatCurrency(payment.amount)}
                        </div>
                        <div className="text-sm text-slate-600">
                          {payment.description} •{" "}
                          {new Date(payment.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePaymentRecord(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total Payments:</span>
                    <span>{formatCurrency(totalPayments)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Receipt className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No payment records
                </h3>
                <p className="text-slate-600">
                  Add payment records to track the payment history for this
                  project
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
