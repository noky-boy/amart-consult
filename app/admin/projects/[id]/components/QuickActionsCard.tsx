// // app/admin/projects/[id]/components/QuickActionsCard.tsx
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { MessageSquare, Upload, Target } from "lucide-react";
// import Link from "next/link";

// export function QuickActionsCard({ project }) {
//   return (
//     <Card className="border-0 shadow-sm">
//       <CardHeader>
//         <CardTitle>Quick Actions</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-3">
//         <Button asChild className="w-full justify-start" variant="outline">
//           <Link
//             href={`/admin/messages?clientId=${project.client_id}&projectId=${project.id}`}
//           >
//             <MessageSquare className="h-4 w-4 mr-2" />
//             Send Message
//           </Link>
//         </Button>
//         <Button asChild className="w-full justify-start" variant="outline">
//           <Link
//             href={`/admin/documents?clientId=${project.client_id}&projectId=${project.id}`}
//           >
//             <Upload className="h-4 w-4 mr-2" />
//             Upload Document
//           </Link>
//         </Button>
//         <Button asChild className="w-full justify-start" variant="outline">
//           <Link href={`/admin/projects/${project.id}/phases`}>
//             <Target className="h-4 w-4 mr-2" />
//             Manage Phases
//           </Link>
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }
