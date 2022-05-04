import { Client } from "@notionhq/client";
import { useReducer, useState } from "react";
import { updateVotes } from "../lib/notion";

export type ProjectProps = {
  id: string;
  idea: string;
  description: string;
  url: string;
  status: { text: string; color: string };
  votes: number;
};

type ProjectItemProps = {
  project: ProjectProps;
};

const ProjectItem: React.FC<ProjectItemProps> = ({ project }) => {
  const color = project?.status?.color;
  const background =
    color === "green"
      ? "bg-emerald-600"
      : color === "red"
      ? "bg-red-500"
      : "bg-gray-50";
  const text = color === "green" || color === "red" ? "text-gray-50" : "";
  const text2 =
    color === "green"
      ? "text-emerald-50"
      : color === "red"
      ? "text-red-50"
      : "";

  const [votes, setVotes] = useState<number>(project?.votes || 0);
  const [hasVoted, toggleHasVoted] = useReducer((s) => !s, false);

  const increaseVote = async () => {
    const { id } = project;

    if (!hasVoted) {
      const newVotes = votes + 1;

      fetch("http://localhost:3000/api/vote", {
        method: "PATCH",
        body: JSON.stringify({
          page_id: id,
          newVotes: 99,
        }),
      })
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));

      setVotes(newVotes);
      toggleHasVoted();
    }
  };

  return (
    <article className="flex w-full justify-center gap-4">
      <a className={` w-full max-w-2xl  ${text2}`} href={project.url}>
        <div className={`p-6 ${background} rounded shadow ml-4   `}>
          <h3 className={` ${text} text-xl font-bold`}>{project.idea}</h3>
          <p className={` ${text2}`}>{project.description}</p>
          <p className={` mt-4 ${text2}`}>{project.url}</p>
        </div>
      </a>

      <div className="flex flex-col justify-center mr-4">
        <button onClick={increaseVote} className="flex justify-center">
          <span className=" text-6xl ">⚡</span>
        </button>
        <div className="flex justify-center mt-2">
          <span className=" text-xl font-bold text-gray-400 ">{votes}</span>
        </div>
      </div>
    </article>
  );
};
export default ProjectItem;
