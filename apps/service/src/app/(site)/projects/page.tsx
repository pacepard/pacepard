
import ProjectList from "@/app/components/projects";
import Herobanner from "@/app/components/shared/hero-banner";
import { getAllProjects } from "@/lib/markdown";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Blueprint | Pacepard",
};

export default function Page() {
    const projects = getAllProjects();
    return (
        <main>
            <Herobanner
                bannerimage="/images/projects/banner/project1.jpg"
                heading="Blueprint"
                desc="Purpose-built systems <span>designed to solve real business problems</span>, explore our delivery blueprints." />
            <ProjectList />    
        </main>
    );
};


