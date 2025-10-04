// // app/admin/projects/[id]/components/FinancialSummaryCard.tsx
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { DollarSign, PieChart, CheckCircle } from "lucide-react";
// import Link from "next/link";

// export function FinancialSummaryCard({ summary, projectId }) {
//   if (!summary) return null;

//   return (
//     <Card className="border-0 shadow-sm">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <PieChart className="h-5 w-5" />
//           Financial Summary
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="grid grid-cols-1 gap-3">
//           <div className="flex items-center justify-between">
//             <span className="text-sm text-slate-600">Contract Sum:</span>
//             <span className="font-semibold text-slate-900">
//               {summary.formatted.contract_sum}
//             </span>
//           </div>
//           <div className="flex items-center justify-between">
//             <span className="text-sm text-slate-600">Cash Received:</span>
//             <span className="font-semibold text-green-700">
//               {summary.formatted.cash_received}
//             </span>
//           </div>
//           <div className="flex items-center justify-between border-t pt-3">
//             <span className="text-sm font-medium text-slate-600">Balance:</span>
//             <span
//               className={`font-bold ${
//                 summary.balance > 0 ? "text-red-600" : "text-green-600"
//               }`}
//             >
//               {summary.formatted.balance}
//             </span>
//           </div>
//         </div>
//         {summary.contract_sum > 0 && (
//           <div className="mt-4">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sm font-medium text-slate-600">
//                 Payment Progress
//               </span>
//               <span className="text-sm text-slate-600">
//                 {summary.progress_percentage}%
//               </span>
//             </div>
//             <Progress value={summary.progress_percentage} className="h-2" />
//             {summary.is_fully_paid && (
//               <div className="flex items-center gap-2 mt-2 text-green-700">
//                 <CheckCircle className="h-4 w-4" />
//                 <span className="text-sm font-medium">Fully Paid</span>
//               </div>
//             )}
//           </div>
//         )}
//         <div className="pt-2">
//           <Button asChild variant="outline" size="sm" className="w-full">
//             <Link href={`/admin/projects/${projectId}/financials`}>
//               <DollarSign className="h-4 w-4 mr-2" />
//               Update Financials
//             </Link>
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
