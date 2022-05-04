import { NextPage } from "next";
import Page from "../components/Page";
import ProjectItem, { ProjectProps } from "../components/ProjectItem";
import { FieldType, parseDatabase } from "../lib/notion";

type PageProps = {
  projects: ProjectProps[];
};

const Index: NextPage<PageProps> = ({ projects }) => {
  return (
    <Page title="make-projects" description="A list of potential projects">
      <main className=" mt-16 w-full flex min-h-screen">
        <div className="w-full">
          <h1 className=" w-full text-center text-6xl font-bold">Projects</h1>
          <div className=" flex justify-center ">
            <h2 className=" max-w-xl text-center text-gray-500 text-xl mt-2 ">
              {" "}
              This is a list of the projects I gathered while going through the
              first chapter of{" "}
              <a
                className=" hover:text-emerald-700 duration-300 transition-all text-emerald-600 border-b border-emerald-700 font-bold "
                href="https://readmake.com"
              >
                readmake.com
              </a>
            </h2>
          </div>

          <div className="flex flex-col justify-center gap-8 my-12">
            {projects.map((project) => (
              <ProjectItem key={project.id} project={project} />
            ))}
          </div>
        </div>
      </main>
    </Page>
  );
};

export async function getStaticProps() {
  // Instead of fetching your `/api` route you can call the same
  // function directly in `getStaticProps`

  const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID;

  const fields: FieldType[] = [
    {
      name: "idea",
      type: "title",
    },
    {
      name: "description",
      type: "rich_text",
    },
    {
      name: "url",
      type: "url",
    },
  ];

  const projects = await parseDatabase(databaseId!, fields);
  return { props: { projects }, revalidate: 10 };
}

export default Index;
