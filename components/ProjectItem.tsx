export type ProjectProps = {
  id: string;
  idea: string;
  description: string;
  url: string;
};

type ProjectItemProps = {
  project: ProjectProps;
};

const ProjectItem: React.FC<ProjectItemProps> = ({ project }) => (
  <article className="flex w-full justify-center">
    <div className="p-6 shadow bg-gray-50  w-full max-w-2xl mx-8 border-gray-300 rounded">
      <h3 className=" text-gray-600 text-xl font-bold">{project.idea}</h3>
      <p className="text-gray-500">{project.description}</p>
    </div>
  </article>
);

export default ProjectItem;
