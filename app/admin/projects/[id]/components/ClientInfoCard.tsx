// // app/admin/projects/[id]/components/ClientInfoCard.tsx
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Mail, Phone, MapPin, Eye } from "lucide-react";
// import Link from "next/link";

// export function ClientInfoCard({ client }) {
//   return (
//     <Card className="border-0 shadow-sm">
//       <CardHeader>
//         <CardTitle>Client Information</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-3">
//         <div className="flex items-start gap-3">
//           <Mail className="h-4 w-4 text-slate-400 mt-1" />
//           <span className="text-sm text-slate-900 truncate">{client.email}</span>
//         </div>
//         {client.phone && (
//           <div className="flex items-start gap-3">
//             <Phone className="h-4 w-4 text-slate-400 mt-1" />
//             <span className="text-sm text-slate-900 truncate">{client.phone}</span>
//           </div>
//         )}
//         {client.address && (
//           <div className="flex items-start gap-3">
//             <MapPin className="h-4 w-4 text-slate-400 mt-1" />
//             <span className="text-sm text-slate-900">{client.address}</span>
//           </div>
//         )}
//         <div className="flex items-center gap-2 pt-2">
//           <Badge variant="outline">{client.tier}</Badge>
//           {client.has_portal_access && (
//             <Badge variant="outline" className="bg-green-50 text-green-700">
//               Portal Access
//             </Badge>
//           )}
//         </div>
//         <div className="pt-2">
//           <Button asChild variant="outline" size="sm" className="w-full">
//             <Link href={`/admin/clients/${client.id}`}>
//               <Eye className="h-4 w-4 mr-2" />
//               View Client Details
//             </Button>
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
