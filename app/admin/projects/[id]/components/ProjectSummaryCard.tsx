// // app/admin/projects/[id]/components/ProjectSummaryCard.tsx
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { User, Building2, Clock, Calendar, Target } from "lucide-react";
// import Link from "next/link";

// export function ProjectSummaryCard({ project }) {
//   const getStatusColor = (status) => {
//     // ... (keep your getStatusColor logic here or move to a helper file)
//     // For brevity, I'll paste a simplified version.
//     if (status === "Completed") return "bg-green-100 text-green-800";
//     if (status === "In Progress") return "bg-blue-100 text-blue-800";
//     return "bg-gray-100 text-gray-800";
//   };

//   return (
//     <Card className="border-0 shadow-sm">
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <div>
//             <CardTitle className="text-xl sm:text-2xl truncate">
//               {project.project_title}
//             </CardTitle>
//             <CardDescription className="text-base mt-1">
//               <Link
//                 href={`/admin/clients/${project.client.id}`}
//                 className="flex items-center gap-2 hover:text-indigo-600 hover:underline"
//               >
//                 <User className="h-4 w-4" />
//                 <span>
//                   {project.client.first_name} {project.client.last_name}
//                 </span>
//                 {project.client.company && (
//                   <>
//                     <span className="text-slate-400">•</span>
//                     <span>{project.client.company}</span>
//                   </>
//                 )}
//               </Link>
//             </CardDescription>
//           </div>
//           <Badge className={`text-sm ${getStatusColor(project.status)}`}>
//             {project.status}
//           </Badge>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="flex items-start gap-3">
//             <Building2 className="h-4 w-4 text-slate-400 mt-1" />
//             <span className="text-slate-900 capitalize">
//               {project.project_type}
//             </span>
//           </div>
//           {project.timeline && (
//             <div className="flex items-start gap-3">
//               <Clock className="h-4 w-4 text-slate-400 mt-1" />
//               <span className="text-slate-900">{project.timeline}</span>
//             </div>
//           )}
//           <div className="flex items-start gap-3">
//             <Calendar className="h-4 w-4 text-slate-400 mt-1" />
//             <span className="text-sm text-slate-900">
//               Created {new Date(project.created_at).toLocaleDateString()}
//             </span>
//           </div>
//           <div className="flex items-start gap-3">
//             <Target className="h-4 w-4 text-slate-400 mt-1" />
//             <span className="text-sm text-slate-900">
//               {project.progress_percentage || 0}% Complete
//             </span>
//           </div>
//         </div>

//         <div className="mt-4">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm font-medium text-slate-600">
//               Project Progress
//             </span>
//             <span className="text-sm text-slate-600">
//               {project.completed_phases || 0} of {project.total_phases || 0}{" "}
//               phases
//             </span>
//           </div>
//           <Progress value={project.progress_percentage || 0} className="h-2" />
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
