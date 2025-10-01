import { Users, Building2, Calculator, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TeamMember {
  title: string;
  department: string;
  icon: React.ElementType;
  color: string;
}

const teamStructure: TeamMember[] = [
  {
    title: "Principal Architect",
    department: "Design & Planning",
    icon: Building2,
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Project Manager",
    department: "Construction Management",
    icon: Briefcase,
    color: "from-emerald-500 to-teal-600",
  },
  {
    title: "Quantity Surveyor",
    department: "Cost Estimation",
    icon: Calculator,
    color: "from-orange-500 to-red-600",
  },
  {
    title: "Design Team",
    department: "Technical Design",
    icon: Users,
    color: "from-purple-500 to-pink-600",
  },
];

export default function CompanyOrganogram() {
  return (
    <section className="py-20 bg-gradient-to-br from-sand/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-indigo-deep mb-4">
            Our Team Structure
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet the dedicated professionals behind every successful project at
            Amart Consult
          </p>
        </div>

        {/* Organogram Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamStructure.map((member, index) => {
            const IconComponent = member.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`mx-auto mb-4 p-4 rounded-2xl w-fit bg-gradient-to-br ${member.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-serif text-indigo-deep">
                    {member.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <span
                    className={`inline-block text-sm px-4 py-2 rounded-full bg-gradient-to-r ${member.color} text-white font-medium`}
                  >
                    {member.department}
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <Card className="max-w-3xl mx-auto border-0 shadow-lg bg-gradient-to-br from-indigo-deep to-indigo-deep/90">
            <CardContent className="p-8">
              <h3 className="text-2xl font-serif font-bold text-white mb-4">
                Collaborative Excellence
              </h3>
              <p className="text-indigo-100 leading-relaxed">
                Our integrated team approach ensures seamless coordination from
                initial concept through final construction. Each department
                works in harmony to deliver projects that exceed client
                expectations in quality, timeline, and budget management.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
